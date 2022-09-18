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
      blockAds: false,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000); //30 seconds

    await page.goto("https://genius.com/Bob-dylan-lily-rosemary-and-the-jack-of-hearts-lyrics");
    // hypothesis: all lyrics are split in this way.. Maybe?

    let elHandle = await page.$x("/html/body/div[1]/main/div[2]/div[2]/div[2]/div/div[2]");
    let value = await page.evaluate((el) => el.innerText, elHandle[0]);
    // Some crap in every lyric
    value = value.replace("JID “Dance Now' Official Lyrics & Meaning | Verified", "");
    value = value.replace(/(?:\n\n)/g, "");

    console.log(value);
    let value2 = "";
    try {
      let elHandle2 = await page.$x("/html/body/div[1]/main/div[2]/div[2]/div[2]/div/div[5]");
      value2 = await page.evaluate((el) => el.innerText, elHandle2[0]);
      console.log(value2);
    } catch (err) {}

    fs.writeFileSync("./lyrics.txt", value + value2, "UTF-8");
  } catch (err) {
    console.log("ERR:", err.message);
  }
};

initialize();

exports.initialize = initialize;
