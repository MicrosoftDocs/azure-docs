---
title: Prepay for compute with reservations - Azure Managed Redis
description: Prepay for Azure Managed Redis compute resources with reservations
ms.date: 11/12/2025
ms.topic: conceptual
ai-usage: ai-assisted
ms.custom:
  - ignite-2024
  - build-2025
  - references_regions
appliesto:
  - ✅ Azure Managed Redis
---

# Prepay for Azure Managed Redis compute resources with reservations

Azure Managed Redis reservations reduce costs by prepaying for compute resources. You commit to a cache in exchange for significant compute cost discounts.

Reservations prepay compute costs for one or three years. Once purchased, matching compute charges use reserved rates instead of pay-as-you-go pricing.

Purchase reservations for a specific Azure region, Redis tier, term, and node quantity. You don't assign reservations to specific cache instances - existing and new caches automatically receive reserved pricing up to the total reservation size.

You can enable auto-renewal or let the reservation expire and revert to pay-as-you-go pricing. You can pay upfront or monthly. For details, see [Buy a reservation](/azure/cost-management-billing/reservations/prepare-buy-reservation).

For pricing information, see the [Azure Managed Redis pricing page](https://azure.microsoft.com/pricing/details/managed-redis/). Reservations don't cover networking or storage charges.

For details on how Enterprise Agreement (EA) customers and pay-as-you-go customers are charged for reservation purchases:

- [Get Enterprise Agreement and Microsoft Customer Agreement reservation costs and usage](/azure/cost-management-billing/reservations/understand-reserved-instance-usage-ea)
- [Understand Azure reservation usage for your pay-as-you-go rate subscription](/azure/cost-management-billing/reservations/understand-reserved-instance-usage).

## Reservation planning

The following Azure Managed Redis tiers currently support reservations:

| Region Name         | Memory Optimized | Balanced | Compute Optimized | Flash Optimized |
| ------------------- | ---------------- | -------- | ---------------- | --------------- |
| UAE North           | Yes              | Yes      | Yes              | No              |
| Australia Central   | Yes              | Yes      | Yes              | No              |
| Australia Southeast | Yes              | Yes      | Yes              | No              |
| Brazil Southeast    | Yes              | Yes      | Yes              | No              |
| Canada East         | Yes              | Yes      | Yes              | No              |
| Switzerland West    | Yes              | Yes      | Yes              | No              |
| Spain Central       | Yes              | Yes      | Yes              | No              |
| France Central      | Yes              | Yes      | Yes              | No              |
| France South        | Yes              | Yes      | Yes              | No              |
| Indonesia Central   | Yes              | Yes      | Yes              | No              |
| Israel Central      | Yes              | Yes      | Yes              | No              |
| Israel Northwest    | No               | Yes      | No               | No              |
| India Central       | Yes              | Yes      | Yes              | No              |
| India South         | Yes              | Yes      | Yes              | No              |
| India West          | Yes              | Yes      | Yes              | No              |
| Italy North         | Yes              | Yes      | Yes              | No              |
| Japan East          | Yes              | Yes      | Yes              | No              |
| Korea Central       | Yes              | Yes      | Yes              | No              |
| Korea South         | Yes              | Yes      | Yes              | No              |
| Norway East         | Yes              | Yes      | Yes              | No              |
| Poland Central      | Yes              | Yes      | Yes              | No              |
| Qatar Central       | Yes              | Yes      | Yes              | No              |
| UK West             | Yes              | Yes      | Yes              | No              |
| US East             | Yes              | No       | Yes              | No              |
| South Africa North  | Yes              | Yes      | Yes              | No              |

## Buy Azure Managed Redis reservations

To buy a reservation:

- You must have Owner or Reservation Purchaser role in the Azure subscription.
- For Azure Managed Redis subscriptions, you must enable **Add Reserved Instances** in the [EA portal](https://ea.azure.com/). Or if that setting is disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Managed Redis reservations. For more information, see [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](/partner-center/azure-reservations).

How to use the Azure portal to buy reservations:

1. In the portal, search for and select **Reservations** and then select **Add**, or select this link to the [Purchase reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/) page.
1. On the **Purchase reservations** page, select **Azure Cache for Redis**.
1. In the **Select the product you want to purchase** pane, select the **Scope** and **Subscription** you want to use for the reservation.
1. Select the values you want from the dropdown lists for **Region**, **Term**, and **Billing frequency**.

The following list describes the form fields in detail.

- **Subscription**: The subscription used to pay for the reservation. The subscription type must be EA, offer numbers MS-AZR-0017P or MS-AZR-0148P, or an individual agreement with pay-as-you-go pricing, offer numberS-AZR-0003P, or MS-AZR-0023P. For an EA subscription, the charges are deducted from the enrollment's Azure Prepayment balance or charged as overage. For pay-as-you-go, the charges are billed to the subscription's credit card or invoice.
- **Scope**: The reservation's scope.
  - **Shared** applies the reservation discount to cache instances in any subscriptions in your billing context. For EA, the shared scope is the enrollment and includes subscriptions within the enrollment. For pay-as-you-go, the shared scope is all pay-as-you-go subscriptions created by the account administrator.
  - **Single subscription** applies the reservation discount to cache instances in this subscription.
  - **Single resource group** applies the reservation discount to instances in the selected resource group within the subscription.
  - **Management group** applies the reservation discount to matching resources in subscriptions that are a part of both the management group and billing scope.
- **Region**: The Azure region for the reservation.
- **Term**: **1 year** or **3 years**.
- **Billing frequency**: **Monthly** or **Upfront**.
- **Recommended quantity**: The recommended number of nodes to reserve in the selected Azure region, tier, and scope. Select **See details** for details about recommended quantities.

Existing or new caches that match the attributes you select get the reservation discount. The actual number of instances that get the discount depends on the scope and quantity you select.

1. Select the reservation you want, and note the **Monthly price per node** and estimated savings calculated at lower right.
1. Select **Add to cart** and then select **View cart** to close the product list pane.
1. On the **Purchase reservations** page, review the reservation details.
1. **Auto-renew** is **On** by default to automatically renew your reservation at the end of the term. You can set it to **Off** now or any time before the end of the term.
1. Select **Next: Review + buy**.
1. Review the details, **Additional notes**, **Today's charge**, and **Total cost**, and then select **Buy now**.

- You can update the scope of the reservation through the Azure portal, PowerShell, Azure CLI, or the API.

- You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations).

## Related content

- [Azure Managed Redis pricing page](https://azure.microsoft.com/pricing/details/managed-redis/)
- [What are Azure Reservations?](/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Manage Azure Reservations](/azure/cost-management-billing/reservations/manage-reserved-vm-instance)
