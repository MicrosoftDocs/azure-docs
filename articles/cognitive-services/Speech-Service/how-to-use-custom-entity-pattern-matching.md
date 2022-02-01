---
title: How to use custom entity pattern matching with the Speech SDK
titleSuffix: Azure Cognitive Services
description: In this guide, you learn how to recognize intents and custom entities from simple patterns.
services: cognitive-services
author: chschrae
manager: travisw
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/15/2021
ms.author: chschrae
ms.devlang: cpp, csharp
zone_pivot_groups: programming-languages-set-nine
ms.custom: devx-track-cpp, devx-track-csharp, mode-other
---

# How to use custom entity pattern matching with the Speech SDK

The Cognitive Services [Speech SDK](speech-sdk.md) has a built-in feature to provide **intent recognition** with **simple language pattern matching**. An intent is something the user wants to do: close a window, mark a checkbox, insert some text, etc.

In this guide, you use the Speech SDK to develop a console application that derives intents from speech utterances spoken through your device's microphone. You'll learn how to:

> [!div class="checklist"]
>
> - Create a Visual Studio project referencing the Speech SDK NuGet package
> - Create a speech configuration and get an intent recognizer
> - Add intents and patterns via the Speech SDK API
> - Add custom entities via the Speech SDK API
> - Use asynchronous, event-driven continuous recognition

## When should you use this?

Use this sample code if:

- You are only interested in matching very strictly what the user said. These patterns match more aggressively than LUIS.
- You do not have access to a [LUIS](../LUIS/index.yml) app, but still want intents. This can be helpful since it is embedded within the SDK.
- You cannot or do not want to create a LUIS app but you still want some voice-commanding capability.

If you do not have access to a [LUIS](../LUIS/index.yml) app, but still want intents, this can be helpful since it is embedded within the SDK.

## Prerequisites

Be sure you have the following items before you begin this guide:

- A [Cognitive Services Azure resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices) or a [Unified Speech resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices)
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) (any edition).

## Pattern Matching Model overview

[!INCLUDE [Pattern Matching Overview](includes/pattern-matching-overview.md)]

::: zone pivot="programming-language-csharp"
[!INCLUDE [Header](includes/quickstarts/intent-recognition/csharp/header.md)]
[!INCLUDE [csharp](includes/quickstarts/intent-recognition/csharp/pattern-matching.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [Header](includes/quickstarts/intent-recognition/cpp/header.md)]
[!INCLUDE [cpp](includes/quickstarts/intent-recognition/cpp/pattern-matching.md)]
::: zone-end
