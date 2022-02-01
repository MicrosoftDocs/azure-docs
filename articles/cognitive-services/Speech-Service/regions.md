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

The Speech service allows your application to convert audio to text, perform speech translation, and convert text to speech. The service is available in multiple regions with unique endpoints for the Speech SDK and REST APIs.

The Speech portal, where you can perform custom configurations to your speech experience for all regions, is available at [speech.microsoft.com](https://speech.microsoft.com).

Keep in mind the following points when considering regions:

* If your application uses a [Speech SDK](speech-sdk.md), you provide the region identifier, such as `westus`, when creating a speech configuration. Make sure the region matches the region of your subscription.
* If your application uses one of the Speech service's [REST APIs](./overview.md#reference-docs), the region is part of the endpoint URI you use when making requests.
* Keys created for a region are valid only in that region. Attempting to use them with other regions will result in authentication errors.

> [!NOTE]
> Speech Services doesn't store/process customer data outside the region the customer deploys the service instance in.

## Speech SDK

In the [Speech SDK](speech-sdk.md), the region is specified as a parameter (for example, as a parameter to `SpeechConfig.FromSubscription` in the Speech SDK for C#).

### Speech-to-Text, Text-to-Speech, and translation

The Speech service is available in these regions for **Speech-to-Text**, **Text-to-Speech**, and **translation**:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

If you plan to train a custom model with audio data, use one of the [regions with dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for faster training. You can use the [REST API](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) to copy the fully trained model to another region later.

### Intent recognition

Available regions for **intent recognition** via the Speech SDK are in the following table.

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

The [Speech SDK](speech-sdk.md) supports **voice assistant** capabilities through [Direct Line Speech](./direct-line-speech.md) for regions in the following table.

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

### Speaker Recognition

Available regions for **Speaker Recognition** are in the following table.

| Geography | Region           | Region identifier |
| ------------- | ---------------- | -------------------- |
| Americas     | Central US   | `centralus` |
| Americas     | East US   | `eastus`  |
| Americas     | East US 2  | `eastus2`  |
| Americas     | West Central US  | `westcentralus`  |
| Americas     | West US  | `westus`  |
| Americas     | West US 2  | `westus2`  |
| Asia Pacific  | East Asia   | `eastasia` |
| Asia Pacific  | Southeast Asia   | `southeastasia` |
| Asia Pacific  | Central India   | `centralindia` |
| Australia     | Australia East   | `australiaeast` |
| Europe     | North Europe   | `northeurope` |
| Europe     | West Europe   | `westeurope` |
| Europe     | UK South   | `uksouth` |

### Keyword recognition

Available regions for **Keyword recognition** are in the following table.

| Region | Custom Keyword (Basic models) | Custom Keyword (Advanced models) | Keyword Verification |
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

The Speech service also exposes REST endpoints for Speech-to-Text, Text-to-Speech and speaker recognition requests.

### Speech-to-Text

For Speech-to-Text reference documentation, see [Speech-to-Text REST API](rest-speech-to-text.md).

The endpoint for the REST API has this format:

```
https://<REGION_IDENTIFIER>.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
```

Replace `<REGION_IDENTIFIER>` with the identifier matching the region of your subscription from this table:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

> [!NOTE]
> The language parameter must be appended to the URL to avoid receiving an 4xx HTTP error. For example, the language set to US English using the West US endpoint is: `https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`.

### Text-to-Speech

For Text-to-Speech reference documentation, see [Text-to-Speech REST API](rest-text-to-speech.md).

[!INCLUDE [](includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]

### Speaker Recognition

For speaker recognition reference documentation, see [Speaker Recognition REST API](/rest/api/speakerrecognition/). Available regions are the same as Speaker Recognition SDK.
