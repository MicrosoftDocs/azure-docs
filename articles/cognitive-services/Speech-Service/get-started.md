---
title: Try Speech Service for free
titleSuffix: Azure Cognitive Services
description: Getting started with the Speech Service is easy and affordable. A 30-day free trial lets you discover what the service can do and decide whether it's right for your application's needs.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: erhopf
ms.custom: seodec18, seo-javascript-october2019
---

# Try Speech Services for free

Getting started with the Speech Services is easy and affordable. A 30-day free trial lets you discover what the service can do and decide whether it's right for your application's needs.

If you need more time, sign up for a Microsoft Azure account—it comes with $200 in service credit that you can apply toward a paid Speech Services subscription for up to 30 days.

Finally, the Speech Services offers a free, low-volume tier that's suitable for developing applications. You can keep this free subscription even after your service credit expires.

## Free trial

The 30-day free trial gives you access to the standard pricing tier for a limited time.

To sign up for a 30-day free trial:

1. Go to [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/).

1. Select the **Speech APIs** tab.

   ![Speech API - Speech Services tab](media/index/cognitive-services-speech-api-tab.png)

1. Under **Speech Services**, select **Get API Key**.

   ![Speech API - Get API key](media/index/speech-api-get-api-key.png)

1. Agree to the terms and select your locale from the drop-down menu.

   ![Speech API - Agree to terms](media/index/speech-api-agree-to-terms.png)

1. Sign in by using your Microsoft, Facebook, LinkedIn, or GitHub account.

    You can sign up for a free Microsoft account at the [Microsoft account portal](https://account.microsoft.com/account). To get started, select **Sign in with Microsoft** and then, when asked to sign in, select **Create one.** Follow the steps to create and verify your new Microsoft account.

After you sign in to Try Cognitive Services, your free trial begins. The displayed webpage lists all the Azure Cognitive Services services for which you currently have trial subscriptions. Two subscription keys are listed beside **Speech Services**. You can use either key in your applications.

> [!NOTE]
> All free trial subscriptions are in the West US region. When you make requests, be sure to use the `westus` endpoint.

## New Azure account

New Azure accounts receive a $200 service credit that is available for up to 30 days. You can use this credit to further explore the Speech Services or to begin application development.

To sign up for a new Azure account, go to the [Azure sign-up page](https://azure.microsoft.com/free/ai/), select **Start Free,** and create a new Azure account using your Microsoft account.

You can sign up for a free Microsoft account at the [Microsoft account portal](https://account.microsoft.com/account). To get started, select **Sign in with Microsoft** and then, when asked to sign in, select **Create one.** Follow the steps to create and verify your new Microsoft account.

After creating your Azure account, follow the steps in the next section to start a subscription to the Speech Services.

## Create a Speech resource in Azure

To add a Speech Services resource (free or paid tier) to your Azure account:

1. Sign in to the [Azure portal](https://portal.azure.com/) using your Microsoft account.

1. Select **Create a resource** at the top left of the portal.

    ![Speech API - Create a resource](media/index/speech-api-create-resource.png)

1. In the **New** window, search for **speech**.

1. In the search results, select **Speech**.

    ![Speech API - Select Speech](media/index/speech-api-select-speech.png)

1. Under **Speech**, select the **Create** button.

    ![Speech API - Create button](media/index/speech-api-create-button.png)

1. Under **Create**, enter:

   * A name for the new resource. The name helps you distinguish among multiple subscriptions to the same service.
   * Choose the Azure subscription that the new resource is associated with to determine how the fees are billed.
   * Choose the [region](regions.md) where the resource will be used.
   * Choose either a free or paid pricing tier. Select **View full pricing details** for complete information about pricing and usage quotas for each tier.
   * Create a new resource group for this Speech subscription or assign the subscription to an existing resource group. Resource groups help you keep your various Azure subscriptions organized.
   * For convenient access to your subscription in the future, select the **Pin to dashboard** check box.
   * Select **Create.**

     ![Speech API - Select Create](media/index/speech-api-select-create.png)

     It takes a moment to create and deploy your new Speech resource. Select **Quickstart** to see information about your new resource.

     ![Speech API - Deploy the resource](media/index/speech-api-deploy-resource.png)

1. Under **Quickstart**, select the **Keys** link under step 1 to display your subscription keys. Each subscription has two keys; you can use either key in your application. Select the button next to each key to copy it to the clipboard for pasting into your code.

> [!NOTE]
> You can create an unlimited number of standard-tier subscriptions in one or multiple regions. However, you can create only one free-tier subscription. Model deployments on the free tier that remain unused for 7 days will be decomissioned automatically.

## Switch to a new subscription

To switch from one subscription to another, for example when your free trial expires or when you publish your application, replace the region and subscription key in your code with the region and subscription key of the new Azure resource.

> [!NOTE]
> Free trial keys are created in the West US (`westus`) region. A subscription created via the Azure dashboard may be in some other region if you so choose.

* If your application uses a [Speech SDK](speech-sdk.md), you provide the region code, such as `westus`, when creating a speech configuration.
* If your application uses one of the Speech Services's [REST APIs](rest-apis.md), the region is part of the endpoint URI you use when making requests.

Keys created for a region are valid only in that region. Attempting to use them with other regions will result in authentication errors.

## Next steps

Complete one of our 10-minute quickstarts or check out our SDK samples:

> [!div class="nextstepaction"]
> [Quickstart: Recognize speech in C#](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=dotnet)
> [Speech SDK samples](speech-sdk.md#get-the-samples)
