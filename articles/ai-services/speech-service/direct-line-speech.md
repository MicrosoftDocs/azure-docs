---
title: Direct Line Speech - Speech service
titleSuffix: Azure AI services
description: An overview of the features, capabilities, and restrictions for Voice assistants using Direct Line Speech with the Speech Software Development Kit (SDK).
#services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 03/11/2020
ms.author: eur
ms.custom: cogserv-non-critical-speech
---

# What is Direct Line Speech?

Direct Line Speech is a robust, end-to-end solution for creating a flexible, extensible voice assistant. It is powered by the Bot Framework and its Direct Line Speech channel, that is optimized for voice-in, voice-out interaction with bots.

[Voice assistants](voice-assistants.md) listen to users and take an action in response, often speaking back. They use [speech to text](speech-to-text.md) to transcribe the user's speech, then take action on the natural language understanding of the text. This action frequently includes spoken output from the assistant generated with [text to speech](text-to-speech.md).

Direct Line Speech offers the highest levels of customization and sophistication for voice assistants. It's designed for conversational scenarios that are open-ended, natural, or hybrids of the two with task completion or command-and-control use. This high degree of flexibility comes with a greater complexity, and scenarios that are scoped to well-defined tasks using natural language input may want to consider [Custom Commands](custom-commands.md) for a streamlined solution experience.

Direct Line Speech supports these locales: `ar-eg`, `ar-sa`, `ca-es`, `da-dk`, `de-de`, `en-au`, `en-ca`, `en-gb`, `en-in`, `en-nz`, `en-us`, `es-es`, `es-mx`, `fi-fi`, `fr-ca`, `fr-fr`, `gu-in`, `hi-in`, `hu-hu`, `it-it`, `ja-jp`, `ko-kr`, `mr-in`, `nb-no`, `nl-nl`, `pl-pl`, `pt-br`, `pt-pt`, `ru-ru`, `sv-se`, `ta-in`, `te-in`, `th-th`, `tr-tr`, `zh-cn`, `zh-hk`, and `zh-tw`.

## Getting started with Direct Line Speech

To create a voice assistant using Direct Line Speech, create a Speech resource and Azure Bot resource in the [Azure portal](https://portal.azure.com). Then [connect the bot](/azure/bot-service/bot-service-channel-connect-directlinespeech) to the Direct Line Speech channel.

   ![Conceptual diagram of the Direct Line Speech orchestration service flow](media/voice-assistants/overview-directlinespeech.png "The Speech Channel flow")

For a complete, step-by-step guide on creating a simple voice assistant using Direct Line Speech, see [the tutorial for speech-enabling your bot with the Speech SDK and the Direct Line Speech channel](tutorial-voice-enable-your-bot-speech-sdk.md).

We also offer quickstarts designed to have you running code and learning the APIs quickly. This table includes a list of voice assistant quickstarts organized by language and platform.

| Quickstart | Platform | API reference |
|------------|----------|---------------|
| C#, UWP | Windows | [Browse](/dotnet/api/microsoft.cognitiveservices.speech) |
| Java | Windows, macOS, Linux | [Browse](/java/api/com.microsoft.cognitiveservices.speech) |
| Java | Android | [Browse](/java/api/com.microsoft.cognitiveservices.speech) |

## Sample code

Sample code for creating a voice assistant is available on GitHub. These samples cover the client application for connecting to your assistant in several popular programming languages.

* [Voice assistant samples (SDK)](https://aka.ms/csspeech/samples/#voice-assistants-quickstarts)
* [Tutorial: Voice enable your assistant with the Speech SDK, C#](tutorial-voice-enable-your-bot-speech-sdk.md)

## Customization

Voice assistants built using Speech service can use the full range of customization options available for [speech to text](speech-to-text.md), [text to speech](text-to-speech.md), and [custom keyword selection](./custom-keyword-basics.md).

> [!NOTE]
> Customization options vary by language/locale (see [Supported languages](./language-support.md?tabs=stt)).

Direct Line Speech and its associated functionality for voice assistants are an ideal supplement to the [Virtual Assistant Solution and Enterprise Template](/azure/bot-service/bot-builder-enterprise-template-overview). Though Direct Line Speech can work with any compatible bot, these resources provide a reusable baseline for high-quality conversational experiences as well as common supporting skills and models to get started quickly.

## Reference docs

* [Speech SDK](./speech-sdk.md)
* [Azure AI Bot Service](/azure/bot-service/)

## Next steps

* [Get the Speech SDK](speech-sdk.md)
* [Create and deploy a basic bot](/azure/bot-service/bot-builder-tutorial-basic-deploy)
* [Get the Virtual Assistant Solution and Enterprise Template](https://github.com/Microsoft/AI)
