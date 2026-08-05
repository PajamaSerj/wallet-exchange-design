const BUSINESS_STATUS_LABELS = Object.freeze({
  created: "Заявка создана",
  pending: "В обработке",
  completed: "Выполнена",
  rejected: "Отклонена"
});

const OUTCOME_COPY = Object.freeze({
  completed: {
    status: "Выполнена",
    title: "Обмен выполнен",
    message: "Подробности доступны в истории заявок."
  },
  pending: {
    status: "В обработке",
    title: "Заявка принята и передана на проверку",
    message: "Ход проверки можно посмотреть в истории заявок."
  },
  rejected: {
    status: "Отклонена",
    title: "Обмен отклонён",
    message: "Подробности доступны в истории заявок."
  },
  technical: {
    status: "Не выполнено",
    title: "Не удалось выполнить обмен",
    message: "Попробуйте ещё раз. Заявка не создана."
  },
  quote: {
    status: "Не выполнено",
    title: "Не удалось выполнить обмен",
    message: "Не удалось получить актуальный курс. Заявка не создана."
  },
  balance: {
    status: "Не выполнено",
    title: "Не удалось выполнить обмен",
    message: "Баланс изменился. Проверьте доступную сумму и повторите попытку."
  }
});

function showOutcome(kind) {
  const copy = OUTCOME_COPY[kind] || OUTCOME_COPY.technical;
  dom.outcomeStatus.className = `status-pill outcome-${kind}`;
  dom.outcomeStatus.textContent = copy.status;
  dom.outcomeTitle.textContent = copy.title;
  dom.outcomeMessage.textContent = copy.message;
  if (typeof dom.outcomeModal.showModal === "function") dom.outcomeModal.showModal();
  else dom.outcomeModal.setAttribute("open", "");
  dom.outcomeClose.focus();
}

function renderHistory() {
  const requests = state.requests;
  dom.historyCount.textContent = `${requests.length} ${pluralize(requests.length, ["заявка", "заявки", "заявок"])}`;
  dom.historyEmpty.hidden = requests.length > 0;
  dom.historyList.innerHTML = requests.map((request) => {
    const statusLabel = BUSINESS_STATUS_LABELS[request.status] || "Статус неизвестен";
    const target = request.actualTargetAmount ?? request.confirmedTargetAmount;
    const rate = request.actualRate ?? request.confirmedRate;
    const reserve = request.status === "pending"
      ? `<span><b>Резерв:</b> ${formatSourceAmount(request.reservedAmount)} ${request.sourceCurrency}</span>`
      : "";
    const fact = request.async && request.status === "completed" && request.actualRate !== request.confirmedRate
      ? `<span><b>Подтверждённый курс:</b> ${formatNumber(request.confirmedRate, 2)} RUB/USDT</span>`
      : "";
    const pendingAction = request.status === "pending"
      ? `<button class="button button-secondary history-action" type="button" data-finalize="${request.id}">Завершить демо-проверку</button>`
      : "";
    const targetLabel = request.status === "completed" ? "Получено" : "Расчётная сумма";
    return `
      <details class="history-item" data-request-id="${request.id}">
        <summary>
          <div class="history-main">
            <strong>${formatSourceAmount(request.sourceAmount)} ${request.sourceCurrency} → ${formatNumber(target, 1)} ${request.targetCurrency}</strong>
            <small>${formatDate(request.createdAt)}</small>
          </div>
          <span class="status-pill ${request.status}">${statusLabel}</span>
        </summary>
        <div class="history-details">
          <span><b>Дата:</b> ${formatDate(request.createdAt)}</span>
          <span><b>Направление:</b> ${request.sourceCurrency} → ${request.targetCurrency}</span>
          <span><b>Отдано:</b> ${formatSourceAmount(request.sourceAmount)} ${request.sourceCurrency}</span>
          <span><b>${targetLabel}:</b> ${formatNumber(target, 1)} ${request.targetCurrency}</span>
          <span><b>Курс:</b> ${formatNumber(rate, 2)} RUB/USDT</span>
          <span><b>ID заявки:</b> ${request.id}</span>
          <span><b>ID котировки:</b> ${request.confirmedQuoteId}</span>
          ${reserve}${fact}
          ${pendingAction}
        </div>
      </details>`;
  }).join("");
}

function pluralize(number, forms) {
  const n10 = number % 10;
  const n100 = number % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
  return forms[2];
}

