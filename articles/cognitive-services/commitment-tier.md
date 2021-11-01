---
title: Create an Azure Cognitive Services resource with commitment tier pricing
description: Learn how to sign up for commitment tier pricing, which is different than pay-as-you-go pricing. 
author: aahill
ms.author: aahi
ms.custom: subject-cost-optimization
ms.service: cognitive-services
ms.topic: how-to
ms.date: 12/15/2020
---

# Sign up for the commitment tier

In addition to the Pay-As-You-Go model, Cognitive Services has commitment tiers, which can cost your organization less than the Pay-As-You-Go price. With the commitment tier pricing, you can commit to using the following Cognitive Services features for a fixed fee, enabling you to have a predictable total cost for The following Cognitive Service features:

* Speech to Text (Standard)
* Text to Speech (Neural)
* Text Translation (Standard)
* Language Understanding standard (Text Requests)
* Azure Cognitive Service for Language
    * Sentiment Analysis
    * Key Phrase Extraction
    * Language Detection
* Form Recognizer – Custom/Invoice
* Computer Vision - Read

For more information, see [Azure Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

## Request approval to use commitment tier pricing

Before you can sign up for commitment tier pricing, you must [submit an online application](https://aka.ms/csgatecommitment). If your application is approved, you will be able to sign up for a commitment tier on the Azure portal, for both new and existing Azure Resources. 

* On the form, you must use a corporate email address associated with an Azure subscription ID.

* Check your email (both inbox and junk folders) for updates on the status of your application from Microsoft.

Once you are approved, you can use either create a new resource to use a commitment tier, or update an existing resource. 

> [!IMPORTANT]
> To use commitment tier pricing, your resource must have the Standard (S0) pricing tier. You cannot upgrade a resource that is on the free (F0) tier.

## Create a new resource

Sign into the Azure portal and select **Create a new resource** for one of the applicable Cognitive Services. 

:::image type="content" source="media/commitment-tier/create-resource.png" alt-text="A screenshot showing resource creation on the Azure portal." lightbox="media/commitment-tier/create-resource.png":::

Once your resource is created, you will be able to change your pricing from pay-as-you-go, to commitment tier pricing.  

## Update a resource to use commitment tier pricing

1. Sign in to the [Azure portal](https://portal.azure.com/) with the Azure subscription that was approved. 
2. In your Azure resources for applicable features listed above, select **Commitment tier pricing**. 
3. Select **Change** to view the available commitments for hosted API and container usage. 

    :::image type="content" source="media/commitment-tier/commitment-tier-pricing.png" alt-text="A screenshot showing the commitment tier pricing page on the Azure portal." lightbox="media/commitment-tier/commitment-tier-pricing.png":::

4. In the window that appears, select both a **Tier** and **Auto-renewal** option.

    :::image type="content" source="media/commitment-tier/enable-commitment-plan.png" alt-text="A screenshot showing the commitment tier pricing and renewal details on the Azure portal." lightbox="media/commitment-tier/enable-commitment-plan.png":::

    * **Tier** - The commitment tier for the capability. The commitment tier will be enabled immediately when you click **Purchase** and you will be charged the commitment amount on a pro-rated basis.
    
    * **Auto-renewal** - The way you want to renew the current commitment plan in the next billing cycle. If you decide to auto-renew, the **Auto-renewal date** is the date (in your local timezone) when you will be charged for the next billing cycle. This date coincides with the start of the calendar month (UTC).
    

    > [!CAUTION]
    > Once you click **Purchase** you will be charged for the tier you select. Commitment tier billing is not refundable.

## Usage, billing, and overage pricing

Any usage above the commitment tier (overage) is billed at an overage price, which is at the same discounted rate compared to pay-as-you-go. The commitment tiers have a calendar month commitment period. You can upgrade from Pay-As-You-Go to commitment anytime. When you upgrade, you will be charged with a prorated price for the remaining month. During the commitment period, you can switch to any other available tier, but you will only be billed at the new tier's pricing at beginning of the month. Billing the commitment portion of a commitment tier is done on the first day of each month, and is pre-paid for the month.


## Ending commitment tier service

If you decide that you don't want to use commitment tier pricing, you can set your resource's auto-renewal to **Do not auto-renew**. Your commitment plan will expire on the displayed commitment end date. After this date, you won't be charged for the commitment plan. You will be able to continue using the Azure resource to make API calls, and you would be charged at pay-as-you-go pricing.

## See also

[Azure Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

