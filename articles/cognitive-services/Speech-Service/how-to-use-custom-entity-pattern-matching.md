---
title:  How to recognize intents with custom entity pattern matching
titleSuffix: Azure Cognitive Services
description: In this guide, you learn how to recognize intents and custom entities from simple patterns.
services: cognitive-services
author: chschrae
manager: travisw
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/15/2021
ms.author: chschrae
ms.devlang: cpp, csharp
zone_pivot_groups: programming-languages-set-thirteen
ms.custom: devx-track-cpp, devx-track-csharp, mode-other
---

# How to recognize intents with custom entity pattern matching

The Cognitive Services [Speech SDK](speech-sdk.md) has a built-in feature to provide **intent recognition** with **simple language pattern matching**. An intent is something the user wants to do: close a window, mark a checkbox, insert some text, etc.

In this guide, you use the Speech SDK to develop a console application that derives intents from speech utterances spoken through your device's microphone. You'll learn how to:

> [!div class="checklist"]
>
> - Create a Visual Studio project referencing the Speech SDK NuGet package
> - Create a speech configuration and get an intent recognizer
> - Add intents and patterns via the Speech SDK API
> - Add custom entities via the Speech SDK API
> - Use asynchronous, event-driven continuous recognition

## When to use pattern matching

Use this sample code if: 
* You're only interested in matching strictly what the user said. These patterns match more aggressively than LUIS.
* You don't have access to a [LUIS](../LUIS/index.yml) app, but still want intents. 
* You can't or don't want to create a [LUIS](../LUIS/index.yml) app but you still want some voice-commanding capability.

For more information, see the [pattern matching overview](./pattern-matching-overview.md).

## Prerequisites

Be sure you have the following items before you begin this guide:

- A [Cognitive Services Azure resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices) or a [Unified Speech resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices)
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) (any edition).

::: zone pivot="programming-language-csharp"
[!INCLUDE [csharp](includes/how-to/intent-recognition/csharp/pattern-matching.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [cpp](includes/how-to/intent-recognition/cpp/pattern-matching.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [java](includes/how-to/intent-recognition/java/pattern-matching.md)]
::: zone-end