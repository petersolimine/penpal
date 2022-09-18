const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
fs = require("fs");

const initialize = async () => {
  try {
    let browser = await puppeteer.launch({
      args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // local chrome on macOS. Remove this line of not on MacOS
      headless: false,
      ignoreHTTPSErrors: false,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000); //30 seconds

    await page.goto("https://genius.com/Wilderado-surefire-lyrics");
    // await page.waitForXPath("/html/body/div[1]/main/div[2]/div[2]/div[2]/div/div[2]");
    let elHandle = await page.$x("/html/body/div[1]/main/div[2]/div[2]/div[2]/div/div[2]"); //try them all until error? make sure content is lyrics?
    let elHandle2 = await page.$x("/html/body/div[1]/main/div[2]/div[2]/div[2]/div/div[5]");
    let value = await page.evaluate((el) => el.innerText, elHandle[0]);

    //const extractedText = await page.$eval("*", (el) => el.innerText);
    // console.log(extractedText);

    console.log(value);
    //s = value.replace(/([A-Z])/g, "\n$1").trim();
  } catch (err) {
    console.log("ERR:", err.message);
  }
};

initialize();

exports.initialize = initialize;
