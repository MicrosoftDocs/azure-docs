---
title: 'Quickstart: Translate speech-to-speech - Speech service'
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 12/09/2019
ms.author: yulili
---

In this quickstart you will use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to interactively translate speech from one language to speech in another language. After satisfying a few prerequisites, translating speech-to-speech only takes six steps:
> [!div class="checklist"]
> * Create a ````SpeechTranslationConfig```` object from your subscription key and region.
> * Update the ````SpeechTranslationConfig```` object to specify the source and target languages.
> * Update the ````SpeechTranslationConfig```` object to specify the speech output voice name.
> * Create a ````TranslationRecognizer```` object using the ````SpeechTranslationConfig```` object from above.
> * Using the ````TranslationRecognizer```` object, start the recognition process for a single utterance.
> * Inspect the ````TranslationRecognitionResult```` returned.
