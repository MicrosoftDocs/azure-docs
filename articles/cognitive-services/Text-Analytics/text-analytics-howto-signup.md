---
title:  Sign up for Text Analytics API (Microsoft Cognitive Services on Azure) | Microsoft Docs
description: Instructions for signing up to use text analysis and operating within limits.
services: cognitive-services
author: HeidiSteen
manager: jhubbard

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: get-started-article
ms.date: 08/24/2017
ms.author: heidist
---

# How to sign up for Text Analytics API

Text Analytics resources are available 24-7 in the cloud. Before you can upload your content for analysis, you must sign up to get an access key. Each call to the API requires an access key on the request.

+ Start with an Azure Subscription. You can create a [free account](https://azure.microsoft.com/free/) to experiment at no charge.

+ Create a [Cognitive Services API account] (https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account), choosing the **Text Analytics API**. Your key is generated when you sign up.

For Text Analytics, there is a Free tier for exploration and evaluation, and billable tiers for production workloads. You can have multiple sign-ups in each subscrption: one free, one paid, and so forth. You can switch to a tier offering more transactions if your request volume increases.

There is no service level agreement for services in Preview or the free tier. For more information, see [SLA for Cognitive Services](https://azure.microsoft.com/support/legal/sla/cognitive-services/v1_1/)

## How to change tiers

Start with a Free tier and then transition to a billable tier for production workloads. Standard billing is offered at graduated levels. You can switch tiers and still keep the same endpoint and access keys.

1. Sign in to [Azure portal](https://portal.azure.com) and [find your service](text-analytics-howto-accesskey.md).

2. Click **Price tier**.

   ![Price tier command in left navigation menu](../media/text-analytics/portal-pricing-tier.png)

3. Choose a tier and click **Select**.  The new limits take effect as soon as the selection is processed. 

   ![Tiles and Select button in tier selection page](../media/text-analytics/portal-choose-tier.png)

## How billing works

Billing is based on the number of transactions. You can purchase a block of transactions at a specific tier in a monthly billing cycle, and then if you go over, a small overage charge is applied per transaction. If you routinely go over the maximum limit, consider switching to a higher tier.

Current rates are offered at a preview discount while the service is in preview. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/).

## Next steps

Refer to the pricing page for current rates. The calculator is helpful if you are subscribing to multiple services.

+ [Pricing for text analytics](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/)
+ [Calculator](https://azure.microsoft.com/pricing/calculator/?service=cognitive-services)

## See also 

 [Text Analytics Overview](overview.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)