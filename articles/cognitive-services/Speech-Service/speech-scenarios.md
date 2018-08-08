---
title: Azure Cognitive Services Speech Scenarios
description: Scenarios
services: cognitive-services
author: PanosPeriorellis

ms.service: cognitive-services
ms.technology: Speech to Text
ms.topic: article
ms.date: 07/02/2018
ms.author: panosper
---

# Speech Scenarios

There are many scenarios that can be empowered using Speech technology. We are analyzing a few of the most common and point out relevant features in the documentation. For most of the content, the [SDK](speech-sdk.md) is central in enabling these scenarios.

The page discusses how to:
> [!div class="checklist"]
> * Create voice triggered apps
> * Transcribe call center audio calls
> * Voice Bots

## Voice Triggered Apps

Many users want to enable voice input on their applications. Voice input is a great way to make your app flexible, be it using it hands free (for example in a car) or speeding up various tasks such as asking directions the news or weather information. 

### Voice Triggered Apps with baseline models

If your app is going to be used by the general public in environments where the background noise is not excessive, the easiest and fastest way to do this be simply downloading our [Speech SDK](speech-sdk.md) and following the relevant [Samples](quickstart-csharp-dotnet-windows.md). The SDK powered by your [Azure Subscription key](https://azure.microsoft.com/try/cognitive-services/) allows developers to upload audio to baseline speech recognition models that power Cortana and Skype. The models are state of the art, and are used by the aforementioned products. You can be up and running in minutes.

### Voice Triggered Apps with custom models

If your app addresses a specific domain, (say chemistry, biology or special dietary needs) then you may want to consider to adapt a [language model](how-to-customize-language-model.md). Adapting a language model will teach the decoder about the most common phrases and words used by your app. The decoder will be able to more accurately transcribe a voice input with a custom language model for a particular domain rather than the baseline model. Similarly if the background noise where your app is going to be used is prominent you may want to adapt an acoustic model. Explore the documentation for other cases under which [language adaptation](how-to-customize-language-model.md) and [acoustic adaptation](how-to-customize-acoustic-models.md) provide value and visit our [adaptation portal](https://customspeech.ai) for kick-starting the model creation experience. Similar to baseline models, custom models are called via our [Speech SDK](speech-sdk.md) and following the relevant [Samples](quickstart-csharp-dotnet-windows.md).

## Transcribe Call center audio calls

Call centers accumulate large quantities of audio. Hidden within those audio files lies value that can be obtained through transcription. The duration of the call, the sentiment, the satisfaction of the customer and the general value the call provided to the caller can be discovered by obtaining call transcripts.

The best starting point is the [Batch transcription API](batch-transcription.md) along with related [Sample](https://github.com/PanosPeriorellis/Speech_Service-BatchTranscriptionAPI).

You will need to first obtain an [Azure Subscription key](https://azure.microsoft.com/try/cognitive-services/) and then you will need to consult the [documentation]([Batch transcription API](batch-transcription.md)).

### Transcribe Call center audio calls with baseline models

The decision that needs to be made is whether you will use the internal baseline models to carry out the transcription, adapt a language or an acoustic model or both. To use baseline models the API only requires the API key. Internally the API will invoke the best model for your data and adapt.

### Transcribe Call center audio calls with custom models

If you plan to use a custom model, then you will need the ID of that model along with the API key. The Model ID is obtained from the [adaptation portal](https://customspeech.ai). This is not the Endpoint ID that you find on the 'Endpoint Details' view but the model ID which you can retrieve when you click on the 'Details' of that model.

## Voice Bots

Developers can empower their applications with voice output. The Speech Service can synthetize speech for a number of [languages](supported-languages.md) and provides the [endpoints](rest-apis.md) for accessing and adding that capability to your app.

In addition, for users that want to add more personality and uniqueness to their bots, the Speech Service enables developers to customize a unique voice font. Similar to customizing speech recognition models voice fonts require user data. Developers are upload that data in our [voice adaptation portal](https://customspeech.ai) and start building your unique brand of voice for your bot. Details are described [here](how-to-text-to-speech.md) as well as the [FAQ](faq-text-to-speech.md) pages 

## Next steps

* [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
* [Start with the Speech SDK](speech-sdk.md)
