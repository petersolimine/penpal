const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT_PREFIX = "[Verse 1]\n";
const PROMPT = "A friend to all is a friend to none";
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion({
  model: "davinci:ft-personal:genius-dylan-2022-09-21-00-04-08",
  prompt: PROMPT_PREFIX + PROMPT,
  temperature: 0.9,
  max_tokens: 1500,
});

console.log(response.data.choices[0].text);
console.log(response.data.choices[1].text);
