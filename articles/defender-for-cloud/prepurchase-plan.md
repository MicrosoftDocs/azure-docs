---
title: Optimize Microsoft Defender for Cloud costs with a prepurchase plan
description: Learn how you can optimize Microsoft Defender for Cloud costs with a prepurchase plan.
ms.topic: how-to
ms.reviewer: liuyizhu
ms.service: cost-management-billing
ms.subservice: reservations
ms.date: 05/15/2024
---

# Optimize Microsoft Defender for Cloud costs with a prepurchase plan

You can save on your Microsoft Defender for Cloud costs when you prepurchase Microsoft Defender for Cloud commit units (DCU) for one year. You can use the prepurchased DCUs at any time during the purchase term. Unlike VMs, the prepurchased units don't expire on an hourly basis and you can use them at any time during the term of the purchase.

Any eligible Microsoft Defender for Cloud usage deducts from the prepurchased DCUs automatically. You don't need to redeploy or assign a prepurchased plan to your Microsoft Defender for Cloud workspaces for the DCU usage to get the prepurchase discounts.

## Determine the right size to buy

A Defender for Cloud prepurchase applies to all Defender for Cloud plans. You can think of the prepurchase as a pool of prepaid Defender for Cloud commit units. Usage is deducted from the pool, regardless of the workload.

There’s no ratio on which the DCUs are applied. DCUs are equivalent to the purchase currency value and are deducted at retail prices. Like other reservations, the benefit of a prepurchase plan is discounted pricing by committing to a purchase term. The more you buy, the larger the discount you receive.

For example, if you purchase 5,000 Commit Units for a one year term, you get a 20% discount on Defender for Cloud products at this tier, so you pay only 4,000 USD. You can use these units with Defender for Servers P2 and Defender CSPM plans on 20 Virtual machines (Azure VMs) for one year, which uses up 4800 Commit units. In this example, we use $15/$5 monthly retail price and 1 DCU = $1.

> [!NOTE]
> The mentioned prices are for example purposes only. They aren't intended to represent actual costs.

The Microsoft Defender for Cloud prepurchase discount applies to usage from the following products:

- Microsoft Defender for Servers
- Microsoft Defender for App Service
- Microsoft Defender for Storage
- Microsoft Defender for Key Vault
- Microsoft Defender for SQL
- Microsoft Defender for DNS
- Microsoft Defender for Resource Manager
- Microsoft Defender for PostgreSQL
- Microsoft Defender for MariaDB
- Microsoft Defender for Azure Cosmos DB
- Microsoft Defender for Containers
- Microsoft Defender CSPM
- Microsoft Defender for APIs

For more information about available DCU tiers and pricing discounts, see the reservation purchase experience in the following section.

## Purchase Defender for Cloud commit units

You can buy Defender for Cloud plans in the [Azure portal](https://portal.azure.com/). To buy a prepurchase plan, you must have the owner role for at least one enterprise or Microsoft Customer Agreement or an individual subscription with pay-as-you-go rates subscription, or the required role for CSP subscriptions.

- To buy a reservation, you must have owner role or reservation purchaser role on an Azure subscription.

- For Enterprise Agreement (EA) subscriptions, the **Reserved Instances** policy option must be enabled in the [Azure portal](/azure/cost-management-billing/manage/direct-ea-administration#view-and-manage-enrollment-policies). Or if that setting is disabled, you must be an EA Admin of the subscription.

- For CSP subscriptions, follow the steps in [Acquire, provision, and manage Azure reserved VM instances (RI) + server subscriptions for customers](/partner-center/azure-ri-server-subscriptions).

**To Purchase:**

1. Go to the [Azure portal](https://portal.azure.com/).
1. If needed, navigate to **Reservations** and then at the top of the page, select **+ Add**.
1. On the Purchase reservations page, select **Microsoft Defender for Cloud Pre-Purchase Plan**.
1. On the Select the product you want to purchase page, select a subscription. Use the **Subscription** list to select the subscription used to pay for the reserved capacity. The payment method of the subscription is charged the upfront costs for the reserved capacity. Charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
1. Select a scope. Use the **Scope** list to select a subscription scope:
    - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
    - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
    - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment.
    - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
1. Select how many Microsoft Defender for Cloud commit units you want to purchase and complete the purchase.

    :::image type="content" source="media/prepay-reserved-capacity/purchase-reservations.png" alt-text="Screenshot of purchase reservations for Defender for Cloud." lightbox="media/prepay-reserved-capacity/purchase-reservations.png":::

## Change scope and ownership

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Azure role-based access control (Azure RBAC)

You can't split or merge the Defender for Cloud commit unit prepurchase plan. For more information about managing reservations, see [Manage reservations after purchase](/azure/cost-management-billing/reservations/manage-reserved-vm-instance).

## Cancellations and exchanges

Cancel and exchange isn't supported for Defender for Cloud prepurchase plans. All purchases are final.

## Related content

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](/azure/cost-management-billing/reservations/save-compute-costs-reservations)

- [Manage Azure Reservations](/azure/cost-management-billing/reservations/manage-reserved-vm-instance)

- [Understand Azure Reservations discount](/azure/cost-management-billing/reservations/understand-reservation-charges)

- [Understand reservation usage for your pay-as-you-go subscription](/azure/cost-management-billing/reservations/understand-reserved-instance-usage)

- [Understand reservation usage for your Enterprise enrollment](/azure/cost-management-billing/reservations/understand-reserved-instance-usage-ea)
