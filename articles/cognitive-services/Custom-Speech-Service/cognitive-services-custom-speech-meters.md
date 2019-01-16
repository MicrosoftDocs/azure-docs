---
title: Custom Speech Service meters and quotas on Azure | Microsoft Docs
description: Information about meters and quotas of Custom Speech Service on Azure.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 07/08/2017
ms.author: panosper
---

# Custom Speech Service meters and quotas

[!INCLUDE [Deprecation note](../../../includes/cognitive-services-custom-speech-deprecation-note.md)]

With cloud-based Custom Speech Service, you can customize speech models for speech-to-text transcription.

To begin using the Custom Speech Service, go to the [Custom Speech Service portal](https://cris.ai).

For the current pricing meters, go to the [Cognitive Services pricing for Custom Speech Service](https://azure.microsoft.com/pricing/details/cognitive-services/custom-speech-service/) page.

## Tiers explained
For testing and prototype only, we propose to use the free F0 tier. For production systems, we propose to use the S2 tier. By using the S2 tier you can scale your deployment to the number of scale units (SUs) that your scenario requires.

> [!NOTE]
> You *cannot* migrate between the F0 tier and the S2 tier.
>

## Meters explained

### Scale Out
Scale Out is a new feature that we have released with the new pricing model. By using Scale Out, you can control the number of concurrent requests that your model can process.

You can set concurrent requests by using the SU measure in the **Create Model Deployment** view. For more information, see [Create a custom speech-to-text endpoint](CustomSpeech-How-to-Topics/cognitive-services-custom-speech-create-endpoint.md). Depending on the quantity of traffic that you envisage the model consuming, you can choose an appropriate number of SUs. 

> [!NOTE]
> Each scale unit guarantees 5 concurrent requests. You can buy 1 or more SUs, as appropriate. Because the number of SUs increases in increments of 1, the number of concurrent requests are guaranteed to increase in increments of 5.
>

### Log management
You can opt to switch off audio traces for a newly deployed model at an additional cost. Custom Speech Service does not log the audio requests or the transcripts from that model.

## Next steps
For more information about how to use the Custom Speech Service, go to the [Custom Speech Service portal](https://cris.ai).

* [Get started](cognitive-services-custom-speech-get-started.md)
* [FAQ](cognitive-services-custom-speech-faq.md)
* [Glossary](cognitive-services-custom-speech-glossary.md)
 