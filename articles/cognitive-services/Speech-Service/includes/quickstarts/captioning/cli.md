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

[!INCLUDE [SPX Setup](../../spx-setup.md)]

## Create captions from speech

- WEBVTT Caption generation
    - Supports `--output vtt` with `spx translate`
    - Supports `--output vtt file FILENAME` to override default VTT FILENAME
    - Supports `--output vtt file -` to write to standard output
    - Individual VTT files are created for each target language (e.g. `--target en;de;fr`)
- SRT Caption generation
    - Supports `--output srt` with `spx recognize`, `spx intent`, and `spx translate`
    - Supports `--output srt file FILENAME` to override default SRT FILENAME
    - Supports `--output srt file -` to write to standard output
    - For `spx translate` individual SRT files are created for each target language (e.g. `--target en;de;fr`)

You can output both SRT (SubRip Subtitle) and WebVTT (Web Video Text Tracks) captions from any type of media that contains audio. For more information about the output formats, see the [Captioning concepts](~/articles/cognitive-services/speech-service/captioning-concepts.md) guide.



### Recognize

To recognize audio from a file and output both vtt and srt captions, run the following command: 

```console
spx recognize --file this.is.a.test.mp4 --format any --output vtt --output srt
```

```
WEBVTT

00:00:00.180 --> 00:00:03.230
Welcome to applied Mathematics course 201.
{
  "ResultId": "8e89437b4b9349088a933f8db4ccc263",
  "Duration": "00:00:03.0500000"
}
```


```srt
1
00:00:00,180 --> 00:00:03,230
Welcome to applied Mathematics course 201.
```


### Recognizing offset and duration

```console
spx config @my-caption-preset --clear
spx config @my-caption-preset --add output.each.recognizing.result.offset=true
spx config @my-caption-preset --add output.each.recognizing.result.duration=true
spx config @my-caption-preset --add output.each.recognizing.result.text=true
spx config @my-caption-preset --add output.each.recognizing.result.resultid=true
spx recognize --file audio.mp4 @my-caption-preset
```

```tsv
recognizer.recognizing.result.offset	recognizer.recognizing.result.duration	recognizer.recognizing.result.resultid	recognizer.recognizing.result.text
1800000	4200000	0d75708d419f45b1bfc1defd0c97d208	welcome to
1800000	8300000	6aa94f19379d4248b987818eec8de2e3	welcome to applied
1800000	14200000	7b985cbe90fb48529952a47c03546e7c	welcome to applied mathematics
1800000	19000000	095c417a7a6d4d97802ad05fbbf4fdf8	welcome to applied mathematics course
1800000	25700000	0698c6860a18460f81c1b353a2d4dd5f	welcome to applied mathematics course 200
1800000	29900000	2d7bc27024704aedae640ebc79efa570	welcome to applied mathematics course 201
```

### Translate
For translations with `spx translate`, individual SRT or VTT files are created for the recognized source language (e.g., `--source en-US`) and each target language (e.g. `--target en;de;fr`). For example, if you want French translations output as VTT from a file named `video.mp4`, the Speech CLI creates caption files named `output.video.{time}.vtt` (Translations in the source language) and `output.video.{time}.fr.vtt` (Translations in French).

For `spx translate` individual SRT files are created for each target language (e.g. `--target en;de;fr`).

To recognize audio from a file, translate to multiple languages, and output both vtt and srt captions, run the following command: 

```console
spx translate --source en-US --target fr;de;zh-Hans --file this.is.a.test.mp4 --format any --output vtt --output srt
```

Speak into the microphone, and you see transcription of your words into text in real time. The Speech CLI stops after a period of silence, or when you press Ctrl+C.

```console
Connection CONNECTED...
RECOGNIZED: Text=I'm excited to try speech to text.
```


## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
