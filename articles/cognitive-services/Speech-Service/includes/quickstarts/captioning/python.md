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
- You must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, or 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.
- On Linux, you must use the x64 target architecture.

1. Install a version of [Python from 3.7 to 3.10](https://www.python.org/downloads/). First check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-python) for any more requirements 
1. You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

## Create captions from speech

Follow these steps to create a new console application.

1. Download or copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/python/console/captioning/"  title="Copy the samples"  target="_blank">scenarios/python/console/captioning/</a> sample files from GitHub into a local directory. 
1. Open a command prompt in the same directory as `captioning.py`.
1. Run this command to install the Speech SDK:  
    ```console
    pip install azure-cognitiveservices-speech
    ```
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```console
    python captioning.py --key YourSubscriptionKey --region YourServiceRegion --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource [region](~/articles/cognitive-services/speech-service/regions.md), such as `westus` or `northeurope`. Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../../cognitive-services-security.md) article for more information.

    The output file with complete captions is written to `caption.output.txt`. Intermediate results are shown in the console:
    ```console
    00:00:00,180 --> 00:00:01,600
    Welcome to
    
    00:00:00,180 --> 00:00:01,820
    Welcome to applied
    
    00:00:00,180 --> 00:00:02,420
    Welcome to applied mathematics
    
    00:00:00,180 --> 00:00:02,930
    Welcome to applied mathematics course
    
    00:00:00,180 --> 00:00:03,100
    Welcome to applied Mathematics course 2
    
    00:00:00,180 --> 00:00:03,230
    Welcome to applied Mathematics course 201.
    ```

## Usage and arguments

Usage: `python captioning.py --key <key> --region <region> --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

