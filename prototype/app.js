function renderResult(requestId) {
  const request = state.requests.find((item) => item.id === requestId) || state.requests[0];
  if (!request) {
    dom.resultSection.hidden = true;
    return;
  }

  dom.resultSection.hidden = false;
  const statusText = {
    created: "Создана",
    pending: "На проверке",
    completed: "Выполнена",
    rejected: "Отклонена"
  }[request.status];
  const targetShown = request.status === "completed" ? request.actualTargetAmount : request.confirmedTargetAmount;
  const rateShown = request.status === "completed" ? request.actualRate : request.confirmedRate;

  let message = "";
  let action = "";
  if (request.status === "pending") {
    message = `Идёт дополнительная проверка. ${formatSourceAmount(request.reservedAmount)} ${request.sourceCurrency} находится в резерве, доступный баланс уже уменьшен. Фактический курс и результат могут измениться. Пользовательская отмена недоступна.`;
    action = `<button class="button button-primary" type="button" data-finalize="${request.id}">Завершить демо-проверку</button>`;
  } else if (request.status === "completed") {
    const asyncDetail = request.async && request.actualRate !== request.confirmedRate
      ? ` Подтверждённый курс: ${formatNumber(request.confirmedRate, 2)} RUB за USDT; фактический demo-курс: ${formatNumber(request.actualRate, 2)}.`
      : "";
    message = `Обмен выполнен. Списано ${formatSourceAmount(request.sourceAmount)} ${request.sourceCurrency}, зачислено ${formatNumber(request.actualTargetAmount, 1)} ${request.targetCurrency}.${asyncDetail}`;
  } else if (request.status === "rejected") {
    message = `Обмен не выполнен. ${request.targetCurrency} не зачислен, резерв ${formatSourceAmount(request.reservedAmount)} ${request.sourceCurrency} освобождён, доступный баланс восстановлен.`;
  }

  dom.resultCard.innerHTML = `
    <article class="result-card ${request.status}">
      <div class="result-card-header">
        <div><h3>Заявка ${request.id}</h3><span class="history-time">${formatDate(request.createdAt)}</span></div>
        <span class="status-pill ${request.status}">${statusText}</span>
      </div>
      <div class="result-summary">
        <div class="result-metric"><span>Исходная сумма</span><strong>${formatSourceAmount(request.sourceAmount)} ${request.sourceCurrency}</strong></div>
        <div class="result-metric"><span>${request.status === "completed" ? "Фактически получено" : "Подтверждено к получению"}</span><strong>${formatNumber(targetShown, 1)} ${request.targetCurrency}</strong></div>
        <div class="result-metric"><span>${request.status === "completed" ? "Фактический курс" : "Подтверждённый курс"}</span><strong>1 USDT = ${formatNumber(rateShown, 2)} RUB</strong></div>
      </div>
      <p class="result-message">${message}</p>
      <div class="result-actions">${action}</div>
    </article>`;
}

function renderHistory() {
  const requests = state.requests;
  dom.historyCount.textContent = `${requests.length} ${pluralize(requests.length, ["заявка", "заявки", "заявок"])}`;
  dom.historyEmpty.hidden = requests.length > 0;
  dom.historyList.innerHTML = requests.map((request) => {
    const statusLabel = { created: "Создана", pending: "Pending", completed: "Completed", rejected: "Rejected" }[request.status];
    const target = request.actualTargetAmount ?? request.confirmedTargetAmount;
    let details = `Курс: ${formatNumber(request.confirmedRate, 2)} RUB/USDT`;
    if (request.status === "pending") details += ` · Резерв: ${formatSourceAmount(request.reservedAmount)} ${request.sourceCurrency}`;
    if (request.async && request.status === "completed" && request.actualRate !== request.confirmedRate) {
      details += ` · Факт: ${formatNumber(request.actualRate, 2)} RUB/USDT`;
    }
    return `
      <article class="history-item" data-request-id="${request.id}">
        <div><strong>${request.id}</strong><div class="history-id">${request.operationKey}</div></div>
        <div class="history-direction"><strong>${request.sourceCurrency} → ${request.targetCurrency}</strong><small>${formatDate(request.createdAt)}</small></div>
        <div class="history-amounts"><strong>${formatSourceAmount(request.sourceAmount)} ${request.sourceCurrency} → ${formatNumber(target, 1)} ${request.targetCurrency}</strong><small>${details}</small></div>
        <span class="status-pill ${request.status}">${statusLabel}</span>
      </article>`;
  }).join("");
}

