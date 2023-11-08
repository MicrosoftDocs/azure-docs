---
title: "Configure the Speech CLI output options - Speech service"
titleSuffix: Azure AI services
description: Learn how to configure output options with the Speech CLI.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: reference
ms.date: 09/16/2022
ms.author: eur
---

# Configure the Speech CLI output options 

The [Speech CLI](spx-basics.md) output can be written to standard output or specified files. 

For contextual help in the Speech CLI, you can run any of the following commands:

```console
spx help recognize output examples
spx help synthesize output examples
spx help translate output examples
spx help intent output examples
```

## Standard output

If the file argument is a hyphen (`-`), the results are written to standard output as shown in the following example. 

```console
spx recognize --file caption.this.mp4 --format any --output vtt file - --output srt file - --output each file - @output.each.detailed --property SpeechServiceResponse_StablePartialResultThreshold=0 --profanity masked
```

## Default file output

If you omit the `file` option, output is written to default files in the current directory. 

For example, run the following command to write WebVTT and SRT [captions](captioning-concepts.md) to their own default files:

```console
spx recognize --file caption.this.mp4 --format any --output vtt --output srt --output each text --output all duration
```

The default file names are as follows, where the `<EPOCH_TIME>` is replaced at run time.
- The default SRT file name includes the input file name and the local operating system epoch time: `output.caption.this.<EPOCH_TIME>.srt`
- The default Web VTT file name includes the input file name and the local operating system epoch time: `output.caption.this.<EPOCH_TIME>.vtt`
- The default `output each` file name, `each.<EPOCH_TIME>.tsv`, includes the local operating system epoch time. This file is not created by default, unless you specify the `--output each` option.
- The default `output all` file name, `output.<EPOCH_TIME>.tsv`, includes the local operating system epoch time. This file is created by default.

## Output to specific files

For output to files that you specify instead of the [default files](#default-file-output), set the `file` option to the file name.

For example, to output both WebVTT and SRT [captions](captioning-concepts.md) to files that you specify, run the following command: 

```console
spx recognize --file caption.this.mp4 --format any --output vtt file caption.vtt --output srt file caption.srt --output each text --output each file each.result.tsv --output all file output.result.tsv
```

The preceding command also outputs the `each` and `all` results to the specified files.

## Output to multiple files

For translations with `spx translate`, separate files are created for the source language (such as `--source en-US`) and each target language (such as `--target "de;fr;zh-Hant"`).

For example, to output translated SRT and WebVTT captions, run the following command: 

```console
spx translate --source en-US --target "de;fr;zh-Hant" --file caption.this.mp4 --format any --output vtt file caption.vtt --output srt file caption.srt
```

Captions should then be written to the following files: *caption.srt*, *caption.vtt*, *caption.de.srt*, *caption.de.vtt*, *caption.fr.srt*, *caption.fr.vtt*, *caption.zh-Hant.srt*, and *caption.zh-Hant.vtt*.

## Suppress header

You can suppress the header line in the output file by setting the `has header false` option:

```
spx recognize --nodefaults @my.defaults --file audio.wav --output recognized text --output file has header false
```

See [Configure the Speech CLI datastore](spx-data-store-configuration.md#nodefaults) for more information about `--nodefaults`.

## Next steps 

* [Captioning quickstart](./captioning-quickstart.md)
