import { scrapeLyricsAndAddToTrainingData } from "./getLyricsAndAddToTrainingData.js";
import fs from "fs";

// a function that reads from a file called song_links.txt in the same directory, and calls the scrapeLyricsAndAddToTrainingData function with each line in the file
const scrapeAllLinks = async () => {
  const links = fs.readFileSync("song_links.txt", "utf8").split("\n");
  for (let i = 0; i < links.length; i++) {
    scrapeLyricsAndAddToTrainingData(links[i]);
  }
};

// a function that reads from a file called song_links.txt in the same directory, and calls the scrapeLyricsAndAddToTrainingData function with each line in the file
const scrapeAllLinksSequentially = async () => {
  const links = fs.readFileSync("song_links.txt", "utf8").split("\n");
  for (let i = 0; i < links.length; i++) {
    try {
      await scrapeLyricsAndAddToTrainingData(links[i]);
    } catch (err) {
      console.log(links[i]);
    }
  }
};

scrapeAllLinksSequentially();
