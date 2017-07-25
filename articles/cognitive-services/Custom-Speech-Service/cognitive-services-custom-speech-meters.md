---
title: Custom Speech Service meters and quotas on Azure | Microsoft Docs
description: Information about meters and quotas of Custom Speech Service on Azure.
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: custom-speech-service
ms.topic: article
ms.date: 07/08/2017
ms.author: panosper
---

# Custom Speech Service meters and quotas

Welcome to Microsoft's Custom Speech Service. Custom Speech Service is a cloud-based service that provides users with the ability to customize speech models for Speech-to-Text transcription.
To use the Custom Speech Service refer to the [Custom Speech Service Portal](https://cris.ai).

The current pricing meters are listed on [the pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/custom-speech-service/).

## Tiers explained
We propose to use the free tier (F0) for testing and prototype only.

For production systems we propose to use the S2 tier. This tier enables you to scale your deployment to a number of SUs your scenario requires.

> [!NOTE]
> Remember that you **cannot** migrate between F0 tier and S2 tier!
>

## Meters explained

### Scale Out
Scale out is a new feature released along the new pricing model. It gives customers the ability to control the number of concurrent requests their model can process.
Concurrent requests are set using the Scale Unit (SU) measure in the [_Create Model Deployment_ view](CustomSpeech-How-to-Topics/cognitive-services-custom-speech-create-endpoint.md). Based on the how much traffic they envisage the model consuming, customers can decide on the appropriate number of Scale Units. **Each Scale Unit guarantees 5 concurrent requests**. Customers can buy 1 or more SUs as appropriate. SUs are increased in increments of 1 therefore guaranteed concurrent are increased in increments of 5.

> [!NOTE]
> Remember that **1 Scale Unit = 5 concurrent requests**
>

### Log management
Customers can opt to switch off audio traces for a newly deployed model at an additional cost. Custom Speech Service will not log the audio requests or the transcripts from that particular model.

## Next steps
For more details about how to use the Custom Speech Service, refer to the [Custom Speech Service Portal] (https://cris.ai).

* [Get Started](cognitive-services-custom-speech-get-started.md)
* [FAQ](cognitive-services-custom-speech-faq.md)
* [Glossary](cognitive-services-custom-speech-glossary.md)
