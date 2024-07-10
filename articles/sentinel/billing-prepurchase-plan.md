---
title: Optimize costs with a prepurchase plan
titleSuffix: Microsoft Sentinel
description: Learn how to save costs and buy a Microsoft Sentinel prepurchase plan
author: austinmccollum
ms.topic: how-to
ms.date: 07/10/2024
ms.author: austinmc
#customerintent: As a SOC administrator or a billing specialist, I want to know how to buy a prepurchase plan and whether commit units will benefit us financially.
---

# Optimize Microsoft Sentinel costs with a prepurchase plan

Save on your Microsoft Sentinel costs when you prepurchase Microsoft Sentinel commit units (CUs). Use the prepurchased CUs at any time during the one year purchase term. Any eligible Microsoft Sentinel costs deduct first from the prepurchased CUs automatically. You don't need to redeploy or assign a prepurchased plan to your Microsoft Sentinel workspaces for the CU usage to get the prepurchase discounts.

## Determine the right size to buy

Prepurchase plans pair nicely with Microsoft Sentinel commitment tiers. Once you plan your Microsoft Sentinel ingestion volume and reduce complexity with a simplified pricing tier, choose an appropriate commitment tier. Then it's easier to decide on the size of a prepurchase plan to buy.

Think of the prepurchase plan as a pool of credits, called commit units (CUs), where CUs are equivalent to your purchase currency value. So, in US dollars (USD), 1 CU = $1 USD. If you have a simplified pricing commitment tier of 200 GB/day, there's an associated monthly estimated cost. For example purposes, let's say that's 20,000 USD and provides a 39% savings over pay-as-you-go. A $100,000 USD prepurchase plan covers 5 months of that commitment tier and is purchased at a 22% discount for $78,000 USD. The savings combine. The original pay-as-you-go price for 5 months of 200 GB/day ingestion and analysis costs is about $160,000 USD. With an accurate commitment tier and a prepurchase plan, the cost reduced to $78,000 for combined savings of over 51%.

>[!IMPORTANT]
> The prices mentioned are for example purposes only. To determine the latest commitment tier prices, see [Microsoft Sentinel pricing](https://azure.microsoft.com/en-us/pricing/details/microsoft-sentinel/).

The Microsoft Sentinel prepurchase CUs are applied to all Microsoft Sentinel costs. From your Microsoft Sentinel bill, these are all the costs with the **Sentine** service name. Keep in mind, Microsoft Sentinel integrates with many other Azure services which have separate costs. For more information, see [Costs and pricing for other services](billing.md#costs-and-pricing-for-other-services).

## Purchase Microsoft Sentinel commit units

Purchase Microsoft Sentinel prepurchase plans in the [Azure portal reservations](https://portal.azure.com/#view/Microsoft_Azure_Reservations/ReservationsBrowseBlade/productType/Reservations). To buy a prepurchase plan, you must have one of the following Azure subscriptions and roles:

- For an individual Azure subscription, the owner or reservation purchaser role is required.
- For an Enterprise Agreement (EA) subscription, **Reserved Instances** policy option must be enabled