import { Builder, By, until } from 'selenium-webdriver';
const driver = await new Builder().forBrowser(process.env.BROWSER || 'chrome').build();
try {
  await driver.get(process.env.APP_URL || 'http://localhost:5173/login');
  await driver.findElement(By.css('input[type="email"]')).sendKeys('alex@example.test');
  await driver.findElement(By.css('input[type="password"]')).sendKeys('DemoPass123!');
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Account overview')]")), 10000);
  console.log('Selenium smoke test passed');
} finally { await driver.quit(); }

