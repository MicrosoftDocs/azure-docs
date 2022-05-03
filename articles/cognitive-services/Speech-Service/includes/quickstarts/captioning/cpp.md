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

You must also install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.

## Create captions from speech

Follow these steps to create a new console application and install the Speech SDK.

1. Create a new C++ console project in Visual Studio.
1. Install the Speech SDK in your new project with the NuGet package manager.
    ```powershell
    Install-Package Microsoft.CognitiveServices.Speech
    ```
1. Replace the contents of `captioning.cpp` with the code that you copy from the [captioning sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/captioning_sample/scenarios/cpp/windows/captioning/captioning.cpp) at GitHub.

// 64-bit
// - In Windows, place the following files from the Speech SDK in the same folder as your compiled .exe:
// - Microsoft.CognitiveServices.Speech.core.dll
// - Microsoft.CognitiveServices.Speech.extension.audio.sys.dll

`cl.exe /Zi /EHsc /std:c++17 /nologo /I <speech sdk>\build\native\include\cxx_api /I <speech sdk>\build\native\include\c_api <code folder>\helper.cpp <code folder>\captioning.cpp <speech sdk>\build\native\x64\Release\Microsoft.CognitiveServices.Speech.core.lib`

1. Install [GStreamer](~/articles/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams.md) for compressed input audio.
1. Make sure that you have an input file named `caption.this.mp4` in the path.
1. Run the following command to output captions from the video file:
    ```console
    captioning.exe --input caption.this.mp4 --format any --output caption.output.txt - --srt --recognizing --threshold 5 --profanity mask --phrases Contoso;Jesse;Rehaan
    ```

Usage: `captioning --input <input file> --key <key> --region <region>`

[!INCLUDE [Usage arguments](usage-arguments.md)]

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
