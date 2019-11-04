---
title: 'Quickstart: Synthesize speech - Speech Service'
titleSuffix: Azure Cognitive Services
description: Learn how to synthesize speech using the Speech SDK
services: cognitive-services
author: yulin-li
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 09/20/2019
ms.author: yulili
---

In this quickstart you will use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to convert text to synthesized speech. After satisfying a few prerequisites, rendering synthesized speech to the default speakers only takes four steps:
> [!div class="checklist"]
> * Create a ````SpeechConfig```` object from your subscription key and region.
> * Create a ````SpeechSynthesizer```` object using the ````SpeechConfig```` object from above.
> * Using the ````SpeechSynthesizer```` object to speak the text.
> * Check the ````SpeechSynthesisResult```` returned for errors.
