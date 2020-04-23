---
title: "SPX basics - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to use the SPX command line tool to work with the Speech SDK with no code and minimal setup. 
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 04/04/2020
ms.author: trbye
---

# Learn the basics of SPX

In this article, you learn the basic usage patterns of SPX, a command line tool to use the Speech service without writing code. You can quickly test out the main features of the Speech service, without creating development environments or writing any code, to see if your use-cases can be adequately met. Additionally, SPX is production ready and can be used to automate simple workflows in the Speech service, using `.bat` or shell scripts.

## Prerequisites

The only prerequisite is an Azure Speech subscription. See the [guide](get-started.md#new-resource) on creating a new subscription if you don't already have one.

## Download and install

SPX is available on Windows and Linux. Start by downloading the [zip archive](https://crbn.us/spx.zip), then extract it. SPX requires either the .NET Core or .NET Framework runtime, and the following versions are supported by platform:

* Windows: [.NET Framework 4.7](https://dotnet.microsoft.com/download/dotnet-framework/net471), [.NET Core 2.2](https://dotnet.microsoft.com/download/dotnet-core/2.2)
* Linux: [.NET Core 2.2](https://dotnet.microsoft.com/download/dotnet-core/2.2)

After you've installed a runtime, go to the root directory `spx-zips` that you extracted from the download, and extract the subdirectory that you need (`spx-net471`, for example). In a command prompt, change directory to this location, and then run `spx` to start the application.

## Create subscription config

To start using SPX, you first need to enter your Speech subscription key and region information. See the [region support](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#speech-sdk) page to find your region identifier. Once you have your subscription key and region identifier (ex. `eastus`, `westus`), run the following commands.

```shell
spx config @key --set YOUR-SUBSCRIPTION-KEY
spx config @region --set YOUR-REGION-ID
```

Your subscription authentication is now stored for future SPX requests. If you need to remove either of these stored values, run `spx config @region --clear` or `spx config @key --clear`.

## Basic usage

This section shows a few basic SPX commands that are often useful for first-time testing and experimentation. Start by performing some speech recognition using your default microphone by running the following command.

```shell
spx recognize --microphone
```

After entering the command, SPX will begin listening for audio on the current active input device, and stop after you press `ENTER`. The recorded speech is then recognized and converted to text in the console output. Text-to-speech synthesis is also easy to do using SPX. 

Running the following command will take the entered text as input, and output the synthesized speech to the current active output device.

```shell
spx synthesize --text "Testing synthesis using SPX" --speakers
```

In addition to speech recognition and synthesis, you can also do speech translation with SPX. Similar to the speech recognition command above, run the following command to capture audio from your default microphone, and perform translation to text in the target language.

```shell
spx translate --microphone --source en-US --target ru-RU --output file C:\some\file\path\russian_translation.txt
```

In this command, you specify both the source (language to translate **from**), and the target (language to translate **to**) languages. Using the `--microphone` argument will listen to audio on the current active input device, and stop after you press `ENTER`. The output is a text translation to the target language, written to a text file.

> [!NOTE]
> See the [language and locale article](language-support.md) for a list of all supported languages with their corresponding locale codes.

## Batch operations

The commands in the previous section are great for quickly seeing how the Speech service works. However, when assessing whether or not your use-cases can be met, you likely need to perform batch operations against a range of input you already have, to see how the service handles a variety of scenarios. This section shows how to:

* Run batch speech recognition on a directory of audio files
* Iterate through a `.tsv` file and run batch text-to-speech synthesis

## Batch speech recognition

If you have a directory of audio files, it's easy with SPX to quickly run batch-speech recognition. Simply run the following command, pointing to your directory with the `--files` command. In this example, you append `\*.wav` to the directory to recognize all `.wav` files present in the dir. Additionally, specify the `--threads` argument to run the recognition on 10 parallel threads.

> [!NOTE]
> The `--threads` argument can be also used in the next section for `spx synthesize` commands, and the available threads will depend on the CPU and it's current load percentage.

```shell
spx recognize --files C:\your_wav_file_dir\*.wav --output file C:\output_dir\speech_output.tsv --threads 10
```

The recognized speech output is written to `speech_output.tsv` using the `--output file` argument. The following is an example of the output file structure.

    audio.input.id    recognizer.session.started.sessionid    recognizer.recognized.result.text
    sample_1    07baa2f8d9fd4fbcb9faea451ce05475    A sample wave file.
    sample_2    8f9b378f6d0b42f99522f1173492f013    Sample text synthesized.

## Batch text-to-speech synthesis

The easiest way to run batch text-to-speech is to create a new `.tsv` (tab-separated-value) file, and leverage the `--foreach` command in SPX. Consider the following file `text_synthesis.tsv`:

    audio.output    text
    C:\batch_wav_output\wav_1.wav    Sample text to synthesize.
    C:\batch_wav_output\wav_2.wav    Using SPX to run batch-synthesis.
    C:\batch_wav_output\wav_3.wav    Some more text to test capabilities.

 Next, you run a command to point to `text_synthesis.tsv`, perform synthesis on each `text` field, and write the result to the corresponding `audio.output` path as a `.wav` file. 

```shell
spx synthesize --foreach in @C:\your\path\to\text_synthesis.tsv
```

This command is the equivalent of running `spx synthesize --text Sample text to synthesize --audio output C:\batch_wav_output\wav_1.wav` **for each** record in the `.tsv` file. A couple things to note:

* The column headers, `audio.output` and `text`, correspond to the command line arguments `--audio output` and `--text`, respectively. Multi-part command line arguments like `--audio output` should be formatted in the file with no spaces, no leading dashes, and periods separating strings, e.g. `audio.output`. Any other existing command line arguments can be added to the file as additional columns using this pattern.
* When the file is formatted in this way, no additional arguments are required to be passed to `--foreach`.
* Ensure to separate each value in the `.tsv` with a **tab**.

However, if you have a `.tsv` file like the following example, with column headers that **do not match** command line arguments:

    wav_path    str_text
    C:\batch_wav_output\wav_1.wav    Sample text to synthesize.
    C:\batch_wav_output\wav_2.wav    Using SPX to run batch-synthesis.
    C:\batch_wav_output\wav_3.wav    Some more text to test capabilities.

You can override these field names to the correct arguments using the following syntax in the `--foreach` call. This is the same call as above.

```shell
spx synthesize --foreach audio.output;text in @C:\your\path\to\text_synthesis.tsv
```

## Next steps

* Complete the [speech recognition](./quickstarts/speech-to-text-from-microphone.md) or [speech synthesis](./quickstarts/text-to-speech.md) quickstarts using the SDK.
