---
title: Migrate from Custom Speech Service to Speech service
titlesuffix: Azure Cognitive Services 
description: Learn how to migration from the Custom Speech service to the Speech Service.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 10/01/2018
ms.author: panosper
---
# Migrate from the Custom Speech service to the Speech service

Use this article to migrate your applications from the Custom Speech service to the Speech Service.

The Custom Speech Service is now part of the Speech Service. Switch to the Speech Service to benefit from the latest quality and feature updates.
 
## Migration for new customers

The pricing model is simpler, moving to an hour-based pricing model for the Speech Service.   

1. Create an Azure resource in each region where your application is available. The Azure resource name is **Speech**. You can use a single Azure resource for the following services in the same region, instead of creating separate resources:

    * Speech-to-text
    * Custom speech-to-text
    * Text-to-speech
    * Speech translation

2. Download the [Speech SDK](speech-sdk.md). 

3. Follow the quickstart guides and SDK samples to use the correct APIs. If you use the REST APIs, you also need to use the correct endpoints and resource keys. 

4. Update the client application to use the Speech service and APIs. 

> [!NOTE]
> * LUIS - If you enabled speech in Language Understanding (LUIS), a single LUIS resource in the same region will work for LUIS as well as all the speech services. See [Recognize intents from speech](how-to-recognize-intents-from-speech-csharp.md) documentation.
> * Text-to-text translation is not part of the Speech service. It needs its own Azure resource subscription.
  


## Migration for existing customers

Existing customers are required to migrate their existing resource keys to the Speech service on the Speech Service portal. Use the following steps: 

> [!NOTE] 
> Resource keys can only be migrated within the same region. 

1. Sign in to the [cris.ai](http://www.cris.ai) portal and select the subscription in the top right menu. 

2. Select **Migrate selected subscription**.

3. Enter the subscription key in the text box and select **Migrate**.

## Next steps

* [try out Speech Service for free](get-started.md)
* Learn [speech to text](./speech-to-text.md) concepts

## See also

* [What is the Speech service](overview.md)
* [Speech Service and SDK documentation](speech-sdk.md#get-the-sdk)