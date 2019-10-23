---
title: 'Quickstart: Translate speech-to-speech - Speech Service'
titleSuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 09/20/2019
ms.author: yulili
---

In this quickstart you will use the [Speech SDK](https://aka.ms/ignite2019/speech/placeholder) to interactively translate speech from one language to speech in another language. After satisfying a few prerequisites, translating speech-to-speech only takes six steps:
> [!div class="checklist"]
> * Create a ````SpeechConfig```` object from your subscription key and region.
> * Update the ````SpeechConfig```` object to specify the source and target languages.
> * Update the ````SpeechConfig```` object to specify the speech output voice name.
> * Create a ````TranslationRecognizer```` object using the ````SpeechConfig```` object from above.
> * Using the ````TranslationRecognizer```` object, start the recognition process for a single utterance.
> * Inspect the ````TranslationRecognitionResult```` returned.
