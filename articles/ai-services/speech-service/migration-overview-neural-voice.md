---
title: Migration to neural voice - Speech service
titleSuffix: Azure AI services
description: This document summarizes the benefits of migration from non-neural voice to neural voice.
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 1/21/2024
ms.author: v-baolianzou
---

# Migration to neural voice

We're retiring two features from [text to speech](index-text-to-speech.yml) capabilities as detailed in this article.

## Custom voice (non-neural training)

> [!IMPORTANT]
> The standard non-neural training tier of custom voice is retired as of February 29, 2024. You could have used a non-neural custom voice with your Speech resource prior to February 29, 2024. Now you can only use custom neural voice with your Speech resources. If you have a non-neural custom voice, you must migrate to custom neural voice.

Go to [this article](how-to-migrate-to-custom-neural-voice.md) to learn how to migrate to custom neural voice. 

Custom neural voice is a gated service. You need to create an Azure account and Speech service subscription (with S0 tier), and [apply](https://aka.ms/customneural) to use custom neural feature. After you're granted access, you can visit the [Speech Studio portal](https://speech.microsoft.com/portal) and then select custom voice to get started. 

Even without an Azure account, you can listen to voice samples in [Speech Studio](https://aka.ms/customvoice) and determine the right voice for your business needs.

Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details. Custom voice (retired) is referred as **Custom**, and custom neural voice is referred as **Custom Neural**. 

## Prebuilt standard voice

> [!IMPORTANT]
> We are retiring the standard voices from September 1, 2021 through August 31, 2024. Speech resources created after September 1, 2021 could never use standard voices. We are gradually sunsetting standard voice support for Speech resources created prior to September 1, 2021. By August 31, 2024 the standard voices won’t be available for all customers. You can choose from the supported [neural voice names](language-support.md?tabs=tts).
> 
> The pricing for prebuilt standard voice is different from prebuilt neural voice. Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details in the collapsable "Deprecated" section. Prebuilt standard voice (retired) is referred as **Standard**. 

Go to [this article](how-to-migrate-to-prebuilt-neural-voice.md) to learn how to migrate to prebuilt neural voice.

Prebuilt neural voice is powered by deep neural networks. You need to create an Azure account and Speech service subscription. Then you can use the [Speech SDK](./get-started-text-to-speech.md) or visit the [Speech Studio portal](https://speech.microsoft.com/portal), and select prebuilt neural voices to get started. Listening to the voice sample without creating an Azure account, you can visit the [Voice Gallery](https://speech.microsoft.com/portal/voicegallery) and determine the right voice for your business needs.

Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details. Prebuilt standard voice (retired) is referred as **Standard**, and prebuilt neural voice is referred as **Neural**. 

## Next steps

- [Try out prebuilt neural voice](text-to-speech.md)
- [Try out custom neural voice](custom-neural-voice.md)
