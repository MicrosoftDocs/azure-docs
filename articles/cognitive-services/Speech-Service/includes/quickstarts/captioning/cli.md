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

To configure your Speech resource key and region, run the following commands. Replace `SUBSCRIPTION-KEY` with your Speech resource key, and replace `REGION` with your Speech resource region:

# [Terminal](#tab/terminal)

```console
spx config @key --set SUBSCRIPTION-KEY
spx config @region --set REGION
```

# [PowerShell](#tab/powershell)

```powershell
spx --% config @key --set SUBSCRIPTION-KEY
spx --% config @region --set REGION
```
***

For more information, see the [Speech CLI quickstart](~/articles/cognitive-services/speech-service/spx-basics.md#download-and-install).

## Create captions from speech

With the [Speech CLI](~/articles/cognitive-services/speech-service/spx-overview.md), you can output both SRT (SubRip Subtitle) and WebVTT (Web Video Text Tracks) captions from any type of media that contains audio. 

To recognize audio from a file and output both WebVtt (`vtt`) and SRT (`srt`) captions, run the following command: 

```console
spx recognize --file caption.this.mp4 --format any --output vtt file - --output srt file - --output each file - @output.each.detailed --property SpeechServiceResponse_StablePartialResultThreshold=5 --profanity masked --phrases "Applied Mathematics;"
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

Here are details about the optional arguments from the previous command:

- `--file caption.this.mp4 --format any`: Input audio from file. The default input is the microphone. For compressed audio files such as MP4, install GStreamer and see [How to use compressed input audio](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).
- `--output vtt file -` and `--output srt file -`: Outputs WebVTT and SRT captions to standard output. For more information about SRT and WebVTT caption file formats, see [Caption output format](~/articles/cognitive-services/speech-service/captioning-concepts.md#caption-output-format). For more information about the `--output` argument, see [Speech CLI output options](~/articles/cognitive-services/speech-service/spx-output-options.md).
- `@output.each.detailed`: Outputs event results with text, offset, and duration. For more information, see [Get speech recognition results](~/articles/cognitive-services/speech-service/get-speech-recognition-results.md).
- `--property SpeechServiceResponse_StablePartialResultThreshold=5`: You can request that the Speech service return fewer `Recognizing` events that are more accurate. In this example, the Speech service must affirm recognition of a word at least five times before returning the partial results to you. For more information, see [Get partial results](~/articles/cognitive-services/speech-service/captioning-concepts.md#get-partial-results) concepts.
- `--profanity masked`: You can specify whether to mask, remove, or show profanity in recognition results. For more information, see [Profanity filter](~/articles/cognitive-services/speech-service/captioning-concepts.md#profanity-filter) concepts.
- `--phrases "Constoso;Jessie;Rehaan"`: You can specify a list of phrases to be recognized, such as Contoso, Jesse, and Rehaan. For more information, see [Improve recognition with phrase list](~/articles/cognitive-services/speech-service/improve-accuracy-phrase-list.md).

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
