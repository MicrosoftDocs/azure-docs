---
title: "Speech CLI quickstart - Speech service"
titleSuffix: Azure Cognitive Services
description: Get started with the Azure Speech CLI. You can interact with Speech services like speech to text, text to speech, and speech translation without writing code.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 01/16/2022
ms.author: eur
ms.custom: mode-api
---

# Get started with the Azure Speech CLI

In this article, you'll learn how to use the Azure Speech CLI (command-line interface) to access Speech services like speech to text, text to speech, and speech translation without writing code. The Speech CLI is production ready and can be used to automate simple workflows in the Speech service, using `.bat` or shell scripts.

This article assumes that you have working knowledge of the command prompt, terminal, or PowerShell.

> [!NOTE]
> In PowerShell, the [stop-parsing token](/powershell/module/microsoft.powershell.core/about/about_special_characters#stop-parsing-token---) (`--%`) should follow `spx`. For example, run `spx --% config @region` to view the current region config value.

[!INCLUDE [](includes/spx-setup.md)]


## Create subscription config

# [Terminal](#tab/terminal)

You need an Azure subscription key and region identifier (ex. `eastus`, `westus`) to get started. See the [Speech service overview](overview.md#find-keys-and-locationregion) documentation for steps to get these credentials.

You run the following commands in a terminal to configure your subscription key and region identifier. 

```console
spx config @key --set SUBSCRIPTION-KEY
spx config @region --set REGION
```

The key and region are stored for future Speech CLI commands. Run the following commands to view the current configuration.

```console
spx config @key
spx config @region
```

As needed, include the `clear` option to remove either stored value.

```console
spx config @key --clear
spx config @region --clear
```

# [PowerShell](#tab/powershell)

You need an Azure subscription key and region identifier (ex. `eastus`, `westus`) to get started. See the [Speech service overview](overview.md#find-keys-and-locationregion) documentation for steps to get these credentials.

You run the following commands in PowerShell to configure your subscription key and region identifier. 

```powershell
spx --% config @key --set SUBSCRIPTION-KEY
spx --% config @region --set REGION
```

The key and region are stored for future Speech CLI commands. Run the following commands to view the current configuration.

```powershell
spx --% config @key
spx --% config @region
```

As needed, include the `clear` option to remove either stored value.

```powershell
spx --% config @key --clear
spx --% config @region --clear
```

***

## Basic usage

This section shows a few basic SPX commands that are often useful for first-time testing and experimentation. Start by viewing the help built in to the tool by running the following command.

```console
spx
```

You can search help topics by keyword. For example, run the following command to see a list of Speech CLI usage examples:

```console
spx help find --topics "examples"
```

Run the following command to see options for the recognize command:

```console
spx help recognize
```

Additional help commands are listed in the console output. You can enter these commands to get detailed help about subcommands.

## Speech to text (speech recognition)

You run this command to convert speech to text (speech recognition) using your system's default microphone. 

```console
spx recognize --microphone
```

After entering the command, SPX will begin listening for audio on the current active input device, and stop when you press **ENTER**. The spoken audio is then recognized and converted to text in the console output.

With the Speech CLI, you can also recognize speech from an audio file.

```console
spx recognize --file /path/to/file.wav
```

> [!NOTE]
> If you are using a Docker container, `--microphone` will not work.
> 
> If you're recognizing speech from an audio file in a Docker container, make sure that the audio file is located in the directory that you mounted in the previous step.

> [!TIP]
> If you get stuck or want to learn more about the Speech CLI's recognition options, you can run ```spx help recognize```.

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

> [!TIP]
> If you get stuck or want to learn more about the Speech CLI's recognition options, you can run ```spx help synthesize```.

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

> [!TIP]
> If you get stuck or want to learn more about the Speech CLI's recognition options, you can run ```spx help translate```.


## Next steps

* [Install GStreamer to use Speech CLI with MP3 and other formats](./how-to-use-codec-compressed-audio-input-streams.md)
* [Speech CLI configuration options](./spx-data-store-configuration.md)
* [Batch operations with the Speech CLI](./spx-batch-operations.md)
