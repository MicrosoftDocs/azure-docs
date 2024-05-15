---
title: Optimize Microsoft Defender for Cloud costs with a prepurchase
description: Learn how you can prepay for Microsoft Defender for Cloud charges with reserved capacity to save money.
ms.topic: how-to
ms.date: 05/15/2024
---

# Optimize Microsoft Defender for Cloud costs with a prepurchase

You can save on your Microsoft Defender for Cloud unit (MCU) costs when you prepurchase Microsoft Defender for Cloud commit units (MCU) for one or three years. You can use the prepurchased MCUs at any time during the purchase term. Unlike VMs, the prepurchased units don't expire on an hourly basis and you use them at any time during the term of the purchase.

Any Microsoft Defender for Cloud use deducts from the prepurchased MCUs automatically. You don't need to redeploy or assign a prepurchased plan to your Microsoft Defender for Cloud workspaces for the MCU usage to get the prepurchase discounts.

The prepurchase discount applies only to the MCU usage. Other charges such as compute, storage, and networking are charged separately.

## Determine the right size to buy

Defender for Cloud prepurchase applies to all Defender for Cloud plans. You can think of the prepurchase as a pool of prepaid Defender for Cloud commit units. Usage is deducted from the pool, regardless of the workload or tier. Usage is deducted in the following ratios:

| Workload | MCU application ratio - Standard tier | MCU application ratio - Premium tier |
| --- | --- | --- |
| All-purpose compute | 0.4 | 0.55 |
| Jobs compute | 0.15 | 0.30 |
| Jobs light compute | 0.07 | 0.22 |
| SQL compute | N/A | 0.22 |
| SQL Pro compute | N/A | 0.55 |
| Serverless SQL | N/A | 0.70 |
| Serverless real-time inference | N/A | 0.082 |
| Model training | N/A | 0.65 |
| Delta Live Tables | NA | 0.30 (core), 0.38 (pro), 0.54 (advanced) |
| All Purpose Photon | NA | 0.55 |

For example, when All-purpose compute – Standard Tier capacity gets consumed, the prepurchased Defender for Cloud commit units get deducted by 0.4 units. When Jobs light compute – Standard Tier capacity gets used, the prepurchased Defender for Cloud commit unit gets deducted by 0.07 units.

>[!NOTE]
> Enabling Photon increases the MCU count.

Before you buy, calculate the total MCU quantity consumed for different workloads and tiers. Use the preceding ratios to normalize to MCU and then run a projection of total usage over next one or three years.

## Purchase Defender for Cloud commit units

You can buy Defender for Cloud plans in the [Azure portal](https://portal.azure.com/).

To buy reserved capacity, you must have the owner role for at least:

- An Enterprise Agreement
- Microsoft Customer Agreement
- Individual subscription with pay-as-you-go rates subscription
- Required role for a CSP subscription

- To buy a reservation, you must have owner role or reservation purchaser role on an Azure subscription.
- For Enterprise subscriptions, **Reserved Instances** policy option must be enabled in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). Navigate to the **Policies** menu to change settings.
- For CSP subscriptions, follow the steps in [Acquire, provision, and manage Azure reserved VM instances (RI) + server subscriptions for customers](/partner-center/azure-ri-server-subscriptions).

**To Purchase:**

1. Go to the [Azure portal](https://portal.azure.com/).
1. Select a subscription. Use the **Subscription** list to select the subscription that gets used to pay for the reserved capacity. The payment method of the subscription is charged the upfront costs for the reserved capacity. Charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
1. Select a scope. Use the **Scope** list to select a subscription scope:
    - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
    - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
    - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment.
    - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
1. Select how many Microsoft Defender for Cloud commit units you want to purchase and complete the purchase.

## Change scope and ownership

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Azure role-based access control (Azure RBAC)

You can't split or merge the Defender for Cloud commit unit prepurchase. For more information about managing reservations, see [Manage reservations after purchase](/azure/cost-management-billing/reservations/manage-reserved-vm-instance).

## Cancellations and exchanges

Cancel and exchange isn't supported for Defender for Cloud prepurchase plans. All purchases are final.

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Related content

- [Understand how a Microsoft Defender for Cloud prepurchase MCU discount is applied](reservation-discount.md)
