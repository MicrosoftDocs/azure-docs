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

## Set up the environment

TBD

## Run post-call transcription analysis

Follow these steps to run post-call transcription analysis:

1. Open a command prompt where you want the new project, and create a console application with the .NET CLI.
    ```dotnetcli
    dotnet new console
    ```
1. Copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/csharp/dotnetcore/call-center/"  title="Copy the samples"  target="_blank">scenarios/csharp/dotnetcore/call-center/</a> sample files from GitHub into your project directory. Overwrite the local copy of `Program.cs` with the file that you copy from GitHub.
1. Build the project with the .NET CLI.
    ```dotnetcli
    dotnet build
    ```
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```dotnetcli
    dotnet run --certificate "YourPathTo\\cacert.pem" --input "https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/main/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav" --speechKey YourResourceKey --speechRegion YourResourceRegion --languageKey YourResourceKey --languageEndpoint YourResourceEndpoint --stereo --output call.output.txt > call.json.txt
    ```
    Replace `YourResourceKey` with your Cognitive Services resource key, replace `YourResourceRegion` with your Cognitive Services resource [region](~/articles/cognitive-services/speech-service/regions.md) (such as `eastus`), and replace `YourResourceEndpoint` with your Cognitive Services endpoint. Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../../cognitive-services-security.md) article for more information.

    The default console output is a combination of the JSON responses from the batch transcription (Speech), sentiment (Language), and conversation summarization (Language) APIs. If you specify --output FILE, a better formatted version of the results are written to the file. 

## Usage and arguments

Usage: `call-center -- [...]`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Remarks

[!INCLUDE [Remarks](remarks.md)]

## Clean up resources

[!INCLUDE [Delete resource](delete-resource.md)]





