---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 09/18/2022
ms.author: eur
---

[!INCLUDE [Header](header.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](azure-prerequisites.md)]

## Set up the environment

This quickstart requires *nlohmann::json*, *libcurl*, and a PEM certificate.

1. Download the latest version of the [nlohmann::json](https://github.com/nlohmann/json/releases) library.
1. Install libcurl. On Windows, you install it from [https://curl.se/download.html]. 
1. Get a `cacert.pem` file from [https://curl.se/ca/cacert.pem](https://curl.se/ca/cacert.pem).
1. Copy YourPathTo\curl\bin\libcurl-x64.def and YourPathTo\curl\bin\libcurl-x64.dll to your project folder.
1. Run the `lib /def:libcurl-x64.def` command to generate the `.lib` file.

## Run post-call transcription analysis

Follow these steps to build and run the post-call transcription analysis quickstart code example with Visual Studio Community 2022 on Windows. 

1. Download or copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/cpp/windows/call-center"  title="Copy the samples"  target="_blank">scenarios/cpp/windows/call-center/</a> sample files from GitHub into a local directory. 
1. Open the `call-center.sln` solution file in Visual Studio.  
1. Open **Project** > **Properties** > **General**. Set **Configuration** to `All configurations`. Set **C++ Language Standard** to `ISO C++17 Standard (/std:c++17)`.
1. Open **Build** > **Configuration Manager**.
    - On a 64-bit Windows installation, set **Active solution platform** to `x64`.
    - On a 32-bit Windows installation, set **Active solution platform** to `x86`.
1. Open **Project** > **Properties** > **Debugging**. Enter your preferred command line arguments at **Command Arguments**. See [usage and arguments](#usage-and-arguments) for the available options. Here's an example:
    ```
    --certificate "YourPathTo\\cacert.pem" --input "https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/main/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav" --speechKey YourResourceKey --speechRegion YourResourceRegion --languageKey YourResourceKey --languageEndpoint YourResourceEndpoint --stereo --output call.output.txt > call.json.txt
    ```
    Replace `YourResourceKey` with your Cognitive Services resource key, replace `YourResourceRegion` with your Cognitive Services resource [region](~/articles/cognitive-services/speech-service/regions.md) (such as `eastus`), and replace `YourResourceEndpoint` with your Cognitive Services endpoint. Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../../cognitive-services-security.md) article for more information.

1. [Build and run](/cpp/build/vscpp-step-2-build) the console application. The default console output is a combination of the JSON responses from the [batch transcription](../../../batch-transcription.md) (Speech), [sentiment](../../../../language-service/sentiment-opinion-mining/overview.md) (Language), and [conversation summarization](../../../../language-service/summarization/overview.md?tabs=conversation-summarization) (Language) APIs. If you specify `--output FILE`, a better formatted version of the results is written to the file. 

## Usage and arguments

Usage: `call-center -- [...]`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](delete-resource.md)]