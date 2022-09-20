import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
import fs from "fs";

const CRUFT = "JID \"Dance Now' Official Lyrics & Meaning | Verified";
// a function that prints all the text content of a webpage inside of divs with the attribute "data-lyrics-container" equal to true and writes the lyrics to a file called "lyrics.txt"

async function getLyrics(url) {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // set the default timeout to 60 seconds
    page.setDefaultNavigationTimeout(60000);
    // try to go to url, if it cant get to the url, reject the promise, log the url to the console, and early return from the function
    try {
      await page.goto(url, { waitUntil: "networkidle2" });
    } catch (error) {
      reject(error);
      console.log(url);
      return;
    }
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

// a function that takes an array of strings, and returns an array of strings where the character '“' is replaced with the character '"' and also the text "JID “Dance Now' Official Lyrics & Meaning | Verified" is removed
function removeUnneededText(array) {
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].replace(/“/g, '"');
    array[i] = array[i].replace(CRUFT, "");
  }
  return array;
}

// a function that takes an array of strings and
// 1. combines them into one string
// 2. Appends the string to a .jsonl file called trainingData.jsonl in the format {"prompt": "", "completion": "the string"}
function addLyricsToTrainingData(array) {
  const string = array.join("");
  const json = JSON.stringify({ prompt: "", completion: string });
  fs.appendFileSync("trainingData.jsonl", json + "\n");
}

export const scrapeLyricsAndAddToTrainingData = async (url) => {
  try {
    await getLyrics(url).then((lyrics) => {
      // call the removeSpaces function with the lyrics
      const lyricsWithoutSpaces = removeUnneededNewlines(lyrics);
      const lyricsWithNewlines = addNewlines(lyricsWithoutSpaces);
      const processedText = removeUnneededText(lyricsWithNewlines);
      addLyricsToTrainingData(processedText);
    });
  } catch (err) {
    console.log(url);
  }
};
