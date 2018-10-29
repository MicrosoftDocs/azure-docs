---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 09/24/2018
ms.author: wolfma
---

<!-- N.B. no header, language-agnostic -->

The Microsoft Cognitive Services [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) provides a way to recognize **intents from speech** and is supported by the Cognitive Services [Language Understanding service (LUIS)](https://www.luis.ai/home).

1. Create a speech configuration with a LUIS subscription key and [region](~/articles/cognitive-services/speech-service/regions.md#regions-for-intent-recognition) as parameters. The LUIS subscription key is called **endpoint key** in the service documentation. You can't use the LUIS authoring key. (See the note later in this section.)

1. Create an intent recognizer from the speech configuration. Provide an audio configuration if you want recognize from a source other than your default microphone (for example, audio stream or audio file).

1. Get the language understanding model that's based on your **AppId**. Add the intents you require. 

1. Tie up the events for asynchronous operation, if desired. The recognizer then calls your event handlers when it has interim and final results (includes intents). If you don't tie up the events, your application receives only a final transcription result.

1. Start intent recognition. For single-shot recognition, such as command or query recognition, use the `RecognizeOnceAsync()` method. This method returns the first recognized utterance. For long-running recognition, use the `StartContinuousRecognitionAsync()` method. Tie up the events for asynchronous recognition results.

See the following code snippets for intent recognition scenarios that use the Speech SDK. Replace the values in the sample with your own LUIS subscription key (endpoint key), the [region of your subscription](~/articles/cognitive-services/speech-service/regions.md#regions-for-intent-recognition), and the **AppId** of your intent model.

> [!NOTE]
> In contrast to other services supported by the Speech SDK, intent recognition requires a specific subscription key (LUIS endpoint key). For information about the intent recognition technology, see the [LUIS website](https://www.luis.ai). For information on how to acquire the **endpoint key**, see [Create a LUIS endpoint key](https://docs.microsoft.com/azure/cognitive-services/LUIS/luis-how-to-azure-subscription#create-luis-endpoint-key).
