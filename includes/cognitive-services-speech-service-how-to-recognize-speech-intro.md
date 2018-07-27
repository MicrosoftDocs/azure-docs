---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 07/27/2018
ms.author: wolfma
---

<!-- N.B. no header, no intents here, language-agnostic -->

The [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) provides the simplest way to use **Speech to Text** in your application with full functionality.

1. Create a speech factory, providing a Speech service subscription key or an authorization token, and a [region](~/articles/cognitive-services/speech-service/regions.md).
   You can also configure options, such as the recognition language or a custom endpoint for your own speech recognition models.

1. Get a speech recognizer from the speech factory.
   A recognizer can use your device's default microphone, an audio stream, or audio from a file.

1. Tie up the events for asynchronous operation, if desired.
   The recognizer then calls your event handlers when it has interim and final results.
   Otherwise, your application will receive a final transcription result.

1. Start recognition.
   For single-shot recognition, like command or query recognition, use `RecognizeAsync()`, which returns the first utterance being recognized.
   For long-running recognition, like transcription, use `StartContinuousRecognitionAsync()` and tie up the events for asynchronous recognition results.

Below we show several code snippets for speech recognition scenarios using the Speech SDK.

[!include[Get a Subscription Key](cognitive-services-speech-service-get-subscription-key.md)]
