---
title: Migration overview - Speech service
titleSuffix: Azure Cognitive Services
description: This document summarizes the benefits of migration from non-neural voice to neural voice.
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/12/2021
ms.author: v-baolianzou
---

# Migration overview

We're retiring two features from [Text-to-Speech](index-text-to-speech.yml) capabilities as detailed below.

## Custom voice

> [!IMPORTANT]
> We are retiring the standard/non-neural training tier of custom voice on **February 29, 2024**. During the retiring period (3/1/2021 - 2/29/2024), existing standard tier users can continue to use their non-neural models created, but all new users/new speech resources should move to the neural tier/custom neural voice. After 2/29/2024, all standard/non-neural custom voices will no longer be supported.

Go to [this article](how-to-migrate-to-custom-neural-voice.md) to learn how to migrate to custom neural voice. 

Custom neural voice is a gated service. You need to create an Azure account and Speech service subscription (with S0 tier), and [apply](https://aka.ms/customneural) to use custom neural feature. After you've been granted access, you can visit the [Speech Studio portal](https://speech.microsoft.com/portal) and then select Custom Voice to get started. 

Even without an Azure account, you can listen to voice samples in [Speech Studio](https://aka.ms/customvoice) and determine the right voice for your business needs.

Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details. Custom voice (deprecated) is referred as **Custom**, and custom neural voice is referred as **Custom Neural**. 

## Prebuilt standard voice

> [!IMPORTANT]
> We are retiring the standard voices on **August 31, 2024** and they will no longer be supported after that date. During the retiring period (8/31/2021 - 8/31/2024), existing standard voice users can continue to use standard voices, but all new users/new speech resources must choose neural voices. 

Go to [this article](how-to-migrate-to-prebuilt-neural-voice.md) to learn how to migrate to prebuilt neural voice.

Prebuilt neural voice is powered by deep neural networks. You need to create an Azure account and Speech service subscription. Then you can use the [Speech SDK](./get-started-text-to-speech.md) or visit the [Speech Studio portal](https://speech.microsoft.com/portal), and select prebuilt neural voices to get started. Listening to the voice sample without creating an Azure account, you can visit [here](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#overview) and determine the right voice for your business needs.

Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details. Prebuilt standard voice (deprecated) is referred as **Standard**, and prebuilt neural voice is referred as **Neural**. 

## Next steps

- [Try out prebuilt neural voice](text-to-speech.md)
- [Try out custom neural voice](custom-neural-voice.md)
