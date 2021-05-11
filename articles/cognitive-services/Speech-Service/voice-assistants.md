---
title: Voice assistants - Speech service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for voice assistants using the Speech Software Development Kit (SDK).
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: travisw
---

# What is a voice assistant?

Voice assistants using the Speech service empowers developers to create natural, human-like conversational interfaces for their applications and experiences.

The voice assistant service provides fast, reliable interaction between a device and an assistant implementation that uses either (1) [Direct Line Speech](direct-line-speech.md) (via Azure Bot Service) for adding voice capabilities to your bots, or, (2) Custom Commands for voice commanding scenarios.

## Choosing an assistant solution

The first step to creating a voice assistant is to decide what it should do. The Speech service provides multiple, complementary solutions for crafting your assistant interactions. You can add voice in and voice out capabilities to your flexible and versatile bot built using Azure Bot Service with the [Direct Line Speech](direct-line-speech.md) channel, or leverage the simplicity of authoring a [Custom Commands](custom-commands.md) app for straightforward voice commanding scenarios.

| If you want... | Then consider... | For example... |
|-------------------|------------------|----------------|
|Open-ended conversation with robust skills integration and full deployment control | Azure Bot Service bot with [Direct Line Speech](direct-line-speech.md) channel | <ul><li>"I need to go to Seattle"</li><li>"What kind of pizza can I order?"</li></ul>
|Voice commanding or simple task-oriented conversations with simplified authoring and hosting | [Custom Commands](custom-commands.md) | <ul><li>"Turn on the overhead light"</li><li>"Make it 5 degrees warmer"</li><li>Other samples [available here](https://speech.microsoft.com/customcommands)</li></ul>

We recommend [Direct Line Speech](direct-line-speech.md) as the best default choice if you aren't yet sure what you'd like your assistant to handle. It offers integration with a rich set of tools and authoring aids such as the [Virtual Assistant Solution and Enterprise Template](/azure/bot-service/bot-builder-enterprise-template-overview) and the [QnA Maker service](../qnamaker/overview/overview.md) to build on common patterns and use your existing knowledge sources.

[Custom Commands](custom-commands.md) makes it easy to build rich voice commanding apps optimized for voice-first interaction experiences. It provides a unified authoring experience, an automatic hosting model, and relatively lower complexity, helping you focus on building the best solution for your voice commanding scenarios.

   ![Comparison of assistant solutions](media/voice-assistants/assistant-solution-comparison.png "Comparison of assistant solutions")


## Reference Architecture for building a voice assistant using the Speech SDK

   ![Conceptual diagram of the voice assistant orchestration service flow](media/voice-assistants/overview.png "The voice assistant flow")

## Core features

Whether you choose [Direct Line Speech](direct-line-speech.md) or [Custom Commands](custom-commands.md) to create your assistant interactions, you can use a rich set of customization features to customize your assistant to your brand, product, and personality.

| Category | Features |
|----------|----------|
|[Custom keyword](./custom-keyword-basics.md) | Users can start conversations with assistants with a custom keyword like "Hey Contoso." An app does this with a custom keyword engine in the Speech SDK, which can be configured with a custom keyword [that you can generate here](./custom-keyword-basics.md). Voice assistants can use service-side keyword verification to improve the accuracy of the keyword activation (versus the device alone).
|[Speech to text](speech-to-text.md) | Voice assistants convert real-time audio into recognized text using [Speech-to-text](speech-to-text.md) from the Speech service. This text is available, as it's transcribed, to both your assistant implementation and your client application.
|[Text to speech](text-to-speech.md) | Textual responses from your assistant are synthesized using [Text-to-speech](text-to-speech.md) from the Speech service. This synthesis is then made available to your client application as an audio stream. Microsoft offers the ability to build your own custom, high-quality Neural TTS voice that gives a voice to your brand. To learn more, [contact us](mailto:mstts@microsoft.com).

## Getting started with voice assistants

We offer quickstarts designed to have you running code in less than 10 minutes. This table includes a list of voice assistant quickstarts, organized by language.

* [Quickstart: Create a custom voice assistant using Direct Line Speech](quickstarts/voice-assistants.md)
* [Quickstart: Build a voice commanding app using Custom Commands](quickstart-custom-commands-application.md)

## Sample code and Tutorials

Sample code for creating a voice assistant is available on GitHub. These samples cover the client application for connecting to your assistant in several popular programming languages.

* [Voice assistant samples on GitHub](https://github.com/Azure-Samples/Cognitive-Services-Voice-Assistant)
* [Tutorial: Voice enable your assistant built using Azure Bot Service with the C# Speech SDK](tutorial-voice-enable-your-bot-speech-sdk.md)
* [Tutorial: Create a Custom Commands application with simple voice commands](./how-to-develop-custom-commands-application.md)

## Customization

Voice assistants built using Azure Speech services can use the full range of customization options.

* [Custom Speech](./custom-speech-overview.md)
* [Custom Voice](how-to-custom-voice.md)
* [Custom Keyword](keyword-recognition-overview.md)

> [!NOTE]
> Customization options vary by language/locale (see [Supported languages](language-support.md)).

## Next steps

* [Get a Speech service subscription key for free](overview.md#try-the-speech-service-for-free)
* [Learn more about Custom Commands](custom-commands.md)
* [Learn more about Direct Line Speech](direct-line-speech.md)
* [Get the Speech SDK](speech-sdk.md)