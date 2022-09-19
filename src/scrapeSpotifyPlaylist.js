import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

// a function that uses puppeteer to scrape the inner text of each HTML element that has the attribute "dir" equal to "auto" and returns an array of strings where each string is the inner text of an <a> element
async function scrapeSpotifyPlaylist(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  const text = await page.evaluate(() => {
    const elements = document.querySelectorAll("a[dir='auto']");
    const text = [];
    for (let i = 0; i < elements.length; i += 2) {
      text.push(elements[i].innerText);
    }
    return text;
  });
  await browser.close();
  return text;
}

// call getSongNames with the url https://open.spotify.com/playlist/1N4cyfNrDGVBTrZDGKnHao and print the results to the console
scrapeSpotifyPlaylist("https://open.spotify.com/playlist/1N4cyfNrDGVBTrZDGKnHao").then(
  (songNames) => {
    console.log(songNames);
  }
);
