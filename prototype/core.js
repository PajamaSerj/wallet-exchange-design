"use strict";

/*
 * Wallet Exchange prototype
 * Logical sections: DOM, state, formatting, quotes, calculation/validation,
 * balances/reserves, requests/statuses, history/localStorage, demo controls.
 */

const STORAGE_KEY = "wallet-exchange-demo-v3";
const COINGECKO_ENDPOINT = "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub&include_last_updated_at=true";
const REQUEST_TIMEOUT_MS = 8000;

const DEFAULT_STATE = Object.freeze({
  version: 3,
  balances: {
    RUB: { total: 250000, reserved: 0 },
    USDT: { total: 1250, reserved: 0 }
  },
  requests: [],
  processedKeys: {},
  lastAttemptKey: null,
  equivalentCurrency: "RUB",
  demo: {
    async: false,
    terminal: "completed",
    rateChange: false,
    quoteError: false,
    technicalError: false
  }
});

const dom = {};
let state = loadState();
let quote = null;
let isQuoteLoading = false;
let isProcessing = false;
let pendingConfirmation = null;

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== DEFAULT_STATE.version) return cloneDefaultState();
    return {
      ...cloneDefaultState(),
      ...parsed,
      balances: {
        RUB: { ...DEFAULT_STATE.balances.RUB, ...(parsed.balances?.RUB || {}) },
        USDT: { ...DEFAULT_STATE.balances.USDT, ...(parsed.balances?.USDT || {}) }
      },
      demo: { ...DEFAULT_STATE.demo, ...(parsed.demo || {}) },
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      processedKeys: parsed.processedKeys && typeof parsed.processedKeys === "object" ? parsed.processedKeys : {}
    };
  } catch (error) {
    console.warn("Не удалось восстановить демонстрационное состояние; используются начальные данные.", error);
    return cloneDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Не удалось сохранить демонстрационное состояние.", error);
  }
}

function cacheDom() {
  const ids = [
    "balance-grid", "wallet-equivalent", "wallet-equivalent-note", "quote-panel", "quote-status-dot",
    "quote-value", "quote-updated", "quote-id", "exchange-form", "source-amount", "source-currency",
    "target-amount", "target-currency", "amount-help", "available-hint", "amount-error", "money-input-wrap",
    "exchange-all", "submit-exchange", "form-status", "demo-async", "async-options", "demo-terminal",
    "demo-rate-change", "demo-quote-error", "demo-technical-error", "repeat-last-attempt", "demo-feedback",
    "result-section", "result-card", "history-count", "history-empty", "history-list", "confirmation-modal",
    "confirmation-form", "confirmation-title", "confirmation-eyebrow", "confirmation-content", "confirm-operation",
    "live-region", "reset-demo"
  ];
  ids.forEach((id) => { dom[toCamel(id)] = document.getElementById(id); });
  dom.directionInputs = [...document.querySelectorAll('input[name="direction"]')];
  dom.equivalentButtons = [...document.querySelectorAll("[data-equivalent]")];
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function getDirection() {
  return dom.directionInputs.find((input) => input.checked)?.value || "RUB_USDT";
}

function getPair(direction = getDirection()) {
  return direction === "RUB_USDT"
    ? { source: "RUB", target: "USDT", label: "RUB → USDT" }
    : { source: "USDT", target: "RUB", label: "USDT → RUB" };
}

function availableBalance(currency) {
  const balance = state.balances[currency];
  return normalizeMoney(balance.total - balance.reserved);
}

function normalizeMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10) / 10;
}

function roundDisplay(value) {
  return normalizeMoney(value);
}

function formatNumber(value, digits = 1) {
  if (!Number.isFinite(Number(value))) return "—";
  const formatter = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: true
  });
  return formatter.format(Number(value)).replace(",", ".");
}

function formatSourceAmount(value) {
  return formatNumber(value, 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  }).format(new Date(value));
}

function makeId(prefix) {
  const randomPart = globalThis.crypto?.randomUUID
    ? crypto.randomUUID().slice(0, 8).toUpperCase()
    : Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${randomPart}`;
}

function announce(message) {
  dom.liveRegion.textContent = "";
  window.setTimeout(() => { dom.liveRegion.textContent = message; }, 20);
}

function setQuoteVisual(status, message = "") {
  dom.quoteStatusDot.className = `status-dot${status ? ` is-${status}` : ""}`;
  dom.quotePanel.classList.toggle("is-error", status === "error");
  if (message) dom.formStatus.textContent = message;
}

async function fetchQuote({ recheck = false } = {}) {
  if (state.demo.quoteError) {
    state.demo.quoteError = false;
    dom.demoQuoteError.checked = false;
    saveState();
    throw new Error("DEMO_QUOTE_ERROR");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(COINGECKO_ENDPOINT, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`QUOTE_HTTP_${response.status}`);
    const data = await response.json();
    const price = Number(data?.tether?.rub);
    const updatedSeconds = Number(data?.tether?.last_updated_at);
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(updatedSeconds) || updatedSeconds <= 0) {
      throw new Error("QUOTE_INVALID_PAYLOAD");
    }

    const adjusted = recheck && state.demo.rateChange;
    return {
      id: makeId(adjusted ? "Q-DEMO" : "Q"),
      rate: adjusted ? price * 1.015 : price,
      sourceUpdatedAt: updatedSeconds * 1000,
      receivedAt: Date.now(),
      demoAdjusted: adjusted
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

async function loadInitialQuote() {
  isQuoteLoading = true;
  setQuoteVisual("loading");
  dom.quoteValue.textContent = "Загрузка курса…";
  dom.quoteUpdated.textContent = "Подключение к CoinGecko";
  dom.quoteId.textContent = "Котировка: —";
  updateForm();

  try {
    quote = await fetchQuote();
    renderQuote();
    setQuoteVisual("ready", "Курс загружен.");
  } catch (error) {
    quote = null;
    renderQuoteError(error);
  } finally {
    isQuoteLoading = false;
    updateForm();
  }
}

function renderQuote() {
  if (!quote) return;
  dom.quoteValue.textContent = `1 USDT = ${formatNumber(quote.rate, 2)} RUB`;
  dom.quoteUpdated.textContent = `Обновлено ${formatDate(quote.sourceUpdatedAt)}`;
  dom.quoteId.textContent = `Котировка: ${quote.id}`;
  if (quote.demoAdjusted) dom.quoteId.textContent += " · demo +1.5%";
  setQuoteVisual("ready");
  renderBalances();
}

function renderQuoteError(error) {
  const timedOut = error?.name === "AbortError";
  dom.quoteValue.textContent = "Курс недоступен";
  dom.quoteUpdated.textContent = timedOut ? "CoinGecko не ответил вовремя" : "Не удалось получить корректную котировку";
  dom.quoteId.textContent = "Заявка не может быть создана";
  setQuoteVisual("error", "Не удалось получить курс. Обмен не создан.");
  announce("Не удалось получить курс. Обмен недоступен.");
}

function calculateTarget(sourceAmount, direction, rate) {
  if (!Number.isFinite(sourceAmount) || !Number.isFinite(rate) || rate <= 0) return 0;
  const raw = direction === "RUB_USDT" ? sourceAmount / rate : sourceAmount * rate;
  return roundDisplay(raw);
}
