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
    return { valid: false, message: "Используйте только целое число и точку как дробный разделитель для результатов." };
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
      message: `Недостаточно средств. Доступно ${formatNumber(available, 1)} ${pair.source}.`
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
  const currencies = ["RUB", "USDT"];
  dom.balanceGrid.innerHTML = currencies.map((currency) => {
    const balance = state.balances[currency];
    const available = availableBalance(currency);
    const name = currency === "RUB" ? "Российский рубль" : "Tether";
    const mark = currency === "RUB" ? "₽" : "₮";
    return `
      <article class="balance-card" aria-label="Баланс ${currency}">
        <div class="balance-card-header">
          <div class="currency-title">
            <span class="currency-mark" aria-hidden="true">${mark}</span>
            <span><strong>${currency}</strong><small>${name}</small></span>
          </div>
          <span class="balance-available">Доступно ${formatNumber(available, 1)}</span>
        </div>
        <div class="balance-values">
          <div class="balance-value"><span>Общий</span><strong>${formatNumber(balance.total, 1)}</strong></div>
          <div class="balance-value"><span>В резерве</span><strong>${formatNumber(balance.reserved, 1)}</strong></div>
          <div class="balance-value"><span>Доступный</span><strong>${formatNumber(available, 1)}</strong></div>
        </div>
      </article>`;
  }).join("");

  const selected = state.equivalentCurrency;
  let equivalent = null;
  if (quote) {
    const rubTotal = state.balances.RUB.total;
    const usdtTotal = state.balances.USDT.total;
    equivalent = selected === "RUB" ? rubTotal + usdtTotal * quote.rate : usdtTotal + rubTotal / quote.rate;
  }
  dom.walletEquivalent.textContent = equivalent === null ? "—" : `${formatNumber(equivalent, 1)} ${selected}`;
  dom.walletEquivalentNote.textContent = quote
    ? "Ориентировочная стоимость по текущему курсу; не является отдельным балансом"
    : "Ориентировочная стоимость появится после загрузки курса";
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
    : `Минимум: ${formatSourceAmount(minimum)} ${pair.source} (1.0 USDT)`;
  dom.availableHint.textContent = `Доступно: ${formatNumber(available, 1)} ${pair.source}`;

  const showError = dom.sourceAmount.value.trim() !== "" && !validation.valid;
  dom.amountError.textContent = showError ? validation.message : "";
  dom.moneyInputWrap.classList.toggle("is-invalid", showError);
  dom.sourceAmount.setAttribute("aria-invalid", showError ? "true" : "false");
  dom.targetAmount.textContent = validation.valid ? formatNumber(validation.targetAmount, 1) : "0.0";

  dom.submitExchange.disabled = isQuoteLoading || isProcessing || !validation.valid;
  dom.exchangeAll.disabled = isQuoteLoading || isProcessing || available <= 0;
}

function setProcessing(active, label = "Проверяем курс и баланс…") {
  isProcessing = active;
  dom.submitExchange.classList.toggle("is-loading", active);
  dom.submitExchange.querySelector(".button-label").textContent = active ? label : "Проверить условия";
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
  dom.formStatus.textContent = "Повторно проверяем курс и доступный баланс…";

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
    if (attempt.sourceAmount > currentAvailable) {
      throw new Error("BALANCE_BECAME_INSUFFICIENT");
    }

    attempt.confirmedQuote = { ...freshQuote };
    attempt.confirmedTargetAmount = calculateTarget(attempt.sourceAmount, attempt.direction, freshQuote.rate);
    attempt.changedResult = attempt.initialTargetAmount !== attempt.confirmedTargetAmount;
    pendingConfirmation = attempt;
    dom.formStatus.textContent = attempt.changedResult
      ? "Результат изменился — требуется ваше согласие."
      : "Курс и баланс проверены.";
    setProcessing(false);
    openConfirmation(attempt);
  } catch (error) {
    setProcessing(false);
    handleSubmissionError(error);
  }
}

function handleSubmissionError(error) {
  let message = "Не удалось безопасно продолжить обмен. Заявка не создана.";
  if (error?.message === "BALANCE_BECAME_INSUFFICIENT") {
    const pair = getPair();
    message = `Баланс изменился. Доступно ${formatNumber(availableBalance(pair.source), 1)} ${pair.source}; заявка не создана.`;
  } else if (error?.message === "DEMO_TECHNICAL_ERROR") {
    message = "Техническая ошибка WX-DEMO-01. Обмен не создан. Проверьте данные и вернитесь к форме.";
  } else if (error?.message === "DEMO_QUOTE_ERROR" || error?.name === "AbortError" || String(error?.message || "").startsWith("QUOTE_")) {
    message = "Не удалось получить корректный курс CoinGecko. Заявка не создана.";
  }
  dom.formStatus.textContent = message;
  announce(message);
  updateForm();
}

function openConfirmation(attempt) {
  const changed = attempt.changedResult;
  dom.confirmationEyebrow.textContent = changed ? "Курс обновился" : "Подтверждение";
  dom.confirmationTitle.textContent = changed ? "Результат изменился" : "Проверьте условия";
  dom.confirmOperation.textContent = changed ? "Согласиться и обменять" : "Подтвердить обмен";

  const rateNote = attempt.confirmedQuote.demoAdjusted ? " (demo-корректировка +1.5%)" : "";
  const asyncWarning = attempt.async
    ? `<div class="confirmation-alert">Заявка перейдёт на дополнительную проверку. ${formatSourceAmount(attempt.sourceAmount)} ${attempt.pair.source} будет зарезервировано. Фактический курс и итоговая сумма могут измениться к моменту выполнения. Отменить подтверждённую заявку нельзя.</div>`
    : `<div class="confirmation-alert">После подтверждения исходный баланс уменьшится, а целевой увеличится в рамках одной операции. Отменить подтверждённую заявку нельзя.</div>`;
  const changedNotice = changed
    ? `<div class="confirmation-alert changed">Предварительно показывалось ${formatNumber(attempt.initialTargetAmount, 1)} ${attempt.pair.target}. После повторной проверки: ${formatNumber(attempt.confirmedTargetAmount, 1)} ${attempt.pair.target}. Дополнительного обычного подтверждения после согласия не будет.</div>`
    : "";

  dom.confirmationContent.innerHTML = `
    <div class="confirmation-summary">
      <div class="confirmation-row"><span>Вы отдаёте</span><strong>${formatSourceAmount(attempt.sourceAmount)} ${attempt.pair.source}</strong></div>
      <div class="confirmation-row"><span>Вы получите</span><strong>${formatNumber(attempt.confirmedTargetAmount, 1)} ${attempt.pair.target}</strong></div>
      <div class="confirmation-row"><span>Применяемый курс</span><strong>1 USDT = ${formatNumber(attempt.confirmedQuote.rate, 2)} RUB${rateNote}</strong></div>
      <div class="confirmation-row"><span>Комиссия и спред</span><strong>0</strong></div>
      <div class="confirmation-row"><span>Ключ попытки</span><strong>${attempt.key}</strong></div>
    </div>
    ${changedNotice}
    ${asyncWarning}`;

  if (typeof dom.confirmationModal.showModal === "function") {
    dom.confirmationModal.showModal();
  } else {
    dom.confirmationModal.setAttribute("open", "");
  }
  dom.confirmOperation.focus();
}
