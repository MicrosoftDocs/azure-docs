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

Install a version of [Python from 3.7 to 3.10](https://www.python.org/downloads/). 

## Run post-call transcription analysis

Follow these steps to build and run the post-call transcription analysis quickstart code example.

1. Download or copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/python/console/call-center/"  title="Copy the samples"  target="_blank">scenarios/python/console/call-center/</a> sample files from GitHub into a local directory. 
1. Open a command prompt in the same directory as `call-center.py`.
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here's an example:
    ```console
    python call-center.py --input "https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/main/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav" --speechKey YourResourceKey --speechRegion YourResourceRegion --languageKey YourResourceKey --languageEndpoint YourResourceEndpoint --stereo --output call.output.txt > call.json.txt
    ```
    Replace `YourResourceKey` with your Cognitive Services resource key, replace `YourResourceRegion` with your Cognitive Services resource [region](~/articles/cognitive-services/speech-service/regions.md) (such as `eastus`), and replace `YourResourceEndpoint` with your Cognitive Services endpoint. Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../../cognitive-services-security.md) article for more information.

    The default console output is a combination of the JSON responses from the [batch transcription](../../../batch-transcription.md) (Speech), [sentiment](../../../../language-service/sentiment-opinion-mining/overview.md) (Language), and [conversation summarization](../../../../language-service/summarization/overview.md?tabs=conversation-summarization) (Language) APIs. If you specify `--output FILE`, a better formatted version of the results is written to the file.

## Usage and arguments

Usage: `python call-center.py -- [...]`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](delete-resource.md)]