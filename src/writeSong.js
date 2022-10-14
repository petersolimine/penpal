import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_GPT3_KEY,
});

let PROMPT_PREFIX = "";
let PROMPT = "";

async function writeSong() {
  const openai = new OpenAIApi(configuration);
  // reads from a file called 'input.txt' and sets PROMPT equal to the contents of the file
  PROMPT = fs.readFileSync("input.txt", "utf8");

  const completion = await openai.createCompletion({
    model: process.env.GPT3_MODEL_ID,
    prompt: PROMPT,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0.35,
    presence_penalty: 0.1,
    stop: ["\n\n###\n\n"],
  });
  return completion;
}

function promptUser(select_type = false) {
  return new Promise((resolve, reject) => {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    if (select_type) {
      process.stdin.on("data", (text) => {
        if (text == "1\n" || text == "2\n") {
          process.stdin.pause();
          if (text === "1\n") {
            resolve("[Chorus]\n");
          }
          resolve("[Verse 1]\n");
        } else {
          console.log("Please enter 1 or 2");
        }
      });
    } else {
      process.stdin.on("data", (text) => {
        process.stdin.pause();
        resolve(text);
      });
    }
  });
}

writeSong().then((response) => {
  console.log(response.data.choices[0].text);
  // write to file
  fs.appendFileSync(
    "output.txt",
    `${new Date().toLocaleString()} \n${PROMPT_PREFIX + PROMPT} \n${
      response.data.choices[0].text
    } \n\n\n`
  );
});
