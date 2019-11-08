---
title: Try Speech service for free
titleSuffix: Azure Cognitive Services
description: Getting started with Speech service is easy and affordable. With a 30-day free trial, you can discover what the service can do and decide whether it's right for your needs.
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

# Try Speech service for free

Using the Speech service is easy and affordable. There are several options available free of charge so you can discover what the service can do and decide whether it's right for your needs.

In this article, you'll use an Azure account to create a Speech resource. You can sign up for a free Microsoft Azure account—it comes with $200 in service credit that you can apply toward a paid Speech service subscription for up to 30 days. Speech service also offers a free, low-volume tier that's suitable for developing applications. You can keep this free subscription even after your free trial or service credit expires.

If want to use to evaluate the Speech service, you can do so for free without creating Azure account or Speech resource (no credit card required, no data saved after trial). Go to [Try Cognitive Service](https://azure.microsoft.com/try/cognitive-services/), select the **Speech APIs** tab, then **Get API Key** and you'll be prompted with a list of available login accounts you can use. Once that is successful you'll see the keys you can use to start coding your Speech app.

## Sign in to an Azure account

You can use your existing Azure account and the free pricing tier to try most Speech service features, or create a new Azure account.

New Azure accounts receive a $200 service credit that is available for up to 30 days. You can use this credit to further explore the Speech service or to begin application development.

To sign up for a new Azure account, go to the [Azure sign-up page](https://azure.microsoft.com/free/ai/), select **Start free**, and create a new Azure account using a Microsoft account.

You can sign up for a free Microsoft account at the [Microsoft account portal](https://account.microsoft.com/account). Select **Sign in with Microsoft** and then, when asked to sign in, select **Create a Microsoft account**. Follow the steps to create and verify your new Microsoft account.

After signing in to your new or existing Azure account, follow the steps in the next section to start a subscription to the Speech service.

## Create a Speech resource in Azure

> [!NOTE]
> You can create an unlimited number of standard-tier subscriptions in one or multiple regions. However, you can create only one free-tier subscription. Model deployments on the free tier that remain unused for 7 days will be decommissioned automatically.

To add a Speech service resource (free or paid tier) to your Azure account:

1. Sign in to the [Azure portal](https://portal.azure.com/) using your Microsoft account.

1. Select **Create a resource** at the top left of the portal. If you do not see **Create a resource**, you can always find it by selecting the collapsed menu in the upper left:

   ![collapsed navigation button](media/index/collapsed-nav.png)

1. In the **New** window, type "speech" in the search box and press ENTER.

1. In the search results, select **Speech**.

   ![speech search results](media/index/speech-search.png)

1. Select **Create** and enter:

   * A unique name for the new resource. The name helps you distinguish among multiple subscriptions to the same service.
   * Choose the Azure subscription that the new resource is associated with to determine how the fees are billed.
   * Choose the [region](regions.md) where the resource will be used.
   * Choose either a free or paid pricing tier. For complete information about pricing and usage quotas for each tier, select **View full pricing details**.
   * Create a new resource group for this Speech subscription or assign the subscription to an existing resource group. Resource groups help you keep your various Azure subscriptions organized.
   * Select **Create**. This will take you to the deployment overview and display deployment progress messages.

It takes a few moments to deploy your new Speech resource. Once deployment is complete, select **Go to resource** and if it's not already selected, in the left navigation pane select **Quickstart**. There are several items presented for you to explore if you like.

In the left nav pane under **Quickstart**, select **Keys** to display or regenerate your Speech service subscription keys. Each subscription has two keys; you can use either key in your application. To quickly copy/paste a key to your code editor or other location, select the copy button next to each key, switch windows to paste the clipboard contents to the desired location.

> [!IMPORTANT]
> These subscription keys are used to access your Cognitive Service API. Do not share your keys. Store them securely– for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

## Switch to a new subscription

To switch from one subscription to another, for example when your free trial expires or when you publish your application, replace the region and subscription key in your code with the region and subscription key of the new Azure resource.

## About regions

* If your application uses a [Speech SDK](speech-sdk.md), you provide the region code, such as `westus`, when creating a speech configuration.
* If your application uses one of the Speech service's [REST APIs](rest-apis.md), the region is part of the endpoint URI you use when making requests.
* Keys created for a region are valid only in that region. Attempting to use them with other regions will result in authentication errors.

## Next steps

Complete one of our 10-minute quickstarts or check out our SDK samples:

> [!div class="nextstepaction"]
> [Quickstart: Recognize speech in C#](~/articles/cognitive-services/Speech-Service/quickstarts/speech-to-text-from-microphone.md?pivots=programming-language-csharp&tabs=dotnet)
> [Speech SDK samples](speech-sdk.md#get-the-samples)
