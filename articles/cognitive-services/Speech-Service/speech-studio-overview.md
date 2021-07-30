---
title: "Speech Studio overview - Speech service"
titleSuffix: Azure Cognitive Services
description: Speech Studio is a set of UI-based tools for building and integrating features from Azure Speech service in your applications.
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/07/2021
ms.author: nitinme
---

# What is Speech Studio?

[Speech Studio](https://speech.microsoft.com) is a set of UI-based tools for building and integrating features from Azure Speech service in your applications. You create projects in Speech Studio using a no-code approach, and then reference the assets you create in your applications using the [Speech SDK](speech-sdk.md), [Speech CLI](spx-overview.md), or various REST APIs.

## Set up your Azure account

You need to have an Azure account and add a Speech service resource before you can use [Speech Studio](https://speech.microsoft.com). If you don't have an account and resource, [try the Speech service for free](overview.md#try-the-speech-service-for-free).

After you create an Azure account and a Speech service resource:

1. Sign in to the [Speech Studio](https://speech.microsoft.com) with your Azure account.
1. Select the Speech service resource you need to get started. (You can change the resources anytime in "Settings" in the top menu.)

## Speech Studio features

The following Speech service features are available as project types in Speech Studio.

* **Real-time speech-to-text**: Quickly test speech-to-text by dragging and dropping audio files without using any code. This is a demo tool for seeing how speech-to-text works on your audio samples, but see the [overview](speech-to-text.md) for speech-to-text to explore the full functionality that's available.
* **Custom Speech**: Custom Speech allows you to create speech recognition models that are tailored to specific vocabulary sets and styles of speaking. In contrast to using a base speech recognition model, Custom Speech models become part of your unique competitive advantage because they are not publicly accessible. See the [quickstart](how-to-custom-speech-test-and-train.md) to get started with uploading sample audio to create a Custom Speech model.
* **Pronunciation Assessment**: Pronunciation assessment evaluates speech pronunciation and gives speakers feedback on the accuracy and fluency of spoken audio. Speech Studio provides a sandbox for testing this feature quickly with no code, but see the [how-to](how-to-pronunciation-assessment.md) article for using the feature with the Speech SDK in your applications.
* **Voice Gallery**: Build apps and services that speak naturally. Choose from more than 170 voices in over 70 languages and variants. Bring your scenarios to life with highly expressive and humanlike neural voices.
* **Custom Voice**: Custom Voice allows you to create custom, one-of-a-kind voices for text-to-speech. You supply audio files and create matching transcriptions in Speech Studio, and then use the custom voices in your applications. See the [how-to](how-to-custom-voice-create-voice.md) article on creating and using custom voices via endpoints. 
* **Audio Content Creation**: [Audio Content Creation](how-to-audio-content-creation.md) is an easy-to-use tool that lets you build highly natural audio content for a variety of scenarios, like audiobooks, news broadcasts, video narrations, and chat bots. Speech Studio allows you to export your created audio files to use in your applications.
* **Custom Keyword**: A Custom Keyword is a word or short phrase that allows your product to be voice-activated. You create a Custom Keyword in Speech Studio, and then generate a binary file to [use with the Speech SDK](custom-keyword-basics.md) in your applications.
* **Custom Commands**: Custom Commands makes it easy to build rich voice commanding apps optimized for voice-first interaction experiences. It provides a code-free authoring experience in Speech Studio, an automatic hosting model, and relatively lower complexity, helping you focus on building the best solution for your voice commanding scenarios. See the [how-to](how-to-develop-custom-commands-application.md) guide for building Custom Commands applications, and also see the guide for [integrating your Custom Commands application with the Speech SDK](how-to-custom-commands-setup-speech-sdk.md).

## Next steps

[Explore Speech Studio](https://speech.microsoft.com) and create a project.




