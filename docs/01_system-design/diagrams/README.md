# Diagrams

**Статус:** BASELINE  
**Владелец:** CHAT-02 System Design

Mermaid-исходники высокоуровневого SDD:

- [`context.mmd`](context.mmd) — контекст модуля и внешние зависимости;
- [`sequence-sync.mmd`](sequence-sync.mmd) — синхронный успешный поток и идемпотентный повтор;
- [`sequence-async.mmd`](sequence-async.mmd) — `pending → completed/rejected`, резерв и повтор;
- [`state-machine.mmd`](state-machine.mmd) — допустимые состояния и переходы заявки.

Диаграммы ограничены scope RUB/USDT и не показывают внутреннее устройство CoinGecko, источника баланса или дополнительной проверки.
