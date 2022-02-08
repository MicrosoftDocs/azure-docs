---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/11/2020
ms.author: eur
---

In this quickstart, you learn common design patterns for doing text-to-speech synthesis by using the Speech SDK. You start by doing basic configuration and synthesis. You then move on to more advanced examples for custom application development, including:

* Getting responses as in-memory streams.
* Customizing output sample rate and bit rate.
* Submitting synthesis requests by using Speech Synthesis Markup Language (SSML).
* Using neural voices.

## Prerequisites

This article assumes that you have an Azure account and a Speech service subscription. If you don't have an account and a subscription, [try the Speech service for free](../../../overview.md#try-the-speech-service-for-free).

[!INCLUDE [SPX Setup](../../spx-setup.md)]

## Synthesize speech to a speaker

Now you're ready to run the Speech CLI to synthesize speech from text. From the command line, change to the directory that contains the Speech CLI binary file. Then run the following command:

```bash
spx synthesize --text "The speech synthesizer greets you!"
```

The Speech CLI will produce natural language in English through the computer speaker.

## Synthesize speech to a file

Run the following command to change the output from your speaker to a .wav file:

```bash
spx synthesize --text "The speech synthesizer greets you!" --audio output greetings.wav
```

The Speech CLI will produce natural language in English in the *greetings.wav* audio file. On Windows, you can play the audio file by entering `start greetings.wav`.
