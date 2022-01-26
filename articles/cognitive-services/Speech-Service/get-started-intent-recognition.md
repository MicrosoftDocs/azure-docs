---
title: "Intent recognition quickstart - Speech service"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you use intent recognition to interactively recognize intents from audio data captured from a microphone.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 01/08/2022
ms.author: eur
ms.devlang: cpp, csharp, java, javascript, python
ms.custom: devx-track-js, devx-track-csharp, cog-serv-seo-aug-2020, mode-other
zone_pivot_groups: programming-languages-speech-services
keywords: intent recognition
---

# Get started with intent recognition

[!INCLUDE [Header](includes/quickstarts/common/csharp.md)]

In this quickstart, you'll use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) and the Language Understanding (LUIS) service to recognize intents from audio data captured from a microphone. Specifically, you'll use the Speech SDK to capture speech, and a prebuilt domain from LUIS to identify intents for home automation, like turning on and off a light. 

::: zone pivot="programming-language-csharp"
## Prerequisites
[!INCLUDE [Header](includes/quickstarts/common/azure-prerequisites.md)]
[!INCLUDE [chsarp](includes/quickstarts/intent-recognition/csharp.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
## Prerequisites
[!INCLUDE [Header](includes/quickstarts/common/azure-prerequisites.md)]
[!INCLUDE [cpp](includes/quickstarts/intent-recognition/cpp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Header](includes/quickstarts/intent-recognition/header.md)]
[!INCLUDE [Header](includes/quickstarts/intent-recognition/java/header.md)]
[!INCLUDE [java](includes/quickstarts/intent-recognition/java/java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Header](includes/quickstarts/intent-recognition/header.md)]
[!INCLUDE [Header](includes/quickstarts/intent-recognition/python/header.md)]
[!INCLUDE [python](includes/quickstarts/intent-recognition/python/python.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Header](includes/quickstarts/intent-recognition/header.md)]
[!INCLUDE [Header](includes/quickstarts/intent-recognition/javascript/header.md)]
[!INCLUDE [javascript](includes/quickstarts/intent-recognition/javascript/javascript.md)]
::: zone-end


> [!div class="nextstepaction"]
> [See the advanced LUIS sample on GitHub](https://github.com/Azure/pizza_luis_bot)
