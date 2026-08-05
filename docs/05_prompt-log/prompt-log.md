# Project Prompt Log

**Статус:** IN PROGRESS  
**Последнее обновление:** 2026-08-05

| Chat ID | Этап | Журнал | Статус | Файлы |
|---|---|---|---|---|
| CHAT-00 | Governance / Master | [`chat-00-governance.md`](chats/chat-00-governance.md) | IN PROGRESS | Каркас репозитория |
| CHAT-01 | Requirements / Domain | [`chat-01-domain-analysis.md`](chats/chat-01-domain-analysis.md) | COMPLETED WITH OPEN ITEMS | `requirements-register.md`, `assumptions-decisions.md`, `traceability-matrix.md`, `acceptance-checklist.md`, Prompt Log |
| CHAT-02 | System Design | [`chat-02-system-design.md`](chats/chat-02-system-design.md) | NOT STARTED | TBD |
| CHAT-03 | UX/UI | [`chat-03-ux-ui.md`](chats/chat-03-ux-ui.md) | NOT STARTED | TBD |
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

Каждый журнал должен содержать цель, входы, использованные промпты, результаты, допущения ИИ, ошибки или галлюцинации, способ обнаружения, ручные исправления, нерешённые вопросы и связанные требования.
