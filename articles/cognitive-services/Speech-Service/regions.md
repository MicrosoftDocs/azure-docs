---
title: Speech service regions | Microsoft Docs
description: Reference for regions of the Speech service.
services: cognitive-services
author: mahilleb-msft
manager: wolmfa61

ms.service: cognitive-services
ms.technology: speech
ms.topic: article
ms.date: 06/27/2018
ms.author: mahilleb
---

# Regions and endpoints of the Speech service

> [!NOTE]
> Region names in the [Speech SDK](speech-sdk.md) match the first part of the domain of the endpoints given below.
> For example, use `westus` to specify the West US region in the Speech SDK.

## Speech to Text

[!include[](includes/endpoints-speech-to-text.md)]

## Text to Speech

[!include[](includes/endpoints-text-to-speech.md)]

## Authentication

[!include[](includes/endpoints-token-service.md)]

See [here](rest-apis.md#authentication) for details obtaining and refreshing authorization tokens.

## Language understanding (Speech SDK only)

Regions for the Language Understanding service are listed [here](/azure/cognitive-services/luis/luis-reference-regions).
In the Speech SDK, specify these regions by the first part of the domain name of the endpoint (for example, `westus`).
