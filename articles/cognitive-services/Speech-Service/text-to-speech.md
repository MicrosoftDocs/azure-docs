---
title: About text-to-speech - Speech Service
titleSuffix: Azure Cognitive Services
description: The Text-to-Speech API offers more than 75 voices in more than 45 languages and locales. To use standard voice fonts, you only need to specify the voice name with a few other parameters when you call the Speech Service.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: speech-service
ms.topic: conceptual
ms.date: 12/13/2018
ms.author: erhopf
ms.custom: seodec18
---

# About the text-to-speech API

The **text-to-speech** (TTS) API converts input text into natural-sounding speech (also called *speech synthesis*).

To generate speech, your application sends HTTP POST requests to the text-to-speech API. There, text is synthesized into human-sounding speech and returned as an audio file. A variety of voices and languages are supported.

Scenarios in which speech synthesis is being adopted include:

* *Improving accessibility:* **text-to-speech** technology enables content owners and publishers to respond to the different ways people interact with their content. People with visual impairment or reading difficulties appreciate being able to consume content aurally. Voice output also makes it easier for people to enjoy textual content, such as newspapers or blogs, on mobile devices while commuting or exercising.

* *Responding in multitasking scenarios:* **text-to-speech** enables people to absorb important information quickly and comfortably while driving or otherwise outside a convenient reading environment. Navigation is a common application in this area.

* *Enhancing learning with multiple modes:* Different people learn best in different ways. Online learning experts have shown that providing voice and text together can help make information easier to learn and retain.

* *Delivering intuitive bots or assistants:* The ability to talk can be an integral part of an intelligent chat bot or a virtual assistant. More and more companies are developing chat bots to provide engaging customer service experiences for their customers. Voice adds another dimension by allowing the bot's responses to be received aurally (for example, by phone).

## Voice support

The Microsoft **Text-to-Speech** service offers more than 75 voices in more than 45 languages and locales. To use these standard "voice fonts", you only need to specify the voice name with a few other parameters when you call the service's REST API. For more information about supported languages, locales, and voices, see [supported languages](language-support.md#text-to-speech).

### Neural voices

Neural text-to-speech can be used to make interactions with chatbots and virtual assistants more natural and engaging, convert digital texts such as e-books into audiobooks and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, Neural TTS has significantly reduced listening fatigue when you interact with AI systems. For more information about neural voices, see [supported languages](language-support.md#text-to-speech).

### Custom voices

Text-to-speech voice customization enables you to create a recognizable, one-of-a-kind voice for your brand: a *voice font.* To create your voice font, you make a studio recording and upload the associated scripts as the training data. The service then creates a unique voice model tuned to your recording. You can use his voice font to synthesize speech. For more information, see [custom voice fonts](how-to-customize-voice-font.md).

## API capabilities

A lot of the capabilities of the **text-to-speech** API, especially around customization, are available via REST. The following table summarizes the capabilities of each method of accessing the API. For a full list of capabilities and API details, see [Swagger reference](https://westus.cris.ai/swagger/ui/index).

| Use case | REST | SDKs |
|-----|-----|-----|----|
| Upload datasets for voice adaptation | Yes | No |
| Create & manage voice font models | Yes | No |
| Create & manage voice font deployments | Yes | No |
| Create & manage voice font tests| Yes | No |
| Manage Subscriptions | Yes | No |

> [!NOTE]
> The API implements throttling that limits the API requests to 25 per 5 seconds. Message headers will inform of the limits.

## Next steps

* [Get a free Speech Services subscription](https://azure.microsoft.com/try/cognitive-services/)
* [Quickstart: Convert text-to-speech, Python](quickstart-python-text-to-speech.md)
* [Quickstart: Convert text-to-speech, .NET Core](quickstart-dotnet-text-to-speech.md)
* [REST API reference](rest-apis.md)
