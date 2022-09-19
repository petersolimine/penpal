const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
fs = require("fs");

// a function that prints all the text content of a webpage inside of divs with the attribute "data-lyrics-container" equal to true and writes the lyrics to a file called "lyrics.txt"

function getLyrics(url) {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const text = await page.evaluate(() => {
      const elements = document.querySelectorAll("div[data-lyrics-container='true']");
      const text = [];
      for (let i = 0; i < elements.length; i++) {
        text.push(elements[i].innerText);
      }
      return text;
    });
    await browser.close();
    resolve(text);
  });
}

// a function that takes an array of strings and, for each string, processes the string to removes each of the newline characters that is followed by a space or a punctioation mark, and then returns the array
function removeUnneededNewlines(array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].replace(/\n(?=[.,?! ])/g, "");
  }
  return array;
}

// a funcion that take an array of strings and for each string
// 1. makes sure there is only one newline character before each '[' character
// 2. Ensures that there are no double newline characters by turning double newline characters into single newline characters, and
// The function then returns the array.

function addNewlines(array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].replace(/\n(?=\[)/g, "");
    array[i] = array[i].replace(/\n\n/g, "\n");
  }
  return array;
}

// a function that takes an array of strings and writes each string to a file called "lyrics.txt" by appending to the end of the file
function writeLyrics(array) {
  for (let i = 0; i < array.length; i++) {
    fs.appendFileSync("lyrics.txt", array[i]);
  }
}

// call the getLyrics function with a url
const lyricsPromise = getLyrics(
  "https://genius.com/Bob-dylan-lily-rosemary-and-the-jack-of-hearts-lyrics"
);

lyricsPromise.then((lyrics) => {
  // call the removeSpaces function with the lyrics
  const lyricsWithoutSpaces = removeUnneededNewlines(lyrics);
  const lyricsWithNewlines = addNewlines(lyricsWithoutSpaces);
  writeLyrics(lyricsWithNewlines, "lyrics.txt");
});

// a function that takes an array of strings and
// 1. combines them into one string
// 2. Appends the string to a .jsonl file called trainingData.jsonl in the format {"prompt": "", "completion": "the string"}
function addLyricsToTrainingData(array) {
  const string = array.join(" ");
  const json = JSON.stringify({ prompt: "", completion: string });
  fs.appendFileSync("trainingData.jsonl", json + "");
}
