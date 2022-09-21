const fs = require("fs");
const OpenAI = require("openai-api");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

function trainModel() {
  const file = fs.readFileSync("../trainingsData.jsonl", "utf8");
  const lines = file.split("\n");
  const prompts = lines.map((line) => {
    const json = JSON.parse(line);
    return json.prompt;
  });
  const responses = lines.map((line) => {
    const json = JSON.parse(line);
    return json.response;
  });
  const data = {
    documents: responses,
    query: prompts,
  };
  const params = {
    engine: "davinci",
    documents: data.documents,
    query: data.query,
    max_rerank: 10,
    temperature: 0.5,
    logprobs: 10,
    stop: ["\n"],
  };
  openai
    .search(params)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// openai api fine_tunes.create -t ../trainingData.jsonl -m davinchi --suffix "genius-dylan"
