---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 04/02/2020
ms.author: trbye
---

In this quickstart, you use the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) to interactively recognize speech from a microphone input, and get the text transcription from captured audio. It's easy to integrate this feature into your apps or devices for common recognition tasks, such as transcribing conversations. It can also be used for more complex integrations, like using the Bot Framework with the Speech SDK to build voice assistants.

After satisfying a few prerequisites, recognizing speech from a microphone only takes four steps:

> [!div class="checklist"]
> * Create a `SpeechConfig` object from your subscription key and region.
> * Create a `SpeechRecognizer` object using the `SpeechConfig` object from above.
> * Using the `SpeechRecognizer` object, start the recognition process for a single utterance.
> * Inspect the `SpeechRecognitionResult` returned.
