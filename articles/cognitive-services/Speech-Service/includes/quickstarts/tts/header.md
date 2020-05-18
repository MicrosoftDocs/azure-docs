---
author: trevorbye
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 01/31/2020
ms.author: trbye
---

In this quickstart, you will use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to convert text to synthesized speech. The text-to-speech service provides numerous options for synthesized voices, under [text-to-speech language support](../../../language-support.md#text-to-speech). After satisfying a few prerequisites, rendering synthesized speech to the default speakers only takes four steps:
> [!div class="checklist"]
> * Create a `SpeechConfig` object from your subscription key and region.
> * Create a `SpeechSynthesizer` object using the `SpeechConfig` object from above.
> * Using the `SpeechSynthesizer` object to speak the text.
> * Check the `SpeechSynthesisResult` returned for errors.
