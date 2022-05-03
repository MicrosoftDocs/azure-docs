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

Install the [Speech SDK for Go](../../../quickstarts/setup-platform.md?pivots=programming-language-go&tabs=dotnet%252cwindows%252cjre%252cbrowser). Check the [platform-specific installation instructions](../../../quickstarts/setup-platform.md?pivots=programming-language-go) for any more requirements.

You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=GO&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Create captions from speech

Follow these steps to create a new GO module.

1. Open a command prompt where you want the new module, and create a new file named `captioning.go`.
1. Replace the contents of `captioning.go` with the code that you copy from the [captioning sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/captioning_sample/scenarios/csharp/dotnet/captioning/Program.cs) at GitHub.

Run the following commands to create a `go.mod` file that links to components hosted on GitHub:

```cmd
go mod init captioning
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```


1. Make sure that you have an input file named `caption.this.mp4` in the path.
1. Now build and run the code to output captions from the video file:
    ```console
    go build
    go run captioning.go helper.go --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases Contoso;Jesse;Rehaan
    ```


> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=GO&Pillar=Speech&Product=Captioning&Page=quickstart&Section=Create-captions-from-speech" target="_target">I ran into an issue</a>

## Usage and arguments

Usage: `go run captioning.go helper.go --key <key> --region <region> --input <input file>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]





