---
title: Custom Commands - Speech Service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for Custom Commands, a solution for creating voice assistants.
services: cognitive-services
author: trrwilson
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/05/2019
ms.author: travisw
---

# About Custom Commands Preview

## When to use Custom Commands Preview

[Voice assistants](voice-assistants.md) process transcribed text from Speech Service [speech-to-text](speech-to-text.md), take action on the natural language input from the user, and then respond, often with spoken output from [text-to-speech](text-to-speech.md). These assistants are then connected to from a device using the Speech SDK's `DialogServiceConnector` object.

**Custom Commands** is a streamlined solution for creating a voice assistant. It provides a unified authoring experience, an automatic hosting model, and relatively lower complexity versus other assistant creation options like [Direct Line Speech](direct-line-speech.md). This simplification comes with a reduction in flexibility, however, and Custom Commands is best suited for task completion or command-and-control scenarios -- complex conversational interaction and integration with other solutions like the [Virtual Assistant Solution and Enterprise Template](https://docs.microsoft.com/azure/bot-service/bot-builder-enterprise-template-overview) is better accomplished with Direct Line Speech.

An example of a task completion assistant perfect for Custom Commands is a home automation tool for controlling a thermostat. A user's commands fit into a fixed vocabulary ("turn up the temperature," "make it cooler") with a well-defined set of variables (number of degrees, time).

***<Image: thermostat scenario />***

## Get started with Custom Commands Preview

The first step for using Custom Commands to make a voice assistant is to get a speech subscription key and access the Custom Commands Builder. From there, you can author a new Custom Commands Application and publish it, after which an on-device application can communicate with it using the Speech SDK.

   ![Authoring flow for Custom Commands](media/voice-assistants/custom-commands-flow.png "The Custom Commands authoring flow")

We offer quickstarts designed to have you running code in less than 10 minutes.

* [Create a Custom Commands Preview Application](quickstart-custom-speech-commands-create-new.md)
* [Create a Custom Commands Preview Application with Parameters](quickstart-custom-speech-commands-create-parameters.md)
* [Connect to a Custom Commands Preview Application with the Speech SDK, C#](quickstart-custom-speech-commands-speech-sdk.md)

## Sample code

Sample code for creating a voice assistant with Custom Commands Preview is available on GitHub.

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
