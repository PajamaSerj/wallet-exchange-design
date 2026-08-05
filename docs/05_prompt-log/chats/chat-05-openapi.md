# OpenAPI Contract

**Chat ID:** CHAT-05  
**Статус:** COMPLETED  
**Дата:** 2026-08-06  
**Базовый `main`:** `6db7ddbb0a282ba29d77b8519dfb01eb2da2de80`

## Цель и границы

Подготовлен OpenAPI `3.0.3` JSON-контракт ровно одного публичного метода создания заявки на обмен. Бизнес-требования, SDD, UX/UI, прототип, Gherkin и scope не пересматривались. CHAT-06 и CHAT-07 не начинались.

Не добавлены quote/balance/read/history/cancel/finalize endpoints, callbacks, webhooks, security schemes, OAuth/JWT, KYC/AML, дополнительные валюты, комиссии, спред, новые статусы, лимиты, demo-поля и новые публичные бизнес-ошибки.

## Изученные источники

- `Wallet_Exchange_Project_Brief.md`;
- governance: requirements register, decisions, traceability matrix, acceptance checklist;
- SDD и три диаграммы lifecycle;
- UX-spec, prototype link и исходники прототипа;
- `exchange-request.feature`;
- API scaffold;
- Prompt Logs CHAT-00–CHAT-04.

Сопоставлены `DR-*`, `VAL-*`, `ERR-*`, `ART-007`, `ART-008`, `NFR-004` и релевантные `DEC-*`. Блокирующих противоречий не найдено.

## Предложенный и принятый контракт

### Endpoint и идемпотентность

`POST /exchange-requests`.

Обязательный заголовок `Idempotency-Key` представляет одну пользовательскую попытку. Первая обработка возвращает `201`; повтор того же ключа — `200` с сохранённым результатом первой обработки без второй заявки и повторного финансового эффекта.

### Request

- `walletId` — минимальный контекст кошелька без добавления security;
- `sourceCurrency`, `targetCurrency` — только RUB/USDT в разных разрешённых направлениях;
- `sourceAmount` — положительное целое;
- `confirmedConditions.quoteId`;
- `confirmedConditions.rate` — цена 1 USDT в RUB;
- `confirmedConditions.quoteUpdatedAt`;
- `confirmedConditions.targetAmount` — подтверждённая сумма с одним знаком;
- `balanceVersion` — признак актуальности баланса по `DEC-039`.

### Success response

Общие поля: `requestId`, `status`, валюты, исходная сумма, подтверждённые target/rate/quote, timestamps и `result`.

Status-specific `result`:

- `created`: заявка существует;
- `pending`: `reservedSourceAmount`;
- `completed`: `actualTargetAmount`, `actualRate`, `completedAt`;
- `rejected`: `targetCredited: false`, `completedAt`.

`rejected` — существующая заявка и успешный HTTP-ответ, а не новая HTTP-ошибка. `completed` и `rejected` терминальны.

### Ошибки

| HTTP | Business code | Результат |
|---:|---|---|
| `400` | `INVALID_REQUEST` | заявка не создана |
| `409` | `EXCHANGE_CONDITIONS_CHANGED` | возвращены новая quote/rate/target для повторного согласия; заявка не создана |
| `422` | `INSUFFICIENT_BALANCE` | возвращён актуальный available balance; заявка не создана |
| `503` | `RATE_UNAVAILABLE` | курс нельзя безопасно подтвердить; заявка не создана |
| `500` | `INTERNAL_ERROR` | безопасное сообщение без внутренних деталей; заявка не создана |

## Соответствие SDD, UX и Gherkin

- Формулы: RUB → USDT — деление на цену USDT в RUB; USDT → RUB — умножение.
- Исходная сумма целая; целевая сумма округляется до одного знака.
- Изменение отображаемого результата требует нового согласия до создания.
- Недостаточный баланс не создаёт заявку и не меняет баланс.
- Один ключ не создаёт вторую заявку, резерв или финансовый эффект.
- Status enum: только `created`, `pending`, `completed`, `rejected`.
- Demo-переключатели прототипа исключены.

Happy Path example: `10000 RUB / 96.45 RUB/USDT = 103.6806… USDT`, результат `103.7 USDT`.

## Имена и файлы

Изменены только:

- `docs/04_api/openapi.json`;
- `docs/04_api/examples/create-request.json`;
- `docs/04_api/examples/success-response.json`;
- `docs/04_api/examples/error-responses.json`;
- `docs/05_prompt-log/chats/chat-05-openapi.md`;
- `docs/05_prompt-log/prompt-log.md`.

## Использованные промпты

1. Изучить актуальный `main` и нормативные источники без расширения scope.
2. Сопоставить требования, решения, SDD, UX и три Gherkin-сценария.
3. Описать один POST с минимальным request/success contract, идемпотентностью и пятью ошибками.
4. Заменить scaffold, обновить только CHAT-05 Prompt Log и сводную запись.
5. Проверить JSON, OpenAPI profile, `$ref`, examples, enum, paths, security/demo и scope diff.
6. Создать отдельную ветку, один коммит и Draft PR без merge.

## Проверки

### JSON

```bash
python -m json.tool docs/04_api/openapi.json > /dev/null
python -m json.tool docs/04_api/examples/create-request.json > /dev/null
python -m json.tool docs/04_api/examples/success-response.json > /dev/null
python -m json.tool docs/04_api/examples/error-responses.json > /dev/null
```

Результат: все четыре файла корректны.

### Базовая проверка

```bash
python scripts/validate-artifacts.py
```

Результат: `Scaffold and basic JSON checks passed.`

### OpenAPI profile

Использован официальный OpenAPI 3.0 JSON Schema profile без постоянных зависимостей или конфигурационных файлов.

```bash
python /tmp/validate-openapi.py docs/04_api/openapi.json /mnt/data/oas30-schema.yaml
```

Результат: profile validation passed; предупреждений нет.

### Контрактная проверка

```bash
python /tmp/check-wallet-openapi.py   docs/04_api/openapi.json   docs/04_api/examples/create-request.json   docs/04_api/examples/success-response.json   docs/04_api/examples/error-responses.json
```

Проверены один path/POST, локальные `$ref`, соответствие примеров схемам, точный status enum, пять business codes, формула/округление, отсутствие security/callbacks/webhooks/demo и scope diff. Результат: passed; предупреждений нет.

## Противоречия, ошибки ИИ и ручные исправления

Блокирующих противоречий нет. `OQ-M-01` (группировка чисел) и `OQ-M-02` (пользовательский часовой пояс) не блокируют API: JSON хранит числа без UI-форматирования и `date-time` с явным offset/UTC.

Исправлены ранние риски:

- `rejected` не моделируется как HTTP-ошибка;
- demo-переключатели не перенесены в production request;
- не добавлены auth, `QUOTE_EXPIRED`, cancel/read/history/callback;
- operation key оставлен непрозрачной строкой, а не ограничен UUID;
- причина `rejected` не добавлена без необходимости;
- внутренние ошибки резервирования не опубликованы отдельным code.

## Намеренно не добавлено

Security, полный wallet API, дополнительные endpoints/callbacks/webhooks, demo-поля, комиссии/спред/валюты/лимиты, `cancelled`/`expired`, лишние ошибки и поля «на будущее».

## Итог

CHAT-05 завершён в разрешённом scope. CHAT-06 Integration и CHAT-07 Final Audit не начинались.
