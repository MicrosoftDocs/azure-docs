---
title: Custom Commands (Preview) - Speech Service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for Custom Commands (Preview), a solution for creating voice assistants.
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/05/2019
ms.author: travisw
---

# Custom Commands (Preview)

[Voice assistants](voice-assistants.md) listen to users and take an action in response, often speaking back. They use [speech-to-text](speech-to-text.md) to transcribe the user's speech, then take action on the natural language understanding of the text. This action frequently includes spoken output from the assistant generated with [text-to-speech](text-to-speech.md). Devices connect to assistants with the Speech SDK’s `DialogServiceConnector` object.

**Custom Commands (Preview)** is a streamlined solution for creating a voice assistant. It provides a unified authoring experience, an automatic hosting model, and relatively lower complexity versus other assistant creation options like [Direct Line Speech](direct-line-speech.md). This simplification, however, comes with a reduction in flexibility. So, Custom Commands (Preview) is best suited for task completion or command-and-control scenarios.

For complex conversational interaction and integration with other solutions like the [Virtual Assistant Solution and Enterprise Template](https://docs.microsoft.com/azure/bot-service/bot-builder-enterprise-template-overview) you're encouraged to use Direct Line Speech.

Good candidates for Custom Commands (Preview) have a fixed vocabulary with well-defined sets of variables. For example, home automation tasks, like controlling a thermostat, are ideal.

   ![Examples of task completion scenarios](media/voice-assistants/task-completion-examples.png "task completion examples")

## Getting started with Custom Commands (Preview)

The first step for using Custom Commands (Preview) to make a voice assistant is to [get a speech subscription key](get-started.md) and access the Custom Commands (Preview) Builder on the [Speech Studio](https://speech.microsoft.com). From there, you can author a new Custom Commands (Preview) Application and publish it, after which an on-device application can communicate with it using the Speech SDK.

   ![Authoring flow for Custom Commands (Preview)](media/voice-assistants/custom-commands-flow.png "The Custom Commands (Preview) authoring flow")

We offer quickstarts designed to have you running code in less than 10 minutes.

* [Create a Custom Commands (Preview) application](quickstart-custom-speech-commands-create-new.md)
* [Create a Custom Commands (Preview) application with parameters](quickstart-custom-speech-commands-create-parameters.md)
* [Connect to a Custom Commands (Preview) application with the Speech SDK, C#](quickstart-custom-speech-commands-speech-sdk.md)

## Sample code

Sample code for creating a voice assistant with Custom Commands (Preview) is available on GitHub.

* [Voice assistant samples (SDK)](https://aka.ms/csspeech/samples)

## Customization

Voice assistants built using Azure Speech Services can use the full range of customization options available for [speech-to-text](speech-to-text.md), [text-to-speech](text-to-speech.md), and [custom keyword selection](speech-devices-sdk-create-kws.md).

> [!NOTE]
> Customization options vary by language/locale (see [Supported languages](supported-languages.md)).

## Reference docs

* [Speech SDK](speech-sdk-reference.md)

## Next steps

* [Get a Speech Services subscription key for free](get-started.md)
* [Get the Speech SDK](speech-sdk.md)
