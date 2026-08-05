# Requirements Traceability Matrix

**Статус:** SDD BASELINE + CHAT-03 UX/UI ACCEPTED / DOWNSTREAM PLANNED  
**Дата актуализации:** 2026-08-05  
**Источник требований:** [`requirements-register.md`](requirements-register.md)  
**Публичный UX evidence:** [https://pajamaserj.github.io/wallet-exchange-design/](https://pajamaserj.github.io/wallet-exchange-design/)

Матрица группирует ID только при совпадении SDD- и UX/UI-доказательств. Каждый ID сохраняет самостоятельный смысл из реестра и связан с [`acceptance-checklist.md`](acceptance-checklist.md). Финальная UX-компоновка вручную принята пользователем; WebP первой реализации остаются архивом и не используются как актуальное UI evidence. Gherkin, OpenAPI, интеграционный QA и проектный `VERIFIED` остаются `PLANNED`.

| Requirement IDs | SDD evidence | Final UX/UI evidence | Prompt Log / review | Downstream |
|---|---|---|---|---|
| BR-001–002, CON-007 | [SDD-01] | [UX-01] | CHAT-01, CHAT-02, CHAT-03 accepted | PLANNED |
| BR-003, FR-033–034, CON-001–006 | [SDD-02] | [UX-01] | CHAT-01, CHAT-02, CHAT-03 accepted | PLANNED |
| BR-004 | [SDD-08] | [UX-01] | CHAT-01–03 | PLANNED |
| UR-001, UR-006–007 | [SDD-06] | [UX-07] | CHAT-03 manual acceptance | PLANNED |
| UR-002–003, UR-014 | [SDD-06] | [UX-05], [UX-19] | CHAT-03 manual acceptance | PLANNED |
| UR-004–005 | [SDD-06] | [UX-09] | CHAT-03 manual acceptance | PLANNED |
| UR-008 | [SDD-06] | [UX-11] | CHAT-03 manual acceptance | PLANNED |
| UR-009 | [SDD-06] | [UX-12] | CHAT-03 manual acceptance | PLANNED |
| UR-010 | [SDD-06] | [UX-13] | CHAT-03 manual acceptance | PLANNED |
| UR-011–012 | [SDD-16] | [UX-13], [UX-15] | CHAT-03 manual acceptance | PLANNED |
| UR-013 | [SDD-06] | [UX-15] | CHAT-03 manual acceptance | PLANNED |
| UR-015–016, FR-032, BRL-018, ERR-001–012, NFR-002 | [SDD-13] | [UX-14] | CHAT-01–03 | PLANNED |
| FR-001–003 | [SDD-05] | [UX-03] | CHAT-01–03 | PLANNED |
| FR-004–012 | [SDD-10] | [UX-12] | CHAT-01–03 | PLANNED |
| FR-013–014, BRL-004–005, BRL-007–010 | [SDD-10] | [UX-09] | CHAT-01–03 | PLANNED |
| FR-015–018 | [SDD-11] | [UX-10] | CHAT-01–03 | PLANNED |
| FR-019–022, NFR-001 | [SDD-14] | [UX-16] | CHAT-01–03 | PLANNED |
| FR-023–028, BRL-011–017 | [SDD-12] | [UX-13], [UX-15] | CHAT-01–03 | PLANNED |
| FR-029–030, DR-004–006, DR-011–015, DR-018–020 | [SDD-09] | [UX-15] | CHAT-01–03 | PLANNED |
| FR-031 | [SDD-15] | [UX-17] | CHAT-01–03 | PLANNED |
| FR-035–036 | [SDD-08] | [UX-17] | CHAT-01–03 | PLANNED |
| BRL-001–002, VAL-007–009 | [SDD-05] | [UX-10] | CHAT-01–03 | PLANNED |
| BRL-003 | [SDD-05] | [UX-09] | CHAT-01–03 | PLANNED |
| BRL-006, VAL-010–013 | [SDD-10] | [UX-10] | CHAT-01–03 | PLANNED |
| DR-001–003, DR-009–010 | [SDD-09] | — | CHAT-01, CHAT-02 | PLANNED |
| DR-007–008, DR-017 | [SDD-09] | [UX-09] | CHAT-01–03 | PLANNED |
| DR-016 | [SDD-09] | [UX-16] | CHAT-01–03 | PLANNED |
| VAL-001–006 | [SDD-13] | [UX-10] | CHAT-01–03 | PLANNED |
| VAL-014–015 | [SDD-14] | [UX-10] | CHAT-01–03 | PLANNED |
| UX-001–002, UX-020 | — | [UX-05] | CHAT-03 manual acceptance | PLANNED |
| UX-003 | — | [UX-06] | CHAT-03 manual acceptance | PLANNED |
| UX-004–009 | — | [UX-09] | CHAT-03 manual acceptance | PLANNED |
| UX-010 | — | [UX-16] | CHAT-03 manual acceptance | PLANNED |
| UX-011 | — | [UX-12] | CHAT-03 manual acceptance | PLANNED |
| UX-012–015 | — | [UX-13] | CHAT-03 manual acceptance | PLANNED |
| UX-016–019 | — | [UX-18] | CHAT-03 manual acceptance | PLANNED |
| NFR-003 | [SDD-14] | [UX-15] | CHAT-01–03 | PLANNED |
| NFR-004 | [SDD-16] | [UX-02] | CHAT-01–03 | PLANNED |
| ART-001 | [SDD] | PLANNED | CHAT-01–03 | PLANNED |
| ART-002 | PLANNED | [UX-01], [PUBLIC] | CHAT-03 accepted | PLANNED |
| ART-003 | PLANNED | [UX-21], [PUBLIC-DOC] | CHAT-03 accepted | PLANNED |
| ART-004–008, ART-010 | PLANNED | PLANNED | CHAT-01–03 | PLANNED |
| ART-009 | PLANNED | [UX-22], [PROMPT-LOG], [MANUAL-REVIEW] | CHAT-03 accepted | PLANNED |
| CON-008–010 | [SDD-03] | [UX-01] | CHAT-01–03 | PLANNED |

## CHAT-03 acceptance evidence

- финальный HTML/CSS/JavaScript в [`../../prototype/`](../../prototype/);
- публичная страница [https://pajamaserj.github.io/wallet-exchange-design/](https://pajamaserj.github.io/wallet-exchange-design/);
- финальная спецификация [`../02_ux/ux-spec.md`](../02_ux/ux-spec.md);
- публикация и smoke [`../02_ux/prototype-link.md`](../02_ux/prototype-link.md);
- основной Prompt Log [`../05_prompt-log/chats/chat-03-ux-ui.md`](../05_prompt-log/chats/chat-03-ux-ui.md);
- отдельная запись review [`../05_prompt-log/chats/chat-03-ux-ui-review.md`](../05_prompt-log/chats/chat-03-ux-ui-review.md).

Ручная приёмка подтверждает UX/UI-компоновку и наблюдаемое поведение CHAT-03. Она не заменяет будущий независимый аудит всего проекта и не устанавливает глобальный `VERIFIED`.

## Правила актуализации

- `PLANNED` заменяется ссылкой только при фактическом появлении профильного артефакта.
- Группировка означает одинаковое evidence, а не объединение требований.
- Актуальным UX evidence является интерактивный прототип и финальная спецификация.
- Архивные снимки первой реализации не являются текущим evidence.
- Gherkin и OpenAPI не повышаются до появления профильных артефактов.
- `VERIFIED` не устанавливается рабочими чатами.

## Журнал изменений

| Дата | Изменение | Автор / чат |
|---|---|---|
| 2026-08-05 | Базовая матрица и `PLANNED` будущих доказательств | CHAT-01 |
| 2026-08-05 | Добавлены ссылки на покрытые разделы SDD | CHAT-02 |
| 2026-08-05 | Добавлено evidence первой UX-реализации | CHAT-03 |
| 2026-08-05 | После ручного review evidence заменено на финальный принятый интерфейс, Prompt Log review и публичную публикацию; screenshots переведены в архив | CHAT-03 closure |

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
[PROMPT-LOG]: ../05_prompt-log/chats/chat-03-ux-ui.md
[MANUAL-REVIEW]: ../05_prompt-log/chats/chat-03-ux-ui-review.md