function renderBalanceControls() {
  if (!dom.demoBalanceControls) return;
  dom.demoBalanceControls.innerHTML = ["RUB", "USDT"].map((currency) => {
    const balance = state.balances[currency];
    const canShow = balance.total > 0;
    const checked = canShow && state.walletVisibility[currency];
    return `
      <div class="balance-control" data-balance-control="${currency}">
        <div class="balance-control-head">
          <strong>${currency}</strong>
          <span>Баланс ${formatNumber(balance.total, 1)} · резерв ${formatNumber(balance.reserved, 1)}</span>
        </div>
        <div class="balance-adjust">
          <input type="number" min="1" step="1" value="${currency === "RUB" ? 1000 : 10}" data-balance-amount="${currency}" aria-label="Сумма изменения баланса ${currency}">
          <button type="button" data-balance-action="add" data-currency="${currency}" aria-label="Пополнить ${currency}">+</button>
          <button type="button" data-balance-action="subtract" data-currency="${currency}" aria-label="Уменьшить ${currency}">−</button>
        </div>
        <label class="wallet-visibility">
          <span>${canShow ? "Показывать кошелёк" : "Сначала добавьте баланс"}</span>
          <input type="checkbox" data-wallet-visibility="${currency}" ${checked ? "checked" : ""} ${canShow ? "" : "disabled"}>
        </label>
      </div>`;
  }).join("");
}

function renderDemo() {
  dom.demoAsync.checked = state.demo.async;
  dom.asyncOptions.hidden = !state.demo.async;
  dom.demoTerminal.value = state.demo.terminal;
  dom.demoRateChange.checked = state.demo.rateChange;
  dom.demoQuoteError.checked = state.demo.quoteError;
  dom.demoTechnicalError.checked = state.demo.technicalError;
  dom.repeatLastAttempt.disabled = !state.lastAttemptKey;
  renderBalanceControls();
}

function renderAll() {
  renderBalances();
  renderDemo();
  renderHistory();
  updateForm();
}

function showSettings() {
  if (typeof dom.settingsDialog.showModal === "function") dom.settingsDialog.showModal();
  else dom.settingsDialog.setAttribute("open", "");
}

function closeSettings() {
  if (typeof dom.settingsDialog.close === "function") dom.settingsDialog.close();
  else dom.settingsDialog.removeAttribute("open");
}

function adjustBalance(currency, action) {
  const input = dom.demoBalanceControls.querySelector(`[data-balance-amount="${currency}"]`);
  const amount = Math.floor(Number(input?.value));
  if (!Number.isFinite(amount) || amount <= 0) {
    dom.demoFeedback.textContent = "Укажите положительную целую сумму изменения баланса.";
    return;
  }

  const balance = state.balances[currency];
  if (action === "add") {
    balance.total = normalizeMoney(balance.total + amount);
    dom.demoFeedback.textContent = `${currency} пополнен на ${formatSourceAmount(amount)}.`;
  } else {
    const removable = availableBalance(currency);
    const removed = Math.min(amount, removable);
    balance.total = normalizeMoney(balance.total - removed);
    dom.demoFeedback.textContent = removed > 0
      ? `${currency} уменьшен на ${formatSourceAmount(removed)}.`
      : `Нельзя уменьшить ${currency}: весь доступный остаток зарезервирован или равен нулю.`;
  }

  if (balance.total <= 0) {
    balance.total = 0;
    state.walletVisibility[currency] = false;
  }
  saveState();
  renderAll();
}

function convertedBalance(currency) {
  if (!quote) return null;
  const total = state.balances[currency].total;
  return currency === "RUB"
    ? { value: total / quote.rate, currency: "USDT" }
    : { value: total * quote.rate, currency: "RUB" };
}

function startBalancePreview(button) {
  if (balancePreview || !quote) return;
  const currency = button.dataset.balancePreview;
  const amountNode = dom.balanceGrid.querySelector(`[data-wallet-amount="${currency}"]`);
  const converted = convertedBalance(currency);
  if (!amountNode || !converted) return;
  balancePreview = { button, amountNode, original: amountNode.textContent, tooltipTimer: null };
  amountNode.textContent = `≈ ${formatNumber(converted.value, 1)} ${converted.currency}`;
  balancePreview.tooltipTimer = window.setTimeout(() => button.classList.add("show-tooltip"), 450);
}

function stopBalancePreview() {
  if (!balancePreview) return;
  window.clearTimeout(balancePreview.tooltipTimer);
  balancePreview.amountNode.textContent = balancePreview.original;
  balancePreview.button.classList.remove("show-tooltip");
  balancePreview = null;
}

