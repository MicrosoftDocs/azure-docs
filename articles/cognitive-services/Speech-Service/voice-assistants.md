---
title: Voice assistants overview - Speech service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for voice assistants with the Speech SDK.
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 03/11/2020
ms.author: travisw
ms.custom: cogserv-non-critical-speech
---

# What is a voice assistant?

By using voice assistants with the Speech service, developers can create natural, human-like, conversational interfaces for their applications and experiences.

The voice assistant service provides fast, reliable interaction between a device and an assistant implementation that uses either [Direct Line Speech](direct-line-speech.md) (via Azure Bot Service) for adding voice capabilities to your bots or Custom Commands for voice-command scenarios.

## Choose an assistant solution

The first step in creating a voice assistant is to decide what you want it to do. Speech service provides multiple, complementary solutions for crafting assistant interactions. For flexibility and versatility, you can add voice in and voice out capabilities to a bot by using Azure Bot Service with the [Direct Line Speech](direct-line-speech.md) channel, or you can simply author a [Custom Commands](custom-commands.md) app for more straightforward voice-command scenarios.

| If you want... | Consider using... | Examples |
|-------------------|------------------|----------------|
|Open-ended conversation with robust skills integration and full deployment control | Azure Bot Service bot with [Direct Line Speech](direct-line-speech.md) channel | <ul><li>"I need to go to Seattle"</li><li>"What kind of pizza can I order?"</li></ul>
|Voice-command or simple task-oriented conversations with simplified authoring and hosting | [Custom Commands](custom-commands.md) | <ul><li>"Turn on the overhead light"</li><li>"Make it 5 degrees warmer"</li><li>More examples at [Speech Studio](https://aka.ms/speechstudio/customcommands)</li></ul>

If you aren't yet sure what you want your assistant to do, we recommend [Direct Line Speech](direct-line-speech.md) as the best option. It offers integration with a rich set of tools and authoring aids, such as the [Virtual Assistant solution and enterprise template](/azure/bot-service/bot-builder-enterprise-template-overview) and the [QnA Maker service](../qnamaker/overview/overview.md), to build on common patterns and use your existing knowledge sources.

If you want to keep it simpler for now, [Custom Commands](custom-commands.md) makes it easy to build rich, voice-command apps that are optimized for voice-first interaction. Custom Commands provides a unified authoring experience, an automatic hosting model, and relatively lower complexity, all of which can help you focus on building the best solution for your voice-command scenario.

   ![Screenshot of a graph comparing the relative complexity and flexibility of the two voice assistant solutions.](media/voice-assistants/assistant-solution-comparison.png)

## Reference architecture for building a voice assistant by using the Speech SDK

   ![Conceptual diagram of the voice assistant orchestration service flow.](media/voice-assistants/overview.png)

## Core features

Whether you choose [Direct Line Speech](direct-line-speech.md) or [Custom Commands](custom-commands.md) to create your assistant interactions, you can use a rich set of customization features to customize your assistant to your brand, product, and personality.

| Category | Features |
|----------|----------|
|[Custom keyword](./custom-keyword-basics.md) | Users can start conversations with assistants by using a custom keyword such as "Hey Contoso." An app does this with a custom keyword engine in the Speech SDK, which you can configure by going to [Get started with custom keywords](./custom-keyword-basics.md). Voice assistants can use service-side keyword verification to improve the accuracy of the keyword activation (versus using the device alone).
|[Speech-to-text](speech-to-text.md) | Voice assistants convert real-time audio into recognized text by using [speech-to-text](speech-to-text.md) from the Speech service. This text is available, as it's transcribed, to both your assistant implementation and your client application.
|[Text-to-speech](text-to-speech.md) | Textual responses from your assistant are synthesized through [text-to-speech](text-to-speech.md) from the Speech service. This synthesis is then made available to your client application as an audio stream. Microsoft offers the ability to build your own custom, high-quality Neural Text to Speech (Neural TTS) voice that gives a voice to your brand. To learn more, [contact us](mailto:mstts@microsoft.com).

## Get started with voice assistants

We offer the following quickstart articles, organized by programming language, that are designed to have you running code in less than 10 minutes:

* [Quickstart: Create a custom voice assistant by using Direct Line Speech](quickstarts/voice-assistants.md)
* [Quickstart: Build a voice-command app by using Custom Commands](quickstart-custom-commands-application.md)

## Sample code and tutorials

Sample code for creating a voice assistant is available on GitHub. The samples cover the client application for connecting to your assistant in several popular programming languages.

* [Voice assistant samples on GitHub](https://github.com/Azure-Samples/Cognitive-Services-Voice-Assistant)
* [Tutorial: Voice-enable an assistant that's built by using Azure Bot Service with the C# Speech SDK](tutorial-voice-enable-your-bot-speech-sdk.md)
* [Tutorial: Create a Custom Commands application with simple voice commands](./how-to-develop-custom-commands-application.md)

## Customization

Voice assistants that you build by using Speech service can use a full range of customization options.

* [Custom Speech](./custom-speech-overview.md)
* [Custom Voice](how-to-custom-voice.md)
* [Custom Keyword](keyword-recognition-overview.md)

> [!NOTE]
> Customization options vary by language and locale. To learn more, see [Supported languages](language-support.md).

## Next steps

* [Learn more about Custom Commands](custom-commands.md)
* [Learn more about Direct Line Speech](direct-line-speech.md)
* [Get the Speech SDK](speech-sdk.md)
