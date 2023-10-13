---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 03/13/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/csharp.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment
The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK later in this guide, but first check the [SDK installation guide](../../../quickstarts/setup-platform.md?pivots=programming-language-csharp) for any more requirements. 

You must also install [GStreamer](~/articles/ai-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

### Set environment variables

[!INCLUDE [Environment variables](../../common/environment-variables.md)]

## Create captions from speech

Follow these steps to build and run the captioning quickstart code example.

1. Copy the  <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/scenarios/csharp/dotnetcore/captioning/"  title="Copy the samples"  target="_blank">scenarios/csharp/dotnetcore/captioning/</a> sample files from GitHub. If you have [Git installed](https://git-scm.com/downloads), open a command prompt and run the `git clone` command to download the Speech SDK samples repository.
    ```dotnetcli
    git clone https://github.com/Azure-Samples/cognitive-services-speech-sdk.git
    ```
1. Open a command prompt and change to the project directory.
    ```dotnetcli
    cd <your-local-path>/scenarios/csharp/dotnetcore/captioning/captioning/
    ```
1. Build the project with the .NET CLI.
    ```dotnetcli
    dotnet build
    ```
1. Run the application with your preferred command line arguments. See [usage and arguments](#usage-and-arguments) for the available options. Here is an example:
    ```dotnetcli
    dotnet run --input caption.this.mp4 --format any --output caption.output.txt --srt --realTime --threshold 5 --delay 0 --profanity mask --phrases "Contoso;Jessie;Rehaan"
    ```
    > [!IMPORTANT]
    > Make sure that the paths specified by `--input` and `--output` are valid. Otherwise you must change the paths.
    > 
    > Make sure that you set the `SPEECH_KEY` and `SPEECH_REGION` environment variables as described [above](#set-environment-variables). Otherwise use the `--key` and `--region` arguments.

## Check results

[!INCLUDE [Example output](example-output-v2.md)]

## Usage and arguments

Usage: `captioning --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments-v2.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]





