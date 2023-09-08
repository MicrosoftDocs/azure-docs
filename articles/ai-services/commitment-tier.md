---
title: Create an Azure AI services resource with commitment tier pricing
description: Learn how to sign up for commitment tier pricing, which is different than pay-as-you-go pricing.
author: aahill
ms.author: aahi
ms.custom: subject-cost-optimization, mode-other
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 12/01/2022
---

# Purchase commitment tier pricing

Azure AI offers commitment tier pricing, each offering a discounted rate compared to the pay-as-you-go pricing model. With commitment tier pricing, you can commit to using the following Azure AI services features for a fixed fee, enabling you to have a predictable total cost based on the needs of your workload:

* Speech to text (Standard)
* Text to speech (Neural)
* Text Translation (Standard)
* Language Understanding standard (Text Requests)
* Azure AI Language
  * Sentiment Analysis
  * Key Phrase Extraction
  * Language Detection

Commitment tier pricing is also available for the following Azure AI service:

* Azure AI Language
  * Sentiment Analysis
  * Key Phrase Extraction
  * Language Detection

* Azure AI Vision - OCR

* Document Intelligence – Custom/Invoice

For more information, see [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

## Create a new resource

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a new resource** for one of the applicable Azure AI services or Azure AI services listed.

2. Enter the applicable information to create your resource. Be sure to select the standard pricing tier.

    > [!NOTE]
    > If you intend to purchase a commitment tier for disconnected container usage, you will need to request separate access and select the **Commitment tier disconnected containers** pricing tier. For more information, [disconnected containers](./containers/disconnected-containers.md).

    :::image type="content" source="media/commitment-tier/create-resource.png" alt-text="A screenshot showing resource creation on the Azure portal." lightbox="media/commitment-tier/create-resource.png":::

3. Once your resource is created, you can change your pricing from pay-as-you-go, to a commitment plan.

## Purchase a commitment plan by updating your Azure resource

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure subscription.
2. In your Azure resource for one of the applicable features listed, select **Commitment tier pricing**.
3. Select **Change** to view the available commitments for hosted API and container usage. Choose a commitment plan for one or more of the following offerings:
    * **Web**: web-based APIs, where you send data to Azure for processing.
    * **Connected container**: Docker containers that enable you to [deploy Azure AI services on premises](cognitive-services-container-support.md), and maintain an internet connection for billing and metering.

    :::image type="content" source="media/commitment-tier/commitment-tier-pricing.png" alt-text="A screenshot showing the commitment tier pricing page on the Azure portal." lightbox="media/commitment-tier/commitment-tier-pricing.png":::

4. In the window that appears, select both a **Tier** and **Auto-renewal** option.

    * **Commitment tier** - The commitment tier for the feature. The commitment tier is enabled immediately when you select **Purchase** and you're charged the commitment amount on a pro-rated basis.

    * **Auto-renewal** - Choose how you want to renew, change, or cancel the current commitment plan starting with the next billing cycle. If you decide to autorenew, the **Auto-renewal date** is the date (in your local timezone) when you'll be charged for the next billing cycle. This date coincides with the start of the calendar month.

    > [!CAUTION]
    > Once you select **Purchase** you will be charged for the tier you select. Once purchased, the commitment plan is non-refundable.
    >
    > Commitment plans are charged monthly, except the first month upon purchase which is pro-rated (cost and quota) based on the number of days remaining in that month. For the subsequent months, the charge is incurred on the first day of the month.

    :::image type="content" source="media/commitment-tier/enable-commitment-plan.png" alt-text="A screenshot showing the commitment tier pricing and renewal details on the Azure portal." lightbox="media/commitment-tier/enable-commitment-plan-large.png":::


## Overage pricing

If you use the resource above the quota provided, you're charged for the additional usage as per the overage amount mentioned in the commitment tier.

## Purchase a different commitment plan

The commitment plans have a calendar month commitment period. You can purchase a commitment plan at any time from the default pay-as-you-go pricing model. When you purchase a plan, you're charged a pro-rated price for the remaining month. During the commitment period, you can't change the commitment plan for the current month. However, you can choose a different commitment plan for the next calendar month. The billing for the next month would happen on the first day of the next month.

If you need a larger commitment plan than any of the ones offered, contact `csgate@microsoft.com`.

## End a commitment plan

If you decide that you don't want to continue purchasing a commitment plan, you can set your resource's autorenewal to **Do not auto-renew**. Your commitment plan expires on the displayed commitment end date. After this date, you won't be charged for the commitment plan. You're able to continue using the Azure resource to make API calls, charged at pay-as-you-go pricing. You have until midnight (UTC) on the last day of each month to end a commitment plan, and not be charged for the following month.

## See also

* [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).
