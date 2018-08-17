---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 07/27/2018
ms.author: wolfma
---

<!-- N.B. no header, language-agnostic -->

The [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) provides a way to recognize **intents from speech**, powered by the Speech service and the [Language Understanding service (LUIS)](https://www.luis.ai/home).

1. Create a speech factory, providing a Language Understanding service subscription key and [region](~/articles/cognitive-services/speech-service/regions.md#regions-for-intent-recognition). The Language Understanding service subscription key is called **endpoint key** in the service documentation. You can't use the Language Understanding service authoring key. See also the **Note** below.

1. Get an intent recognizer from the speech factory. A recognizer can use your device's default microphone, an audio stream, or audio from a file.

1. Get the language understanding model based on your AppId, and add the intents you require. 

1. Tie up the events for asynchronous operation, if desired. The recognizer then calls your event handlers when it has interim and final results (including intents). Otherwise, your application will receive a final transcription result.

1. Start intent recognition. For single-shot recognition, like command or query recognition, use `RecognizeAsync()`, which returns the first utterance being recognized. For long-running recognition use `StartContinuousRecognitionAsync()` and tie up the events for asynchronous recognition results.

See the code snippets below for intent recognition scenarios using the Speech SDK. Replace your own Language Understanding subscription key (endpoint key), the [region of your subscription](~/articles/cognitive-services/speech-service/regions.md#regions-for-intent-recognition), and the AppId of your intent model in the appropriate places in the samples.

> [!NOTE]
> In contrast to other services supported by the Speech SDK, intent recognition requires a specific subscription key (Language Understanding service endpoint key). [Here](https://www.luis.ai) you can find additional information about the intent recognition technology. How to acquire the **endpoint key** is described [here](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/luis-how-to-azure-subscription#create-luis-endpoint-key).
