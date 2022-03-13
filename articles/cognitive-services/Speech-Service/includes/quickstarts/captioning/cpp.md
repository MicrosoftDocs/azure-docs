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
1. Replace the contents of `caption.cpp` with the following code:
    
    :::code language="cpp" source="~/samples-cognitive-services-speech-sdk/blob/captioning_sample/scenarios/cpp/windows/captioning/caption.cpp" :::

1. To change the speech recognition language, replace `en-US` with another [supported language](~/articles/cognitive-services/speech-service/supported-languages.md). For example, `es-ES` for Spanish (Spain). The default language is `en-us` if you don't specify a language. For details about how to identify one of multiple languages that might be spoken, see [language identification](~/articles/cognitive-services/speech-service/supported-languages.md). 

Build and run your new console application. Replace `YourSubscriptionKey` with your Speech resource key, and replace `YourServiceRegion` with your Speech resource region. 

```console
caption.exe [-f] [-h] [-i file] [-l languages] [-m] [-o file] [-p phrases] [-q] [-r number] [-s] [-t] [-u] YourSubscriptionKey YourServiceRegion
```

Usage options include:
    -f: Enable profanity filter (remove profanity). Overrides -m
    -h: Show this help and stop
    -i: Input audio file *file* (default input is from the microphone.)
    -l languages: Enable language identification for specified *languages*
        Example: en-US,ja-JP
    -m: Enable profanity filter (mask profanity). -f overrides this
    -o file: Output to *file*
    -p phrases: Add specified *phrases*
        Example: Constoso;Jessie;Rehaan
    -q: Suppress console output (except errors)
    -r number: Set stable partial result threshold to *number*
        Example: 3
    -s: Emit SRT (default is WebVTT.)
    -t: Enable TrueText

Speak into your microphone when prompted. The speech should be output as captioned text. 

```console
RECOGNIZING: Text=I'm excited to try speech to text
RECOGNIZED: Text=I'm excited to try speech to text.
```

## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
