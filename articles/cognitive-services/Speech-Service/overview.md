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
# What is the Speech service (preview)?

With one subscription, the Speech service gives developers an easy way to add powerful speech-enabled features to their applications. Your apps can now feature voice command, transcription, dictation, speech synthesis, and speech translation.

The Speech service is powered by the technologies used in other Microsoft products, including Cortana and Microsoft Office.

> [!NOTE]
> The Speech service is currently in public preview. Return here regularly for updates to documentation, additional code samples, and more.

## Speech service features

|Function|Description|
|-|-|
|[Speech-to-text](speech-to-text.md)| Transcribes audio streams into text that your application can accept as input. Also integrates with the [Language Understanding service](https://docs.microsoft.com/azure/cognitive-services/luis/) (LUIS) to derive user intent from utterances.|
|[Text-to-speech](text-to-speech.md)| Converts plain text to natural-sounding speech, delivered to your application in an audio file. Multiple voices, varying in gender or accent, are available for many supported languages. |
|[Speech-translation](speech-translation.md)| Can be used either to translate streaming audio in near-real-time or to process recorded speech. |
|Custom speech-to-text|You can customize speech-to-text by creating your own [acoustic](how-to-customize-acoustic-models.md) and [language](how-to-customize-language-model.md) models and by specifying custom [pronunciation](how-to-customize-pronunciation.md) rules. |
|[Custom text-to-speech](how-to-customize-voice-font.md)|You can create your own voices for text-to-speech.|
|[Speech Devices SDK](speech-devices-sdk.md)| With the introduction of the unified Speech service, Microsoft and its partners offer an integrated hardware/software platform optimized for developing speech-enabled devices |

## Access to the Speech service

The Speech service is made available in two ways. [The SDK](speech-sdk.md) abstracts away the details of the network protocols for easier development on supported platforms. The [REST API](rest-apis.md) works with any programming language, but does not offer all the functions offered by the SDK.

|<br>Method|Speech<br>to Text|Text to<br>Speech|Speech<br>Translation|<br>Description|
|-|-|-|-|-|
|[SDKs](speech-sdk.md)|Yes|No|Yes|Libraries for specific programming languages, utilize Websocket-based procotol that simplify development.|
|[REST](rest-apis.md)|Yes|Yes|No|A simple HTTP-based API that makes it easy to add speech to your application.|

## Speech scenarios

A few common uses of speech technology are discussed briefly below. The [Speech SDK](speech-sdk.md) is central to most of these scenarios.

> [!div class="checklist"]
> * Create voice-triggered apps
> * Transcribe call center recordings
> * Implement voice bots

### Voice-triggered apps

Voice input is a great way to make your app flexible, hands-free, and quick to use. In a voice-enabled app, users can just ask for the information they want rather than needing to navigate to it by clicking or tapping.

If your app is intended for use by the general public, you can use the baseline speech recognition model provided by the Speech service. It does a good job of recognizing a wide variety of speakers in typical environments.

If your app will be used in a specific domain (for example, medicine or IT), you can create a [language model](how-to-customize-language-model.md) to teach the Speech service about the special terminology used by your app.

If your app will be used in a noisy environment, such as a factory, you can create a custom  [acoustic model](how-to-customize-acoustic-models.md) to better allow the Speech service to distinguish speech from noise.

Getting started is as easy as downloading the [Speech SDK](speech-sdk.md) and following a relevant [Quickstart](quickstart-csharp-dotnet-windows.md) article.

### Transcribe call center recordings

Often, call center recordings are only consulted if an issue arises with a call. With the Speech service, it's easy to transcribe every recording to text. Once they're text, you can easily index them for [full-text search](https://docs.microsoft.com/azure/search/search-what-is-azure-search) or apply [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/Text-Analytics/) to detect sentiment, language, and key phrases.

If your call center recordings often contain specialized terminology (such as product names or IT jargon), you can create a [language model](how-to-customize-language-model.md) to teach the Speech service that vocabulary. A custom [acoustic model](how-to-customize-acoustic-models.md) can help the Speech service understand less-than-optimal phone connections.

For more information about this scenario, read more about [batch transcription](batch-transcription.md) with the Speech service.

### Voice bots

[Bots](https://dev.botframework.com/) are an increasingly popular way of connecting users with the information they want, and customers with the businesses they love. Adding a conversational user interface to your Web site or app makes its functionality easier to find and quicker to access. With the Speech service, this conversation takes on a new dimension of fluency by actually responding to spoken queries with synthesized speech.

To add a unique personality to your voice-enabled bot (and strengthen your brand), you can give it a voice of its own. Creating a custom voice is a two-step process. First, you [make recordings](record-custom-voice-samples.md) of the voice you want to use. Then you [submit those recordings](how-to-customize-voice-font.md) (along with a text transcript) to the Speech service's [voice customization portal](https://cris.ai/Home/CustomVoice), which does the rest. Once you've created your custom voice, it's straightforward to use it in your app.

## Next steps

Get a subscription key for the Speech service.

> [!div class="nextstepaction"]
> [Try the Speech service for free](get-started.md)
