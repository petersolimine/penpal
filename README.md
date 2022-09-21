# penpal

## Scrape lyrics and fine tune a GPT-3 model to write songs

The idea here is to get songs from Genius and train a model with empty prompts where the completions are songs you like.

Doesn't make sense? No problem...

All you'll need to do is create a custom list of Genius.com song links, an OpenAI Secret Key, and have NPM installed.

## To get started:

### Scrape:

1. Run `npm i`
2. Add the songs you want to train on to `song_links.txt`, one per line
3. Run `npm run scrape`
   1. If any links are printed to the console, that means they were not successfully scraped. You may want to add them to the end of the list.
4. Done scraping! You should see a `trainingData.jsonl` file in the root directory

### Train:

3. Create a `.env` file in the root directory by running `cp .env.example .env` in the terminal
4. add your OpenAI API Key to the .env file
5. The `trainModel.js` script is not functional. Instead, use the openai CLI
   1. Install the openai CLI
   2. Prepare the dataset using the built in tool (removes duplicates etc... I suggest taking it's suggestions :) `openai tools fine_tunes.prepare_data -f trainingData.jsonl`
   3. You might want to add a stop sequence to the completions. To do so in the trainingData.jsonl file, do a find `"}` and replace `\n\n###\n\n"}`
   4. Queue the dataset for training by running `openai api fine_tunes.create -t trainingData_prepared.jsonl -m davinci --suffix "custom model name"` in the terminal
   5. Then wait. If you get disconnected, you can follow along by running `openai api fine_tunes.follow -i ft-SomeUniqueID `
6. Once your model is complete, add the model name to your .env
7. Then you can run `npm run write` which will execute the `src/writeSong.js` script and output your results to `output.txt` in the root directory (and log them to the console)

## Example output

The first run of this model, I fed it `[Verse 1]\nA friend to all is a friend to none` and the completion was:

He who earns the gratitude of many people earns the obligation
To offend one of them at some time

[Verse 2]
The friend of all is the friend of none who must be close
And faithful to himself and far from himself
Away from himself but not alone

[Verse 3]
He must be a pariah who’s not for one and all
But for one and more than one who must be uninvited
Away from his own home

[Verse 4]
For him all doors are closed, all doors that open
Are closed against him, for him no one is at home, for him
All walls are weeping walls and the friend of all is
The friend of none

Not too bad, eh?

## Ideas for improvements:

- Automatically pull playlists from Spotify and turn them into Genius.com links (see `src/scrapeSpotifyPlaylist.js`, I got a start with this but have not finished it yet. Have a look at how the genius.com links are structured: genius.com/Artist-name-song-name)
- Right now the prompts are empty. Maybe results would improve if the prompt was the first line of a song? i.e. `[Verse 1]\nHello stranger, it's been a long time`
- Run each set of song lyrics through a davinci model with the ending `\n\nExplain what this song means:\n`, then capture the results and feed it to the fine-tuned model as a prompt
- If someone wants to play around with the training parameters and report back, that would be cool too
- abstract away the 'lyrics' aspect of this project and make it a general purpose tool for scraping data and formatting it for GPT-3 fine-tuning
