---
title: Optimize Azure Synapse Analytics costs with a Pre-Purchase Plan
description: Learn how you can save on your Azure Synapse Analytics costs when you prepurchase Azure Synapse commit units (SCU) for one year.
author: bandersmsft
ms.reviewer: nitinarora
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 03/28/2023
ms.author: banders
---

# Optimize Azure Synapse Analytics costs with a Pre-Purchase Plan

You can save on your Azure Synapse Analytics costs when you prepurchase Azure Synapse commit units (SCU) for one year. You can use the prepurchased SCUs at any time during the purchase term. Unlike VMs, the prepurchased units don't expire on an hourly basis and you use them at any time during the term of the purchase.

Any Azure Synapse Analytics usage deducts from the prepurchased SCUs automatically. You don't need to redeploy or assign a Pre-Purchased Plan to your Azure Synapse Analytics workspaces to get the prepurchase discounts.

## Determine the right size to buy

A synapse prepurchase applies to all Synapse workloads and tiers. You can think of the Pre-Purchase Plan as a pool of prepaid Synapse commit units. Usage is deducted from the pool, regardless of the workload or tier. Integrated services such as VMs for SHIR, Azure Storage accounts, and networking components are charged separately.

There’s no ratio on which the SCUs are applied. SCUs are equivalent to the purchase currency value and are deducted at retail prices. Like other reservations, the benefit of a pre-purchase plan is discounted pricing by committing to a purchase term. The more you buy, the larger the discount you receive.

For example, if you want to use your SCUs for Data Warehousing – Dedicated SQL pool in West US 2, and you consume 1 hour of SQL Dedicated Pool DWU100 that has a retail price of $1.20, then 1.2 SCUs are consumed.

The Synapse prepurchase discount applies to usage from the following products:

- Azure Synapse Analytics Dedicated SQL Pool
- Azure Synapse Analytics Managed VNET
- Azure Synapse Analytics Pipelines
- Azure Synapse Analytics Serverless SQL Pool
- Azure Synapse Analytics Serverless Apache Spark Pool - Memory Optimized
- Azure Synapse Analytics Data Flow - Basic
- Azure Synapse Analytics Data Flow - Standard

For more information about available SCU tiers and pricing discounts, you use the reservation purchase experience in the following section.

## Purchase Synapse commit units

You buy Synapse plans in the [Azure portal](https://portal.azure.com). To buy a Pre-Purchase Plan, you must have the owner role for at least one enterprise or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates subscription, or the required role for CSP subscriptions.

- You must be in an Owner role for at least one Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
- For Enterprise Agreement (EA) subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin of the subscription.
- For CSP subscriptions, follow the steps in [Acquire, provision, and manage Azure reserved VM instances (RI) + server subscriptions for customers](/partner-center/azure-ri-server-subscriptions).

### To Purchase:

1. Go to the [Azure portal](https://portal.azure.com/?synapse=true#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/Browse_AddCommand/autoOpenSpecPicker//productType/Reservation).
1. If needed, navigate to **Reservations** and then at the top of the page, select **+ Add**.
1. On the Purchase reservations page, select **Azure Synapse Analytics Pre-Purchase Plan**.
1. On the Select the product you want to purchase page, select a subscription. Use the **Subscription** list to select the subscription that's used to pay for the reserved capacity. The payment method of the subscription is charged the upfront costs for the reserved capacity. Charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
1. Select a scope. Use the **Scope** list to select a subscription scope:
    - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
    - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
    - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment.
    - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
1. Select how many SCUs you want to purchase and then complete the purchase.  
    :::image type="content" source="./media/synapse-analytics-pre-purchase-plan/buy-synapse-analytics-pre-purchase-plan.png" alt-text="Screenshot showing the Select the product experience for the Azure Synapse Analytics Pre-Purchase Plan." lightbox="./media/synapse-analytics-pre-purchase-plan/buy-synapse-analytics-pre-purchase-plan.png" :::

## Change scope and ownership

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Azure role-based access control (Azure RBAC)

You can't split or merge a Synapse commit unit Pre-Purchase Plan. For more information about managing reservations, see [Manage reservations after purchase](manage-reserved-vm-instance.md).

## Cancellations and exchanges

Cancel and exchange isn't supported for Synapse Pre-Purchase Plans. All purchases are final.

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Manage Azure Reservations](manage-reserved-vm-instance.md)
- [Understand Azure Reservations discount](understand-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
