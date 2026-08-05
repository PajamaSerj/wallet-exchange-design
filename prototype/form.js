function minimumSource(direction = getDirection(), rate = quote?.rate) {
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return direction === "RUB_USDT" ? Math.ceil(rate) : 1;
}

function validateAmount(rawValue = dom.sourceAmount.value, activeQuote = quote) {
  const raw = String(rawValue ?? "").trim().replace(/\s+/g, "");
  const direction = getDirection();
  const pair = getPair(direction);
  const available = availableBalance(pair.source);

  if (!raw) return { valid: false, message: "Введите исходную сумму." };
  if (raw.includes(".") || raw.includes(",")) {
    return { valid: false, message: "Исходная сумма должна быть целым числом без дробной части." };
  }
  if (!/^-?\d+$/.test(raw)) {
    return { valid: false, message: "Используйте только целое число." };
  }

  const amount = Number(raw);
  if (!Number.isSafeInteger(amount)) return { valid: false, message: "Введите корректное целое число." };
  if (amount <= 0) return { valid: false, message: "Сумма должна быть больше нуля." };
  if (!activeQuote || !Number.isFinite(activeQuote.rate) || activeQuote.rate <= 0) {
    return { valid: false, message: "Расчёт недоступен без корректного курса." };
  }

  const minimum = minimumSource(direction, activeQuote.rate);
  if (amount < minimum) {
    return {
      valid: false,
      message: `Минимальная сумма — ${formatSourceAmount(minimum)} ${pair.source} (эквивалент 1.0 USDT).`
    };
  }
  if (amount > available) {
    return {
      valid: false,
      message: `Недостаточно средств. Можно обменять ${formatNumber(available, 1)} ${pair.source}.`
    };
  }

  return {
    valid: true,
    amount,
    direction,
    pair,
    available,
    targetAmount: calculateTarget(amount, direction, activeQuote.rate)
  };
}

function renderBalances() {
  const visibleCurrencies = ["RUB", "USDT"].filter((currency) => {
    const balance = state.balances[currency];
    return state.walletVisibility[currency] && balance.total > 0;
  });

  if (!visibleCurrencies.length) {
    dom.balanceGrid.innerHTML = '<div class="wallet-empty-note">Добавьте баланс и включите кошелёк в демонстрационных настройках.</div>';
    return;
  }

  dom.balanceGrid.innerHTML = visibleCurrencies.map((currency) => {
    const balance = state.balances[currency];
    const name = currency === "RUB" ? "Российский рубль" : "Tether";
    const mark = currency === "RUB" ? "₽" : "₮";
    const previewCurrency = currency === "RUB" ? "USDT" : "RUB";
    const reserve = balance.reserved > 0
      ? `<button class="reserve-indicator" type="button" data-tooltip="В резерве ${formatNumber(balance.reserved, 1)} ${currency}" aria-label="В резерве ${formatNumber(balance.reserved, 1)} ${currency}">◷</button>`
      : "";
    return `
      <article class="wallet-card" aria-label="Кошелёк ${currency}" data-wallet-card="${currency}">
        <span class="currency-mark" aria-hidden="true">${mark}</span>
        <div class="wallet-amount">
          <strong data-wallet-amount="${currency}">${formatNumber(balance.total, 1)} ${currency}</strong>
          <span>${name}</span>
        </div>
        <div class="wallet-actions">
          ${reserve}
          <button class="preview-button" type="button" data-balance-preview="${currency}" data-tooltip="Удерживайте, чтобы увидеть примерный эквивалент в ${previewCurrency}" aria-label="Удерживайте, чтобы временно показать примерный эквивалент баланса ${currency} в ${previewCurrency}">≈</button>
        </div>
      </article>`;
  }).join("");
}

function updateForm() {
  const direction = getDirection();
  const pair = getPair(direction);
  const validation = validateAmount();
  const minimum = minimumSource(direction);
  const available = availableBalance(pair.source);

  dom.sourceCurrency.textContent = pair.source;
  dom.targetCurrency.textContent = pair.target;
  dom.amountHelp.textContent = minimum === null
    ? "Минимум: эквивалент 1.0 USDT"
    : `Минимум: ${formatSourceAmount(minimum)} ${pair.source}`;
  dom.availableHint.textContent = `Можно обменять: ${formatNumber(available, 1)} ${pair.source}`;

  const hasValue = dom.sourceAmount.value.trim() !== "";
  const showError = hasValue && !validation.valid;
  dom.amountError.textContent = showError ? validation.message : "";
  dom.moneyInputWrap.classList.toggle("is-invalid", showError);
  dom.sourceAmount.setAttribute("aria-invalid", showError ? "true" : "false");
  dom.targetResult.hidden = !validation.valid;
  dom.targetPlaceholder.hidden = validation.valid;
  dom.targetAmount.textContent = validation.valid ? formatNumber(validation.targetAmount, 1) : "";

  dom.submitExchange.disabled = isQuoteLoading || isProcessing || !validation.valid;
  dom.exchangeAll.disabled = isQuoteLoading || isProcessing || available <= 0;
  dom.swapDirection.disabled = isProcessing;
}

