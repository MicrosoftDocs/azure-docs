---
title: What is the Speech service (preview)?
description: "The Speech service, part of Microsoft Cognitive Services, unites several Azure speech services that were previously available separately: Bing Speech (comprising speech recognition and text to speech), Custom Speech, and Speech Translation."
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.component: speech-service
ms.topic: overview
ms.date: 05/07/2018
ms.author: v-jerkin
---
# What is the Speech service?

The Speech service unites the Azure speech features previously available via the [Bing Speech API](https://docs.microsoft.com/azure/cognitive-services/speech/home), [Translator Speech](https://docs.microsoft.com/azure/cognitive-services/translator-speech/), [Custom Speech](https://docs.microsoft.com/azure/cognitive-services/custom-speech-service/cognitive-services-custom-speech-home), and [Custom Voice](http://customvoice.ai/) services. Now, one subscription provides access to all of these capabilities.

Like the other Azure speech services, the Speech service is powered by the speech technologies used in products like Cortana and Microsoft Office. You can count on the quality of the results and the reliability of the cloud platform.

> [!NOTE]
> The Speech service is currently in public preview. Return here for documentation updates, new code samples, and more.

## Main Speech service functions

The primary functions of the Speech service are Speech to Text (also called speech recognition or transcription), Text to Speech (speech synthesis), and Speech Translation.

|Function|Features|
|-|-|
|[Speech to Text](speech-to-text.md)| <ul><li>Transcribes continuous real-time speech into text.<li>Can batch-transcribe speech from audio recordings. <li>Offers recognition modes for interactive, conversation, and dictation use cases.<li>Supports intermediate results, end-of-speech detection, automatic text formatting, and profanity masking. <li>Can call on [Language Understanding](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS) to derive user intent from transcribed speech.\*|
|[Text to Speech](text-to-speech.md)| <ul><li>Converts text to natural-sounding speech. <li>Offers multiple genders and/or dialects for many supported languages. <li>Supports plain text input or Speech Synthesis Markup Language (SSML). |
|[Speech Translation](speech-translation.md)| <ul><li>Translates streaming audio in near-real-time.<li> Can also process recorded speech.<li>Provides results as text or synthesized speech. |

\* *Intent recognition requires a LUIS subscription.*


## Customize speech features

You can use your own data to train the models that underlie the Speech service's Speech-to-Text and Text-to-Speech features.

|Feature|Model|Purpose|
|-|-|-|
|Speech to Text|[Acoustic model](how-to-customize-acoustic-models.md)|Helps transcribe particular speakers and environments, such as cars or factories.|
||[Language model](how-to-customize-language-model.md)|Helps transcribe field-specific vocabulary and grammar, such as medical or IT jargon.|
||[Pronunciation model](how-to-customize-pronunciation.md)|Helps transcribe abbreviations and acronyms, such as "IOU" for "I owe you." |
|Text to Speech|[Voice font](how-to-customize-voice-font.md)|Gives your app a voice of its own by training the model on samples of human speech.|

You can use your custom models anywhere you use the standard models in your app's Speech-to-Text or Text-to-Speech functionality.


## Use the Speech service

To simplify the development of speech-enabled applications, Microsoft provides the [Speech SDK](speech-sdk.md) for use with the new Speech service. The Speech SDK provides consistent native Speech-to-Text and Speech Translation APIs for C#, C++, and Java. If you develop with one of these languages, the Speech SDK makes development easier by handling the network details for you.

The Speech service also has a [REST API](rest-apis.md) that works with any programming language that can make HTTP requests. The REST interface does not offer the streaming, real-time functionality of the SDK.

|<br>Method|Speech<br>to Text|Text to<br>Speech|Speech<br>Translation|<br>Description|
|-|-|-|-|-|
|[Speech SDK](speech-sdk.md)|Yes|No|Yes|Native APIs for C#, C++, and Java to simplify development.|
|[REST](rest-apis.md)|Yes|Yes|No|A simple HTTP-based API that makes it easy to add speech to your applications.|

### WebSockets

The Speech service also has WebSocket protocols for streaming Speech to Text and Speech Translation. The Speech SDKs use these protocols to communicate with the Speech service. Use the Speech SDK instead of trying to implement your own WebSocket communication with the Speech service.

If you already have code that uses Bing Speech or Translator Speech via WebSockets, you can update it to use the Speech service. The WebSocket protocols are compatible, only the endpoints are different.

### Speech Devices SDK

The [Speech Devices SDK](speech-devices-sdk.md) is an integrated hardware and software platform for developers of speech-enabled devices. Our hardware partner provides reference designs and development units. Microsoft provides a device-optimized SDK that takes full advantage of the hardware's capabilities.

## Why move to the Speech service?

The Speech service provides all the functionality and more of the Bing Speech API and three other Azure speech services: Custom Speech, Custom Voice, and Translator Speech. We encourage users of these services to migrate to the Speech service.

The Speech service incorporates many upgrades to these other services, including:

* Higher speech recognition accuracy. We regularly improve the models used in the service.

* More scalable. The service is more capable of handling multiple simultaneous requests, reducing latency.

* The Speech Service uses a time-based pricing model. See [Speech Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for details.

* The Speech Service is available in [multiple regions](regions.md) to suit the needs of customers worldwide. You need an [Azure subscription](https://docs.microsoft.com/azure/cognitive-services/welcome) for each region used by your application.

* A single Speech Service subscription key grants access to the following features. Each is metered separately, so you're charged only for the features you use.

    * [Speech-to-text](speech-to-text.md)
    * [Custom speech-to-text](https://cris.ai/CustomSpeech)
    * [Text-to-speech](text-to-speech.md)
    * [Custom text-to-speech voices](https://cris.ai/CustomVoice)
    * [Speech translation](speech-translation.md) (does not include [Text translation](https://docs.microsoft.com/azure/cognitive-services/translator/translator-info-overview))

* The Speech Service speech-to-text function integrates with the [Language Understanding Service](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS) to recognize speaker intent. A LUIS endpoint key can also be used with the Speech Service. See the [intent recognition tutorial](how-to-recognize-intents-from-speech-csharp.md) for details.

* Speech-to-text no longer requires that you specify a recognition mode.

* The Speech Service supports 24-KHz voices for text-to-speech, improving audio quality. At this writing, there are two such voices (US English only): `Jessa24kRUS` and `Guy24kRUS`.

* THe Speech Service's [batch transcription](batch-transcription.md) allows high volumes of recorded speech, such as call center recordings, to be transcribed to text efficiently, so they can be easily analyzed and searched.

* When using the Speech SDK, there is no time limit on streaming speech-to-text transcription.

* The [Speech SDK](speech-sdk.md) provides a consistent API to the Speech service across several programming languages and execution environments (including Windows 10, UWP, and .NET Core), making development easier, especially on multiple platforms.

* The Speech Service is compatible with the REST APIs and WebSockets protocol used by other Azure speech services, making it easy to migrate existing client applications to the Speech service.

## Speech scenarios

Use cases for the Speech service include:

> [!div class="checklist"]
> * Create voice-triggered apps
> * Transcribe call center recordings
> * Implement voice bots

### Voice user interface

Voice input is a great way to make your app flexible, hands-free, and quick to use. With a voice-enabled app, users can just ask for the information they want.

If your app is intended for use by the general public, you can use the default speech recognition models. They recognize a wide variety of speakers in common environments.

If your app is used in a specific domain, for example, medicine or IT, you can create a [language model](how-to-customize-language-model.md). You can use this model to teach the Speech service about the special terminology used by your app.

If your app is used in a noisy environment, such as a factory, you can create a custom [acoustic model](how-to-customize-acoustic-models.md). This model helps the Speech service to distinguish speech from noise.

Getting started is easy. Just download the [Speech SDK](speech-sdk.md) and follow the relevant [Quickstart](quickstart-csharp-dotnet-windows.md) article.

### Call center transcription

Often, call center recordings are consulted only if an issue arises with a call. With the Speech service, it's easy to transcribe every recording to text. You can easily index the text for [full-text search](https://docs.microsoft.com/azure/search/search-what-is-azure-search) or apply [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/Text-Analytics/) to detect sentiment, language, and key phrases.

If your call center recordings involve specialized terminology, such as product names or IT jargon, you can create a [language model](how-to-customize-language-model.md) to teach the Speech service the vocabulary. A custom [acoustic model](how-to-customize-acoustic-models.md) can help the Speech service understand less-than-optimal phone connections.

For more information about this scenario, read more about [batch transcription](batch-transcription.md) with the Speech service.

### Voice bots

[Bots](https://dev.botframework.com/) are a popular way to connect users with the information they want and customers with businesses they like. When you add a conversational user interface to your website or app, the functionality is easier to find and quicker to access. With the Speech service, this conversation takes on a new dimension of fluency by responding to spoken queries in kind.

To add a unique personality to your voice-enabled bot, you can give it a voice of its own. Creating a custom voice is a two-step process. First, [make recordings](record-custom-voice-samples.md) of the voice you want to use. Then [submit those recordings](how-to-customize-voice-font.md) along with a text transcript to the Speech service's [voice customization portal](https://cris.ai/Home/CustomVoice), which does the rest. After you create your custom voice, the steps to use it in your app are straightforward.

## Next steps

Get a subscription key for the Speech service.

> [!div class="nextstepaction"]
> [Try the Speech service for free](get-started.md)
