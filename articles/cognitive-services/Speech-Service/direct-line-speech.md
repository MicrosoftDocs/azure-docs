---
title: Direct Line Speech - Speech Service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for Voice Assistants using Direct Line Speech with the Speech Software Development Kit (SDK).
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/05/2019
ms.author: travisw
---

# About Direct Line Speech

## When to use Direct Line Speech

[Voice Assistants](voice-assistants.md) process transcribed text from Speech Service [speech-to-text](speech-to-text.md), take action on the natural language input from the user, and then respond, often with spoken output from [text-to-speech](text-to-speech.md). These assistants are then connected to from a device using the Speech SDK’s `DialogServiceConnector` object.

**Direct Line Speech** is a robust, end-to-end solution for creating a flexible, extensible Voice Assistant, powered by the Bot Framework and its Direct Line Speech channel, that is optimized for voice-in, voice-out interaction with bots.

Direct Line Speech offers the highest levels of customization and sophistication for Voice Assistants. It is well-suited to conversational scenarios that’re open-ended, natural, or hybrids of these with task completion or command-and-control use. This high degree of flexibility comes with a greater complexity, and scenarios that are scoped to well-defined tasks using natural language input may want to consider [Custom Commands Preview](custom-commands.md) for a streamlined solution experience.

## Getting started with Direct Line Speech

The first steps for creating a Voice Assistant using Direct Line Speech are to get a speech subscription key, create a new bot associated with that subscription, and connect the bot to the Direct Line Speech Channel. 

   ![Conceptual diagram of the direct line speech orchestration service flow](media/voice-assistants/overview-dls.png "The Speech Channel flow")

For a complete, step-by-step guide on creating a simple Voice Assistant using Direct Line Speech, please see [the tutorial for speech-enabling your bot with the Speech SDK and the Direct Line Speech channel](tutorial-voice-enable-your-bot-speech-sdk.md).

We also offer Quickstarts designed to have you running code in less than 10 minutes. This table includes a list of Voice Assistant Quickstarts organized by language.

| Quickstart | Platform | API reference |
|------------|----------|---------------|
| C#, UWP | Windows | [Browse](https://aka.ms/csspeech/csharpref) |
| Java | Windows, macOS, Linux | [Browse](https://aka.ms/csspeech/javaref) |
| Java | Android | [Browse](https://aka.ms/csspeech/javaref) |

## Sample Code

Sample code for creating a Voice Assistant is available on GitHub. These samples cover the client application for connecting to your assistant in several popular programming languages.

* [Voice Assistant samples (SDK)](https://aka.ms/csspeech/samples)
* [Tutorial: Voice enable your assistant with the Speech SDK, C#](tutorial-voice-enable-your-bot-speech-sdk.md)

## Customization

Voice Assistants built using Azure Speech Services can use the full range of customization options available for [speech-to-text](speech-to-text.md), [text-to-speech](text-to-speech.md), and [custom keyword selection](speech-devices-sdk-create-kws.md).

> [!NOTE]
> Customization options vary by language/locale (see [Supported languages](supported-languages.md)).

Direct Line Speech and its associated functionality for Voice Assistants are an ideal supplement to the [Virtual Assistant Solution and Enterprise Template](https://docs.microsoft.com/azure/bot-service/bot-builder-enterprise-template-overview). Though Direct Line Speech can work with any compatible bot, these resources provide a reusable baseline for high-quality conversational experiences as well as common supporting skills and models for getting started quickly.

## Reference Docs

* [Speech SDK](speech-sdk-reference.md)
* [Azure Bot Service](https://docs.microsoft.com/azure/bot-service/?view=azure-bot-service-4.0)

## Next Steps

* [Get a Speech Services subscription key for free](get-started.md)
* [Get the Speech SDK](speech-sdk.md)
* [Create and deploy a basic bot](https://docs.microsoft.com/azure/bot-service/bot-builder-tutorial-basic-deploy?view=azure-bot-service-4.0)
* [Get the Virtual Assistant Solution and Enterprise Template](https://github.com/Microsoft/AI)
