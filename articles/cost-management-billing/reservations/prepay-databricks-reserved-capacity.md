---
title: Optimize Azure Databricks costs with a pre-purchase
description: Learn how you can prepay for Azure Databricks charges with reserved capacity to save money.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 11/17/2023
ms.author: banders
---

# Optimize Azure Databricks costs with a pre-purchase

You can save on your Azure Databricks unit (DBU) costs when you pre-purchase Azure Databricks commit units (DBCU) for one or three years. You can use the pre-purchased DBCUs at any time during the purchase term. Unlike VMs, the pre-purchased units don't expire on an hourly basis and you use them at any time during the term of the purchase.

Any Azure Databricks use deducts from the pre-purchased DBUs automatically. You don't need to redeploy or assign a pre-purchased plan to your Azure Databricks workspaces for the DBU usage to get the pre-purchase discounts.

The pre-purchase discount applies only to the DBU usage. Other charges such as compute, storage, and networking are charged separately.

## Determine the right size to buy

Databricks pre-purchase applies to all Databricks workloads and tiers. You can think of the pre-purchase as a pool of pre-paid Databricks commit units. Usage is deducted from the pool, regardless of the workload or tier. Usage is deducted in the following ratio:

| **Workload** | **DBU application ratio - Standard tier** | **DBU application ratio — Premium tier** |
| --- | --- | --- |
| Data Analytics | 0.4 | 0.55 |
| Data Engineering | 0.15 | 0.30 |
| Data Engineering Light | 0.07 | 0.22 |

For example, when a quantity of Data Analytics – Standard Tier is consumed, the pre-purchased Databricks commit units is deducted by 0.4 units.

Before you buy, calculate the total DBU quantity consumed for different workloads and tiers. Use the preceding ratios to normalize to DBCU and then run a projection of total usage over next one or three years.

## Purchase Databricks commit units

You can buy Databricks plans in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22Databricks%22%7D). To buy reserved capacity, you must have the owner role for at least one enterprise or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates subscription, or the required role for CSP subscriptions.

- You must be in an Owner role for at least one Enterprise Agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin of the subscription to enable it. Direct EA customers can now update **Reserved Instance** setting on [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). Navigate to the Policies menu to change settings.
- For CSP subscriptions, follow the steps in [Acquire, provision, and manage Azure reserved VM instances (RI) + server subscriptions for customers](/partner-center/azure-ri-server-subscriptions).


**To Purchase:**

1. Go to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22Databricks%22%7D).
1. Select a subscription. Use the **Subscription** list to select the subscription that's used to pay for the reserved capacity. The payment method of the subscription is charged the upfront costs for the reserved capacity. Charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
1. Select a scope. Use the **Scope** list to select a subscription scope:
    - **Single resource group scope** — Applies the reservation discount to the matching resources in the selected resource group only.
    - **Single subscription scope** — Applies the reservation discount to the matching resources in the selected subscription.
    - **Shared scope** — Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment.
    - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
1. Select how many Azure Databricks commit units you want to purchase and complete the purchase.


![Example showing Azure Databricks purchase in the Azure portal](./media/prepay-databricks-reserved-capacity/data-bricks-pre-purchase.png)

## Change scope and ownership

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Azure role-based access control (Azure RBAC)

You can't split or merge the Databricks commit unit pre-purchase. For more information about managing reservations, see [Manage reservations after purchase](manage-reserved-vm-instance.md).

## Cancellations and exchanges

Cancel and exchange isn't supported for Databricks pre-purchase plans. All purchases are final.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Understand how an Azure Databricks pre-purchase DBCU discount is applied](reservation-discount-databricks.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
