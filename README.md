# Wallet Exchange Design

Основной источник требований: [`Wallet_Exchange_Project_Brief.md`](Wallet_Exchange_Project_Brief.md).

## Статус

Создан стартовый каркас для последовательной работы специализированных чатов. Файлы со статусом `SCAFFOLD` являются заготовками и не считаются готовыми проектными материалами.

## Разделы

- [`docs/00_governance/`](docs/00_governance/) — приёмка, требования, трассировка, допущения и решения.
- [`docs/01_system-design/`](docs/01_system-design/) — высокоуровневый SDD.
- [`docs/02_ux/`](docs/02_ux/) — UX-спецификация, ссылка и скриншоты.
- [`docs/03_scenarios/`](docs/03_scenarios/) — Gherkin-сценарии.
- [`docs/04_api/`](docs/04_api/) — OpenAPI JSON и примеры.
- [`docs/05_prompt-log/`](docs/05_prompt-log/) — журнал ИИ-взаимодействия.
- [`docs/06_qa/`](docs/06_qa/) — итоговый аудит, исправления и повторная проверка.
- [`prototype/`](prototype/) — веб-прототип.

## Правила передачи между чатами

Каждому чату передаются бриф, актуальные governance-файлы, необходимые результаты предыдущих этапов, список разрешённых для изменения файлов и критерии готовности. Новые допущения и решения регистрируются в `docs/00_governance/assumptions-decisions.md`.

## Базовая проверка

```bash
python scripts/validate-artifacts.py
```
