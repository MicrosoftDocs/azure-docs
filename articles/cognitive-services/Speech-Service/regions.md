---
title: Regions - Speech service
titleSuffix: Azure Cognitive Services
description: A list of available regions and endpoints for the Speech service, including speech-to-text, text-to-speech, and speech translation.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/16/2022
ms.author: eur
ms.custom: references_regions, ignite-fall-2021
---

# Speech service supported regions

The Speech service allows your application to convert audio to text, perform speech translation, and convert text to speech. The service is available in multiple regions with unique endpoints for the Speech SDK and REST APIs. You can perform custom configurations to your speech experience, for all regions, at the [Speech Studio](https://aka.ms/speechstudio/).

Keep in mind the following points:

* If your application uses a [Speech SDK](speech-sdk.md), you provide the region identifier, such as `westus`, when you create a speech configuration. Make sure the region matches the region of your subscription.
* If your application uses one of the Speech service REST APIs, the region is part of the endpoint URI you use when making requests.
* Keys created for a region are valid only in that region. If you attempt to use them with other regions, you get authentication errors.

> [!NOTE]
> Speech service doesn't store or process customer data outside the region the customer deploys the service instance in.

## Speech SDK

In the [Speech SDK](speech-sdk.md), you specify the region as a parameter (for example, in the Speech SDK for C#, you specify the region as a parameter to `SpeechConfig.FromSubscription`).

### Speech-to-text, pronunciation assessment, text-to-speech, and translation

The Speech service is available in these regions for speech-to-text, pronunciation assessment, text-to-speech, and translation:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

If you plan to train a custom model with audio data, use one of the regions with dedicated hardware for faster training. You can use the [REST API](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) to copy the fully trained model to another region later.

> [!TIP]
> For pronunciation assessment feature, `en-US` and `en-GB` are available in all regions listed above, `zh-CN` is available in East Asia and Southeast Asia regions, `es-ES` and `fr-FR` are available in West Europe region, and `en-AU` is available in Australia East region.

### Intent recognition

Available regions for intent recognition via the Speech SDK are in the following table.

| Global region | Region           | Region identifier |
| ------------- | ---------------- | -------------------- |
| Asia          | East Asia        | `eastasia`           |
| Asia          | Southeast Asia   | `southeastasia`      |
| Australia     | Australia East   | `australiaeast`      |
| Europe        | North Europe     | `northeurope`        |
| Europe        | West Europe      | `westeurope`         |
| North America | East US          | `eastus`             |
| North America | East US 2        | `eastus2`            |
| North America | South Central US | `southcentralus`     |
| North America | West Central US  | `westcentralus`      |
| North America | West US          | `westus`             |
| North America | West US 2        | `westus2`            |
| South America | Brazil South     | `brazilsouth`        |

This is a subset of the publishing regions supported by the [Language Understanding service (LUIS)](../luis/luis-reference-regions.md).

### Voice assistants

The [Speech SDK](speech-sdk.md) supports voice assistant capabilities through [Direct Line Speech](./direct-line-speech.md) for regions in the following table.

| Global region | Region           | Region identifier    |
| ------------- | ---------------- | -------------------- |
| North America | West US          | `westus`             |
| North America | West US 2        | `westus2`            |
| North America | East US          | `eastus`             |
| North America | East US 2        | `eastus2`            |
| North America | West Central US  | `westcentralus`      |
| North America | South Central US | `southcentralus`     |
| Europe        | West Europe      | `westeurope`         |
| Europe        | North Europe     | `northeurope`        |
| Asia          | East Asia        | `eastasia`           |
| Asia          | Southeast Asia   | `southeastasia`      |
| India         | Central India    | `centralindia`       |

### Speaker recognition

Available regions for speaker recognition are in the following table.

| Geography | Region           | Region identifier |
| ------------- | ---------------- | -------------------- |
| Americas     | Central US   | `centralus` |
| Americas     | East US   | `eastus`  |
| Americas     | East US 2  | `eastus2`  |
| Americas     | West Central US  | `westcentralus`  |
| Americas     | West US  | `westus`  |
| Americas     | West US 2  | `westus2`  |
| Americas     | West US 3  | `westus3`  |
| Asia Pacific  | East Asia   | `eastasia` |
| Asia Pacific  | Southeast Asia   | `southeastasia` |
| Asia Pacific  | Central India   | `centralindia` |
| Asia Pacific  | Japan East   | `japaneast` |
| Asia Pacific  | Japan West   | `japanwest` |
| Asia Pacific  | Korea Central   | `koreacentral` |
| Australia     | Australia East   | `australiaeast` |
| Canada     | Canada Central   | `canadacentral` |
| Europe     | North Europe   | `northeurope` |
| Europe     | West Europe   | `westeurope` |
| Europe     | France Central   | `francecentral` |
| Europe     | Germany West Central   | `germanywestcentral` |
| Europe     | Norway East   | `norwayeast` |
| Europe     | Switzerland West   | `switzerlandwest` |
| Europe     | UK South   | `uksouth` |

### Keyword recognition

Available regions for keyword recognition are in the following table.

| Region | Custom keyword (basic models) | Custom keyword (advanced models) | Keyword verification |
| ------ | ----------------------------- | -------------------------------- | -------------------- |
| West US | Yes | No | Yes |
| West US 2 | Yes | Yes | Yes |
| East US | Yes | Yes | Yes |
| East US 2 | Yes | Yes | Yes |
| West Central US | Yes | No | Yes |
| South Central US | Yes | Yes | Yes |
| West Europe | Yes | Yes | Yes |
| North Europe | Yes | Yes | Yes |
| UK South | Yes | Yes | No |
| East Asia | Yes | No | Yes |
| Southeast Asia | Yes | Yes | Yes |
| Central India | Yes | Yes | Yes |
| Japan East | Yes | No | Yes |
| Japan West | Yes | No | No |
| Australia East | Yes | Yes | No |
| Brazil South | Yes | No | No |
| Canada Central | Yes | No | No |
| Korea Central | Yes | No | No |
| France Central | Yes | No | No |
| North Central US | Yes | Yes | No |
| Central US | Yes | No | No |
| South Africa North | Yes | No | No |

## REST APIs

The Speech service also exposes REST endpoints for speech-to-text, text-to-speech, and speaker recognition requests.

### Speech-to-text

The endpoint for the REST API has this format:

```
https://<REGION_IDENTIFIER>.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
```

Replace `<REGION_IDENTIFIER>` with the identifier matching the region of your subscription from this table:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

> [!NOTE]
> The language parameter must be appended to the URL to avoid receiving an HTTP error. For example, the language set to `US English` by using the `West US` endpoint is: `https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`.

For more information, see the [speech-to-text REST API](rest-speech-to-text.md).

### Text-to-speech

For more information, see the [text-to-speech REST API](rest-text-to-speech.md).

[!INCLUDE [](includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

### Speaker recognition

For more information, see the [speaker recognition REST API](/rest/api/speakerrecognition/). The regions available are the same as those for the speaker recognition SDK.
