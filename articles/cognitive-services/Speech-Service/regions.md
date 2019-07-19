---
title: Regions - Speech Services
titlesuffix: Azure Cognitive Services
description: Reference for regions of the Speech Service.
services: cognitive-services
author: mahilleb-msft
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/12/2019
ms.author: panosper
ms.custom: seodec18
---

# Speech Service supported regions

The Speech service allows your application to convert audio to text, perform speech translation, and covert text to speech. The service is available in multiple regions with unique endpoints for the Speech SDK and REST APIs.

Make sure that you use the endpoint that matches the region for your subscription.

## Speech SDK

In the [Speech SDK](speech-sdk.md), regions are specified as a string
(for example, as a parameter to `SpeechConfig.FromSubscription` in the Speech SDK for C#).

### Speech-to-text, text-to-speech, and translation

The Speech SDK is available in these regions for **speech recognition**, **text-to-speech**, and **translation**:

  Region | Speech SDK Parameter | Speech Customization Portal
 ------|-------|--------
 West US | `westus` | https://westus.cris.ai
 West US 2 | `westus2` | https://westus2.cris.ai
 East US | `eastus` | https://eastus.cris.ai
 East US 2 | `eastus2` | https://eastus2.cris.ai
 Central US | `centralus` | https://centralus.cris.ai
 North Central US | `northcentralus` | https://northcentralus.cris.ai
 South Central US | `southcentralus` | https://southcentralus.cris.ai
 Central India | `centralindia` | https://centralindia.cris.ai
 East Asia | `eastasia` | https://eastasia.cris.ai
 Southeast Asia | `southeastasia` | https://southeastasia.cris.ai
 Japan East | `japaneast` | https://japaneast.cris.ai
 Korea Central | `koreacentral` | https://koreacentral.cris.ai
 Australia East | `australiaeast` | https://australiaeast.cris.ai
 Canada Central | `canadacentral` | https://canadacentral.cris.ai
 North Europe | `northeurope` | https://northeurope.cris.ai
 West Europe | `westeurope` | https://westeurope.cris.ai
 UK South | `uksouth` | https://uksouth.cris.ai
 France Central | `francecentral` | https://francecentral.cris.ai

### Intent recognition

Available regions for **intent recognition** via the Speech SDK are the following:

 Global region | Region | Speech SDK Parameter
 ------|-------|--------
 Asia | East Asia | `eastasia`
 Asia | Southeast Asia | `southeastasia`
 Australia | Australia East | `australiaeast`
 Europe | North Europe | `northeurope`
 Europe | West Europe | `westeurope`
 North America | East US | `eastus`
 North America | East US 2 | `eastus2`
 North America | South Central US | `southcentralus`
 North America | West Central US | `westcentralus`
 North America | West US | `westus`
 North America | West US 2 | `westus2`
 South America | Brazil South | `brazilsouth`

This is a subset of the publishing regions supported by the [Language Understanding service (LUIS)](/azure/cognitive-services/luis/luis-reference-regions).

### Voice-first virtual assistants

The [Speech SDK](speech-sdk.md) supports **voice-first virtual assistant** capabilities in these regions:

Region | Speech SDK Parameter
-------|---------------------
West US | `westus`
West US 2 | `westus2`
East US | `eastus`
East US 2 | `eastus2`
West Europe | `westeurope`
North Europe | `northeurope`
Southeast Asia | `southeastasia`

## REST APIs

The Speech service also exposes REST endpoints for speech-to-text and text-to-speech requests.

### Speech-to-text

For speech-to-text reference documentation, see [Speech-to-text REST API](rest-speech-to-text.md).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-speech-to-text.md)]

### Text-to-speech

For text-to-speech reference documentation, see [Text-to-speech REST API](rest-text-to-speech.md).

[!INCLUDE [](../../../includes/cognitive-services-speech-service-endpoints-text-to-speech.md)]