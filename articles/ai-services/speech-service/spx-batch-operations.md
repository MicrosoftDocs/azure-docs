---
title: "Run batch operations with the Speech CLI - Speech service"
titleSuffix: Azure AI services
description: Learn how to do batch speech to text (speech recognition), batch text to speech (speech synthesis) with the Speech CLI.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 09/16/2022
ms.author: eur
ms.custom: mode-api
---

# Run batch operations with the Speech CLI

Common tasks when using the Speech service, are batch operations. In this article, you'll learn how to do batch speech to text (speech recognition), batch text to speech (speech synthesis) with the Speech CLI. Specifically, you'll learn how to:

* Run batch speech recognition on a directory of audio files
* Run batch speech synthesis by iterating over a `.tsv` file

## Batch speech to text (speech recognition)

The Speech service is often used to recognize speech from audio files. In this example, you'll learn how to iterate over a directory using the Speech CLI to capture the recognition output for each `.wav` file. The `--files` flag is used to point at the directory where audio files are stored, and the wildcard `*.wav` is used to tell the Speech CLI to run recognition on every file with the extension `.wav`. The output for each recognition file is written as a tab separated value in `speech_output.tsv`.

> [!NOTE]
> The `--threads` argument can be also used in the next section for `spx synthesize` commands, and the available threads will depend on the CPU and its current load percentage.

```console
spx recognize --files C:\your_wav_file_dir\*.wav --output file C:\output_dir\speech_output.tsv --threads 10
```

The following is an example of the output file structure.

```output
audio.input.id	recognizer.session.started.sessionid	recognizer.recognized.result.text
sample_1	07baa2f8d9fd4fbcb9faea451ce05475	A sample wave file.
sample_2	8f9b378f6d0b42f99522f1173492f013	Sample text synthesized.
```

## Batch text to speech (speech synthesis)

The easiest way to run batch text to speech is to create a new `.tsv` (tab-separated-value) file, and use the `--foreach` command in the Speech CLI. You can create a `.tsv` file using your favorite text editor, for this example, let's call it `text_synthesis.tsv`:

>[!IMPORTANT]
> When copying the contents of this text file, make sure that your file has a **tab** not spaces between the file location and the text. Sometimes, when copying the contents from this example, tabs are converted to spaces causing the `spx` command to fail when run.

```Input
audio.output	text
C:\batch_wav_output\wav_1.wav	Sample text to synthesize.
C:\batch_wav_output\wav_2.wav	Using the Speech CLI to run batch-synthesis.
C:\batch_wav_output\wav_3.wav	Some more text to test capabilities.
```

Next, you run a command to point to `text_synthesis.tsv`, perform synthesis on each `text` field, and write the result to the corresponding `audio.output` path as a `.wav` file.

```console
spx synthesize --foreach in @C:\your\path\to\text_synthesis.tsv
```

This command is the equivalent of running `spx synthesize --text "Sample text to synthesize" --audio output C:\batch_wav_output\wav_1.wav` **for each** record in the `.tsv` file.

A couple things to note:

* The column headers, `audio.output` and `text`, correspond to the command-line arguments `--audio output` and `--text`, respectively. Multi-part command-line arguments like `--audio output` should be formatted in the file with no spaces, no leading dashes, and periods separating strings, for example, `audio.output`. Any other existing command-line arguments can be added to the file as additional columns using this pattern.
* When the file is formatted in this way, no additional arguments are required to be passed to `--foreach`.
* Ensure to separate each value in the `.tsv` with a **tab**.

However, if you have a `.tsv` file like the following example, with column headers that **do not match** command-line arguments:

```Input
wav_path    str_text
C:\batch_wav_output\wav_1.wav	Sample text to synthesize.
C:\batch_wav_output\wav_2.wav	Using the Speech CLI to run batch-synthesis.
C:\batch_wav_output\wav_3.wav	Some more text to test capabilities.
```

You can override these field names to the correct arguments using the following syntax in the `--foreach` call. This is the same call as above.

```console
spx synthesize --foreach audio.output;text in @C:\your\path\to\text_synthesis.tsv
```

## Next steps

* [Speech CLI overview](./spx-overview.md)
* [Speech CLI quickstart](./spx-basics.md)
