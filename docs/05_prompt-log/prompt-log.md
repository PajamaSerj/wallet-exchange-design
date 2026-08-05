# Project Prompt Log

**Статус:** IN PROGRESS  
**Последнее обновление:** 2026-08-05

| Chat ID | Этап | Журнал | Статус | Файлы |
|---|---|---|---|---|
| CHAT-00 | Governance / Master | [`chat-00-governance.md`](chats/chat-00-governance.md) | IN PROGRESS | Каркас репозитория |
| CHAT-01 | Requirements / Domain | [`chat-01-domain-analysis.md`](chats/chat-01-domain-analysis.md) | COMPLETED WITH OPEN ITEMS | `requirements-register.md`, `assumptions-decisions.md`, `traceability-matrix.md`, `acceptance-checklist.md`, Prompt Log |
| CHAT-02 | System Design | [`chat-02-system-design.md`](chats/chat-02-system-design.md) | COMPLETED | SDD, 4 Mermaid-диаграммы, `DEC-036`–`DEC-040`, SDD-трассировка, acceptance checks |
| CHAT-03 | UX/UI | [`chat-03-ux-ui.md`](chats/chat-03-ux-ui.md), [`manual review`](chats/chat-03-ux-ui-review.md) | UX REVIEW — AWAITING MANUAL SMOKE | переработанный прототип; документация и screenshots ожидают подтверждения UI |
| CHAT-04 | Gherkin | [`chat-04-gherkin.md`](chats/chat-04-gherkin.md) | NOT STARTED | TBD |
| CHAT-05 | OpenAPI | [`chat-05-openapi.md`](chats/chat-05-openapi.md) | NOT STARTED | TBD |
| CHAT-06 | Integration | [`chat-06-integration.md`](chats/chat-06-integration.md) | NOT STARTED | TBD |
| CHAT-07 | Final Audit | [`chat-07-final-audit.md`](chats/chat-07-final-audit.md) | NOT STARTED | TBD |

## Сводная запись CHAT-01

| Поле | Значение |
|---|---|
| Цель | Сформировать согласованную базу требований для создания заявки на обмен RUB/USDT |
| Основные источники | Бриф, ответы пользователя, governance-файлы, публичные материалы Bidzaar, официальная документация CoinGecko |
| Результат | 165 атомарных положений, решения/допущения, глоссарий, модель предметной области, трассировка |
| Ключевые исправления ИИ | Исключено сравнение скрытых знаков курса; устранён `cancelled`; отделена локальная история от глобальной; визуальные догадки помечены как интерпретации |
| Открытые вопросы | 4 вопроса `MEDIUM`; `BLOCKER` и `HIGH` закрыты |
| Следующие чаты | CHAT-02 SDD, CHAT-03 UX/UI, CHAT-04 Gherkin, CHAT-05 OpenAPI |

## Сводная запись CHAT-02

| Поле | Значение |
|---|---|
| Цель | Сформировать высокоуровневый системный дизайн обмена RUB/USDT до `completed`/`rejected` |
| Основные источники | Бриф, governance-база CHAT-01, acceptance checklist и prompt logs |
| Результат | SDD из 17 разделов; контекстная, две sequence- и state-диаграммы; обновлённая SDD-трассировка и этапный acceptance checklist |
| Компоненты | UI/flow, котировки, расчёт/валидация, оркестратор заявки, баланс/резерв, шлюз дополнительной проверки, demo-хранилище |
| Ключевые решения | Явный demo-переключатель `pending`; логические компоненты; атомарные бизнес-границы; признак актуальности баланса; защита повторных terminal-событий |
| Ключевые исправления ИИ | Убрана лишняя технологическая детализация; после повторной сверки восстановлены обязательные 15 шагов, атрибутная модель, полная матрица ошибок и handoff-таблицы; скрытый триггер `pending` заменён прозрачным; предотвращён повторный финансовый эффект |
| Открытые вопросы | `OQ-M-01`, `OQ-M-02`, `OQ-M-04` (`MEDIUM`); новых `BLOCKER`/`HIGH` нет |
| Следующие чаты | CHAT-03 UX/UI, CHAT-04 Gherkin, CHAT-05 OpenAPI, затем CHAT-06 Integration |

## Сводная запись CHAT-03

| Поле | Значение |
|---|---|
| Цель | Реализовать интерактивный desktop/mobile-прототип, строго следующий SDD, и подготовить UX-документацию этапа 3 |
| Основные источники | Бриф, SDD и диаграммы, governance CHAT-01/02, Prompt Logs предыдущих этапов, полный промпт CHAT-03 |
| Результат | Переработанный HTML/CSS/JS: компактные кошельки, двухблочная форма, settings drawer и раскрывающаяся история; прежние screenshots и UX-документация ожидают smoke-approval |
| Ключевые UX-решения | Форма как главный объект; RUB/USDT-блоки со swap; удержание approximate balance; demo-настройки под шестерёнкой; компактная раскрывающаяся история |
| Ключевые исправления ИИ | Устранён скрытый trigger pending; changed-result сравнивается после округления; pending не списывает total; terminal убирает резерв; repeat key не создаёт дубль; Bidzaar не копируется |
| Проверки | Для текущей итерации: Node syntax, HTML/DOM ID и изолированные бизнес-проверки; браузерная автоматизация и новые screenshots намеренно не запускались |
| Открытые вопросы | `OQ-M-01`, `OQ-M-02`, `OQ-M-04` (`MEDIUM`); GitHub Pages не заявлен рабочим без публикации |
| Следующие чаты | Сначала ручной smoke-тест и синхронизация UX-документации; затем CHAT-04/05/06/07 |

Каждый журнал должен содержать цель, входы, использованные промпты, результаты, допущения ИИ, ошибки или галлюцинации, способ обнаружения, ручные исправления, нерешённые вопросы и связанные требования.
