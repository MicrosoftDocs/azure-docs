---
title: Create an Azure Cognitive Services resource with commitment tier pricing
description: Learn how to sign up for commitment tier pricing, which is different than pay-as-you-go pricing.
author: aahill
ms.author: aahi
ms.custom: subject-cost-optimization, mode-other
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 09/01/2022
---

# Purchase commitment tier pricing

Cognitive Services offers commitment tier pricing, each offering a discounted rate compared to the pay-as-you-go pricing model. With commitment tier pricing, you can commit to using the following Cognitive Services features for a fixed fee, enabling you to have a predictable total cost based on the needs of your workload:
* Speech to Text (Standard)
* Text to Speech (Neural)
* Text Translation (Standard)
* Language Understanding standard (Text Requests)
* Azure Cognitive Service for Language
    * Sentiment Analysis
    * Key Phrase Extraction
    * Language Detection
* Computer Vision - OCR

Commitment tier pricing is also available for the following Applied AI service:
* Form Recognizer – Custom/Invoice

For more information, see [Azure Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

## Request approval to purchase a commitment plan

> [!CAUTION]
> The following instructions are for purchasing a commitment tier for web-based APIs and connected containers only. For instructions on purchasing plans for disconnected containers, see [Run containers in disconnected environments](containers/disconnected-containers.md).  

Before you can purchase a commitment plan, you must [submit an online application](https://aka.ms/csgatecommitment). If your application is approved, you will be able to purchase a commitment tier on the Azure portal, for both new and existing Azure Resources. 

* On the form, you must use a corporate email address associated with an Azure subscription ID.

* Check your email (both inbox and junk folders) for updates on the status of your application from `csgate@microsoft.com`.

Once you are approved, you can use either create a new resource to use a commitment plan, or update an existing resource. 

## Create a new resource

> [!NOTE]
> To purchase and use a commitment plan, your resource must have the Standard pricing tier. You cannot purchase a commitment plan (or see the option) for a resource that is on the free tier.

1. Sign into the [Azure portal](https://portal.azure.com/) and select **Create a new resource** for one of the applicable Cognitive Services or Applied AI services listed above. 

2. Enter the applicable information to create your resource. Be sure to select the standard pricing tier.

    :::image type="content" source="media/commitment-tier/create-resource.png" alt-text="A screenshot showing resource creation on the Azure portal." lightbox="media/commitment-tier/create-resource.png":::

3. Once your resource is created, you will be able to change your pricing from pay-as-you-go, to a commitment plan.  

## Purchase a commitment plan by updating your Azure resource

1. Sign in to the [Azure portal](https://portal.azure.com/) with the Azure subscription that was approved. 
2. In your Azure resource for one of the applicable features listed above, select **Commitment tier pricing**.

    > [!NOTE]
    > You will only see the option to purchase a commitment plan if:
    > * The resource is using the standard pricing tier.
    > * You have been approved to purchase  commitment tier pricing. 
 
3. Select **Change** to view the available commitments for hosted API and container usage. Choose a commitment plan for one or more of the following offerings:
    * **Web**: web-based APIs, where you send data to Azure for processing.
    * **Connected container**: Docker containers that enable you to [deploy Cognitive services on premises](cognitive-services-container-support.md), and maintain an internet connection for billing and metering.

    :::image type="content" source="media/commitment-tier/commitment-tier-pricing.png" alt-text="A screenshot showing the commitment tier pricing page on the Azure portal." lightbox="media/commitment-tier/commitment-tier-pricing.png":::

4. In the window that appears, select both a **Tier** and **Auto-renewal** option.

    * **Commitment tier** - The commitment tier for the feature. The commitment tier will be enabled immediately when you click **Purchase** and you will be charged the commitment amount on a pro-rated basis.
    
    * **Auto-renewal** - Choose how you want to renew, change, or cancel the current commitment plan starting with the next billing cycle. If you decide to auto-renew, the **Auto-renewal date** is the date (in your local timezone) when you will be charged for the next billing cycle. This date coincides with the start of the calendar month.
    
    > [!CAUTION]
    > Once you click **Purchase** you will be charged for the tier you select. Once purchased, the commitment plan is non-refundable.
    > 
    > Commitment plans are charged monthly, except the first month upon purchase which is pro-rated (cost and quota) based on the number of days remaining in that month. For the subsequent months, the charge is incurred on the first day of the month.

    :::image type="content" source="media/commitment-tier/enable-commitment-plan.png" alt-text="A screenshot showing the commitment tier pricing and renewal details on the Azure portal." lightbox="media/commitment-tier/enable-commitment-plan-large.png":::


## Overage pricing

If you use the resource above the quota provided, you will be charged for the additional usage as per the overage amount mentioned in the commitment tier.

## Purchase a different commitment plan 

The commitment plans have a calendar month commitment period. You can purchase a commitment plan at any time from the default pay-as-you-go pricing model. When you purchase a plan, you will be charged a pro-rated price for the remaining month. During the commitment period, you cannot change the commitment plan for the current month. However, you can choose a different commitment plan for the next calendar month. The billing for the next month would happen on the first day of the next month.

If you need a larger commitment plan than any of the ones offered, contact `csgate@microsoft.com`.

## End a commitment plan

If you decide that you don't want to continue purchasing a commitment plan, you can set your resource's auto-renewal to **Do not auto-renew**. Your commitment plan will expire on the displayed commitment end date. After this date, you won't be charged for the commitment plan. You will be able to continue using the Azure resource to make API calls, charged at pay-as-you-go pricing. You have until midnight (UTC) on the last day of each month to end a commitment plan, and not be charged for the following month. 

## See also

* [Azure Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).
* [Submit an application to purchase commitment tier pricing](https://aka.ms/csgatecommitment)
