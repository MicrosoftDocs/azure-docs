---
author: v-demjoh
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 05/18/2020
ms.author: v-demjoh
---

## Run the SPX tool

Now you're ready to run the SPX tool to synthesize speech from text into a new audio file.

From the command line, change to the directory that contains spx.exe, and type:

```bash
spx synthesize --text "The speech synthesizer greets you!" --audio output greetings.wav
```

The SPX tool will produce natural language in English into the `greetings.wav` audio file.
