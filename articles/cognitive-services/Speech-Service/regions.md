---
title: Speech service regions
description: Reference for regions of the Speech service.
services: cognitive-services
author: mahilleb-msft

ms.service: cognitive-services
ms.component: speech
ms.topic: article
ms.date: 09/24/2018
ms.author: mahilleb
---

# Regions of the Speech service

The Speech service is available in different regions.
When you create a subscription, you can select an available region based on your needs.

When you use your subscription, you have to account for the region you selected.

## REST API

Use the REST API to select the correct region-specific endpoints.
See [REST APIs](rest-apis.md) for details.

## Speech SDK

In the [Speech SDK](speech-sdk.md), regions are specified as a string
(for example, as a parameter to `SpeechConfig.FromSubscription` in the Speech SDK for C#).

### Regions for speech recognition and translation

The following table lists the available regions for **speech recognition** and **translation**.

  Region | Speech SDK Parameter | Portal
 ------|-------|--------
 West US | `westus` | https://westus.cris.ai
 West US2 | `westus2` | https://westus2.cris.ai 
 East US | `eastus` | https://eastus.cris.ai
 East US2 | `eastus2` | https://eastus2.cris.ai
 East Asia | `eastasia` | https://eastasia.cris.ai
 South East Asia | `southeastasia` | https://southeastasia.cris.ai
 North Europe | `northeurope` | https://northeurope.cris.ai
 West Europe | `westeurope` | https://westeurope.cris.ai


### Regions for intent recognition

Available regions for **intent recognition** via the Speech SDK are listed on the [Language Understanding service region page](/azure/cognitive-services/luis/luis-reference-regions).
For each publishing region listed, the corresponding Speech SDK region parameter is determined as the first part of the domain name of the endpoint.
For example, use `westus` to specify the West US publishing region.
