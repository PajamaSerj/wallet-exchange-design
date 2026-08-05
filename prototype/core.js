"use strict";

const STORAGE_KEY = "wallet-exchange-demo-v3";
const COINGECKO_ENDPOINT = "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub&include_last_updated_at=true";
const REQUEST_TIMEOUT_MS = 8000;

const DEFAULT_STATE = Object.freeze({
  version: 4,
  balances: {
    RUB: { total: 250000, reserved: 0 },
    USDT: { total: 1250, reserved: 0 }
  },
  walletVisibility: { RUB: true, USDT: true },
  requests: [],
  processedKeys: {},
  lastAttemptKey: null,
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
let balancePreview = null;

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || ![3, DEFAULT_STATE.version].includes(parsed.version)) return cloneDefaultState();
    return {
      ...cloneDefaultState(),
      ...parsed,
      version: DEFAULT_STATE.version,
      balances: {
        RUB: { ...DEFAULT_STATE.balances.RUB, ...(parsed.balances?.RUB || {}) },
        USDT: { ...DEFAULT_STATE.balances.USDT, ...(parsed.balances?.USDT || {}) }
      },
      walletVisibility: {
        RUB: parsed.walletVisibility?.RUB !== false,
        USDT: parsed.walletVisibility?.USDT !== false
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
    "balance-grid", "quote-panel", "quote-status-dot", "quote-value", "quote-updated", "quote-id",
    "exchange-form", "source-amount", "source-currency", "target-amount", "target-currency",
    "target-result", "target-placeholder", "amount-help", "available-hint", "amount-error",
    "money-input-wrap", "exchange-all", "swap-direction", "submit-exchange", "form-status",
    "settings-open", "settings-close", "settings-dialog", "demo-balance-controls", "demo-async",
    "async-options", "demo-terminal", "demo-rate-change", "demo-quote-error", "demo-technical-error",
    "repeat-last-attempt", "demo-feedback", "result-section", "result-card", "history-details",
    "history-count", "history-empty", "history-list", "confirmation-modal", "confirmation-form",
    "confirmation-title", "confirmation-eyebrow", "confirmation-content", "confirm-operation",
    "live-region", "reset-demo"
  ];
  ids.forEach((id) => { dom[toCamel(id)] = document.getElementById(id); });
  dom.directionInputs = [...document.querySelectorAll('input[name="direction"]')];
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function getDirection() {
  return dom.directionInputs.find((input) => input.checked)?.value || "RUB_USDT";
}

function setDirection(direction) {
  dom.directionInputs.forEach((input) => { input.checked = input.value === direction; });
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
  if (dom.quoteStatusDot) dom.quoteStatusDot.className = `status-dot${status ? ` is-${status}` : ""}`;
  if (dom.quotePanel) dom.quotePanel.classList.toggle("is-error", status === "error");
  if (message) dom.formStatus.textContent = message;
}

async function fetchQuote({ recheck = false } = {}) {
  if (state.demo.quoteError) {
    state.demo.quoteError = false;
    if (dom.demoQuoteError) dom.demoQuoteError.checked = false;
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
  dom.quoteUpdated.dataset.tooltip = "Курс загружается";
  dom.quoteUpdated.setAttribute("aria-label", "Курс загружается");
  dom.quoteId.textContent = "";
  updateForm();

  try {
    quote = await fetchQuote();
    renderQuote();
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
  const updatedText = `Обновлено ${formatDate(quote.sourceUpdatedAt)}`;
  dom.quoteUpdated.dataset.tooltip = updatedText;
  dom.quoteUpdated.setAttribute("aria-label", updatedText);
  dom.quoteId.textContent = quote.id;
  setQuoteVisual("ready");
  renderBalances();
  renderBalanceControls();
}

function renderQuoteError(error) {
  const timedOut = error?.name === "AbortError";
  dom.quoteValue.textContent = "Курс недоступен";
  const detail = timedOut ? "CoinGecko не ответил вовремя" : "Не удалось получить корректную котировку";
  dom.quoteUpdated.dataset.tooltip = detail;
  dom.quoteUpdated.setAttribute("aria-label", detail);
  dom.quoteId.textContent = "";
  setQuoteVisual("error", "Не удалось получить курс. Обмен не создан.");
  announce("Не удалось получить курс. Обмен недоступен.");
}

function calculateTarget(sourceAmount, direction, rate) {
  if (!Number.isFinite(sourceAmount) || !Number.isFinite(rate) || rate <= 0) return 0;
  const raw = direction === "RUB_USDT" ? sourceAmount / rate : sourceAmount * rate;
  return roundDisplay(raw);
}
