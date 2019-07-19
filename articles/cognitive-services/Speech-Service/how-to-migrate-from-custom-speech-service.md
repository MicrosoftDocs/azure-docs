---
title: Migrate from Custom Speech Service to Speech Services
titlesuffix: Azure Cognitive Services
description: The Custom Speech Service is now part of the Speech Services. Switch to the Speech Services to benefit from the latest quality and feature updates.
services: cognitive-services
author: PanosPeriorellis
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/01/2018
ms.author: panosper
ms.custom: seodec18
---
# Migrate from the Custom Speech Service to the Speech Service

Use this article to migrate your applications from the Custom Speech Service to the Speech Service.

The Custom Speech Service is now part of the Speech Service. Switch to the Speech Services to benefit from the latest quality and feature updates.

## Migration for new customers

The pricing model is simpler, using an hour-based pricing model for the Speech Service.  

1. Create an Azure resource in each region where your application is available. The Azure resource name is **Speech**. You can use a single Azure resource for the following services in the same region, instead of creating separate resources:

    * Speech-to-text
    * Custom speech-to-text
    * Text-to-speech
    * Speech translation

2. Download the [Speech SDK](speech-sdk.md).

3. Follow the quickstart guides and SDK samples to use the correct APIs. If you use the REST APIs, you also need to use the correct endpoints and resource keys.

4. Update the client application to use the Speech Services and APIs.

## Migration for existing customers

Migrate your existing resource keys to the Speech Services on the Speech Services portal. Use the following steps:

> [!NOTE]
> Resource keys can only be migrated within the same region.

1. Sign in to the [cris.ai](https://cris.ai/Home/CustomSpeech) portal, and select the subscription in the top right menu.

2. Select **Migrate selected subscription**.

3. Enter the subscription key in the text box, and select **Migrate**.

## Next steps

* [Try out Speech Services for free](get-started.md).
* Learn [speech to text](./speech-to-text.md) concepts.

## See also

* [What is the Speech Service](overview.md)
* [Speech Services and Speech SDK documentation](speech-sdk.md#get-the-sdk)
