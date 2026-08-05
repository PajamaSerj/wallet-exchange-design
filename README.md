# Wallet Exchange Design

Основной источник требований: [`Wallet_Exchange_Project_Brief.md`](Wallet_Exchange_Project_Brief.md).

## Статус

Этапы требований, системного дизайна и UX/UI-прототипа подготовлены. Gherkin, OpenAPI, интеграционная проверка и итоговый аудит остаются отдельными будущими этапами; их scaffold-файлы не считаются готовыми результатами.

## UX/UI-прототип

- [Интерактивная реализация](prototype/)
- [UX-спецификация](docs/02_ux/ux-spec.md)
- [Ссылка и инструкция запуска](docs/02_ux/prototype-link.md)
- [Индекс скриншотов](docs/02_ux/screenshots/README.md)
- [Prompt Log CHAT-03](docs/05_prompt-log/chats/chat-03-ux-ui.md)

Локальный запуск:

```bash
python -m http.server 8000
```

Затем открыть `http://localhost:8000/prototype/`.

## Разделы

- [`docs/00_governance/`](docs/00_governance/) — приёмка, требования, трассировка, допущения и решения.
- [`docs/01_system-design/`](docs/01_system-design/) — высокоуровневый SDD и Mermaid-диаграммы.
- [`docs/02_ux/`](docs/02_ux/) — UX-спецификация, ссылка и скриншоты.
- [`docs/03_scenarios/`](docs/03_scenarios/) — будущие Gherkin-сценарии.
- [`docs/04_api/`](docs/04_api/) — будущая OpenAPI JSON и примеры.
- [`docs/05_prompt-log/`](docs/05_prompt-log/) — журнал ИИ-взаимодействия.
- [`docs/06_qa/`](docs/06_qa/) — будущий итоговый аудит, исправления и повторная проверка.
- [`prototype/`](prototype/) — статический веб-прототип.

## Правила передачи между чатами

Каждому чату передаются бриф, актуальные governance-файлы, необходимые результаты предыдущих этапов, список разрешённых для изменения файлов и критерии готовности. Новые допущения и решения регистрируются в `docs/00_governance/assumptions-decisions.md` только при фактической необходимости.

## Базовая проверка

```bash
python scripts/validate-artifacts.py
```

Скрипт проверяет комплектность scaffold-структуры и JSON, но не заменяет ручную проверку UX-поведения.
