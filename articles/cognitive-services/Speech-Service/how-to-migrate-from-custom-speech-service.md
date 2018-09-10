---
title: Migrate from custom speech serivce - Speech service
titlesuffix: Azure Cognitive Services 
description: Learn how to migration from the Custom Speech service to the unified Speech Service.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: bing-speech
ms.topic: article
ms.date: 09/10/2018
ms.author: panosper
---
# Migration Guide 
Learn how to migration from the Custom Speech service to the unified Speech Service.

Custom Speech Service and its corresponding Client libraries and APIs are being deprecated on September 24th. We highly recommend customers to switch to the new unified Speech Service and SDK as soon as possible to benefit from the latest quality and feature updates. 
 
# Migration for new customers

The pricing model is simpler, moving to an hour-based pricing model for the new Speech Service. Visit the Speech Service Pricing page for details.  

1. Create an Azure resource in each region where your application is availability. The new Azure Resource name is **Speech** service. You can use **one** Azure resource for the following services in the same region, instead of creating separate resources:

    * Speech-to-text
    * Custom speech-to-text
    * Text-to-speech
    * Speech translation

    > [!NOTE]
    > * LUIS - If your enabled speech in Language Understanding (LUIS), a single LUIS resource in the same region will work for LUIS as well as all the speech services. See [Recognize intents from speech](how-to-recognize-intents-from-speech-csharp.md) documentation.
    > * Text-to-text translation is not part of the Speech service. It needs its own Azure resource subscription. 

2. Download the [Speech SDK](speech-sdk.md). 

3. Follow the quickstart guides and SDK samples to use the correct APIs. If you use the REST apis, you will also need to use the correct endpoints and resource keys. 

4. Update the client application to use the Speech service and APIs. 
  
# Migration for existing customers
Existing customers are required to migrate their existing resource keys to the new service. They can do this on the Speech Service portal. Note that resource keys can only be migrated within the same region. Use the following steps:

1. Sign in to the [cris.ai](http://www.cris.ai) portal and select the subscription in the top right menu. 

2. Select **Migrate selected subscription**.

    ![Enter subscription to migrate](./media/migrate-from-custom-speech-service/migrate-selected-subscriptions.png)

3. Enter the subscription key in the text box and select **Migrate**.

    ![Enter subscription to migrate](./media/migrate-from-custom-speech-service/migrate-dialog.png)

## Next steps

Learn how to [authenticate](../how-to-authenticate.md) to the Speech API