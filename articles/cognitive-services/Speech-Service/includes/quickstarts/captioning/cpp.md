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

The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK in the next section of this article, but first check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp) for any more requirements

You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

## Create captions from speech

Follow these steps to create a new console application and install the Speech SDK.

1. Download or copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/cpp/windows/captioning"  title="Copy the samples"  target="_blank">scenarios/cpp/windows/captioning/</a> sample files from GitHub into a local directory. 
1. Open the `captioning.sln` solution file in Visual Studio.  
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
    --key YourSubscriptionKey --region YourServiceRegion --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource [region](~/articles/cognitive-services/speech-service/regions.md), such as `westus` or `northeurope`. Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../../cognitive-services-security.md) article for more information.

1. [Build and run](/cpp/build/vscpp-step-2-build) the console application. The output file with complete captions is written to `caption.output.txt`. Intermediate results are shown in the console:
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

Usage: `captioning --key <key> --region <region> --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]

