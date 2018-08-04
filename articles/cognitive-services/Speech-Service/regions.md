---
title: Speech service regions
description: Reference for regions of the Speech service.
services: cognitive-services
author: mahilleb-msft

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 06/28/2018
ms.author: mahilleb
---

# Regions of the Speech service

The Speech service is available in different regions.
When you create a subscription you can pick an available region, depending on your needs.

When you use your subscription you have to account for the region you picked.

## REST API

Using the REST API, pick the right region-specific endpoints.
See [REST APIs](rest-apis.md) for details.

## Speech SDK

In the [Speech SDK](speech-sdk.md), regions are specified as a string
(for example, as a parameter to [SpeechFactory.FromSubscription](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.speechfactory.fromsubscription) in the Speech SDK for C#).

The table below lists the available regions for **speech recognition** and **translation**:

Region|	Value for region parameter in the Speech SDK
-|-
West US| `westus`
East Asia| `eastasia`
North Europe| `northeurope`

Available regions for **intent recognition** via the Speech SDK are listed in the [Language Understanding service region page](/azure/cognitive-services/luis/luis-reference-regions).
For each publishing region listed, the corresponding Speech SDK region parameter is determined as the first part of the domain name of the endpoint.
For example, use `westus` to specify the West US publishing region.
