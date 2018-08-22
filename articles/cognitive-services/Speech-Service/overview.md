---
title: What is the Speech service (preview)?
description: "The Speech service, part of Microsoft's Cognitive Services, unites several Azure speech services that were previously available separately: Bing Speech (comprising speech recognition and text to speech), Custom Speech, and Speech Translation."
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: v-jerkin
---
# What is the Speech service?

The Speech service provides a powerful collection of related speech features in the Microsoft Azure cloud. These features were previously available via the [Bing Speech API](https://docs.microsoft.com/azure/cognitive-services/speech/home), [Translator Speech](https://docs.microsoft.com/azure/cognitive-services/translator-speech/), [Custom Speech](https://docs.microsoft.com/azure/cognitive-services/custom-speech-service/cognitive-services-custom-speech-home), and [Custom Voice](http://customvoice.ai/) services. Now, one subscription gets you access to all of these Azure speech features.

To simplify the development of speech-enabled applications, Microsoft created a unified [Speech SDK](speech-sdk.md) for use with the new Speech service. The SDK provides consistent native speech-to-text and speech translation APIs for C#, C++, and Java. If you're using one of these programming languages, the Speech SDK makes development easier by handling the network details for you.

Microsoft also offers a [Speech Devices SDK](speech-devices-sdk.md), an integrated hardware/software platform for developers of speech-enabled devices. Our hardware partner provides reference designs and development units, while we provide a device-optimized SDK for the best possible results.

Like the other Azure speech services, the Speech service is powered by the proven speech technologies used in products like Cortana and Microsoft Office. You can count on the quality of the results and the reliability of the Azure cloud.

> [!NOTE]
> The Speech service is currently in public preview. Return here regularly for documentation updates, new code samples, and more.

## Speech service functions

The primary functions of the Speech service are speech-to-text (also called speech recognition or transcription), text-to-speech (speech synthesis), and speech translation.

|Function|Features|
|-|-|
|[Speech-to-text](speech-to-text.md)| <ul><li>Transcribes continuous real-time speech into text.<li>Can batch-transcribe speech from audio recordings. <li>Offers recognition modes for interactive, conversation, and dictation use cases.<li>Supports intermediate results, end-of-speech detection, automatic text formatting, and profanity masking. <li>Can call on [Language Understanding](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS) to derive user intent from transcribed speech.\*|
|[Text-to-speech](text-to-speech.md)| <ul><li>Converts text to natural-sounding speech. <li>Offers Multiple genders and/or dialects for many supported languages. <li>Supports plain text input or Speech Synthesis Markup Language (SSML). |
|[Speech translation](speech-translation.md)| <ul><li>Translates streaming audio in near-real-time<li> Can also process recorded speech<li>Provides results as text or synthesized speech. |

\* *Intent recognition requires a LUIS subscription.*


## Customizing Speech functions

The Speech service lets you use your own data to train the models underlying both speech-to-text and text-to-speech. For speech-to-text, you can train three different models.

|Speech-to-text model|Purpose|
|-|-|
|[Acoustic model](how-to-customize-acoustic-models.md)|Helps transcribe particular speakers and environments (such as cars or factories)|
|[Language model](how-to-customize-language-model.md)|Helps transcribe field-specific vocabulary and grammar (such as medical or IT jargon)|
|[Pronunciation model](how-to-customize-pronunciation.md)|Helps transcribe abbreviations and acronyms (such as "IOU" for "i oh you") |

For text-to-speech, you can train the voice to sound like a different person.

|Text-to-speech model|Purpose|
|-|-|
|[Voice font](how-to-customize-voice-font.md)|Gives your app a voice of its own by training the model on samples of human speech.|

Once created, your custom models can be used anywhere you'd use the standard models in your app's speech-to-text or text-to-speech functionality.


## Using the Speech service in your applications

There are two ways for applications to use the Speech service. If you're using a supported programming language, the [Speech SDK](speech-sdk.md) makes development easier. The [REST API](rest-apis.md) works with any programming language, but does not offer all the functions offered by the SDK.

|<br>Method|Speech<br>to Text|Text to<br>Speech|Speech<br>Translation|<br>Description|
|-|-|-|-|-|
|[Speech SDK](speech-sdk.md)|Yes|No|Yes|Native APIs for C#, C++, and Java to simplify development.|
|[REST](rest-apis.md)|Yes|Yes|No|A simple HTTP-based API that makes it easy to add speech to your applications.|

The Speech service provides WebSockets protocols for streaming speech-to-text and text translation. These protocols are used by the SDKs. We encourage you to use the SDK rather than trying to implement a WebSockets protocol yourself.


## Migrating to the Speech service

The older Azure speech services will be deprecated and eventually discontinued. New features will be added to the unified Speech service rather than to deprecated services. In fact, the Speech service already has features that its predecessors do not.

At some point, then, developers using these older APIs must migrate their applications to the Speech service.

It's straightforward to migrate. The Speech service's network endpoints are different, and you need a new subscription key. Otherwise, the Speech Service's REST and WebSockets APIs are compatible with the older services' APIs. Your existing code should need only minor modifications to work with the Speech service.

As you continue development on your application, you might opt to switch to the Speech SDK to simplify your code and make maintenance easier.


## Speech scenarios

A few example use cases for the Speech service are discussed briefly below.

> [!div class="checklist"]
> * Create voice-triggered apps
> * Transcribe call center recordings
> * Implement voice bots

### Voice-triggered apps

Voice input is a great way to make your app flexible, hands-free, and quick to use. In a voice-enabled app, users can just ask for the information they want rather than needing to navigate to it.

If your app is intended for use by the general public, you can use the default speech recognition models. They do a good job of recognizing a wide variety of speakers in typical environments.

If your app will be used in a specific domain (for example, medicine or IT), you can create a [language model](how-to-customize-language-model.md) to teach the Speech service about the special terminology used by your app.

If your app will be used in a noisy environment, such as a factory, you can create a custom  [acoustic model](how-to-customize-acoustic-models.md) to better allow the Speech service to distinguish speech from noise.

Getting started is as easy as downloading the [Speech SDK](speech-sdk.md) and following a relevant [Quickstart](quickstart-csharp-dotnet-windows.md) article.

### Transcribe call center recordings

Often, call center recordings are only consulted if an issue arises with a call. With the Speech service, it's easy to transcribe every recording to text. Once they're text, you can easily index them for [full-text search](https://docs.microsoft.com/azure/search/search-what-is-azure-search) or apply [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/Text-Analytics/) to detect sentiment, language, and key phrases.

If your call center recordings revolve around specialized terminology (such as product names or IT jargon), you can create a [language model](how-to-customize-language-model.md) to teach the Speech service that vocabulary. A custom [acoustic model](how-to-customize-acoustic-models.md) can help the Speech service understand less-than-optimal phone connections.

For more information about this scenario, read more about [batch transcription](batch-transcription.md) with the Speech service.

### Voice bots

[Bots](https://dev.botframework.com/) are an increasingly popular way of connecting users with the information they want, and customers with the businesses they love. Adding a conversational user interface to your Web site or app makes its functionality easier to find and quicker to access. With the Speech service, this conversation takes on a new dimension of fluency by responding to spoken queries in kind.

To add a unique personality to your voice-enabled bot (and strengthen your brand), you can give it a voice of its own. Creating a custom voice is a two-step process. First, you [make recordings](record-custom-voice-samples.md) of the voice you want to use. Then you [submit those recordings](how-to-customize-voice-font.md) (along with a text transcript) to the Speech service's [voice customization portal](https://cris.ai/Home/CustomVoice), which does the rest. Once you've created your custom voice, it's straightforward to use it in your app.

## Next steps

Get a subscription key for the Speech service.

> [!div class="nextstepaction"]
> [Try the Speech service for free](get-started.md)
