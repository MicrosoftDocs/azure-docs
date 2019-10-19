---
title: "Quickstart: Recognize Intents from a microphone - Speech Service"
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 10/28/2019
ms.author: erhopf
zone_pivot_groups: programming-languages-set-two
---

# Recognize Intents usig speech

In this quickstart you will use the [Speech SDK](https://aka.ms/ignite2019/speech/placeholder) to interactively recognize speech from audio data captured from a microphone. After satisfying a few prerequisites, recognizing speech from a microphone takes only four steps:
> [!div class="checklist"]
> * Create a ````SpeechConfig```` object from your subscription key and region.
> * Create a ````IntentRecognizer```` object using the ````SpeechConfig```` object from above.
> * Using the ````IntentRecognizer```` object, start the recognition process for a single utterance.
> * Inspect the ````IntentRecognitionResult```` returned.

## Prerequisites

Before you get started, make sure to:

1. [Create a LUIS application and get an endpoint key](~/articles/cognitive-services/Speech-Service/quickstarts/create-luis.md)
2. [Setup your development environment](~/articles/cognitive-services/Speech-Service/quickstarts/setup-platform.md?tabs=dotnet%2CWindows%2Cjre)
3. [Created an empty sample project](~/articles/cognitive-services/Speech-Service/quickstarts/create-project.md?tabs=dotnet%2CWindows%2Cjre)

::: zone pivot="programming-language-csharp"
[!INCLUDE [chsarp](~/articles/cognitive-services/Speech-Service/includes/quickstarts/intent-recognition/csharp.md)]
::: zone-end

::: zone pivot="programming-language-cpp"
[!INCLUDE [chsarp](~/articles/cognitive-services/Speech-Service/includes/quickstarts/intent-recognition/cpp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [chsarp](~/articles/cognitive-services/Speech-Service/includes/quickstarts/intent-recognition/java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [chsarp](~/articles/cognitive-services/Speech-Service/includes/quickstarts/intent-recognition/python.md)]
::: zone-end

::: zone pivot="programming-language-more"
::: zone-end
