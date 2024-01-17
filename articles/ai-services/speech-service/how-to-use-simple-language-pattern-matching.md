---
title: How to recognize intents with simple language pattern matching
titleSuffix: Azure AI services
description: In this guide, you learn how to recognize intents and entities from simple patterns.
author: chschrae
manager: travisw
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 04/19/2022
ms.author: chschrae
zone_pivot_groups: programming-languages-set-thirteen
ms.custom: devx-track-cpp, devx-track-csharp, mode-other, devx-track-extended-java
---

# How to recognize intents with simple language pattern matching

The Azure AI services [Speech SDK](speech-sdk.md) has a built-in feature to provide **intent recognition** with **simple language pattern matching**. An intent is something the user wants to do: close a window, mark a checkbox, insert some text, etc.

In this guide, you use the Speech SDK to develop a C++ console application that derives intents from user utterances through your device's microphone. You'll learn how to:

> [!div class="checklist"]
>
> - Create a Visual Studio project referencing the Speech SDK NuGet package
> - Create a speech configuration and get an intent recognizer
> - Add intents and patterns via the Speech SDK API
> - Recognize speech from a microphone
> - Use asynchronous, event-driven continuous recognition

## When to use pattern matching

Use pattern matching if: 
* You're only interested in matching strictly what the user said. These patterns match more aggressively than [conversational language understanding (CLU)](../language-service/conversational-language-understanding/overview.md).
* You don't have access to a CLU model, but still want intents. 

For more information, see the [pattern matching overview](./pattern-matching-overview.md).

## Prerequisites

Be sure you have the following items before you begin this guide:

- An [Azure AI services resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices) or a [Unified Speech resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices)
- [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) (any edition).

## Speech and simple patterns

The simple patterns are a feature of the Speech SDK and need an Azure AI services resource or a Unified Speech resource.

A pattern is a phrase that includes an Entity somewhere within it. An Entity is defined by wrapping a word in curly brackets. This example defines an Entity with the ID "floorName", which is case-sensitive:

```
    Take me to the {floorName}
```

All other special characters and punctuation will be ignored.

Intents will be added using calls to the IntentRecognizer->AddIntent() API.

::: zone pivot="programming-language-csharp"
[!INCLUDE [csharp](includes/how-to/intent-recognition/csharp/simple-pattern-matching.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [cpp](includes/how-to/intent-recognition/cpp/simple-pattern-matching.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [java](includes/how-to/intent-recognition/java/simple-pattern-matching.md)]
::: zone-end
