import { scrapeLyricsAndAddToTrainingData } from "./getLyricsAndAddToTrainingData.js";
import fs from "fs";

scrapeLyricsAndAddToTrainingData("https://genius.com/Bob-dylan-mr-tambourine-man-lyrics");

// a function that reads from a file called song_links.txt in the same directory, and calls the scrapeLyricsAndAddToTrainingData function with each line in the file
const scrapeAllLinks = () => {
  const links = fs.readFileSync("song_links.txt", "utf8").split("\n");
  for (let i = 0; i < links.length; i++) {
    scrapeLyricsAndAddToTrainingData(links[i]);
  }
};

scrapeAllLinks();
