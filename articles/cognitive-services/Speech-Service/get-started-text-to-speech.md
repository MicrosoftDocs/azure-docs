---
title: "Text-to-speech quickstart - Speech service"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you convert text to speech. Learn about object construction and design patterns, supported audio output formats, and custom configuration options for speech synthesis.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 01/08/2022
ms.author: eur
ms.devlang: cpp, csharp, golang, java, javascript, objective-c, python
ms.custom: devx-track-python, devx-track-js, devx-track-csharp, cog-serv-seo-aug-2020, mode-other
zone_pivot_groups: programming-languages-speech-services
keywords: text to speech
---

# Quickstart: Convert text to speech

::: zone pivot="programming-language-csharp"
[!INCLUDE [C# include](includes/quickstarts/text-to-speech-basics/csharp.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [C++ include](includes/quickstarts/text-to-speech-basics/cpp.md)]
::: zone-end

::: zone pivot="programming-language-go"
[!INCLUDE [Go include](includes/quickstarts/text-to-speech-basics/go.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java include](includes/quickstarts/text-to-speech-basics/java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript include](includes/quickstarts/text-to-speech-basics/javascript.md)]
::: zone-end

::: zone pivot="programming-language-objectivec"
[!INCLUDE [ObjectiveC include](includes/quickstarts/text-to-speech-basics/objectivec.md)]
::: zone-end

::: zone pivot="programming-language-swift"
[!INCLUDE [Swift include](includes/quickstarts/text-to-speech-basics/swift.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python include](./includes/quickstarts/text-to-speech-basics/python.md)]
::: zone-end

::: zone pivot="programming-language-rest"
[!INCLUDE [REST include](includes/quickstarts/text-to-speech-basics/rest.md)]
::: zone-end

::: zone pivot="programming-language-cli"
[!INCLUDE [CLI include](includes/quickstarts/text-to-speech-basics/cli.md)]
::: zone-end

## Get position information

Your project might need to know when a word is spoken by text-to-speech so that it can take specific action based on that timing. For example, if you want to highlight words as they're spoken, you need to know what to highlight, when to highlight it, and for how long to highlight it.

You can accomplish this by using the `WordBoundary` event within `SpeechSynthesizer`. This event is raised at the beginning of each new spoken word. It provides a time offset within the spoken stream and a text offset within the input prompt:

* `AudioOffset` reports the output audio's elapsed time between the beginning of synthesis and the start of the next word. This is measured in hundred-nanosecond units (HNS), with 10,000 HNS equivalent to 1 millisecond.
* `WordOffset` reports the character position in the input string (original text or [SSML](speech-synthesis-markup.md)) immediately before the word that's about to be spoken.

> [!NOTE]
> `WordBoundary` events are raised as the output audio data becomes available, which will be faster than playback to an output device. The caller must appropriately synchronize stream timing to "real time."

You can find examples of using `WordBoundary` in the [text-to-speech samples](https://aka.ms/csspeech/samples) on GitHub.

## Next steps

* [Get started with Custom Neural Voice](how-to-custom-voice.md)
* [Improve synthesis with SSML](speech-synthesis-markup.md)
* Learn how to use the [Long Audio API](long-audio-api.md) for large text samples like books and news articles