function setProcessing(active, label = "Проверяем условия…") {
  isProcessing = active;
  dom.submitExchange.classList.toggle("is-loading", active);
  dom.submitExchange.querySelector(".button-label").textContent = active ? label : "Обмен";
  dom.confirmOperation.disabled = active;
  updateForm();
}

async function onSubmit(event) {
  event.preventDefault();
  if (isProcessing) return;

  const initial = validateAmount();
  if (!initial.valid) {
    dom.amountError.textContent = initial.message;
    dom.moneyInputWrap.classList.add("is-invalid");
    dom.sourceAmount.focus();
    return;
  }

  setProcessing(true);
  dom.formStatus.textContent = "";

  const attempt = {
    key: makeId("OP"),
    direction: initial.direction,
    pair: initial.pair,
    sourceAmount: initial.amount,
    initialQuote: { ...quote },
    initialTargetAmount: initial.targetAmount,
    async: state.demo.async,
    terminalDemoOutcome: state.demo.terminal
  };

  try {
    if (state.demo.technicalError) {
      state.demo.technicalError = false;
      dom.demoTechnicalError.checked = false;
      saveState();
      throw new Error("DEMO_TECHNICAL_ERROR");
    }

    const freshQuote = await fetchQuote({ recheck: true });
    quote = freshQuote;
    renderQuote();

    const currentAvailable = availableBalance(attempt.pair.source);
    if (attempt.sourceAmount > currentAvailable) throw new Error("BALANCE_BECAME_INSUFFICIENT");

    attempt.confirmedQuote = { ...freshQuote };
    attempt.confirmedTargetAmount = calculateTarget(attempt.sourceAmount, attempt.direction, freshQuote.rate);
    attempt.changedResult = attempt.initialTargetAmount !== attempt.confirmedTargetAmount;
    pendingConfirmation = attempt;
    dom.formStatus.textContent = attempt.changedResult ? "Результат изменился — подтвердите новые условия." : "";
    setProcessing(false);
    openConfirmation(attempt);
  } catch (error) {
    setProcessing(false);
    handleSubmissionError(error);
  }
}

function handleSubmissionError(error) {
  let message = "Не удалось выполнить обмен. Попробуйте ещё раз.";
  let outcome = "technical";
  if (error?.message === "BALANCE_BECAME_INSUFFICIENT") {
    const pair = getPair();
    message = `Баланс изменился. Можно обменять ${formatNumber(availableBalance(pair.source), 1)} ${pair.source}.`;
    outcome = "balance";
  } else if (error?.message === "DEMO_QUOTE_ERROR" || error?.name === "AbortError" || String(error?.message || "").startsWith("QUOTE_")) {
    message = "Не удалось получить актуальный курс. Заявка не создана.";
    outcome = "quote";
  }
  dom.formStatus.textContent = message;
  showOutcome(outcome);
  announce(message);
  updateForm();
}

function openConfirmation(attempt) {
  const changed = attempt.changedResult;
  dom.confirmationEyebrow.textContent = changed ? "Курс обновился" : "Подтверждение";
  dom.confirmationTitle.textContent = changed ? "Результат изменился" : "Проверьте условия";
  dom.confirmOperation.textContent = changed ? "Согласиться и обменять" : "Подтвердить обмен";

  const rateNote = attempt.confirmedQuote.demoAdjusted ? " (demo +1.5%)" : "";
  const asyncWarning = attempt.async
    ? `<div class="confirmation-alert">Заявка перейдёт на дополнительную проверку. ${formatSourceAmount(attempt.sourceAmount)} ${attempt.pair.source} будет зарезервировано. Фактический курс и итоговая сумма могут измениться.</div>`
    : `<div class="confirmation-alert">После подтверждения исходный баланс уменьшится, а целевой увеличится в рамках одной операции.</div>`;
  const changedNotice = changed
    ? `<div class="confirmation-alert changed">Было ${formatNumber(attempt.initialTargetAmount, 1)} ${attempt.pair.target}, стало ${formatNumber(attempt.confirmedTargetAmount, 1)} ${attempt.pair.target}. После согласия обмен начнётся сразу.</div>`
    : "";

  dom.confirmationContent.innerHTML = `
    <div class="confirmation-summary">
      <div class="confirmation-row"><span>Вы отдаёте</span><strong>${formatSourceAmount(attempt.sourceAmount)} ${attempt.pair.source}</strong></div>
      <div class="confirmation-row"><span>Вы получите</span><strong>${formatNumber(attempt.confirmedTargetAmount, 1)} ${attempt.pair.target}</strong></div>
      <div class="confirmation-row"><span>Курс</span><strong>1 USDT = ${formatNumber(attempt.confirmedQuote.rate, 2)} RUB${rateNote}</strong></div>
    </div>
    ${changedNotice}
    ${asyncWarning}`;

  if (typeof dom.confirmationModal.showModal === "function") dom.confirmationModal.showModal();
  else dom.confirmationModal.setAttribute("open", "");
  dom.confirmOperation.focus();
}
