---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 08/11/2020
ms.author: trbye
---

[!INCLUDE [SPX Setup](../../spx-setup.md)]

## Synthesize speech to a speaker

Now you're ready to run the Speech CLI to synthesize speech from text. From the command line, change to the directory that contains the Speech CLI binary file. Then run the following command.

```bash
spx synthesize --text "The speech synthesizer greets you!"
```

The Speech CLI will produce natural language in English through the computer speaker.

## Synthesize speech to a file

Run the following command to change the output from your speaker to a `.wav` file.

```bash
spx synthesize --text "The speech synthesizer greets you!" --audio output greetings.wav
```

The Speech CLI will produce natural language in English into the `greetings.wav` audio file.
In Windows, you can play the audio file by entering `start greetings.wav`.