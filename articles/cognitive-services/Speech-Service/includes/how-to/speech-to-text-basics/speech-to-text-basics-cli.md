---
author: laujan
ms.service: cognitive-services
ms.topic: include
ms.date: 09/08/2020
ms.author: lajanuar
---

One of the core features of the Speech service is the ability to recognize and transcribe human speech (often referred to as speech-to-text). In this quickstart, you learn how to use the Speech CLI in your apps and products to perform high-quality speech-to-text conversion.

[!INCLUDE [SPX Setup](../../spx-setup.md)]

## Speech-to-text from microphone

Plug in and turn on your PC microphone, and turn off any apps that might also use the microphone. Some computers have a built-in microphone, while others require configuration of a Bluetooth device.

Now you're ready to run the Speech CLI to recognize speech from your microphone. From the command line, change to the directory that contains the Speech CLI binary file, and run the following command.

```bash
spx recognize --microphone
```

> [!NOTE]
> The Speech CLI defaults to English. You can choose a different language [from the Speech-to-text table](../../../../language-support.md).
> For example, add `--source de-DE` to recognize German speech.

Speak into the microphone, and you see transcription of your words into text in real-time. The Speech CLI will stop after a period of silence, or when you press ctrl-C.

## Speech-to-text from audio file

The Speech CLI can recognize speech in many file formats and natural languages. In this example, you can use any WAV file (16kHz or 8kHz, 16-bit, and mono PCM) that contains English speech. Or if you want a quick sample, download the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/whatstheweatherlike.wav" download="whatstheweatherlike" target="_blank">whatstheweatherlike.wav <span class="docon docon-download x-hidden-focus"></span></a> file and copy it to the same directory as the Speech CLI binary file.

Now you're ready to run the Speech CLI to recognize speech found in the audio file by running the following command.

```bash
spx recognize --file whatstheweatherlike.wav
```

> [!NOTE]
> The Speech CLI defaults to English. You can choose a different language [from the Speech-to-text table](../../../../language-support.md).
> For example, add `--source de-DE` to recognize German speech.

The Speech CLI will show a text transcription of the speech on the screen.