# Project Prompt Log

**Статус:** IN PROGRESS  
**Последнее обновление:** 2026-08-06

| Chat ID | Этап | Журнал | Статус | Файлы |
|---|---|---|---|---|
| CHAT-00 | Governance / Master | [`chat-00-governance.md`](chats/chat-00-governance.md) | IN PROGRESS | Каркас репозитория |
| CHAT-01 | Requirements / Domain | [`chat-01-domain-analysis.md`](chats/chat-01-domain-analysis.md) | COMPLETED WITH OPEN ITEMS | governance-база и 165 атомарных положений |
| CHAT-02 | System Design | [`chat-02-system-design.md`](chats/chat-02-system-design.md) | COMPLETED | SDD, Mermaid, решения и SDD-трассировка |
| CHAT-03 | UX/UI | [`chat-03-ux-ui.md`](chats/chat-03-ux-ui.md), [`manual review`](chats/chat-03-ux-ui-review.md) | COMPLETED — MANUALLY ACCEPTED / PUBLICATION CHECK PENDING | финальный прототип, UX-spec, governance, Pages workflow и public smoke |
| CHAT-04 | Gherkin | [`chat-04-gherkin.md`](chats/chat-04-gherkin.md) | COMPLETED | 3 согласованных Gherkin-сценария и этапный Prompt Log |
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
| Результат | SDD из 17 разделов; контекстная, две sequence- и state-диаграммы; обновлённая SDD-трассировка |
| Ключевые решения | Явный demo-переключатель `pending`; атомарные бизнес-границы; признак актуальности баланса; защита повторных terminal-событий |
| Открытые вопросы | `OQ-M-01`, `OQ-M-02`, `OQ-M-04` (`MEDIUM`); новых `BLOCKER`/`HIGH` нет |
| Следующие чаты | CHAT-03 UX/UI, CHAT-04 Gherkin, CHAT-05 OpenAPI, затем CHAT-06 Integration |

## Сводная запись CHAT-03

| Поле | Значение |
|---|---|
| Цель | Реализовать и вручную принять интерактивный desktop/mobile-прототип, строго следующий SDD, затем опубликовать его через GitHub Pages |
| Основные источники | Бриф, SDD и диаграммы, governance CHAT-01/02, предыдущие Prompt Logs, исходный CHAT-03 и последующие пользовательские замечания |
| Первая реализация | Полная бизнес-логика, но перегруженная композиция с отдельными блоками кошельков, demo-панели и результата |
| Ручной review | Пользователь подтвердил логику, не принял UX, сформулировал требования к упрощению и повторно проверил доработки |
| Финальный результат | Единая карточка с кошельками и двухблочной формой; settings drawer; outcome dialog; раскрывающаяся история как единственное место полных деталей; русские business statuses |
| Пользовательская приёмка | Пользователь явно принял текущий интерфейс как финальный вариант UX/UI-прототипа |
| Сохранённая логика | Обе пары, CoinGecko/recheck, validations, normal/changed confirmation, sync/async, reserve, terminal outcomes, idempotency и `localStorage` |
| Скриншоты | WebP первой реализации сохранены неизменными как архив и не считаются актуальным final UI |
| Публикация | `.github/workflows/pages.yml`, `scripts/pages-smoke.mjs`, целевой URL `https://pajamaserj.github.io/wallet-exchange-design/` |
| Проверки | Node syntax, HTML/DOM, isolated business/lifecycle, artifact validation, links, quality gates, mergeability; после merge — public Playwright smoke |
| Открытые вопросы | `OQ-M-01`, `OQ-M-02`, `OQ-M-04` (`MEDIUM`) |
| Следующие чаты | Не начинались; CHAT-03 закрывается отдельно от CHAT-04–07 |

## Сводная запись CHAT-04

| Поле | Значение |
|---|---|
| Цель | Подготовить ровно три бизнес-сценария создания заявки на обмен без технических деталей и новых правил |
| Основные источники | Бриф, SDD, финальная UX-спецификация, опубликованный прототип и его исходники, журнал решений, Prompt Logs CHAT-02/03 |
| Результат | Happy Path, недостаточный доступный баланс и изменение отображаемого результата после повторной проверки курса |
| Ветка изменения курса | Пользователь явно соглашается с новыми условиями; заявка создаётся с новой котировкой без второго обычного подтверждения |
| Проверки | Один `Feature`, ровно три `Scenario`, обязательные `Given/When/Then`, отсутствие технических деталей и новых статусов/ошибок |
| Противоречия | Блокирующих нет; зафиксировано только расхождение имени `PROJECT_BRIEF.md` и фактического `Wallet_Exchange_Project_Brief.md` |
| Дополнительные сценарии | Отказ от нового результата, достаточный изменившийся баланс, ошибка курса, идемпотентный повтор и async-переходы перечислены только как предложения |
| Следующие чаты | CHAT-05 OpenAPI не начат; дальнейшие этапы выполняются отдельно |

Каждый журнал содержит цель, входы, использованные промпты, результаты, допущения ИИ, ошибки или риски, способ обнаружения, ручные исправления, нерешённые вопросы и связанные требования.
