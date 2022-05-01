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

With the Speech CLI, you can output both SRT (SubRip Subtitle) and WebVTT (Web Video Text Tracks) captions from any type of media that contains audio. For more information about the output formats, see the [Captioning concepts](~/articles/cognitive-services/speech-service/captioning-concepts.md) guide.

To recognize audio from a file and output both vtt and srt captions, run the following command: 

```console
spx recognize --file caption.this.mp4 --format any --output vtt file - --output srt file -
```

Here are the SRT captions output followed by the WebVTT captions output to the console::

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

## Output options

Captions are written to the file specified by the `--output vtt file` or `--output srt file` option. If the file name is a hyphen (`-`), the captions are written to standard output as shown in the preceding example. 

To output both vtt and srt captions to separate files that you specify, run the following command: 

```console
spx recognize --file caption.this.mp4 --format any --output vtt file caption.vtt --output srt file caption.srt 
```

Open the captions.vtt file to view the WebVTT captions:

```vtt
WEBVTT

00:00:00.180 --> 00:00:03.230
Welcome to applied Mathematics course 201.
{
  "ResultId": "8e89437b4b9349088a933f8db4ccc263",
  "Duration": "00:00:03.0500000"
}
```

Open the captions.srt file to view the SRT captions:

```srt
1
00:00:00,180 --> 00:00:03,230
Welcome to applied Mathematics course 201.
```

If you omit the `file` option, the file name is automatically generated from the input file name and the local operating system epoch time. Run the following command to write WebVTT captions to the default output file:

```console
spx recognize --file caption.this.mp4 --format any --output vtt --output srt
```

Since the input file name is `caption.this.mp4`, then the WebVTT output file name would look like `output.caption.this.mp4.<EPOCH_TIME>.vtt`. The SRT output file name would look like `output.caption.this.mp4.<EPOCH_TIME>.srt`. In both cases, the `<EPOCH_TIME>` is replaced at run time. 

## Get offset and duration

You'll want to synchronize captions with the audio track, whether it's done in real time or with a prerecording. 

For example, run the following command to get the offset and duration of the recognized speech:

```console
spx recognize --file caption.this.mp4 --format any --output vtt file caption.vtt --output srt file caption.srt --output each file each.result.tsv --output all file output.result.tsv --output each recognizer recognizing result offset --output each recognizer recognizing duration --output each recognizer recognizing result resultid --output each recognizer recognizing text
```

These are the individual components of the preceding command:
- Recognize from the input file `caption.this.mp4`.
- Output WebVTT and SRT captions to the files `caption.vtt` and `caption.srt` respectively.
- Output the `offset`, `duration`, `requestid`, and `text` of each recognizing event to the file `each.result.tsv`.
- Output the `id`, `sessionid`, and `text` of each recognized event to the file `output.result.tsv`. 
  > [!NOTE]
  > The specified file name overrides the default file name. Otherwise the recognized text would have been written to a file named `output.<EPOCH_TIME>.tsv`, where `<EPOCH_TIME>` is replaced at run time. 

Open `each.result.tsv` to view the results of each recognizing event:

```tsv
recognizer.recognizing.result.offset	recognizer.recognizing.result.duration	recognizer.recognizing.result.resultid	recognizer.recognizing.result.text
1800000	4200000	0d75708d419f45b1bfc1defd0c97d208	welcome to
1800000	8300000	6aa94f19379d4248b987818eec8de2e3	welcome to applied
1800000	14200000	7b985cbe90fb48529952a47c03546e7c	welcome to applied mathematics
1800000	19000000	095c417a7a6d4d97802ad05fbbf4fdf8	welcome to applied mathematics course
1800000	25700000	0698c6860a18460f81c1b353a2d4dd5f	welcome to applied mathematics course 200
1800000	29900000	2d7bc27024704aedae640ebc79efa570	welcome to applied mathematics course 201
```

Open `output.result.tsv` to view the results of each recognized event:

```tsv
audio.input.id	recognizer.session.started.sessionid	recognizer.recognized.result.text
caption.this	0fe3749a96fa4735914300d8f2a8e136	Welcome to applied Mathematics course 201.
```

### Preset configuration

For readability, flexibility, and convenience, you can use a preset configuration with select output options. For example, you can create a preset configuration named `@caption.defaults` with the following series of commands:

```console
spx config @caption.defaults --clear
spx config @caption.defaults --add output.each.recognizing.result.offset=true
spx config @caption.defaults --add output.each.recognizing.result.duration=true
spx config @caption.defaults --add output.each.recognizing.result.resultid=true
spx config @caption.defaults --add output.each.recognizing.result.text=true
spx config @caption.defaults --add output.all.file.name=output.result.tsv
spx config @caption.defaults --add output.each.file.name=each.result.tsv
spx config @caption.defaults --add output.srt.file.name=caption.srt
spx config @caption.defaults --add output.vtt.file.name=caption.vtt
```

The settings are saved in a file named `caption.defaults` (no extension) in the current directory.

```
output.each.recognizing.result.offset=true
output.each.recognizing.result.duration=true
output.each.recognizing.result.resultid=true
output.each.recognizing.result.text=true
output.all.file.name=output.result.tsv
output.each.file.name=each.result.tsv
output.srt.file.name=caption.srt
output.vtt.file.name=caption.vtt
```

Now you can run this short command using the `@caption.defaults` preset configuration:

```console
spx recognize --file caption.this.mp4 --format any --output vtt --output srt @caption.defaults
```


## Translated captions

To get translated SRT and WebVTT captions with the Speech CLI, run the following command: 

```console
spx translate --source en-US --target de;fr;zh-Hant --file audio.mp4 --format any --output vtt file - --output srt file -
```

For translations with `spx translate`, separate SRT and VTT files are created for the source language (e.g., `--source en-US`) and each target language (e.g. `--target de;fr;zh-Hant`). To output translated SRT and WebVTT captions to files, run the following command: 

```console
spx translate --source en-US --target de;fr;zh-Hant --file caption.this.mp4 --format any --output vtt file caption.vtt --output srt file caption.srt
```

Captions should then be written to the following files: *caption.srt*, *caption.vtt*, *caption.de.srt*, *caption.de.vtt*, *caption.fr.srt*, *caption.fr.vtt*, *caption.zh-Hant.srt*, and *caption.zh-Hant.vtt*.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
