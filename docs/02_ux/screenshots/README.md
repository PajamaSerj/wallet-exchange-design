# Prototype Screenshots

**Статус:** COMPLETE FOR CHAT-03  
**Дата создания и проверки:** 2026-08-05

Скриншоты сформированы из фактического HTML/CSS/JavaScript-прототипа. Для стабильной фиксации визуальных состояний браузерный тест перехватывал только ответ согласованного CoinGecko endpoint и возвращал валидную тестовую котировку `1 USDT = 91.23 RUB`; приложение при этом выполняло обычную клиентскую логику.

| Файл | Состояние |
|---|---|
| [`desktop-default.webp`](desktop-default.webp) | Desktop default: балансы, загруженный курс, пустая форма, demo-зона и пустая история |
| [`insufficient-balance.webp`](insufficient-balance.webp) | Сумма выше доступного RUB-баланса, локальная ошибка и заблокированное действие |
| [`normal-confirmation.webp`](normal-confirmation.webp) | Обычное подтверждение неизменившегося результата |
| [`changed-rate.webp`](changed-rate.webp) | Отдельное согласие с изменившимся отображаемым результатом |
| [`completed.webp`](completed.webp) | Синхронный `completed`, фактические суммы, обновлённые балансы и история |
| [`pending.webp`](pending.webp) | `pending`, активный резерв, доступный баланс и предупреждение об отсутствии отмены |
| [`rejected.webp`](rejected.webp) | Асинхронный `rejected`, отсутствие целевого зачисления и освобождённый резерв |
| [`mobile-default.webp`](mobile-default.webp) | Mobile default при ширине viewport 390 px |

Скриншоты являются доказательством состояний и резервным форматом сдачи, но не заменяют интерактивный прототип.
