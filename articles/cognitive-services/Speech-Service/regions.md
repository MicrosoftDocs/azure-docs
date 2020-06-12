---
title: Regions - Speech service
titleSuffix: Azure Cognitive Services
description: A list of available regions and endpoints for the Speech service, including speech-to-text, text-to-speech, and speech translation.
services: cognitive-services
author: mahilleb-msft
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/05/2019
ms.author: panosper
ms.custom: seodec18
---

# Speech service supported regions

The Speech service allows your application to convert audio to text, perform speech translation, and covert text to speech. The service is available in multiple regions with unique endpoints for the Speech SDK and REST APIs.

The Speech portal to perform custom configurations to your speech experience for all the regions is available here: https://speech.microsoft.com

For invocations of your Speech service, make sure the call matches the region for your subscription.

## Speech SDK

In the [Speech SDK](speech-sdk.md), regions are specified as a string
(for example, as a parameter to `SpeechConfig.FromSubscription` in the Speech SDK for C#).

### Speech-to-text, text-to-speech, and translation

The speech customization portal is available here: https://speech.microsoft.com

The Speech service is available in these regions for **speech recognition**, **text-to-speech**, and **translation**:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

If you use the [Speech SDK](speech-sdk.md), regions are specified by the **Region identifier** (for example, as a parameter to `SpeechConfig.FromSubscription`). Make sure the region is matching the region of your subscription.

### Intent recognition

Available regions for **intent recognition** via the Speech SDK are the following:

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

This is a subset of the publishing regions supported by the [Language Understanding service (LUIS)](/azure/cognitive-services/luis/luis-reference-regions).

### Voice assistants

The [Speech SDK](speech-sdk.md) supports **voice assistant** capabilities in these regions:

| Region         | Region identifier |
| -------------- | -------------------- |
| West US        | `westus`             |
| West US 2      | `westus2`            |
| East US        | `eastus`             |
| East US 2      | `eastus2`            |
| West Europe    | `westeurope`         |
| North Europe   | `northeurope`        |
| Southeast Asia | `southeastasia`      |

### Speaker Recognition

Speaker Recognition is currently only available in the `westus` region.

## REST APIs

The Speech service also exposes REST endpoints for speech-to-text and text-to-speech requests.

### Speech-to-text

For speech-to-text reference documentation, see [Speech-to-text REST API](rest-speech-to-text.md).

The endpoint for the REST API has this format:

```
https://<REGION_IDENTIFIER>.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1
```

Replace `<REGION_IDENTIFIER>` with the identifier matching the region of your subscription from this table:

[!INCLUDE [](../../../includes/cognitive-services-speech-service-region-identifier.md)]

> [!NOTE]
> The language parameter must be appended to the URL to avoid receiving an 4xx HTTP error. For example, the language set to US English using the West US endpoint is: `https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`.

### Text-to-speech

For text-to-speech reference documentation, see [Text-to-speech REST API](rest-text-to-speech.md).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]
