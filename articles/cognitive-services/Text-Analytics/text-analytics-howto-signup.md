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

  For Text Analytics, there is a Free tier for exploration and evaluation, and billable tiers for production workloads. You only have one sign-up, but changing tiers is simple if your request volume increases.

> [!Note]
> Cognitive Services has multiple APIs. Each API ships new features and transitions from preview to general availability on its own schedule. For this reason, we ask you to sign up for each API independently.

## How to change tiers

Start with a Free tier and then transition to a billable tier for production workloads. Standard billing is offered at graduated levels. You can switch tiers and still keep the same endpoint and access keys.

1. Sign in to [Azure portal](https://portal.azure.com) and [find your service](text-analytics-howto-accesskey.md).

2. Click **Price Tier**.

   ![Price tier command in left navigation menu](../media/text-analytics/portal-pricing-tier.png)

3. Choose a tier Sand click **Select**.  The new limits take effect as soon as the selection is processed. 

   ![Tiles and Select button in tier selection page](../media/text-analytics/portal-choose-tier.png)

## How billing works

Billing is based on transactions, where a transaction is based on the number of documents multiplied by unit of operation. There is no storage component to billing because we do not store your data. The following table illustrates the billing model at a glance.

| Document | Sentiment | Key Phrase | Language Detection | Transactions |
|----------|-----------|------------|--------------------|--------------|
| 1  | ✔ | ✔ | ✔ | 3 |
| 100 | ✔ | ✔ |   | 200 |
| 1000 |   |   | ✔ | 1000 |

Each tier provides an allocation of transactions to be consumed over a 30-day billing cycle. The counter is reset back to 0 on day 31. 

**What happens if transactions get used up before the current billing period ends?**

At the Free tier, excess requests are not handled and you get a message explaining why the request was dropped.

For billable tiers, an overage rate is applied for each transaction above the limit. The overage rate varies by tier, as indicated on the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/). 

 > [!Note]
 > Text Analytics was [first announced](https://blogs.technet.microsoft.com/machinelearning/2016/06/21/text-analytics-api-now-available-in-multiple-languages/) in June 2016 and is now [generally available (GA)](https://azure.microsoft.com//blog/) with support for production workloads. Preview pricing has been retired. For more information about service level agreements (SLA) from Microsoft, see [SLA for Cognitive Services](https://azure.microsoft.com/support/legal/sla/cognitive-services/v1_1/).

## Next steps

Refer to the pricing page for current rates:

+ [Pricing for text analytics](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/)
+ [Calculator](https://azure.microsoft.com/pricing/calculator/?service=cognitive-services)

## See also 

 [Text Analytics Overview](overview.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)