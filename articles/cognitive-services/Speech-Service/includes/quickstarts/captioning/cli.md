---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

[!INCLUDE [SPX Setup](../../spx-setup-quick.md)]

For more information, see the [Speech CLI quickstart](~/articles/cognitive-services/speech-service/spx-basics.md#download-and-install).

## Create captions from speech

With the [Speech CLI](~/articles/cognitive-services/speech-service/spx-overview.md), you can output both SRT (SubRip Subtitle) and WebVTT (Web Video Text Tracks) captions from any type of media that contains audio. 

To recognize audio from a file and output both WebVtt (`vtt`) and SRT (`srt`) captions, run the following command: 

```console
spx recognize --file caption.this.mp4 --format any --output vtt file - --output srt file - --output each file - @output.each.detailed --property SpeechServiceResponse_StablePartialResultThreshold=0 --profanity masked
```

The SRT and WebVTT captions are output to the console as shown here:

```console
1
00:00:00,180 --> 00:00:03,230
Welcome to applied Mathematics course 201.
WEBVTT

00:00:00.180 --> 00:00:03.230
Welcome to applied Mathematics course 201.
{
  "ResultId": "561a0ea00cc14bb09bd294357df3270f",
  "Duration": "00:00:03.0500000"
}
```

Please take note of optional arguments from the previous command:

- You can output WebVTT, SRT, or neither. For more information about SRT and WebVTT caption file formats, see the [Caption output format](~/articles/cognitive-services/speech-service/captioning-concepts.md#caption-output-format) section of the captioning concepts documentation.
- The preceding command also displayed event results with offset and duration. For more information, see the [Get speech recognition results](~/articles/cognitive-services/speech-service/get-speech-recognition-results.md) documentation.
- You can request that the Speech service return fewer `Recognizing` events that are more accurate. This is done by setting the `SpeechServiceResponse_StablePartialResultThreshold` property. For more information see the [Get partial results](~/articles/cognitive-services/speech-service/captioning-concepts.md#get-partial-results) section of the captioning concepts documentation.
- You can specify whether to mask, remove, or show profanity in recognition results. For more information see the [Profanity filter](~/articles/cognitive-services/speech-service/captioning-concepts.md#profanity-filter) section of the captioning concepts documentation.
- Captions are written to the file specified by the `--output vtt file` or `--output srt file` option. If the file argument is a hyphen (`-`), the captions are written to standard output. For more information, see the [Speech CLI output options](~/articles/cognitive-services/speech-service/spx-output-options.md) documentation.

## Translated captions

To get translated SRT and WebVTT captions with the Speech CLI, run the following command: 

```console
spx translate --source en-US --target de;fr;zh-Hant --file audio.mp4 --format any --output vtt file - --output srt file -
```

For translations with `spx translate`, separate SRT and VTT files are created for the source language (such as `--source en-US`) and each target language (such as `--target de;fr;zh-Hant`). To output translated SRT and WebVTT captions to files, run the following command: 

```console
spx translate --source en-US --target de;fr;zh-Hant --file caption.this.mp4 --format any --output vtt file caption.vtt --output srt file caption.srt
```

Captions should then be written to the following files: *caption.srt*, *caption.vtt*, *caption.de.srt*, *caption.de.vtt*, *caption.fr.srt*, *caption.fr.vtt*, *caption.zh-Hant.srt*, and *caption.zh-Hant.vtt*.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
