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

We're retiring two features from Text-to-Speech offering as highlighted below.

## Features of the Text-to-Speech service

The Text-to-Speech service includes the following features.

| Feature| Summary | Use sample |
|--------|----|------|
| Prebuilt standard voice (referred as *Standard* on [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)) | **We're retiring the standard voices** on 8/31/2024 and they'll no longer be supported after that date.  During the retiring period (8/31/2021- 8/31/2024), existing standard voice users can continue to use their standard voices.  Go to [this article](how-to-migrate-to-prebuilt-neural-voice.md) to learn how to migrate to prebuilt neural voice. | Listening to the voice sample without creating an Azure account, you can visit [here](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#overview) and determine the right voice for your business needs. |
| Prebuilt neural voice (referred as *Neural* on [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)) | Prebuilt neural voice is powered by deep neural networks. You need to create an Azure account and Speech service subscription, then you can visit the [Speech Studio portal](https://speech.microsoft.com/portal), and select prebuilt neural voices to get started. Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details. | Listening to the voice sample without creating an Azure account, you can visit [here](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#overview) and determine the right voice for your business needs. |
| Custom voice (referred as *Custom* on [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/))| **We're retiring the standard/non-neural training tier (statistical parametric, concacenative) of Custom Voice**. After 2/29/2024, all standard/non-neural custom voices will no longer be supported. During the deprecation period (3/1/2021 - 2/29/2024), existing standard tier users can continue to use their non-neural models created. Go to [this article](how-to-migrate-to-custom-neural-voice.md) to learn how to migrate to custom neural voice. | N/A |
| Custom neural voice (referred as *Custom Neural* on [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)) | Custom neural voice is a gated service. You need to create an Azure account and Speech service subscription (with S0 tier), and [apply](https://aka.ms/customneural) to use custom neural feature. After you've been granted access, you can visit the [Speech Studio portal](https://speech.microsoft.com/portal) and then select Custom Voice to get started. Go to the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) and check the pricing details. | Listening to the voice sample without creating an Azure account, you can visit [here](https://aka.ms/customvoice) and determine the right voice for your business needs. |

## Benefits of migration

The prebuilt neural voice provides more natural sounding speech output, and thus, a better end-user experience, so we're retiring the standard voices on 8/31/2024 and they'll no longer be supported after that date.  

|Prebuilt standard voice  | Prebuilt neural voice | 
|--|--|
| Noticeably robotic  | Natural sounding, closer to human-parity|
| Limited capabilities in voice tuning |Advanced capabilities in voice tuning   |
| No new investment in future voice fonts  |On-going investment in future voice fonts |

The custom neural voice enables you to build higher-quality voice models while requiring less data, and provides measures to help you deploy AI responsibly, so we're retiring the custom voices on 2/29/2024 and they'll no longer be supported after that date.

|Custom voice  |Custom neural voice | 
|--|--|
| The standard, or "traditional," method of custom voice breaks down spoken language into phonetic snippets that can be remixed and matched using classical programming or statistical methods.  | Custom neural voice synthesizes speech using deep neural networks that have "learned" the way phonetics are combined in natural human speech rather than using classical programming or statistical methods.|
| Custom voice requires a large volume of voice data to produce a more human-like voice model. With fewer recorded lines, a standard voice model will tend to sound more obviously robotic. |The custom neural voice capability enables you to create a unique brand voice in multiple languages and styles by using a small set of recordings.|


## Next steps

- [Try out prebuilt neural voice](text-to-speech.md)
- [Try out custom neural voice](custom-neural-voice.md)
