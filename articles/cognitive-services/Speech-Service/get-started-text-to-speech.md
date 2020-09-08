---
title: "Text-to-speech quickstart - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Speech SDK to convert text-to-speech. In this quickstart, you learn about object construction and design patterns, supported audio output formats, the Speech CLI, and custom configuration options for speech synthesis.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 09/01/2020
ms.author: trbye
ms.custom: "devx-track-python, devx-track-javascript, devx-track-csharp, cog-serv-seo-aug-2020"
zone_pivot_groups: speech-full-stack
keywords: text to speech
---

# Get started with text-to-speech

In this quickstart, you learn common design patterns for doing text-to-speech synthesis using the Speech SDK. You start by doing basic configuration and synthesis, and move on to more advanced examples for custom application development including:

* Getting responses as in-memory streams
* Customizing output sample rate and bit rate
* Submitting synthesis requests using SSML (speech synthesis markup language)
* Using neural voices

> [!TIP]
> If you want to skip straight to sample code, see the [quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart) on GitHub.

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

::: zone pivot="programming-language-spx"
[!INCLUDE [CLI include](includes/how-to/text-to-speech-basics/text-to-speech-basics-cli.md)]
::: zone-end

## Next steps

* [Get started with Custom Voice](how-to-custom-voice.md)
* [Improve synthesis with SSML](speech-synthesis-markup.md)
* Learn how to use the [Long Audio API](long-audio-api.md) for large text samples like books and news articles
* See the [quickstart samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart) on GitHub
