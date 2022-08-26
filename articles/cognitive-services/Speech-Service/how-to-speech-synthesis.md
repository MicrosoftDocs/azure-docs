---
title: "How to synthesize speech from text - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to convert text to speech. Learn about object construction and design patterns, supported audio output formats, and custom configuration options for speech synthesis.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 03/14/2022
ms.author: eur
ms.devlang: cpp, csharp, golang, java, javascript, objective-c, python
ms.custom: devx-track-python, devx-track-js, devx-track-csharp, cog-serv-seo-aug-2020, mode-other
zone_pivot_groups: programming-languages-speech-services
keywords: text to speech
---

# How to synthesize speech from text

::: zone pivot="programming-language-csharp"
[!INCLUDE [C# include](includes/how-to/speech-synthesis/csharp.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [C++ include](includes/how-to/speech-synthesis/cpp.md)]
::: zone-end

::: zone pivot="programming-language-go"
[!INCLUDE [Go include](includes/how-to/speech-synthesis/go.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java include](includes/how-to/speech-synthesis/java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript include](includes/how-to/speech-synthesis/javascript.md)]
::: zone-end

::: zone pivot="programming-language-objectivec"
[!INCLUDE [ObjectiveC include](includes/how-to/speech-synthesis/objectivec.md)]
::: zone-end

::: zone pivot="programming-language-swift"
[!INCLUDE [Swift include](includes/how-to/speech-synthesis/swift.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python include](./includes/how-to/speech-synthesis/python.md)]
::: zone-end

::: zone pivot="programming-language-rest"
[!INCLUDE [REST include](includes/how-to/speech-synthesis/rest.md)]
::: zone-end

::: zone pivot="programming-language-cli"
[!INCLUDE [CLI include](includes/how-to/speech-synthesis/cli.md)]
::: zone-end

## Get facial pose events

Speech can be a good way to drive the animation of facial expressions.
[Visemes](how-to-speech-synthesis-viseme.md) are often used to represent the key poses in observed speech. Key poses include the position of the lips, jaw, and tongue in producing a particular phoneme.

You can subscribe to viseme events in the Speech SDK. Then, you can apply viseme events to animate the face of a character as speech audio plays.
Learn [how to get viseme events](how-to-speech-synthesis-viseme.md#get-viseme-events-with-the-speech-sdk).

## Get position information

Your project might need to know when a word is spoken by text-to-speech so that it can take specific action based on that timing. For example, if you want to highlight words as they're spoken, you need to know what to highlight, when to highlight it, and for how long to highlight it.

You can accomplish this by using the `WordBoundary` event within `SpeechSynthesizer`. This event is raised at the beginning of each new spoken word. It provides a time offset within the spoken stream and a text offset within the input prompt:

* `AudioOffset` reports the output audio's elapsed time between the beginning of synthesis and the start of the next word. This is measured in hundred-nanosecond units (HNS), with 10,000 HNS equivalent to 1 millisecond.
* `WordOffset` reports the character position in the input string (original text or [SSML](speech-synthesis-markup.md)) immediately before the word that's about to be spoken.

> [!NOTE]
> `WordBoundary` events are raised as the output audio data becomes available, which will be faster than playback to an output device. The caller must appropriately synchronize streaming and real time.

You can find examples of using `WordBoundary` in the [text-to-speech samples](https://aka.ms/csspeech/samples) on GitHub.

## Next steps

* [Get started with Custom Neural Voice](how-to-custom-voice.md)
* [Improve synthesis with SSML](speech-synthesis-markup.md)
* [Synthesize from long-form text](long-audio-api.md) like books and news articles
