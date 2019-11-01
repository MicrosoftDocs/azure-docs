---
title: "Quickstart: Recognize speech, intents, and entities - Speech Service"
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/28/2019
ms.author: erhopf
zone_pivot_groups: programming-languages-set-two
---

In this quickstart you will use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to interactively recognize speech from audio data captured from a microphone. After satisfying a few prerequisites, recognizing speech from a microphone only takes four steps:
> [!div class="checklist"]
> * Create a ````SpeechConfig```` object from your subscription key and region.
> * Create a ````IntentRecognizer```` object using the ````SpeechConfig```` object from above.
> * Using the ````IntentRecognizer```` object, start the recognition process for a single utterance.
> * Inspect the ````IntentRecognitionResult```` returned.