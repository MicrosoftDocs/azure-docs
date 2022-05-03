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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up the environment

The Speech SDK for Python is compatible with Windows, Linux, and macOS. 
- On Windows, you must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, or 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.
- On Linux, you must use the x64 target architecture.

1. Install a version of [Python from 3.7 to 3.10](https://www.python.org/downloads/). First check the [platform-specific installation instructions](../../../quickstarts/setup-platform.md?pivots=programming-language-python) for any more requirements. 
1. Install the Speech SDK. The Speech SDK for Python is available as a [Python Package Index (PyPI) module](https://pypi.org/project/azure-cognitiveservices-speech/). 

    ```console
    pip install azure-cognitiveservices-speech
    ```
1. You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Create captions from speech

Follow these steps to create a new console application.

1. Clone the [Cognitive Services Speech SDK]() samples repository from GitHub.
1. Open a command prompt in the directory of `captioning.py`.
1. Make sure that you have an input file named `caption.this.mp4` in the path.
1. Run the following command to output captions from the video file:
    ```console
    python captioning.py --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases Contoso;Jesse;Rehaan
    ```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Create-captions-from-speech" target="_target">I ran into an issue</a>

## Usage and arguments

Usage: `python captioning.py --input <input file> --key <key> --region <region>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

