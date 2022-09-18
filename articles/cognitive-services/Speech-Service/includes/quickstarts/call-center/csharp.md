---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 08/02/2022
ms.author: eur
---

[!INCLUDE [Header](header.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](azure-prerequisites.md)]

## Run post-call transcription analysis

Follow these steps to run post-call transcription analysis:

1. Copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/csharp/dotnetcore/call-center/"  title="Copy the samples"  target="_blank">scenarios/csharp/dotnetcore/call-center/</a> sample files from GitHub. If you have [Git installed](https://git-scm.com/downloads), you can download the entire repository. Open a command prompt and run the `git clone` clone command with the Speech SDK samples repository URL.
    ```dotnetcli
    git clone https://github.com/Azure-Samples/cognitive-services-speech-sdk.git
    ```
1. Open a command prompt and change to the project directory.
    ```dotnetcli
    cd <your-local-path>/scenarios/csharp/dotnetcore/call-center/call-center/
    ```
1. Build the project with the .NET CLI.
    ```dotnetcli
    dotnet build
    ```
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```dotnetcli
    dotnet run --languageKey YourResourceKey --languageEndpoint YourResourceEndpoint --speechKey YourResourceKey --speechRegion YourResourceRegion --input "https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/scenarios/call-center/sampledata/Call3_separated_16k_pharmacy_call.wav" --stereo  --output summary.txt
    ```
    Replace `YourResourceKey` with your Cognitive Services resource key, replace `YourResourceRegion` with your Cognitive Services resource [region](~/articles/cognitive-services/speech-service/regions.md) (such as `eastus`), and replace `YourResourceEndpoint` with your Cognitive Services endpoint. Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../../cognitive-services-security.md) article for more information.

    The default console output is a combination of the JSON responses from the [batch transcription](/azure/cognitive-services/speech-service/batch-transcription) (Speech), [sentiment](/azure/cognitive-services/language-service/sentiment-opinion-mining/overview) (Language), and [conversation summarization](/azure/cognitive-services/language-service/summarization/overview?tabs=conversation-summarization) (Language) APIs. If you specify `--output FILE`, a better formatted version of the results is written to the file. 

## Usage and arguments

Usage: `call-center -- [...]`

[!INCLUDE [Usage arguments](usage-arguments.md)]


## Clean up resources

[!INCLUDE [Delete resource](delete-resource.md)]





