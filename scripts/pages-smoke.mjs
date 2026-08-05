import { chromium } from "playwright";

const baseUrl = process.env.PROTOTYPE_URL;
if (!baseUrl) throw new Error("PROTOTYPE_URL is required");

const url = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
const assets = ["", "styles.css", "core.js", "form.js", "operations.js", "app.js"];

for (const asset of assets) {
  const response = await fetch(new URL(asset, url), { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Asset check failed: ${asset || "index.html"} returned ${response.status}`);
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  locale: "ru-RU"
});
const page = await context.newPage();

page.on("pageerror", (error) => {
  throw error;
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "domcontentloaded" });

await page.locator("#quote-value").waitFor({ state: "visible" });
await page.waitForFunction(() => document.querySelector("#quote-value")?.textContent?.includes("1 USDT ="), null, {
  timeout: 30_000
});

const sourcePlaceholder = await page.locator("#source-amount").getAttribute("placeholder");
if (sourcePlaceholder !== "Введите сумму") {
  throw new Error(`Unexpected source placeholder: ${sourcePlaceholder}`);
}
const targetPrompt = (await page.locator("#target-placeholder").textContent())?.trim();
if (targetPrompt) {
  throw new Error(`Target panel must not prompt for input: ${targetPrompt}`);
}

await page.locator("#swap-direction").click();
const usdtAvailableHint = (await page.locator("#available-hint").textContent())?.trim().replace(/\s+/g, " ");
if (usdtAvailableHint !== "Можно обменять: 1 250 USDT") {
  throw new Error(`Unexpected integer exchangeable balance: ${usdtAvailableHint}`);
}
await page.locator("#swap-direction").click();

await page.locator("#settings-open").click();
await page.locator("#settings-dialog").waitFor({ state: "visible" });
await page.locator("#settings-close").click();

await page.locator("#source-amount").fill("1000");
await page.locator("#submit-exchange").waitFor({ state: "visible" });
await page.waitForFunction(() => !document.querySelector("#submit-exchange")?.disabled);
await page.locator("#submit-exchange").click();
await page.locator("#confirmation-modal").waitFor({ state: "visible" });
await page.locator("#confirm-operation").click();
await page.locator("#outcome-modal").waitFor({ state: "visible" });

const outcomeTitle = (await page.locator("#outcome-title").textContent())?.trim();
if (outcomeTitle !== "Обмен выполнен") {
  throw new Error(`Unexpected outcome title: ${outcomeTitle}`);
}
await page.locator("#outcome-close").click();

await page.locator("#history-details > summary").click();
await page.locator(".history-item").first().waitFor({ state: "visible" });
const historyText = await page.locator(".history-item").first().innerText();
if (!historyText.includes("Выполнена")) {
  throw new Error("Completed business status is missing from history");
}

await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "domcontentloaded" });
await page.locator(".exchange-card").waitFor({ state: "visible" });
const mobileFits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
if (!mobileFits) throw new Error("Mobile layout has horizontal overflow");
await page.locator("#settings-open").click();
await page.locator("#settings-dialog").waitFor({ state: "visible" });

await browser.close();
console.log(`Public prototype smoke test passed: ${url}`);