function pluralize(number, forms) {
  const n10 = number % 10;
  const n100 = number % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
  return forms[2];
}

function renderDemo() {
  dom.demoAsync.checked = state.demo.async;
  dom.asyncOptions.hidden = !state.demo.async;
  dom.demoTerminal.value = state.demo.terminal;
  dom.demoRateChange.checked = state.demo.rateChange;
  dom.demoQuoteError.checked = state.demo.quoteError;
  dom.demoTechnicalError.checked = state.demo.technicalError;
  dom.repeatLastAttempt.disabled = !state.lastAttemptKey;
}

function renderEquivalentButtons() {
  dom.equivalentButtons.forEach((button) => {
    const active = button.dataset.equivalent === state.equivalentCurrency;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderAll(resultId = null) {
  renderBalances();
  renderEquivalentButtons();
  renderDemo();
  renderHistory();
  renderResult(resultId);
  updateForm();
}

function bindEvents() {
  dom.sourceAmount.addEventListener("input", updateForm);
  dom.sourceAmount.addEventListener("blur", () => {
    const validation = validateAmount();
    if (!validation.valid && dom.sourceAmount.value.trim()) updateForm();
  });

  dom.directionInputs.forEach((input) => input.addEventListener("change", () => {
    dom.sourceAmount.value = "";
    dom.formStatus.textContent = "";
    updateForm();
  }));

  dom.exchangeAll.addEventListener("click", () => {
    const pair = getPair();
    dom.sourceAmount.value = String(Math.floor(availableBalance(pair.source)));
    updateForm();
    dom.sourceAmount.focus();
  });

  dom.exchangeForm.addEventListener("submit", onSubmit);
  dom.confirmOperation.addEventListener("click", confirmPendingAttempt);
  dom.confirmationModal.addEventListener("close", () => {
    if (!isProcessing) pendingConfirmation = null;
  });

  dom.demoAsync.addEventListener("change", () => {
    state.demo.async = dom.demoAsync.checked;
    dom.asyncOptions.hidden = !state.demo.async;
    saveState();
  });
  dom.demoTerminal.addEventListener("change", () => {
    state.demo.terminal = dom.demoTerminal.value;
    saveState();
  });
  dom.demoRateChange.addEventListener("change", () => {
    state.demo.rateChange = dom.demoRateChange.checked;
    saveState();
  });
  dom.demoQuoteError.addEventListener("change", () => {
    state.demo.quoteError = dom.demoQuoteError.checked;
    saveState();
  });
  dom.demoTechnicalError.addEventListener("change", () => {
    state.demo.technicalError = dom.demoTechnicalError.checked;
    saveState();
  });

  dom.repeatLastAttempt.addEventListener("click", () => {
    const key = state.lastAttemptKey;
    const requestId = key ? state.processedKeys[key] : null;
    const request = state.requests.find((item) => item.id === requestId);
    if (!request) return;
    const before = JSON.stringify(state.balances);
    const returned = processAttempt({ key });
    const unchanged = before === JSON.stringify(state.balances);
    dom.demoFeedback.textContent = `Возвращена существующая заявка ${returned.id}. Баланс и резерв ${unchanged ? "не изменены" : "проверены"}.`;
    renderResult(returned.id);
    announce("Повторный ключ вернул существующую заявку без нового финансового эффекта.");
  });

  dom.resultCard.addEventListener("click", (event) => {
    const button = event.target.closest("[data-finalize]");
    if (button) finalizePending(button.dataset.finalize);
  });

  dom.historyList.addEventListener("click", (event) => {
    const item = event.target.closest("[data-request-id]");
    if (item) {
      renderResult(item.dataset.requestId);
      dom.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  dom.equivalentButtons.forEach((button) => button.addEventListener("click", () => {
    state.equivalentCurrency = button.dataset.equivalent;
    saveState();
    renderEquivalentButtons();
    renderBalances();
  }));

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
