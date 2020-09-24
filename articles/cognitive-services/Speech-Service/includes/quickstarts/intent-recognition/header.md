---
author: trevorbye
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 01/27/2020
ms.author: trbye
---

In this quickstart, you'll use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) and the Language Understanding (LUIS) service to recognize intents from audio data captured from a microphone. Specifically, you'll use the Speech SDK to capture speech, and a prebuilt domain from LUIS to identify intents for home automation, like turning on and off a light. 

After satisfying a few prerequisites, recognizing speech and identifying intents from a microphone only takes a few steps:

> [!div class="checklist"]
>
> * Create a `SpeechConfig` object from your subscription key and region.
> * Create an `IntentRecognizer` object using the `SpeechConfig` object from above.
> * Using the `IntentRecognizer` object, start the recognition process for a single utterance.
> * Inspect the `IntentRecognitionResult` returned.
