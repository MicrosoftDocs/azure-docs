---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/go.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Check whether there are any [platform-specific installation steps](../../../quickstarts/setup-platform.md?pivots=programming-language-go).

You must also install [GStreamer](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

## Create captions from speech

Follow these steps to build and run the captioning quickstart code example.

1. Download or copy the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/go/captioning/"  title="Copy the samples"  target="_blank">scenarios/go/captioning/</a> sample files from GitHub into a local directory. 
1. Open a command prompt in the same directory as `captioning.go`.
1. Run the following commands to create a `go.mod` file that links to the Speech SDK components hosted on GitHub:
    ```console
    go mod init captioning
    go get github.com/Microsoft/cognitive-services-speech-sdk-go
    ```
1. Build the GO module.
    ```console
    go build
    ```
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```console
    go run captioning --key YourSubscriptionKey --region YourServiceRegion --input caption.this.mp4 --format any --output caption.output.txt --srt --recognizing --threshold 5 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource [region](~/articles/ai-services/speech-service/regions.md), such as `westus` or `northeurope`. Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../use-key-vault.md). See the Azure AI services [security](../../../../security-features.md) article for more information.


## Check results

[!INCLUDE [Example output](example-output.md)]

## Usage and arguments

Usage: `go run captioning.go helper.go --key <key> --region <region> --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
