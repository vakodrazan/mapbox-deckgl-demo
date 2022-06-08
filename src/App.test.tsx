import 'expect-puppeteer'
import puppeteer from "puppeteer"
describe('Load Button', () => {
  test('Button loads correctly', async () => {
    let browser = await puppeteer.launch({
      headless: false
    });
    let page = await browser.newPage();
    page.emulate({
      viewport: {
        width: 500,
        height: 2400
      },
      userAgent: ''
    });
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.MuiButton-root');
    const html = await page?.$eval('.MuiButton-root', (e: any) => e.innerHTML);
    expect(html).toBe('Load GeoJson<span class=\"MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root\"></span>');
    browser.close();
  }, 16000);
});