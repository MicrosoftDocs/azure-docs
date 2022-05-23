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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=GO&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Set up the environment

Check whether there are any [platform-specific installation steps](../../../quickstarts/setup-platform.md?pivots=programming-language-go).

You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=GO&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Create captions from speech

Follow these steps to create a new GO module and install the Speech SDK.

1. Download or copy the [scenarios/go/captioning/](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/go/captioning/) sample files from GitHub into a local directory. 
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
    go run captioning --key YourSubscriptionKey --region YourServiceRegion --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region. Make sure that the specified arguments for `--input` file and `--output` path exist. Otherwise you must change the path.

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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=GO&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Create-captions-from-speech" target="_target">I ran into an issue</a>

## Usage and arguments

Usage: `go run captioning.go helper.go --key <key> --region <region> --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]





