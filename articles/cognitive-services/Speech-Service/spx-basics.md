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

In this article, you learn the basic usage patterns of SPX. SPX is a command-line interface leveraging the back-end of the Speech service. You can quickly test out the main features of the Speech service, without creating development environments or writing any code, to see if your use-cases can be adequately met. Additionally, SPX is production ready and can be used to automate simple workflows in the Speech service.

## Prerequisites

The only prerequisite is an Azure Speech subscription. See the [guide](get-started.md#new-resource) on creating a new subscription if you don't already have one.

## Download and install


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

After entering the command, SPX will begin listening for audio on the current active input device, and stop after you press `ENTER`. The recorded speech is then recognized and converted to text in the output. Text-to-speech synthesis is also easy to do using SPX. Running the following command will take the entered text as input, and output the synthesized speech to the current active output device.

```shell
spx synthesize --text "Testing synthesis using SPX" --speakers
```

To change the output to a file, switch the output from `--speakers` to `--audio output`, and enter a file path.

```shell
spx synthesize --text "Synthesis to a file." --audio output some/file/path/spx.wav
```

## Batch operations

The commands in the previous section are great for quickly seeing how the Speech service works. However, when assessing whether or not your use-cases can be met, you likely need to perform batch operations against a range of input you already have, to see how the service handles a variety of scenarios. This section shows how to:

* Run batch speech recognition on a directory of audio files
* Iterate through a `.tsv` file and run batch text-to-speech

### Batch speech recognition


### Batch text-to-speech

The easiest way to run batch text-to-speech is to create a new `.tsv` file, and leverage the `--foreach` command in SPX. Consider the following file `text_synthesis.tsv`:

    audio.output    text
    C:\batch_wav_output\wav_1.wav    Sample text to synthesize.
    C:\batch_wav_output\wav_2.wav    Using SPX to run batch-synthesis.
    C:\batch_wav_output\wav_3.wav    Some more text to test capabilities.

 Next, you run a command to point to `text_synthesis.tsv`, perform synthesis on each `text` field, and write the result to the corresponding `audio.output` path as a `.wav` file. 

```shell
spx synthesize --foreach in @C:\your\path\to\text_synthesis.tsv
```

This command is the equivalent of running `spx synthesize --text Sample text to synthesize --audio output C:\batch_wav_output\wav_1.wav` **for each** record in the `.tsv` file. A couple things to note:

* The column headers, `audio.output` and `text`, correspond to the command line arguments `--audio output` and `--text`, respectively. Multi-part command line arguments like `--some arg` should be formatted in the file with no spaces, no leading dashes, and periods separating strings, e.g. `some.arg`. Any other existing command line arguments can be added to the file as additional columns using this pattern.
* When the file is formatted in this way, no additional arguments are required to be passed to `--foreach`.

However, if you have a `.tsv` file like the following example, with column headers that **do not match** command line arguments:

    wav_path    str_text
    C:\batch_wav_output\wav_1.wav    Sample text to synthesize.
    C:\batch_wav_output\wav_2.wav    Using SPX to run batch-synthesis.
    C:\batch_wav_output\wav_3.wav    Some more text to test capabilities.

You can override these field names to the correct arguments using the following syntax in the `--foreach` call. This is the same call as above.

```shell
spx synthesize --foreach audio.output;text in @C:\your\path\to\text_synthesis.tsv
```