function bindEvents() {
  dom.sourceAmount.addEventListener("input", updateForm);
  dom.sourceAmount.addEventListener("blur", updateForm);

  dom.swapDirection.addEventListener("click", () => {
    setDirection(getDirection() === "RUB_USDT" ? "USDT_RUB" : "RUB_USDT");
    dom.sourceAmount.value = "";
    dom.formStatus.textContent = "";
    updateForm();
    dom.sourceAmount.focus();
  });

  dom.exchangeAll.addEventListener("click", () => {
    const pair = getPair();
    dom.sourceAmount.value = String(Math.floor(availableBalance(pair.source)));
    updateForm();
    dom.sourceAmount.focus();
  });

  dom.exchangeForm.addEventListener("submit", onSubmit);
  dom.confirmOperation.addEventListener("click", confirmPendingAttempt);
  dom.confirmationModal.addEventListener("close", () => { if (!isProcessing) pendingConfirmation = null; });

  dom.settingsOpen.addEventListener("click", showSettings);
  dom.settingsClose.addEventListener("click", closeSettings);
  dom.settingsDialog.addEventListener("click", (event) => {
    if (event.target === dom.settingsDialog) closeSettings();
  });

  dom.demoAsync.addEventListener("change", () => {
    state.demo.async = dom.demoAsync.checked;
    dom.asyncOptions.hidden = !state.demo.async;
    saveState();
  });
  dom.demoTerminal.addEventListener("change", () => { state.demo.terminal = dom.demoTerminal.value; saveState(); });
  dom.demoRateChange.addEventListener("change", () => { state.demo.rateChange = dom.demoRateChange.checked; saveState(); });
  dom.demoQuoteError.addEventListener("change", () => { state.demo.quoteError = dom.demoQuoteError.checked; saveState(); });
  dom.demoTechnicalError.addEventListener("change", () => { state.demo.technicalError = dom.demoTechnicalError.checked; saveState(); });

  dom.demoBalanceControls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-balance-action]");
    if (button) adjustBalance(button.dataset.currency, button.dataset.balanceAction);
  });
  dom.demoBalanceControls.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-wallet-visibility]");
    if (!checkbox) return;
    const currency = checkbox.dataset.walletVisibility;
    if (state.balances[currency].total <= 0) {
      checkbox.checked = false;
      dom.demoFeedback.textContent = `Пустой кошелёк ${currency} нельзя показать. Сначала добавьте баланс.`;
      return;
    }
    state.walletVisibility[currency] = checkbox.checked;
    saveState();
    renderBalances();
  });

  dom.balanceGrid.addEventListener("pointerdown", (event) => {
    const button = event.target.closest("[data-balance-preview]");
    if (!button) return;
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    startBalancePreview(button);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((type) => {
    dom.balanceGrid.addEventListener(type, stopBalancePreview);
  });
  dom.balanceGrid.addEventListener("keydown", (event) => {
    const button = event.target.closest("[data-balance-preview]");
    if (!button || ![" ", "Enter"].includes(event.key)) return;
    event.preventDefault();
    startBalancePreview(button);
  });
  dom.balanceGrid.addEventListener("keyup", (event) => {
    if ([" ", "Enter"].includes(event.key)) stopBalancePreview();
  });
  dom.balanceGrid.addEventListener("focusout", stopBalancePreview);

  dom.repeatLastAttempt.addEventListener("click", () => {
    const key = state.lastAttemptKey;
    const requestId = key ? state.processedKeys[key] : null;
    const request = state.requests.find((item) => item.id === requestId);
    if (!request) return;
    const before = JSON.stringify(state.balances);
    const returned = processAttempt({ key });
    const unchanged = before === JSON.stringify(state.balances);
    dom.demoFeedback.textContent = `Возвращена заявка ${returned.id}. Баланс и резерв ${unchanged ? "не изменены" : "проверены"}.`;
    renderAll();
    announce("Повторный ключ вернул существующую заявку без нового финансового эффекта.");
  });

  dom.historyList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-finalize]");
    if (button) finalizePending(button.dataset.finalize);
  });

  dom.resetDemo.addEventListener("click", () => {
    const confirmed = window.confirm("Сбросить тестовые балансы, резервы, историю и demo-настройки?");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });
}

async function init() {
  cacheDom();
  bindEvents();
  renderAll();
  await loadInitialQuote();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
