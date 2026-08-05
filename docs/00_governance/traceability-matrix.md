# Requirements Traceability Matrix

**Статус:** SDD + CHAT-03 UX/UI ACCEPTED + CHAT-04 GHERKIN + CHAT-05 OPENAPI + CHAT-06 INTEGRATION EVIDENCE  
**Дата актуализации:** 2026-08-06  
**Источник требований:** [`requirements-register.md`](requirements-register.md)  
**Публичный UX evidence:** [https://pajamaserj.github.io/wallet-exchange-design/](https://pajamaserj.github.io/wallet-exchange-design/)

Матрица сохраняет самостоятельный смысл каждого requirement ID. SDD и вручную принятый UX/UI остаются базовыми доказательствами; CHAT-04 и CHAT-05 добавляют профильные Gherkin/OpenAPI evidence; CHAT-06 подтверждает согласованность только по `INT-01`–`INT-13`. Архивные WebP первой реализации не используются как актуальное UI evidence. Итоговый независимый аудит и проектный `VERIFIED` остаются задачей CHAT-07.

| Requirement IDs | SDD evidence | Final UX/UI evidence | CHAT-04–06 evidence |
|---|---|---|---|
| BR-001–002, CON-007 | [SDD-01] | [UX-01] | [GHK], [API], [INT] |
| BR-003, FR-033–034, CON-001–006 | [SDD-02] | [UX-01] | [INT] |
| BR-004 | [SDD-08] | [UX-01] | [INT] |
| UR-001, UR-006–007 | [SDD-06] | [UX-07] | [GHK], [API-REQ], [INT] |
| UR-002–003, UR-014 | [SDD-06] | [UX-05], [UX-19] | [INT] |
| UR-004–005 | [SDD-06] | [UX-09] | [GHK], [API-REQ], [INT] |
| UR-008 | [SDD-06] | [UX-11] | [GHK], [API-REQ], [INT] |
| UR-009 | [SDD-06] | [UX-12] | [GHK], [API-ERRORS], [INT] |
| UR-010 | [SDD-06] | [UX-13] | [GHK], [API-SUCCESS], [INT] |
| UR-011–012 | [SDD-16] | [UX-13], [UX-15] | [API-SUCCESS], [INT] |
| UR-013 | [SDD-06] | [UX-15] | [INT] |
| UR-015–016, FR-032, BRL-018, ERR-001–012, NFR-002 | [SDD-13] | [UX-14] | [GHK], [API-ERRORS], [INT] |
| FR-001–003 | [SDD-05] | [UX-03] | [GHK], [API-REQ], [INT] |
| FR-004–012 | [SDD-10] | [UX-12] | [GHK], [API-REQ], [API-ERRORS], [INT] |
| FR-013–014, BRL-004–005, BRL-007–010 | [SDD-10] | [UX-09] | [GHK], [API-REQ], [INT] |
| FR-015–018 | [SDD-11] | [UX-10] | [GHK], [API-REQ], [API-ERRORS], [INT] |
| FR-019–022, NFR-001 | [SDD-14] | [UX-16] | [API], [INT] |
| FR-023–028, BRL-011–017 | [SDD-12] | [UX-13], [UX-15] | [GHK], [API-SUCCESS], [INT] |
| FR-029–030, DR-004–006, DR-011–015, DR-018–020 | [SDD-09] | [UX-15] | [API-SUCCESS], [INT] |
| FR-031 | [SDD-15] | [UX-17] | [INT] |
| FR-035–036 | [SDD-08] | [UX-17] | [API-SUCCESS], [INT] |
| BRL-001–002, VAL-007–009 | [SDD-05] | [UX-10] | [GHK], [API-REQ], [API-ERRORS], [INT] |
| BRL-003 | [SDD-05] | [UX-09] | [INT] |
| BRL-006, VAL-010–013 | [SDD-10] | [UX-10] | [GHK], [API-REQ], [API-ERRORS], [INT] |
| DR-001–003, DR-009–010 | [SDD-09] | — | [API-SUCCESS], [INT] |
| DR-007–008, DR-017 | [SDD-09] | [UX-09] | [API-REQ], [API-SUCCESS], [INT] |
| DR-016 | [SDD-09] | [UX-16] | [API], [INT] |
| VAL-001–006 | [SDD-13] | [UX-10] | [GHK], [API-REQ], [API-ERRORS], [INT] |
| VAL-014–015 | [SDD-14] | [UX-10] | [API], [INT] |
| UX-001–002, UX-020 | — | [UX-05] | [INT] |
| UX-003 | — | [UX-06] | [PUBLIC-SMOKE], [INT] |
| UX-004–009 | — | [UX-09] | [INT] |
| UX-010 | — | [UX-16] | [API], [INT] |
| UX-011 | — | [UX-12] | [GHK], [API-ERRORS], [INT] |
| UX-012–015 | — | [UX-13] | [API-SUCCESS], [INT] |
| UX-016–019 | — | [UX-18] | [INT] |
| NFR-003 | [SDD-14] | [UX-15] | [INT] |
| NFR-004 | [SDD-16] | [UX-02] | [GHK], [API], [INT] |
| ART-001 | [SDD] | — | existing SDD; [INT] |
| ART-002 | — | [UX-01], [PUBLIC] | accepted UX; [INT] |
| ART-003 | — | [UX-21], [PUBLIC-DOC] | [PUBLIC-SMOKE], [INT] |
| ART-004–006 | — | — | [GHK], [CHAT-04], [INT] |
| ART-007–008 | — | — | [API], [API-REQ], [API-SUCCESS], [API-ERRORS], [CHAT-05], [INT] |
| ART-009 | — | [UX-22], [PROMPT-LOG], [MANUAL-REVIEW] | [CHAT-04], [CHAT-05], [INT] |
| ART-010 | — | — | PLANNED — только CHAT-07 final audit/recheck |
| CON-008–010 | [SDD-03] | [UX-01] | [INT] |

## CHAT-04 Gherkin evidence

- [`exchange-request.feature`](../03_scenarios/exchange-request.feature) содержит один `Feature` и ровно три утверждённых `Scenario`.
- Happy Path подтверждает RUB → USDT, смысл курса, расчёт `10000 / 96.45`, округление `103.7`, `completed` и согласованное изменение балансов.
- Негативные сценарии подтверждают отсутствие заявки/эффекта при недостаточном available balance и согласие с изменившимся отображаемым результатом до создания заявки.
- Профильный журнал: [`chat-04-gherkin.md`](../05_prompt-log/chats/chat-04-gherkin.md).

## CHAT-05 OpenAPI evidence

- [`openapi.json`](../04_api/openapi.json) описывает единственный `POST /exchange-requests`, обязательный `Idempotency-Key`, request/success/error schemas и enum статусов.
- Примеры: [`create-request.json`](../04_api/examples/create-request.json), [`success-response.json`](../04_api/examples/success-response.json), [`error-responses.json`](../04_api/examples/error-responses.json).
- Профильный журнал: [`chat-05-openapi.md`](../05_prompt-log/chats/chat-05-openapi.md).

## CHAT-06 integration evidence

- [`chat-06-integration.md`](../05_prompt-log/chats/chat-06-integration.md) содержит матрицу `INT-01`–`INT-13`, отдельные `INT-ISSUE-*`, severity, доказательства, минимальные действия и повторную проверку.
- Результат ограничен формулировкой `CONSISTENT WITHIN CHAT-06 SCOPE`.
- CHAT-06 не является независимой верификацией, не устанавливает `VERIFIED` и не заменяет CHAT-07.
- `INT-ISSUE-002` и `INT-ISSUE-003` закрыты обновлением governance evidence; `INT-ISSUE-001` по устаревшей этапной навигации README принят как MINOR и не исправлялся из-за границ этапа.

## CHAT-03 acceptance evidence

- финальный HTML/CSS/JavaScript в [`../../prototype/`](../../prototype/);
- публичная страница [https://pajamaserj.github.io/wallet-exchange-design/](https://pajamaserj.github.io/wallet-exchange-design/);
- финальная спецификация [`../02_ux/ux-spec.md`](../02_ux/ux-spec.md);
- публикация и smoke [`../02_ux/prototype-link.md`](../02_ux/prototype-link.md);
- основной Prompt Log [`../05_prompt-log/chats/chat-03-ux-ui.md`](../05_prompt-log/chats/chat-03-ux-ui.md);
- отдельная запись review [`../05_prompt-log/chats/chat-03-ux-ui-review.md`](../05_prompt-log/chats/chat-03-ux-ui-review.md).

Ручная приёмка подтверждает UX/UI-компоновку и наблюдаемое поведение CHAT-03. Она не заменяет будущий независимый аудит всего проекта и не устанавливает глобальный `VERIFIED`.

## Правила актуализации

- Evidence добавляется только при фактическом существовании профильного артефакта.
- Группировка означает одинаковое evidence, а не объединение требований.
- Актуальным UX evidence является интерактивный прототип и финальная спецификация.
- Архивные снимки первой реализации не являются текущим evidence.
- CHAT-06 подтверждает только заданную интеграционную матрицу.
- `VERIFIED` не устанавливается рабочими чатами.

## Журнал изменений

| Дата | Изменение | Автор / чат |
|---|---|---|
| 2026-08-05 | Базовая матрица и `PLANNED` будущих доказательств | CHAT-01 |
| 2026-08-05 | Добавлены ссылки на покрытые разделы SDD | CHAT-02 |
| 2026-08-05 | Добавлено evidence первой UX-реализации | CHAT-03 |
| 2026-08-05 | После ручного review evidence заменено на финальный принятый интерфейс, Prompt Log review и публичную публикацию; screenshots переведены в архив | CHAT-03 closure |
| 2026-08-06 | Добавлены фактические Gherkin/OpenAPI evidence и результат ограниченной интеграционной проверки `INT-01`–`INT-13` | CHAT-06 |

## Reference links

[SDD]: ../01_system-design/wallet-exchange-sdd.md
[SDD-01]: ../01_system-design/wallet-exchange-sdd.md#sdd-01
[SDD-02]: ../01_system-design/wallet-exchange-sdd.md#sdd-02
[SDD-03]: ../01_system-design/wallet-exchange-sdd.md#sdd-03
[SDD-05]: ../01_system-design/wallet-exchange-sdd.md#sdd-05
[SDD-06]: ../01_system-design/wallet-exchange-sdd.md#sdd-06
[SDD-08]: ../01_system-design/wallet-exchange-sdd.md#sdd-08
[SDD-09]: ../01_system-design/wallet-exchange-sdd.md#sdd-09
[SDD-10]: ../01_system-design/wallet-exchange-sdd.md#sdd-10
[SDD-11]: ../01_system-design/wallet-exchange-sdd.md#sdd-11
[SDD-12]: ../01_system-design/wallet-exchange-sdd.md#sdd-12
[SDD-13]: ../01_system-design/wallet-exchange-sdd.md#sdd-13
[SDD-14]: ../01_system-design/wallet-exchange-sdd.md#sdd-14
[SDD-15]: ../01_system-design/wallet-exchange-sdd.md#sdd-15
[SDD-16]: ../01_system-design/wallet-exchange-sdd.md#sdd-16
[UX-01]: ../02_ux/ux-spec.md#ux-01
[UX-02]: ../02_ux/ux-spec.md#ux-02
[UX-03]: ../02_ux/ux-spec.md#ux-03
[UX-05]: ../02_ux/ux-spec.md#ux-05
[UX-06]: ../02_ux/ux-spec.md#ux-06
[UX-07]: ../02_ux/ux-spec.md#ux-07
[UX-09]: ../02_ux/ux-spec.md#ux-09
[UX-10]: ../02_ux/ux-spec.md#ux-10
[UX-11]: ../02_ux/ux-spec.md#ux-11
[UX-12]: ../02_ux/ux-spec.md#ux-12
[UX-13]: ../02_ux/ux-spec.md#ux-13
[UX-14]: ../02_ux/ux-spec.md#ux-14
[UX-15]: ../02_ux/ux-spec.md#ux-15
[UX-16]: ../02_ux/ux-spec.md#ux-16
[UX-17]: ../02_ux/ux-spec.md#ux-17
[UX-18]: ../02_ux/ux-spec.md#ux-18
[UX-19]: ../02_ux/ux-spec.md#ux-19
[UX-21]: ../02_ux/ux-spec.md#ux-21
[UX-22]: ../02_ux/ux-spec.md#ux-22
[PUBLIC]: https://pajamaserj.github.io/wallet-exchange-design/
[PUBLIC-DOC]: ../02_ux/prototype-link.md
[PUBLIC-SMOKE]: ../../scripts/pages-smoke.mjs
[GHK]: ../03_scenarios/exchange-request.feature
[API]: ../04_api/openapi.json
[API-REQ]: ../04_api/examples/create-request.json
[API-SUCCESS]: ../04_api/examples/success-response.json
[API-ERRORS]: ../04_api/examples/error-responses.json
[PROMPT-LOG]: ../05_prompt-log/prompt-log.md
[MANUAL-REVIEW]: ../05_prompt-log/chats/chat-03-ux-ui-review.md
[CHAT-04]: ../05_prompt-log/chats/chat-04-gherkin.md
[CHAT-05]: ../05_prompt-log/chats/chat-05-openapi.md
[INT]: ../05_prompt-log/chats/chat-06-integration.md
