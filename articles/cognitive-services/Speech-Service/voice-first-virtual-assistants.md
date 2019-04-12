---
title: Custom voice-first virtual assistants with Azure Speech Services (Preview)
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for custom voice-first virtual assistants using the Direct Line Speech channel on the Bot Framework and the Cognitive Services Speech SDK.
services: cognitive-services
author: trrwilson
manager: 
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: travisw
ms.custom: 
---

# About Custom Voice-First Virtual Assistants (Preview)

 Custom virtual assistants that use Azure Speech Services empower developers to create natural, human-like conversational interfaces for their applications and experiences. The Bot Framework's Direct Line Speech channel enhances these capabilities by providing a coordinated, orchestrated entry point to a compatible bot that enables voice in, voice out interaction with low latency and high reliability.

   ![Conceptual diagram of the direct line speech orchestration service flow](media/voice-first-virtual-assistants/overview.png "The Speech Channel flow")

## Core features

| Category | Features |
|----------|----------|
|Keyword activation | Direct Line Speech includes both on-device and cloud-based wake word verification. This allows users to begin conversations with bots using a custom keyword like "Hey Cortana." For more information on choosing and creating a wake word, see the [custom wake word page](speech-devices-sdk-create-kws.md).
|[Speech to text](speech-to-text.md) | The Direct Line Speech channel includes real-time transcription of audio into recognized text using [Speech-to-text](speech-to-text.md) from Azure Speech Services. This text is available to both your bot and your client application as it is transcribed.
|[Text to speech](text-to-speech.md) | Textual responses from your bot will be synthesized using [Text-to-speech](text-to-speech.md) from Azure Speech Services. This will then be made available to your client application as an audio stream.
|Direct Line Speech | As a channel within the Bot Framework, Direct Line Speech enables a smooth and seamless connection between your client application, a compatible bot, and the capabilities of Azure Speech Services. For more information on configuring your bot to use the Direct Line Speech channel, see [its page in the Bot Framework documentation](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-directlinespeech.md).

## Sample code

Sample code for creating a voice-first virtual assistant is available on GitHub. These samples cover the client application for connecting to your bot in several popular programming languages.

* [Voice-first virtual assistant samples (SDK)](https://aka.ms/csspeech/samples)

## Customization

Voice-first virtual assistants built using Azure Speech Services can use the full range of customization options available for [speech-to-text](speech-to-text.md), [text-to-speech](text-to-speech.md), and [custom keyword selection](speech-devices-sdk-create-kws.md).

> [!NOTE]
> Customization options vary by language/locale (see [Supported languages](supported-languages.md)).

## Reference docs

* [Speech SDK](speech-sdk-reference.md)
* [Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0)

## Next steps

* [Get a Speech Services subscription key for free](get-started.md)
* [Get the Speech SDK](speech-sdk.md)
* [Create and deploy a basic bot](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-tutorial-basic-deploy?view=azure-bot-service-4.0)
