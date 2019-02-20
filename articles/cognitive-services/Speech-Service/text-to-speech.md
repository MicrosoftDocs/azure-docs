---
title: Speech synthesis with Azure Speech Services
titleSuffix: Azure Cognitive Services
description: Speech synthesis from Azure Speech Services is a REST-based service that enables your applications, tools, or devices to convert text into natural human-like speech. Speech synthesis is available in 75 languages and more than 45 languages and locales. Choose from standard from standard and neural voices, or create your own custom voice unique to your product or brand. 
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/29/2019
ms.author: erhopf
ms.custom: seodec18
---

# What is speech synthesis?

Speech synthesis from Azure Speech Services is a REST-based service that enables your applications, tools, or devices to convert text into natural human-like speech. Speech synthesis is available in 75 languages and more than 45 languages and locales. Choose from standard from standard and neural voices, or create your own custom voice unique to your product or brand. For a full list of languages, locales, and voices, see [supported languages](language-support.md#text-to-speech).

Text-to-speech technology allows content creators interact with their users in different ways. Speech synthesis can improve accessibility by providing users with an option to interact with content audibly. Whether the user has a visual impairment, a learning disability, or requires navigation information while driving, text-to-speech can improve an existing experience. Speech synthesis is also a valuable add-on for voice bots and virtual assistants.

### Neural voices

Neural voices can be used to make interactions with chatbots and virtual assistants more natural and engaging, convert digital texts such as e-books into audiobooks and enhance in-car navigation systems. With the human-like natural prosody and clear articulation of words, Neural voices significantly reduce listening fatigue when you interact with AI systems. For more information about neural voices, see [supported languages](language-support.md#text-to-speech).

### Custom voice fonts

Voice customization lets you to create a recognizable, one-of-a-kind voice for your brand: a *voice font.* To create your voice font, you make a studio recording and upload the associated scripts as the training data. The service then creates a unique voice model tuned to your recording. You can use his voice font to synthesize speech. For more information, see [custom voice fonts](how-to-customize-voice-font.md).

## Core features

This is a list of core features for speech synthesis:

| Use case | SDK | REST |
|----------|-----|------|
| Convert text to speech. | No | Yes |
| Upload datasets for voice adaptation. | No | Yes\* |
| Create and manage voice font models. | No | Yes\* |
| Create and manage voice font deployments. | No | Yes\* |
| Create and manage voice font tests. | No | Yes\* |
| Manage subscriptions. | No | Yes\* |

\* *These services are available using the cris.ai endpoint. See [Swagger reference](https://westus.cris.ai/swagger/ui/index).*

> [!NOTE]
> The text-to-speech endpoint implements throttling that limits requests to 25 per 5 seconds. When throttling occurs, you'll be notified via message headers.

## Get started with speech recognition

We offer quickstarts designed to have you running code in less than 10 minutes. This table includes a list of speech synthesis quickstarts organized by language.

| Quickstart | Platform | API reference |
|------------|----------|---------------|
| [C#, .NET Core](quickstart-csharp-dotnetcore-windows.md) | Windows, macOS, Linux | [Browse](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#text-to-speech-api) |
| [Node.js](quickstart-nodejs-text-to-speech.md) | Window, macOS, Linux | [Browse](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#text-to-speech-api) |
| [Python](quickstart-python-text-to-speech.md) | Window, macOS, Linux | [Browse](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#text-to-speech-api) |

## Sample code

Sample code for speech synthesis is available on GitHub. These samples cover text-to-speech conversion in most popular programming languages.

* [Speech synthesis samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)

## Next steps

* [Get a free Speech Services subscription](get-started.md)
* [REST API reference](rest-apis.md)
