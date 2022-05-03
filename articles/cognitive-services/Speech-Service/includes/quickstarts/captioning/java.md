---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/java.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Before you can do anything, you need to install the Speech SDK. The sample in this quickstart works with the [Java Runtime](~/articles/cognitive-services/speech-service/quickstarts/setup-platform.md?pivots=programming-language-java&tabs=jre).

You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

## Create captions from speech

Follow these steps to create a new console application for speech recognition.

1. Open a command prompt where you want the new project, and create a new file named `Captioning.java`.
1. Replace the contents of `Captioning.java` with the code that you copy from the [captioning sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/captioning_sample/scenarios/csharp/dotnet/captioning/Program.cs) at GitHub.


// This assumes you have Speech SDK .jar files installed. 
// NOTE This is for Windows. In Linux, use : as delimiter instead of ;
javac Captioning.java -cp .;target\dependency\*

1. Make sure that you have an input file named `caption.this.mp4` in the path.
1. Run the following command to output captions from the video file:
    ```console
    java -cp .;target\dependency\* Captioning --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases Contoso;Jesse;Rehaan
    ```

Usage: `java -cp .;target\dependency\* Captioning --input <input file> --key <key> --region <region>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
