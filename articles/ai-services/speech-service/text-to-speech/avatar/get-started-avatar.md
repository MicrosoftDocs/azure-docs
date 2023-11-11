---
title: Get started with text to speech avatar - Speech service
titleSuffix: Azure AI services
description: Learn how to run an application that performs text to speech avatar synthesis.
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 11/15/2023
ms.author: v-baolianzou
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech avatar
---

# Get started with text to speech avatar

In this guide, you run an application that performs text to speech avatar synthesis. 

## Prerequisites

To get started, make sure you have the following prerequisites:

- **Azure Subscription:** [Create one for free](https://azure.microsoft.com/free/cognitive-services).
- **Speech Resource:** <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Create a speech resource</a> in the Azure portal.
- **Communication Resource:** Create a [Communication resource](https://portal.azure.com/#create/Microsoft.Communication) in the Azure portal (for real-time avatar synthesis only).
- You also need your network relay token for real-time avatar synthesis. After deploying your Communication resource, select **Go to resource** to view the endpoint and connection string under **Settings** -> **Keys** tab, and then follow [Access TURN relays](/azure/ai-services/speech-service/quickstarts/setup-platform#install-the-speech-sdk-for-javascript) to generate the relay token with the endpoint and connection string filled.

> [!NOTE]
> Text to speech avatar feature in public preview is only available in the following 3 service regions: West US2, West Europe, and Southeast Asia. If you plan to use custom neural voice with the text to speech avatar, you'll need to deploy the custom neural voice models to the supported regions. Otherwise, you can [copy the custom neural voice models](../../how-to-custom-voice-create-voice.md#copy-your-voice-model-to-another-project) to the avatar supported regions. 

## Set Up Environment

For real-time avatar synthesis, you need to install the Speech SDK for JavaScript to use with a webpage. For the installation instructions, see [Install the Speech SDK](/azure/ai-services/speech-service/quickstarts/setup-platform?pivots=programming-language-javascript&tabs=windows%2Cubuntu%2Cdotnetcli%2Cdotnet%2Cjre%2Cmaven%2Cbrowser%2Cmac%2Cpypi#install-the-speech-sdk-for-javascript).

Here's the compatibility of real-time avatar on different platforms and browsers:

| Platform | Chrome | Microsoft Edge | Safari | Firefox | Opera |
|----------|--------|------|--------|---------|-------|
| Windows  |   Y    |  Y   |  N/A   |   Y<sup>1</sup>   |   Y   |
| Android  |   Y    |  Y   |  N/A   |   Y<sup>1</sup><sup>2</sup>  |   N   |
| iOS      |   Y    |  Y   |   Y    |   Y     |   Y   |
| macOS    |   Y    |  Y   |   Y    |   Y<sup>1</sup>    |   Y   |

<sup>1</sup> It dosen't work with ICE server by Communication Service but works with Coturn.

<sup>2</sup> Background transparency doesn't work.

## Next steps

* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [What is custom text to speech avatar](what-is-custom-tts-avatar.md)
