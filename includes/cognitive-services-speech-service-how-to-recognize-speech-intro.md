---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 09/24/2018
ms.author: wolfma
---

<!-- N.B. no header, no intents here, language-agnostic -->

The Cognitive Services [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) provides the simplest way to use **Speech to Text** in your application with full functionality.

1. Create a speech factory and provide a Speech service subscription key (or an authorization token) and a [region](~/articles/cognitive-services/speech-service/regions.md) as parameters. You can also provide a custom endpoint to specify a non-standard service endpoint.

1. Get a speech recognizer from the speech factory. You can configure the input language and the output format. A recognizer can use your device's default microphone, an audio stream, or audio from a file.

1. Tie up the events for asynchronous operation, if desired. The recognizer then calls your event handlers when it has interim and final results. Otherwise, your application receives only a final transcription result.

1. Start recognition. For single-shot recognition, such as command or query recognition, use the `RecognizeOnceAsync()` method. This method returns the first recognized utterance. For long-running recognition like transcription, use the `StartContinuousRecognitionAsync()` method. Tie up the events for asynchronous recognition results.

See the following code snippets for speech recognition scenarios that use the Speech SDK.

[!INCLUDE [Get a subscription key](cognitive-services-speech-service-get-subscription-key.md)]
