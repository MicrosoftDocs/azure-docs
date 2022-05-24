---
title: "Speech Studio overview - Speech service"
titleSuffix: Azure Cognitive Services
description: Speech Studio is a set of UI-based tools for building and integrating features from Azure Speech service in your applications.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 05/13/2022
ms.author: eur
---

# What is Speech Studio?

[Speech Studio](https://speech.microsoft.com) is a set of UI-based tools for building and integrating features from Azure Cognitive Services Speech service in your applications. You create projects in Speech Studio by using a no-code approach, and then reference those assets in your applications by using the [Speech SDK](speech-sdk.md), the [Speech CLI](spx-overview.md), or the REST APIs.

## Speech Studio features

In Speech Studio, the following Speech service features are available as project types:

* **Real-time speech-to-text**: Quickly test speech-to-text by dragging audio files here without having to use any code. This is a demo tool for seeing how speech-to-text works on your audio samples. To explore the full functionality, see [What is speech-to-text?](speech-to-text.md).

* **Custom Speech**: Create speech recognition models that are tailored to specific vocabulary sets and styles of speaking. In contrast to the base speech recognition model, Custom Speech models become part of your unique competitive advantage because they're not publicly accessible. To get started with uploading sample audio to create a Custom Speech model, see [Upload training and testing datasets](how-to-custom-speech-upload-data.md).

* **Pronunciation assessment**: Evaluate speech pronunciation and give speakers feedback on the accuracy and fluency of spoken audio. Speech Studio provides a sandbox for testing this feature quickly, without code. To use the feature with the Speech SDK in your applications, see the [Pronunciation assessment](how-to-pronunciation-assessment.md) article.

* **Voice Gallery**: Build apps and services that speak naturally. Choose from more than 170 voices in over 70 languages and variants. Bring your scenarios to life with highly expressive and human-like neural voices.

* **Custom Voice**: Create custom, one-of-a-kind voices for text-to-speech. You supply audio files and create matching transcriptions in Speech Studio, and then use the custom voices in your applications. To create and use custom voices via endpoints, see [Create and use your voice model](how-to-custom-voice-create-voice.md). 

* **Audio Content Creation**: Build highly natural audio content for a variety of scenarios, such as audiobooks, news broadcasts, video narrations, and chat bots, with the easy-to-use [Audio Content Creation](how-to-audio-content-creation.md) tool. With Speech Studio, you can export these audio files to use in your applications.

* **Custom Keyword**: A custom keyword is a word or short phrase that you can use to voice-activate a product. You create a custom keyword in Speech Studio, and then generate a binary file to [use with the Speech SDK](custom-keyword-basics.md) in your applications.

* **Custom Commands**: Easily build rich, voice-command apps that are optimized for voice-first interaction experiences. Custom Commands provides a code-free authoring experience in Speech Studio, an automatic hosting model, and relatively lower complexity. The feature helps you focus on building the best solution for your voice-command scenarios. For more information, see the [Develop Custom Commands applications](how-to-develop-custom-commands-application.md) guide. Also see [Integrate with a client application by using the Speech SDK](how-to-custom-commands-setup-speech-sdk.md).

## Next steps

* [Explore Speech Studio](https://speech.microsoft.com)
