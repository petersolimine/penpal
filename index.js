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

    let lyrics = "";
    for (let i = 2; i < 12; i += 3) {
      try {
        let elHandle = await page.$x(`/html/body/div[1]/main/div[2]/div[2]/div[2]/div/div[${i}]`);
        let value = await page.evaluate((el) => el.innerText, elHandle[0]);
        lyrics = lyrics + value;
      } catch (err) {
        // write to file, break
        lyrics = lyrics.replace("JID “Dance Now' Official Lyrics & Meaning | Verified", "");
        fs.writeFileSync("./lyrics.txt", value + value2, "UTF-8");
        break;
      }
    }
  } catch (err) {
    console.log("ERR:", err.message);
  }
};

initialize();

exports.initialize = initialize;
