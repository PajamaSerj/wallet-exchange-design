# Wallet Exchange Design

Основной источник требований: [`Wallet_Exchange_Project_Brief.md`](Wallet_Exchange_Project_Brief.md).

## Статус проекта

CHAT-01 (требования), CHAT-02 (системный дизайн) и CHAT-03 (UX/UI-прототип) завершены. Итоговый интерфейс CHAT-03 принят пользователем после ручного UX-review, двух итераций доработки и повторной ручной проверки.

Gherkin, OpenAPI, интеграционная проверка и итоговый независимый аудит остаются отдельными будущими этапами и в рамках CHAT-03 не начинались.

## Публичный UX/UI-прототип

**Открыть без установки и авторизации:**  
[https://pajamaserj.github.io/wallet-exchange-design/](https://pajamaserj.github.io/wallet-exchange-design/)

Прототип поддерживает RUB → USDT и USDT → RUB, получение и повторную проверку курса CoinGecko, валидации, обычное и изменённое подтверждение, sync/async lifecycle, резерв, `pending → completed/rejected`, идемпотентность, demo-настройки и локальную историю.

Материалы CHAT-03:

- [UX-спецификация](docs/02_ux/ux-spec.md)
- [Публичная ссылка и инструкция](docs/02_ux/prototype-link.md)
- [README реализации](prototype/README.md)
- [Prompt Log CHAT-03](docs/05_prompt-log/chats/chat-03-ux-ui.md)
- [Запись ручного UX-review](docs/05_prompt-log/chats/chat-03-ux-ui-review.md)

Старые WebP-снимки сохранены в репозитории только как архив первой реализации и не являются актуальным представлением финального интерфейса. Основной формат передачи CHAT-03 — публичный интерактивный прототип.

## Разделы репозитория

- [`docs/00_governance/`](docs/00_governance/) — приёмка, требования, трассировка, допущения и решения.
- [`docs/01_system-design/`](docs/01_system-design/) — утверждённый высокоуровневый SDD и Mermaid-диаграммы.
- [`docs/02_ux/`](docs/02_ux/) — финальная UX-спецификация и сведения о публикации.
- [`docs/03_scenarios/`](docs/03_scenarios/) — будущие Gherkin-сценарии.
- [`docs/04_api/`](docs/04_api/) — будущая OpenAPI JSON и примеры.
- [`docs/05_prompt-log/`](docs/05_prompt-log/) — журнал ИИ-взаимодействия и ручных проверок.
- [`docs/06_qa/`](docs/06_qa/) — будущий итоговый аудит и повторная проверка.
- [`prototype/`](prototype/) — статический HTML/CSS/JavaScript-прототип, публикуемый через GitHub Pages.

## Локальный резервный запуск

Публичная ссылка является основным способом просмотра. Для разработки из корня репозитория можно запустить:

```bash
python -m http.server 8000
```

и открыть `http://localhost:8000/prototype/`.

## Проверки

```bash
python scripts/validate-artifacts.py
node --check prototype/core.js
node --check prototype/form.js
node --check prototype/operations.js
node --check prototype/app.js
```

Публикация выполняется workflow `.github/workflows/pages.yml`; после деплоя он запускает smoke-тест публичной страницы из `scripts/pages-smoke.mjs`.
