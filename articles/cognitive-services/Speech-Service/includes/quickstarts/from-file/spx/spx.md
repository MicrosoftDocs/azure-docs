---
author: v-demjoh
ms.service: cognitive-services
ms.topic: include
ms.date: 05/13/2020
ms.author: v-demjoh
---

## Find a file that contains speech

The SPX tool can recognize speech in many file formats and natural languages. For this quickstart, you can use
a WAV file (16kHz or 8kHz, 16-bit, and mono PCM) that contains English speech.

1. Download the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/whatstheweatherlike.wav" download="whatstheweatherlike" target="_blank">whatstheweatherlike.wav <span class="docon docon-download x-hidden-focus"></span></a>.
2. Copy the `whatstheweatherlike.wav` file to the same folder as the spx.exe binary file.

## Run the SPX tool

Now you're ready to run the SPX tool to recognize speech found in the sound file.

From the command line, change to the directory that contains spx.exe, and type:

```bash
spx recognize --file whatstheweatherlike.wav
```

> [!NOTE]
> The SPX tool defaults to English. You can choose a different language [from the Speech-to-text table](../../../../language-support.md).
> For example, add `--source de-DE` to recognize German speech.

The SPX tool will show a text transcription of the speech on the screen. Then the SPX tool will close.
