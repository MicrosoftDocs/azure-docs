---
title: "Speech synthesis basics - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Speech SDK to convert text-to-speech. In this article, you'll learn about object construction, supported audio output formats, and custom configuration options for speech synthesis.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 04/14/2020
ms.author: trbye
ms.custom: tracking-python
zone_pivot_groups: programming-languages-set-two-with-js
---

# Learn the basics of speech synthesis

In this article, you learn common design patterns for doing text-to-speech synthesis using the Speech SDK. You start by doing basic configuration and synthesis, and move on to more advanced examples for custom application development including:

* Getting responses as in-memory streams
* Customizing output sample rate and bit rate
* Submitting synthesis requests using SSML (speech synthesis markup language)
* Using neural voices

> [!TIP]
> If you haven't had a chance to complete one of our quickstarts, we encourage you to kick the tires and try text to speech for yourself.
> * [Synthesize speech to a speaker](quickstarts/text-to-speech.md)

::: zone pivot="programming-language-csharp"
[!INCLUDE [C# Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-csharp.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [C++ Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-cpp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python Basics include](includes/how-to/text-to-speech-basics/text-to-speech-basics-python.md)]
::: zone-end

::: zone pivot="programming-language-more"
[!INCLUDE [More languages include](./includes/how-to/speech-to-text-basics/more.md)]
::: zone-end

## Next steps

* [Get started with Custom Voice](how-to-custom-voice.md)
* [Improve synthesis with SSML](speech-synthesis-markup.md)
