---
title: "Speech CLI quickstart - Speech service"
titleSuffix: Azure Cognitive Services
description: Get started with the Azure Speech CLI. You can interact with Speech services like speech to text, text to speech, and speech translation without writing code. 
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 01/13/2021
ms.author: trbye
---

# Get started with the Azure Speech CLI

In this article, you'll learn how to use the Speech CLI, a command line interface, to access Speech services like speech to text, text to speech, and speech translation without writing code. The Speech CLI is production ready and can be used to automate simple workflows in the Speech service, using `.bat` or shell scripts.

This article assumes that you have working knowledge of the command prompt, terminal or PowerShell.

[!INCLUDE [](includes/spx-setup.md)]

## Basic usage

This section shows a few basic SPX commands that are often useful for first-time testing and experimentation. Start by viewing the help built in to the tool by running the following command.

```shell
spx
```

Notice **see:** help topics listed right of command parameters. You can enter these commands to get detailed help about sub-commands.

You can search help topics by keyword. For example, enter the following command to see a list of Speech CLI usage examples:

```shell
spx help find --topics "examples"
```

Enter the following command to see options for the recognize command:

```shell
spx help recognize
```

## Speech to text (speech recognition)

Let's use the Speech CLI to perform speech to text (speech recognition) using your system's default microphone. After entering the command, SPX will begin listening for audio on the current active input device, and stop when you press **ENTER**. The recorded speech is then recognized and converted to text in the console output.

>[!WARNING]
> If you are using a Docker container, `--microphone` will not work.

Run this command:

```shell
spx recognize --microphone
```

With the Speech CLI you can also recognize speech from an audio file.

```shell
spx recognize --file C:\path\to\file.wav
```
> [!TIP]
> If you're recognizing speech from an audio file in a Docker container, make sure that the audio file is located in the directory that you mounted in the previous step.

Don't forget, if you get stuck or want to learn more about the Speech CLI's recognition options, just type:

```shell
spx help recognize
```

## Text to speech (speech synthesis)

Running the following command will take text as input, and output the synthesized speech to the current active output device (e.g. your computer speakers).

```shell
spx synthesize --text "Testing synthesis using the Speech CLI" --speakers
```

You can also save the synthesized output to file. In this example, we'll create a file named `my-sample.wav` in the directory that the command is run.

```shell
spx synthesize --text "We hope that you enjoy using the Speech CLI." --audio output my-sample.wav
```

These examples presume that you're testing in English. However, we support speech synthesis in many languages. You can pull down a full list of voices with this command, or by visiting the [language support page](./language-support.md).

```shell
spx synthesize --voices
```

And finally, here's how you use one of the voices you've just discovered.

```shell
spx synthesize --text "Bienvenue chez moi." --voice fr-CA-Caroline --speakers
```

Don't forget, if you get stuck or want to learn more about the Speech CLI's synthesis options, just type:

```shell
spx help synthesize
```

## Speech to text translation

With the Speech CLI, you can also do speech to text translation. Run this command to capture audio from your default microphone, and perform translation to text in the target language.

Using this command, you specify both the source (language to translate **from**), and the target (language to translate **to**) languages. Using the `--microphone` argument will listen to audio on the current active input device, and stop after you press `ENTER`. 

```shell
spx translate --microphone --source en-US --target ru-RU
```

If you want to save the output of your translation, use the `--output` flag. In this example, you'll also read from a file.

```powershell
spx translate --file C:\some\file\path\input.wav --source en-US --target ru-RU --output file C:\some\file\path\russian_translation.txt
```

Now, let's take a look at how you can translate speech to text into multiple languages with a single command.

```shell
spx translate --microphone --source en-US --target ru-RU;fr-FR;es-ES
```

> [!NOTE]
> See the [language and locale article](language-support.md) for a list of all supported languages with their corresponding locale codes.

Don't forget, if you get stuck or want to learn more about the Speech CLI's translation options, just type:

