import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

// a function that uses puppeteer to go to the following link https://genius.com/artists/Bob-dylan
// Clicks "show all songs by .." to expand the list of songs by the artist
// and then prints the links of each song to the console
// Once all the links have been printed, the function scrolls down the page to check if there are more, and if not, the function returns the list of song links

async function getSongs(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  // call the findElementWithText function with "Show all songs by Bob Dylan"
  const showAllSongsButton = await findElementWithText(page, "Show all songs by Bob Dylan");
  // if the button is found, click it and wait for the page to load
  console.log(showAllSongsButton.prototype.name);
  if (showAllSongsButton) {
    await showAllSongsButton.click();
    await page.waitForNavigation({ waitUntil: "networkidle0" });
  }

  const links = await page.evaluate(() => {
    const elements = document.querySelectorAll("a");
    const links = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].href.includes("https://genius.com/")) {
        links.push(elements[i].href);
      }
    }
    return links;
  });
  await browser.close();
  return links;
}

// call getSongs with the url https://genius.com/artists/Bob-dylan and print the results to the console
getSongs("https://genius.com/artists/Bob-dylan").then((links) => {
  console.log(links);
});

// Uses puppeteer to find an element that has the given text in the given page.
function findElementWithText(page, text) {
  return page.evaluate((text) => {
    const elements = document.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].innerText.toLowerCase().includes(text.toLowerCase())) {
        return elements[i];
      }
    }
    return null;
  }, text);
}
