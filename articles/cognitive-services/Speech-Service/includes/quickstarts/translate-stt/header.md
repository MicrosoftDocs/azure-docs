---
title: 'Quickstart: Translate speech-to-text - Speech Service'
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

In this quickstart you will use the [Speech SDK](https://aka.ms/ignite2019/speech/placeholder) to interactively translate speech from one language to text in another language. After satisfying a few prerequisites, translating speech-to-text only takes four steps:
> [!div class="checklist"]
> * Create a ````SpeechConfig```` object from your subscription key and region.
> * Create a ````TranslationRecognizer```` object using the ````SpeechConfig```` object from above.
> * Using the ````TranslationRecognizer```` object, start the recognition process for a single utterance.
> * Inspect the ````TranslationRecognitionResult```` returned.
