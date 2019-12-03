---
title: "Quickstart: Synthesize speech into audio file - Speech Service"
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

In this quickstart you will use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to convert text to synthesized speech in an audio file. After satisfying a few prerequisites, synthesizing speech into a file only takes five steps:
> [!div class="checklist"]
> * Create a ````SpeechConfig```` object from your subscription key and region.
> * Create an Audio Configuration object that specifies the .WAV file name.
> * Create a ````SpeechSynthesizer```` object using the configuration objects from above.
> * Using the ````SpeechSynthesizer```` object, convert your text into synthesized speech, saving it into the audio file specified.
> * Inspect the ````SpeechSynthesizer```` returned for errors.
