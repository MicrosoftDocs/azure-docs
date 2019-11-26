---
title: "Quickstart: Recognize speech from an audio file - Speech Service"
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
---

In this quickstart you will use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to recognize speech from an audio file. After satisfying a few prerequisites, recognizing speech from a file only takes five steps:
> [!div class="checklist"]
> * Create a ````SpeechConfig```` object from your subscription key and region.
> * Create an ````AudioConfig```` object that specifies the .WAV file name.
> * Create a ````SpeechRecognizer```` object using the ````SpeechConfig```` and ````AudioConfig```` objects from above.
> * Using the ````SpeechRecognizer```` object, start the recognition process for a single utterance.
> * Inspect the ````SpeechRecognitionResult```` returned.
