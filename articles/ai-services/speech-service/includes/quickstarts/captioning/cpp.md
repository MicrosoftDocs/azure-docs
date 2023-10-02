---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/13/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/cpp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide, but first check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp) for any more requirements

You must also install [GStreamer](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Create captions from speech

Follow these steps to build and run the captioning quickstart code example with Visual Studio Community 2022 on Windows. 

1. Download or copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/cpp/windows/captioning"  title="Copy the samples"  target="_blank">scenarios/cpp/windows/captioning/</a> sample files from GitHub into a local directory. 
1. Open the `captioning.sln` solution file in Visual Studio Community 2022.  
1. Install the Speech SDK in your project with the NuGet package manager.
    ```powershell
    Install-Package Microsoft.CognitiveServices.Speech
    ```
1. Open **Project** > **Properties** > **General**. Set **Configuration** to `All configurations`. Set **C++ Language Standard** to `ISO C++17 Standard (/std:c++17)`.
1. Open **Build** > **Configuration Manager**.
    - On a 64-bit Windows installation, set **Active solution platform** to `x64`.
    - On a 32-bit Windows installation, set **Active solution platform** to `x86`.
1. Open **Project** > **Properties** > **Debugging**. Enter your preferred command line arguments at **Command Arguments**. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```
    --input caption.this.mp4 --format any --output caption.output.txt --srt --realTime --threshold 5 --delay 0 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    > [!IMPORTANT]
    > Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.
    > 
    > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described [above](#set-environment-variables). Otherwise use the `--key` and `--region` arguments.

1. [Build and run](/cpp/build/vscpp-step-2-build) the console application. 

## Check results

[!INCLUDE [Example output](example-output-v2.md)]

## Usage and arguments

Usage: `captioning --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments-v2.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

