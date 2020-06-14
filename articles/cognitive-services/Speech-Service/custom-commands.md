---
title: Custom Commands - Speech service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for Custom Commands, a solution for creating voice applications.
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: travisw
---

# What is Custom Commands?

Voice applications such as [Voice assistants](voice-assistants.md) listen to users and take an action in response, often speaking back. They use [speech-to-text](speech-to-text.md) to transcribe the user's speech, then take action on the natural language understanding of the text. This action frequently includes spoken output from the assistant generated with [text-to-speech](text-to-speech.md). Devices connect to assistants with the Speech SDK's `DialogServiceConnector` object.

**Custom Commands** makes it easy to build rich voice commanding apps optimized for voice-first interaction experiences. It provides a unified authoring experience, an automatic hosting model, and relatively lower complexity, helping you focus on building the best solution for your voice commanding scenarios. 

Custom Commands is best suited for task completion or command-and-control scenarios, particularly well-matched for Internet of Things (IoT), ambient and headless devices. Examples include solutions for Hospitality, Retail and Automotive industries, allowing you to build the best in-room voice-controlled experiences for your guests, manage inventory in your store and control in-car functionality while on the move.

> [!TIP]
> View our sample demos on our landing page at [https://speech.microsoft.com/customcommands](https://speech.microsoft.com/customcommands).

If you're interested in building complex conversational app, you're encouraged to try the Bot Framework using the [Virtual Assistant Solution](https://docs.microsoft.com/azure/bot-service/bot-builder-enterprise-template-overview). You can add voice to any bot framework bot using Direct Line Speech.

Good candidates for Custom Commands have a fixed vocabulary with well-defined sets of variables. For example, home automation tasks, like controlling a thermostat, are ideal.

   ![Examples of task completion scenarios](media/voice-assistants/task-completion-examples.png "task completion examples")

## Getting started with Custom Commands

The first step for using Custom Commands (Preview) to make a voice application is to [get a speech subscription key](get-started.md) and access the Custom Commands (Preview) Builder on the [Speech Studio](https://speech.microsoft.com). From there, you can author a new Custom Commands (Preview) Application and publish it, after which an on-device application can communicate with it using the Speech SDK.

   ![Authoring flow for Custom Commands (Preview)](media/voice-assistants/custom-commands-flow.png "The Custom Commands (Preview) authoring flow")

We offer quickstarts designed to have you running code in less than 10 minutes.

* [Create a Custom Commands (Preview) application](quickstart-custom-speech-commands-create-new.md)
* [Create a Custom Commands (Preview) application with parameters](quickstart-custom-speech-commands-create-parameters.md)
* [Connect to a Custom Commands (Preview) application with the Speech SDK, C#](quickstart-custom-speech-commands-speech-sdk.md)

Once you are done with the quickstarts, explore our how-tos.

- [Add validations to Custom Command parameters](./how-to-custom-speech-commands-validations.md)
- [Fulfill Commands on the client with the Speech SDK](./how-to-custom-speech-commands-fulfill-sdk.md)
- [Add a confirmation to a Custom Command](./how-to-custom-speech-commands-confirmations.md)
- [Add a one-step correction to a Custom Command](./how-to-custom-speech-commands-one-step-correction.md)

## Next steps

* [Get a Speech service subscription key for free](get-started.md)
* [Go to the Speech Studio to try out Custom Commands](https://speech.microsoft.com)
* [Get the Speech SDK](speech-sdk.md)