```shell
spx help translate
```

## Batch operations

The commands in the previous section are great for quickly seeing how the Speech service works. However, when assessing whether or not your use-cases can be met, you likely need to perform batch operations against a range of input you already have, to see how the service handles a variety of scenarios. This section shows how to:

* Run batch speech recognition on a directory of audio files
* Iterate through a `.tsv` file and run batch text-to-speech synthesis

## Batch speech recognition

If you have a directory of audio files, it's easy with the Speech CLI to quickly run batch-speech recognition. Simply run the following command, pointing to your directory with the `--files` command. In this example, you append `\*.wav` to the directory to recognize all `.wav` files present in the dir. Additionally, specify the `--threads` argument to run the recognition on 10 parallel threads.

> [!NOTE]
> The `--threads` argument can be also used in the next section for `spx synthesize` commands, and the available threads will depend on the CPU and its current load percentage.

```shell
spx recognize --files C:\your_wav_file_dir\*.wav --output file C:\output_dir\speech_output.tsv --threads 10
```

The recognized speech output is written to `speech_output.tsv` using the `--output file` argument. The following is an example of the output file structure.

```output
audio.input.id    recognizer.session.started.sessionid    recognizer.recognized.result.text
sample_1    07baa2f8d9fd4fbcb9faea451ce05475    A sample wave file.
sample_2    8f9b378f6d0b42f99522f1173492f013    Sample text synthesized.
```

## Synthesize speech to a file

Run the following command to change the output from your speaker to a `.wav` file.

```bash
spx synthesize --text "The speech synthesizer greets you!" --audio output greetings.wav
```

The Speech CLI will produce natural language in English into the `greetings.wav` audio file.
In Windows, you can play the audio file by entering `start greetings.wav`.


## Batch text-to-speech synthesis

The easiest way to run batch text-to-speech is to create a new `.tsv` (tab-separated-value) file, and leverage the `--foreach` command in the Speech CLI. Consider the following file `text_synthesis.tsv`:

```output
audio.output    text
C:\batch_wav_output\wav_1.wav    Sample text to synthesize.
C:\batch_wav_output\wav_2.wav    Using the Speech CLI to run batch-synthesis.
C:\batch_wav_output\wav_3.wav    Some more text to test capabilities.
```

 Next, you run a command to point to `text_synthesis.tsv`, perform synthesis on each `text` field, and write the result to the corresponding `audio.output` path as a `.wav` file. 

```shell
spx synthesize --foreach in @C:\your\path\to\text_synthesis.tsv
```

This command is the equivalent of running `spx synthesize --text Sample text to synthesize --audio output C:\batch_wav_output\wav_1.wav` **for each** record in the `.tsv` file. A couple things to note:

* The column headers, `audio.output` and `text`, correspond to the command line arguments `--audio output` and `--text`, respectively. Multi-part command line arguments like `--audio output` should be formatted in the file with no spaces, no leading dashes, and periods separating strings, e.g. `audio.output`. Any other existing command line arguments can be added to the file as additional columns using this pattern.
* When the file is formatted in this way, no additional arguments are required to be passed to `--foreach`.
* Ensure to separate each value in the `.tsv` with a **tab**.

However, if you have a `.tsv` file like the following example, with column headers that **do not match** command line arguments:

```output
wav_path    str_text
C:\batch_wav_output\wav_1.wav    Sample text to synthesize.
C:\batch_wav_output\wav_2.wav    Using the Speech CLI to run batch-synthesis.
C:\batch_wav_output\wav_3.wav    Some more text to test capabilities.
```

You can override these field names to the correct arguments using the following syntax in the `--foreach` call. This is the same call as above.

```shell
spx synthesize --foreach audio.output;text in @C:\your\path\to\text_synthesis.tsv
```

## Next steps

* [Speech CLI configuration options](./spx-data-store-configuration.md)
* [Batch operations with the Speech CLI](./spx-batch-oeprations.md)
