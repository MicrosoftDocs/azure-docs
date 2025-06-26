---
title: Prepay for compute with reservations
description: Prepay for Azure Cache for Redis compute resources with reservations.




ms.topic: conceptual
ms.date: 05/22/2025
appliesto:
  - ✅ Azure Cache for Redis


---

# Prepay for Azure Cache for Redis compute resources with reservations

Reservations in Azure Cache for Redis can help you save money compared to pay-as-you-go prices by prepaying for compute resources. With reservations, you make an upfront commitment on a cache for one or three years to get a significant discount on the compute costs.

You purchase an Azure Cache for Redis reservation for a specific Azure region, Azure Redis tier, term, and node quantity. You don't need to assign the reservation to specific cache instances. Existing and new caches automatically get the benefit of reserved pricing, up to the total reservation size.

When you purchase a reservation, you prepay for compute costs for one or three years. As soon as you buy the reservation, the compute charges that match the reservation attributes no longer use the pay-as-you go rates.

You can choose to auto-renew your reservation. Otherwise, the billing benefit expires and billing reverts to the pay-as-you go price at the end of the reservation term.

You can pay for reservations up front or with monthly payments. For more information, see [Buy a reservation](/azure/cost-management-billing/reservations/prepare-buy-reservation).

For reservation pricing information, see the [Azure Cache for Redis pricing page](https://azure.microsoft.com/pricing/details/cache). A reservation doesn't cover networking or storage charges associated with the cache.

For details on how Enterprise Agreement (EA) customers and pay-as-you-go customers are charged for reservation purchases, see [Get Enterprise Agreement and Microsoft Customer Agreement reservation costs and usage](/azure/cost-management-billing/reservations/understand-reserved-instance-usage-ea) and [Understand Azure reservation usage for your pay-as-you-go rate subscription](/azure/cost-management-billing/reservations/understand-reserved-instance-usage).

## Reservation planning

The following Azure Cache for Redis tiers support reservations:

| Feature | Basic and Standard | Premium | Enterprise and Enterprise Flash |
|-- |:-: | :-: |:-:|
|**Reservation Support** | No        |Yes     |      Yes   |

### Reservation increments

Reservations are sold in increments of nodes. Premium-tier and Enterprise-tier Azure Cache for Redis instances contain two nodes by default. To buy reservations for an instance, you buy two reservation units.

The Enterprise Flash tier contains three nodes by default, so for Enterprise Flash tiers you need to buy three reservation units.

To calculate number of nodes, see the [Pricing calculator](https://azure.microsoft.com/pricing/calculator/).

### Reservation size determination

Base your reservation size on the total amount of memory size that the existing or soon-to-be-deployed caches use within the specific region and tier.

For example, suppose you run two caches, one at 13 GB and the other at 26 GB. You need both caches for at least one year. You plan to scale the existing 13-GB cache to 26 GB for a month to meet your seasonal demand, and then scale back.

In this case, you could purchase either one P2-cache and one P3-cache or three P2-caches on a one-year reservation to maximize savings. You receive a discount on the total amount of cache memory you reserve, independent of how that memory is allocated across your caches.

Cache size flexibility helps you scale up or down within a service tier and region without losing the reservation benefit. For an explanation of cache architecture, see [A quick summary of cache architecture](cache-failover.md#a-quick-summary-of-cache-architecture).

## Buy Azure Cache for Redis reservations

To buy a reservation:

- You must have Owner or Reservation Purchaser role in the Azure subscription.
- For Enterprise subscriptions, you must enable **Add Reserved Instances** in the [EA portal](https://ea.azure.com/). Or if that setting is disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Cache for Redis reservations. For more information, see [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](/partner-center/azure-reservations).

To buy reservations using the Azure portal:

1. In the portal, search for and select **Reservations** and then select **Purchase Now**, or select this link to the [Purchase reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/) page.
1. On the **Purchase reservations** page, select **Azure Cache for Redis**.
1. In the **Select the product you want to purchase** pane, select the **Scope** and **Subscription** you want to use for the reservation.
1. Select the values you want from the dropdown lists for **Region**, **Term**, and **Billing frequency**.

   :::image type="content" source="media/cache-reserved-pricing/cache-reserved-price.png" alt-text="Screenshot showing an overview of reserved pricing.":::

   The following table describes the form fields in detail.

   | Field | Description |
   | ------------ | ------- |
   | Subscription   | The subscription used to pay for the reservation. The subscription type must be EA, offer numbers MS-AZR-0017P or MS-AZR-0148P, or an individual agreement with pay-as-you-go pricing, offer numbers MS-AZR-0003P or MS-AZR-0023P. For an EA subscription, the charges are deducted from the enrollment's Azure Prepayment balance or charged as overage. For pay-as-you-go, the charges are billed to the subscription's credit card or invoice.|
   | Scope | The reservation's scope. <br>**Shared** applies the reservation discount to cache instances in any subscriptions in your billing context. For EA, the shared scope is the enrollment and includes all subscriptions within the enrollment. For pay-as-you-go, the shared scope is all pay-as-you-go subscriptions created by the account administrator. <br>**Single subscription** applies the reservation discount to cache instances in this subscription. <br>**Single resource group** applies the reservation discount to instances in the selected resource group within the subscription. <br>**Management group** applies the reservation discount to matching resources in subscriptions that are a part of both the management group and billing scope.|
   | Region | The Azure region for the reservation.|
   | Term | **1 year** or **3 years**.|
   | Billing frequency | **Monthly** or **Upfront**.
   | Recommended quantity | The recommended number of nodes to reserve in the selected Azure region, tier, and scope. Select **See details** for details about recommended quantities.|

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

- [Understand the Azure reservation discount](/azure/cost-management-billing/reservations/understand-azure-cache-for-redis-reservation-charges)
- [What are Azure Reservations?](/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Manage Azure Reservations](/azure/cost-management-billing/reservations/manage-reserved-vm-instance)
