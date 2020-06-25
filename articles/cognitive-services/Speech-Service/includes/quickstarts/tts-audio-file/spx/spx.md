---
author: v-demjoh
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 05/18/2020
ms.author: v-demjoh
---

## Run the Speech CLI

Now you're ready to run the Speech CLI to synthesize speech from text into a new audio file.

From the command line, change to the directory that contains the Speech CLI binary file, and type:

```bash
spx synthesize --text "The speech synthesizer greets you!" --audio output greetings.wav
```

The Speech CLI will produce natural language in English into the `greetings.wav` audio file.
In Windows, you can play the audio file by entering `start greetings.wav`.
