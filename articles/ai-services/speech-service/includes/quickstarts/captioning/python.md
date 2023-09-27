---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/15/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/python.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK for Python is available as a [Python Package Index (PyPI) module](https://pypi.org/project/azure-cognitiveservices-speech/). The Speech SDK for Python is compatible with Windows, Linux, and macOS. 
- You must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, and 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.
- On Linux, you must use the x64 target architecture.

1. Install a version of [Python from 3.10 or later](https://www.python.org/downloads/). First check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-python) for any more requirements 
1. You must also install [GStreamer](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Create captions from speech

Follow these steps to build and run the captioning quickstart code example.

1. Download or copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/python/console/captioning/"  title="Copy the samples"  target="_blank">scenarios/python/console/captioning/</a> sample files from GitHub into a local directory. 
1. Open a command prompt in the same directory as `captioning.py`.
1. Run this command to install the Speech SDK:  
    ```console
    pip install azure-cognitiveservices-speech
    ```
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```console
    python captioning.py --input caption.this.mp4 --format any --output caption.output.txt --srt --realTime --threshold 5 --delay 0 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    > [!IMPORTANT]
    > Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.
    > 
    > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described [above](#set-environment-variables). Otherwise use the `--key` and `--region` arguments.

## Check results

[!INCLUDE [Example output](example-output-v2.md)]

## Usage and arguments

Usage: `python captioning.py --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments-v2.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

