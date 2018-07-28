---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 07/27/2018
ms.author: wolfma
---

<!-- N.B. no header, language-agnostic -->

The [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) provides a way to recognize intents from speech, powered by the Speech service and the [Language Understanding service (LUIS)](https://luis.ai).

1. Create a speech factory, providing a Language Understanding service subscription key and [region](~/articles/cognitive-services/speech-service/regions.md#regions-for-intent-recognition).


1. Get an intent recognizer from the speech factory.
   A recognizer can use your device's default microphone, an audio stream, or audio from a file.

1. Tie up the events for asynchronous operation, if desired.
   The recognizer then calls your event handlers when it has interim and final results.
   Otherwise, your application will receive a final transcription result.

1. Start recognition.
   For single-shot recognition, like command or query recognition, use `RecognizeAsync()`, which returns the first utterance being recognized.
   For long-running recognition, like transcription, use `StartContinuousRecognitionAsync()` and tie up the events for asynchronous recognition results.

Below we show several code snippets for intent recognition scenarios using the Speech SDK.

> [!NOTE]
> Please obtain a subscription key first.
> In contrast to other services supported by the Speech SDK, intent recognition requires a specific subscription key.
> [Here](https://www.luis.ai) you can find additional information about the intent recognition technology, as well as information about how to acquire a subscription key.
> Replace your own Language Understanding subscription key, the [region of your subscription](~/articles/cognitive-services/speech-service/regions.md#regions-for-intent-recognition), and the AppId of your intent model in the appropriate places in the samples.
