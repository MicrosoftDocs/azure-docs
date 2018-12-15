---
title: Speech Service regions
titlesuffix: Azure Cognitive Services
description: Reference for regions of the Speech Service.
services: cognitive-services
author: mahilleb-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: speech-service
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: mahilleb
---

# Speech Service supported regions

The Speech service allows your application to convert audio to text, perform speech translation, and covert text to speech. The service is available in multiple regions with unique endpoints for the Speech SDK and REST APIs.

Make sure that you use the endpoint that matches the region for your subscription.

## Speech SDK

In the [Speech Service SDK](speech-sdk.md), regions are specified as a string
(for example, as a parameter to `SpeechConfig.FromSubscription` in the Speech SDK for C#).

### Speech recognition and translation

The Speech SDK is available in these regions for **speech recognition** and **translation**:

  Region | Speech SDK Parameter | Speech Customization Portal
 ------|-------|--------
 West US | `westus` | https://westus.cris.ai
 West US2 | `westus2` | https://westus2.cris.ai
 East US | `eastus` | https://eastus.cris.ai
 East US2 | `eastus2` | https://eastus2.cris.ai
 East Asia | `eastasia` | https://eastasia.cris.ai
 South East Asia | `southeastasia` | https://southeastasia.cris.ai
 North Europe | `northeurope` | https://northeurope.cris.ai
 West Europe | `westeurope` | https://westeurope.cris.ai


### Intent recognition

**Intent recognition** for the Speech SDK shares regions support with LUIS. For a complete list of available regions, see [Publishing regions and endpoints - LUIS](https://docs.microsoft.comazure/cognitive-services/luis/luis-reference-regions)

Available regions for **intent recognition** via the Speech SDK are listed on the [Language Understanding service region page](/azure/cognitive-services/luis/luis-reference-regions).

For each publishing region listed, use the provided **API region name**. For example, use `westus` for West US.

## REST APIs

The Speech service also exposes REST endpoints for speech-to-text and text-to-speech requests.

### Speech-to-text

For speech-to-text reference documentation, see [REST APIs](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#speech-to-text).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-speech-to-text.md)]

### Text-to-speech

For text-to-speech reference documentation, see [REST APIs](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis#speech-to-text).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]
