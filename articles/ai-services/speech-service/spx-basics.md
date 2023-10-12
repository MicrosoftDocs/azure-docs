---
title: "Quickstart: The Speech CLI - Speech service"
titleSuffix: Azure AI services
description: In this Azure AI Speech CLI quickstart, you interact with speech to text, text to speech, and speech translation without having to write code.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: quickstart
ms.date: 09/16/2022
ms.author: eur
ms.custom: mode-api
---

# Quickstart: Get started with the Azure AI Speech CLI

In this article, you'll learn how to use the Azure AI Speech CLI (also called SPX) to access Speech services such as speech to text, text to speech, and speech translation, without having to write any code. The Speech CLI is production ready, and you can use it to automate simple workflows in the Speech service by using `.bat` or shell scripts.

This article assumes that you have working knowledge of the Command Prompt window, terminal, or PowerShell.

> [!NOTE]
> In PowerShell, the [stop-parsing token](/powershell/module/microsoft.powershell.core/about/about_special_characters#stop-parsing-token---) (`--%`) should follow `spx`. For example, run `spx --% config @region` to view the current region config value.
 
## Download and install

[!INCLUDE [spx-setup](includes/spx-setup.md)]

## Create a resource configuration

# [Terminal](#tab/terminal)

To get started, you need a Speech resource key and region identifier (for example, `eastus`, `westus`). Create a Speech resource on the [Azure portal](https://portal.azure.com). For more information, see [Create a multi-service resource](../../ai-services/multi-service-resource.md?pivots=azportal).

To configure your resource key and region identifier, run the following commands:  

```console
spx config @key --set SPEECH-KEY
spx config @region --set SPEECH-REGION
```

The key and region are stored for future Speech CLI commands. To view the current configuration, run the following commands:

```console
spx config @key
spx config @region
```

As needed, include the `clear` option to remove either stored value:

```console
spx config @key --clear
spx config @region --clear
```

# [PowerShell](#tab/powershell)

To get started, you need a Speech resource key and region identifier (for example, `eastus`, `westus`). Create a Speech resource on the [Azure portal](https://portal.azure.com). For more information, see [Create a multi-service resource](~/articles/ai-services/multi-service-resource.md?pivots=azportal).

To configure your Speech resource key and region identifier, run the following commands in PowerShell: 

```powershell
spx --% config @key --set SPEECH-KEY
spx --% config @region --set SPEECH-REGION
```

The key and region are stored for future SPX commands. To view the current configuration, run the following commands:

```powershell
spx --% config @key
spx --% config @region
```

As needed, include the `clear` option to remove either stored value:

```powershell
spx --% config @key --clear
spx --% config @region --clear
```

***

## Basic usage

> [!IMPORTANT]
> When you use the Speech CLI in a container, include the `--host` option. You must also specify `--key none` to ensure that the CLI doesn't try to use a Speech key for authentication. For example, run `spx recognize --key none --host wss://localhost:5000/ --file myaudio.wav` to recognize speech from an audio file in a [speech to text container](speech-container-stt.md).

This section shows a few basic SPX commands that are often useful for first-time testing and experimentation. Start by viewing the help that's built into the tool by running the following command:

```console
spx
```

You can search help topics by keyword. For example, to see a list of Speech CLI usage examples, run the following command:

```console
spx help find --topics "examples"
```

To see options for the recognize command, run the following command:

```console
spx help recognize
```

Additional help commands are listed in the console output. You can enter these commands to get detailed help about subcommands.

## Speech to text (speech recognition)

> [!NOTE]
> You can't use your computer's microphone when you run the Speech CLI within a Docker container. However, you can read from and save audio files in your local mounted directory. 

To convert speech to text (speech recognition) by using your system's default microphone, run the following command: 

```console
spx recognize --microphone
```

After you run the command, SPX begins listening for audio on the current active input device. It stops listening when you select **Enter**. The spoken audio is then recognized and converted to text in the console output.

With the Speech CLI, you can also recognize speech from an audio file. Run the following command:

```console
spx recognize --file /path/to/file.wav
```

> [!TIP]
> If you get stuck or want to learn more about the Speech CLI recognition options, you can run ```spx help recognize```.

## Text to speech (speech synthesis)

The following command takes text as input and then outputs the synthesized speech to the current active output device (for example, your computer speakers).

```console
spx synthesize --text "Testing synthesis using the Speech CLI" --speakers
```

You can also save the synthesized output to a file. In this example, let's create a file named *my-sample.wav* in the directory where you're running the command.

```console
spx synthesize --text "Enjoy using the Speech CLI." --audio output my-sample.wav
```

These examples presume that you're testing in English. However, Speech service supports speech synthesis in many languages. You can pull down a full list of voices either by running the following command or by visiting the [language support page](./language-support.md?tabs=tts).

```console
spx synthesize --voices
```

Here's a command for using one of the voices you've discovered.

```console
spx synthesize --text "Bienvenue chez moi." --voice fr-FR-AlainNeural --speakers
```

> [!TIP]
> If you get stuck or want to learn more about the Speech CLI recognition options, you can run ```spx help synthesize```.

## Speech to text translation

With the Speech CLI, you can also do speech to text translation. Run the following command to capture audio from your default microphone and output the translation as text. Keep in mind that you need to supply the `source` and `target` language with the `translate` command.

```console
spx translate --microphone --source en-US --target ru-RU
```

When you're translating into multiple languages, separate the language codes with a semicolon (`;`).

```console
spx translate --microphone --source en-US --target ru-RU;fr-FR;es-ES
```

If you want to save the output of your translation, use the `--output` flag. In this example, you'll also read from a file.

```console
spx translate --file /some/file/path/input.wav --source en-US --target ru-RU --output file /some/file/path/russian_translation.txt
```

> [!TIP]
> If you get stuck or want to learn more about the Speech CLI recognition options, you can run ```spx help translate```.


## Next steps

* [Install GStreamer to use the Speech CLI with MP3 and other formats](./how-to-use-codec-compressed-audio-input-streams.md)
* [Configuration options for the Speech CLI](./spx-data-store-configuration.md)
* [Batch operations with the Speech CLI](./spx-batch-operations.md)
