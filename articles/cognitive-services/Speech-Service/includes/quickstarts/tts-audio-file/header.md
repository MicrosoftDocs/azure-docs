---
author: trevorbye
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 01/31/2020
ms.author: trbye
---

In this quickstart, you will use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to convert text to synthesized speech in an audio file. The text-to-speech service provides numerous options for synthesized voices, under [text-to-speech language support](../../../language-support.md#text-to-speech). After satisfying a few prerequisites, synthesizing speech into a file only takes five steps:
> [!div class="checklist"]
> * Create a `SpeechConfig` object from your subscription key and region.
> * Create an Audio Configuration object that specifies the .WAV file name.
> * Create a `SpeechSynthesizer` object using the configuration objects from above.
> * Using the `SpeechSynthesizer` object, convert your text into synthesized speech, saving it into the audio file specified.
> * Inspect the `SpeechSynthesizer` returned for errors.
