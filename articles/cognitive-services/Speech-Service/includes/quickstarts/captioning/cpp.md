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

The Speech SDK is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech) and implements .NET Standard 2.0. You install the Speech SDK in the next section of this article, but first check the [platform-specific installation instructions](../../../quickstarts/setup-platform.md?pivots=programming-language-cpp) for any more requirements.

## Create captions from speech

Follow these steps to create a new console application and install the Speech SDK.

1. Create a new C++ console project in Visual Studio.
1. Install the Speech SDK in your new project with the NuGet package manager.
    ```powershell
    Install-Package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `captioning.cpp` with the code that you copy from the [captioning sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/captioning_sample/scenarios/cpp/windows/captioning/captioning.cpp) at GitHub.

Run the captions console application with the following command. Make sure that you have an input file named `caption.this.mp4` in the path.

```console
captioning.exe --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases Contoso;Jesse;Rehaan
```

Connection options include:

- `--key`: Your Speech resource key. 
- `--region REGION`: Your Speech resource region. Examples: `westus`, `eastus`

Input options include:

- `--input FILE`: Input audio from file. The default input is the microphone. 
- `--url URL`: Input audio from URL. The default input is the microphone.
- `--format FORMAT`: Use compressed audio format. Valid only with `--file` or `--url`. Valid values are `alaw`, `any`, `flac`, `mp3`, `mulaw`, and `ogg_opus`. The default value is `any`. For compressed audio files such as MP4, install GStreamer and see [How to use compressed input audio](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md).

Language options include:

- `--languages LANG1,LANG2`: Enable language identification for specified languages. For example: `en-US,ja-JP`. For more information, see [Language identification](~/articles/cognitive-services/speech-service/language-identification.md).

Recognition options include:

- `--recognizing`: Output `Recognizing` event results. The default output is `Recognized` event results only. These are always written to the console, never to an output file. The `--quiet` option overrides this. For more information, see [Get speech recognition results](~/articles/cognitive-services/speech-service/get-speech-recognition-results.md).

Accuracy options include:

- `--phrases PHRASE1;PHRASE2`: You can specify a list of phrases to be recognized, such as `Contoso;Jesse;Rehaan`. For more information, see [Improve recognition with phrase list](~/articles/cognitive-services/speech-service/improve-accuracy-phrase-list.md).

Output options include:

- `--help`: Show this help and stop
- `--output FILE`: Output captions to the specified `file`. This flag is required.
- `--srt`: Output captions in SRT (SubRip Subtitle) format. The default format is WebVTT (Web Video Text Tracks). For more information about SRT and WebVTT caption file formats, see [Caption output format](~/articles/cognitive-services/speech-service/captioning-concepts.md#caption-output-format).
- `--quiet`: Suppress console output, except errors.
- `--profanity OPTION`: Valid values: raw, remove, mask. For more information, see [Profanity filter](~/articles/cognitive-services/speech-service/captioning-concepts.md#profanity-filter) concepts.
- `--threshold NUMBER`: Set stable partial result threshold. The default value with this code example is `3`. For more information, see [Get partial results](~/articles/cognitive-services/speech-service/captioning-concepts.md#get-partial-results) concepts.

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]