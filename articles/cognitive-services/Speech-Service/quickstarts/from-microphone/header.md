---
title: "Quickstart: Recognize speech from a microphone - Speech Service"
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

In this quickstart you will use the [Speech SDK](https://aka.ms/speech/sdk) to interactively recognize speech from audio data captured from a microphone. After satisfying a few prerequisites, *recognizing speech* from a microphone takes only four steps:
1. Create a ````SpeechConfig```` object from your subscription key and region.
2. Create a ````SpeechRecognizer```` object from the ````SpeechConfig```` object.
3. Start the recognition process for a single utterance.
4. Inspect the ````SpeechRecognitionResult```` returned 
