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

In this article, you'll learn how to use the Speech CLI, a command-line interface, to access Speech services like speech to text, text to speech, and speech translation without writing code. The Speech CLI is production ready and can be used to automate simple workflows in the Speech service, using `.bat` or shell scripts.

This article assumes that you have working knowledge of the command prompt, terminal, or PowerShell.

[!INCLUDE [](includes/spx-setup.md)]

## Basic usage

This section shows a few basic SPX commands that are often useful for first-time testing and experimentation. Start by viewing the help built in to the tool by running the following command.

```console
spx
```

You can search help topics by keyword. For example, enter the following command to see a list of Speech CLI usage examples:

```console
spx help find --topics "examples"
```

Enter the following command to see options for the recognize command:

```console
spx help recognize
```

Additional help commands listed in the right column. You can enter these commands to get detailed help about subcommands.

## Speech to text (speech recognition)

Let's use the Speech CLI to convert speech to text (speech recognition) using your system's default microphone. After entering the command, SPX will begin listening for audio on the current active input device, and stop when you press **ENTER**. The recorded speech is then recognized and converted to text in the console output.

>[!IMPORTANT]
> If you are using a Docker container, `--microphone` will not work.

Run this command:

```console
spx recognize --microphone
```

With the Speech CLI, you can also recognize speech from an audio file.

```console
spx recognize --file /path/to/file.wav
```

> [!TIP]
> If you're recognizing speech from an audio file in a Docker container, make sure that the audio file is located in the directory that you mounted in the previous step.

Don't forget, if you get stuck or want to learn more about the Speech CLI's recognition options, just type:

```console
spx help recognize
```

## Text to speech (speech synthesis)

Running the following command will take text as input, and output the synthesized speech to the current active output device (for example, your computer speakers).

```console
spx synthesize --text "Testing synthesis using the Speech CLI" --speakers
```

You can also save the synthesized output to file. In this example, we'll create a file named `my-sample.wav` in the directory that the command is run.

```console
spx synthesize --text "Enjoy using the Speech CLI." --audio output my-sample.wav
```

These examples presume that you're testing in English. However, we support speech synthesis in many languages. You can pull down a full list of voices with this command, or by visiting the [language support page](./language-support.md).

```console
spx synthesize --voices
```

Here's how you use one of the voices you've discovered.

```console
spx synthesize --text "Bienvenue chez moi." --voice fr-CA-Caroline --speakers
```

Don't forget, if you get stuck or want to learn more about the Speech CLI's synthesis options, just type:

```console
spx help synthesize
```

## Speech to text translation

With the Speech CLI, you can also do speech to text translation. Run this command to capture audio from your default microphone, and output the translation as text. Keep in mind that you need to supply the `source` and `target` language with the `translate` command.

```console
spx translate --microphone --source en-US --target ru-RU
```

When translating into multiple languages, separate language codes with `;`.

```console
spx translate --microphone --source en-US --target ru-RU;fr-FR;es-ES
```

If you want to save the output of your translation, use the `--output` flag. In this example, you'll also read from a file.

```console
spx translate --file /some/file/path/input.wav --source en-US --target ru-RU --output file /some/file/path/russian_translation.txt
```

> [!NOTE]
> See the [language and locale article](language-support.md) for a list of all supported languages with their corresponding locale codes.

Don't forget, if you get stuck or want to learn more about the Speech CLI's translation options, just type:

```console
spx help translate
```

## Next steps

* [Speech CLI configuration options](./spx-data-store-configuration.md)
* [Batch operations with the Speech CLI](./spx-batch-operations.md)
