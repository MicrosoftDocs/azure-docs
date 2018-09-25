---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 09/24/2018
ms.author: wolfma
---

<!-- N.B. no header, language-agnostic -->

The Microsoft Cognitive Services [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) provides the simplest way to use **speech translation** in your application.
The SDK provides the full functionality of the service. The basic process for performing speech translation includes the following steps:

1. Create a speech translation configuration and provide a Speech service subscription key (or an authorization token) and a [region](~/articles/cognitive-services/speech-service/regions.md) as parameters. Change the configuration as needed. For example, you can configure the source and target translation languages, as well as specify whether you want text or speech output.

1. Create a translation recognizer from the speech translation configuration. Provide an audio configuration if you want recognize from a source other than your default microphone (for example, audio stream or audio file).

1. Tie up the events for asynchronous operation, if desired. The recognizer then calls your event handlers when it has interim and final results, as well as a synthesis event for the optional audio output. Otherwise, your application receives only a final transcription result.

1. Start recognition. For single-shot translation use the `RecognizeOnceAsync()` method, which returns the first recognized utterance. For long-running translations, use the `StartContinuousRecognitionAsync()` method and tie up the events for asynchronous recognition results.

See the following code snippets for speech translation scenarios that use the Speech SDK.

[!INCLUDE [Get a subscription key](cognitive-services-speech-service-get-subscription-key.md)]
