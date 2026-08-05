async function confirmPendingAttempt() {
  if (!pendingConfirmation || isProcessing) return;
  setProcessing(true, "Создаём заявку…");
  dom.confirmOperation.disabled = true;

  try {
    const request = processAttempt(pendingConfirmation);
    pendingConfirmation = null;
    dom.confirmationModal.close();
    dom.sourceAmount.value = "";
    dom.formStatus.textContent = request.status === "pending"
      ? "Заявка создана и передана на дополнительную проверку."
      : "Обмен выполнен.";
    renderAll(request.id);
    announce(request.status === "pending" ? "Заявка ожидает дополнительной проверки." : "Обмен успешно выполнен.");
  } catch (error) {
    dom.confirmationModal.close();
    handleSubmissionError(error);
  } finally {
    setProcessing(false);
  }
}

function processAttempt(attempt) {
  const existingId = state.processedKeys[attempt.key];
  if (existingId) {
    const existing = state.requests.find((request) => request.id === existingId);
    if (existing) return existing;
  }

  const available = availableBalance(attempt.pair.source);
  if (attempt.sourceAmount > available) throw new Error("BALANCE_BECAME_INSUFFICIENT");

  const now = Date.now();
  const request = {
    id: makeId("EX"),
    operationKey: attempt.key,
    createdAt: now,
    confirmedAt: now,
    completedAt: null,
    direction: attempt.direction,
    sourceCurrency: attempt.pair.source,
    targetCurrency: attempt.pair.target,
    sourceAmount: attempt.sourceAmount,
    confirmedTargetAmount: attempt.confirmedTargetAmount,
    confirmedRate: attempt.confirmedQuote.rate,
    confirmedQuoteId: attempt.confirmedQuote.id,
    quoteUpdatedAt: attempt.confirmedQuote.sourceUpdatedAt,
    actualTargetAmount: null,
    actualRate: null,
    actualRateIsDemo: false,
    reservedAmount: 0,
    status: "created",
    terminalDemoOutcome: attempt.terminalDemoOutcome,
    async: attempt.async
  };

  if (attempt.async) {
    state.balances[request.sourceCurrency].reserved = normalizeMoney(
      state.balances[request.sourceCurrency].reserved + request.sourceAmount
    );
    request.reservedAmount = request.sourceAmount;
    request.status = "pending";
  } else {
    state.balances[request.sourceCurrency].total = normalizeMoney(
      state.balances[request.sourceCurrency].total - request.sourceAmount
    );
    state.balances[request.targetCurrency].total = normalizeMoney(
      state.balances[request.targetCurrency].total + request.confirmedTargetAmount
    );
    request.actualRate = request.confirmedRate;
    request.actualTargetAmount = request.confirmedTargetAmount;
    request.completedAt = now;
    request.status = "completed";
  }

  state.requests.unshift(request);
  state.processedKeys[attempt.key] = request.id;
  state.lastAttemptKey = attempt.key;
  saveState();
  return request;
}

function finalizePending(requestId) {
  const request = state.requests.find((item) => item.id === requestId);
  if (!request || request.status !== "pending") return request;

  const sourceBalance = state.balances[request.sourceCurrency];
  const targetBalance = state.balances[request.targetCurrency];
  const activeReserve = request.reservedAmount;

  if (request.terminalDemoOutcome === "completed") {
    const actualRate = request.confirmedRate * 1.012;
    const actualTarget = calculateTarget(request.sourceAmount, request.direction, actualRate);
    sourceBalance.reserved = normalizeMoney(Math.max(0, sourceBalance.reserved - activeReserve));
    sourceBalance.total = normalizeMoney(sourceBalance.total - activeReserve);
    targetBalance.total = normalizeMoney(targetBalance.total + actualTarget);
    request.actualRate = actualRate;
    request.actualTargetAmount = actualTarget;
    request.actualRateIsDemo = true;
    request.status = "completed";
  } else {
    sourceBalance.reserved = normalizeMoney(Math.max(0, sourceBalance.reserved - activeReserve));
    request.status = "rejected";
  }

  request.completedAt = Date.now();
  saveState();
  renderAll(request.id);
  announce(request.status === "completed"
    ? "Дополнительная проверка завершена. Обмен выполнен."
    : "Дополнительная проверка завершена. Обмен отклонён, резерв освобождён.");
  return request;
}
