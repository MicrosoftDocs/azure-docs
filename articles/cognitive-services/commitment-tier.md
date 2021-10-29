---
title: Plan to manage costs for Azure Cognitive Services
description: Learn how to plan for and manage costs for Azure Cognitive Services by using cost analysis in the Azure portal.
author: erhopf
ms.author: erhopf
ms.custom: subject-cost-optimization
ms.service: cognitive-services
ms.topic: how-to
ms.date: 12/15/2020
---

# Sign up for the commitment tier

In addition to the Pay-As-You-Go model, Cognitive Services has commitment Tiers, which can cost your organization less than the Pay-As-You-Go price. With the commitment tier pricing, you can commit to using the following Cognitive Services features for a fixed fee, enabling you to have a predictable total cost for The following Cognitive Service features:

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


> [!IMPORTANT]
> Before you can sign up for commitment tier pricing, you must [submit an online application](https://aka.ms/csgatecommitment). If your application is approved, you will be able to sign up for a commitment tier on the Azure portal. 

Any usage above the commitment level (overage) is billed at an overage price, which is at the same discounted rate compared to pay-as-you-go. The commitment tiers have a calendar month commitment period. You can upgrade from Pay-As-You-Go to commitment anytime. When you upgrade you will charged with a prorated price for the remaining month. During the commitment period you can switch to any other available tier, but you will only be billed at the new tier's pricing at beginning of the month. Billing the commitment portion of a commitment tier is done on the first day of each month, and is pre-paid for the month. Commitment tier billing is not refundable.

For more details, see [Azure Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

### Sign up for a commitment tier

Once you are approved, you can use either create a new resource](cognitive-services-apis-create-account.md with a commitment tier, or update an existing resource. 

1. Sign into the Azure portal and select **Create a new resource** for one of the applicable Cognitive Services. 

    > [!IMPORTANT]
    > Be sure to use the Standard (S0) pricing tier. Once your resource is created, you will be able to change your pricing from pay-as-you-go, to commitment tier pricing.  

    :::image type="content" source="media/commitment-tier/create-resource.png" alt-text="A screenshot showing resource creation on the Azure portal." lightbox="media/cost-management/commitment-tier-pricing.png":::

## Update an existing resource:

1. Log in to the [Azure portal](https://portal.azure.com/) with the Azure subscription that was approved. 
2. In your Azure resources for applicable features listed above, select **Commitment tier pricing**. 
3. Select **Change** to view the available commitments for hosted API and container usage. 

    :::image type="content" source="media/cost-management/commitment-tier-pricing.png" alt-text="A screenshot showing the commitment tier pricing page on the Azure portal." lightbox="media/cost-management/commitment-tier-pricing.png":::
