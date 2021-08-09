---
title: "Text-to-speech quickstart - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Speech SDK to convert text-to-speech. In this quickstart, you learn about object construction and design patterns, supported audio output formats, the Speech CLI, and custom configuration options for speech synthesis.
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 05/17/2021
ms.author: nitinme
ms.custom: "devx-track-python, devx-track-js, devx-track-csharp, cog-serv-seo-aug-2020"
zone_pivot_groups: programming-languages-set-twenty-four
keywords: text to speech
---

# Get started with text-to-speech

::: zone pivot="programming-language-csharp"
[!INCLUDE [C# Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-csharp.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [C++ Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-cpp.md)]
::: zone-end

::: zone pivot="programming-language-go"
[!INCLUDE [C++ Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-go.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-javascript.md)]
::: zone-end

::: zone pivot="programming-languages-objectivec-swift"
[!INCLUDE [Objective-C and Swift Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-objectivec-swift.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-python.md)]
::: zone-end

::: zone pivot="programming-language-curl"
[!INCLUDE [REST include](includes/how-to/text-to-speech-basics/text-to-speech-basics-curl.md)]
::: zone-end

::: zone pivot="programmer-tool-spx"
[!INCLUDE [CLI Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-cli.md)]
::: zone-end

## Get position information

Your project may need to know when a word is spoken by text-to-speech so that it can take specific action based on that timing.
As an example, if you wanted to highlight words as they were spoken, you would need to know what to highlight, when to highlight it, and for how long to highlight it.

You can accomplish this using the `WordBoundary` event available within `SpeechSynthesizer`.
This event is raised at the beginning of each new spoken word and will provide a time offset within the spoken stream and a text offset within the input prompt.

* `AudioOffset` reports the output audio's elapsed time between the beginning of synthesis and the start of the next word. This is measured in hundred-nanosecond units (HNS) with 10,000 HNS equivalent to 1 millisecond.
* `WordOffset` reports the character position in the input string (original text or [SSML](speech-synthesis-markup.md)) immediately before the word that's about to be spoken.

> [!NOTE]
> `WordBoundary` events are raised as the output audio data becomes available, which will be faster than playback to an output device. Appropriately synchronizing stream timing to "real time" must be accomplished by the caller.

You can find examples of using `WordBoundary` in the [text-to-speech samples](https://aka.ms/csspeech/samples) on GitHub.

## Next steps

* [Get started with Custom Voice](how-to-custom-voice.md)
* [Improve synthesis with SSML](speech-synthesis-markup.md)
* Learn how to use the [Long Audio API](long-audio-api.md) for large text samples like books and news articles
* See the [quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart) on GitHub
