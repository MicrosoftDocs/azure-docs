---
title: Regions - Speech service
titleSuffix: Azure AI services
description: A list of available regions and endpoints for the Speech service, including speech to text, text to speech, and speech translation.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 10/27/2023
ms.author: eur
ms.custom: references_regions
---

# Speech service supported regions

The Speech service allows your application to convert audio to text, perform speech translation, and convert text to speech. The service is available in multiple regions with unique endpoints for the Speech SDK and REST APIs. You can perform custom configurations to your speech experience, for all regions, at the [Speech Studio](https://aka.ms/speechstudio/).

Keep in mind the following points:

* If your application uses a [Speech SDK](speech-sdk.md), you provide the region identifier, such as `westus`, when you create a `SpeechConfig`. Make sure the region matches the region of your subscription.
* If your application uses one of the Speech service REST APIs, the region is part of the endpoint URI you use when making requests.
* Keys created for a region are valid only in that region. If you attempt to use them with other regions, you get authentication errors.

> [!NOTE]
> Speech service doesn't store or process customer data outside the region the customer deploys the service instance in.

## Speech service

The following regions are supported for Speech service features such as speech to text, text to speech, pronunciation assessment, and translation. The geographies are listed in alphabetical order.

| Geography | Region | Region identifier |
| ----- | ----- | ----- |
| Africa | South Africa North | `southafricanorth` <sup>6</sup>|
| Asia Pacific | East Asia | `eastasia` <sup>5</sup>|
| Asia Pacific | Southeast Asia | `southeastasia` <sup>1,2,3,4,5,7</sup>|
| Asia Pacific | Australia East | `australiaeast` <sup>1,2,3,4,7</sup>|
| Asia Pacific | Central India | `centralindia` <sup>1,2,3,4,5</sup>|
| Asia Pacific | Japan East | `japaneast` <sup>2,5</sup>|
| Asia Pacific | Japan West | `japanwest` |
| Asia Pacific | Korea Central | `koreacentral` <sup>2</sup>|
| Canada | Canada Central | `canadacentral` <sup>1</sup>|
| Europe | North Europe | `northeurope` <sup>1,2,4,5,7</sup>|
| Europe | West Europe | `westeurope` <sup>1,2,3,4,5,7</sup>|
| Europe | France Central | `francecentral` |
| Europe | Germany West Central | `germanywestcentral` |
| Europe | Norway East | `norwayeast` |
| Europe | Sweden Central | `swedentcentral` |
| Europe | Switzerland North | `switzerlandnorth` <sup>6</sup>|
| Europe | Switzerland West | `switzerlandwest` |
| Europe | UK South | `uksouth` <sup>1,2,3,4,7</sup>|
| Middle East | UAE North | `uaenorth` <sup>6</sup>|
| South America | Brazil South | `brazilsouth` <sup>6</sup>|
| US | Central US | `centralus` |
| US | East US | `eastus` <sup>1,2,3,4,5,7</sup>|
| US | East US 2 | `eastus2` <sup>1,2,4,5</sup>|
| US | North Central US | `northcentralus` <sup>4,6</sup>|
| US | South Central US | `southcentralus` <sup>1,2,3,4,5,6,7</sup>|
| US | West Central US | `westcentralus` <sup>5</sup>|
| US | West US | `westus` <sup>2,5</sup>|
| US | West US 2 | `westus2` <sup>1,2,4,5,7</sup>|
| US | West US 3 | `westus3` |

<sup>1</sup> The region has dedicated hardware for Custom Speech training. If you plan to train a custom model with audio data, use one of the regions with dedicated hardware for faster training. Then you can [copy the trained model](how-to-custom-speech-train-model.md#copy-a-model) to another region.

<sup>2</sup> The region is available for custom neural voice training. You can copy a trained neural voice model to other regions for deployment.

<sup>3</sup> The Long Audio API is available in the region.

<sup>4</sup> The region supports custom keyword advanced models.

<sup>5</sup> The region supports keyword verification.

<sup>6</sup> The region does not support Speaker Recognition.

<sup>7</sup> The region supports the [high performance](how-to-deploy-and-use-endpoint.md#add-a-deployment-endpoint) endpoint type for custom neural voice.

## Intent recognition

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

## Voice assistants

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
