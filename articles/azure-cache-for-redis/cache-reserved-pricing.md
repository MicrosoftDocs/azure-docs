---
title: Prepay for compute with reservations - Azure Cache for Redis 
description: Prepay for Azure Cache for Redis compute resources with reservations
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 08/19/2022

---

# Prepay for Azure Cache for Redis compute resources with reservations

Azure Cache for Redis can help you save money by prepaying for compute resources compared to pay-as-you-go prices. With reservations, you make an upfront commitment on a cache for one or three years to get a significant discount on the compute costs. To purchase Azure Cache for Redis reservations, you need to specify the Azure region, service tier, and term.

You don't need to assign the reservation to specific Azure Cache for Redis instances. If you have a cache already running or new ones that are being deployed, they automatically get the benefit of reserved pricing, up to the reserved cache size. By purchasing a reservation, you're pre-paying for the compute costs for one or three years. As soon as you buy a reservation, the compute charges that match the reservation attributes are no longer charged at the pay-as-you go rates. A reservation doesn't cover networking or storage charges associated with the cache. At the end of the reservation term, the billing benefit expires and the cache is billed at the pay-as-you go price. Reservations don't auto-renew. For pricing information, see the [Azure Cache for Redis pricing page](https://azure.microsoft.com/pricing/details/cache).

You can buy a reservation in the [Azure portal](https://portal.azure.com/). To buy the reservations:

- You must be in the owner role for at least one Enterprise or individual subscription with pay-as-you-go rates.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin on the subscription.
- For Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Cache for Redis reservations.

For the details on how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [understand Azure reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md) and [understand Azure reservation usage for your Pay-As-You-Go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md).

## Determine the right cache size before purchase

### Supported Tiers for reservations

| Feature | Basic and Standard | Premium | Enterprise and Enterprise Flash |
|-- |:-: | :-: |:-:|
|**Reservation Support** | No        |Yes     |      Yes   |

The size of reservation should be based on the total amount of memory size that is used by the existing or soon-to-be-deployed cache within a specific region, and using the same service tier.

For example, let's suppose that you're running two caches - one at 13 GB and the other at 26 GB. You'll need both for at least one year. Further, let's suppose that you plan to scale the existing 13 GB cache to 26 GB for a month to meet your seasonal demand, and then scale back.

In this case, you could purchase either one P2-cache and one P3-cache or three P2-caches on a one-year reservation to maximize savings. You'll receive a discount on the total amount of cache memory you reserve, independent of how that amount is allocated across your caches.

### Reservation increments

Reservations are sold in increments of nodes. For the Premium tier and Enterprise tier, each instance contains two nodes by default. So, to buy reservations for an instance, you buy two reservation units.

The Enterprise Flash tier is slightly different. It contains three nodes by default. So, for the Enterprise Flash tier, you would need to buy three reservation units.

For the number of nodes calculation, see "View Cost Calculation" on [Pricing calculator](https://azure.microsoft.com/pricing/calculator/).

For an explanation of the architecture of a cache, see [A quick summary of cache architecture](cache-failover.md#a-quick-summary-of-cache-architecture).

## Buy Azure Cache for Redis reservations

You can buy reservations in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/). Pay for the reservation [up front or with monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md).

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add** and then in the Purchase reservations pane, select **Azure Cache for Redis** to purchase a new reservation for your caches.
4. Fill in the required fields. Existing or new databases that match the attributes you select qualify to get the reservation discount. The actual number of your instances that get the discount depend on the scope and quantity selected.

:::image type="content" source="media/cache-reserved-pricing/cache-reserved-price.png" alt-text="Screenshot showing an overview of reserved pricing.":::

The following table describes required fields.

| Field | Description |
| :------------ | :------- |
| Subscription   | The subscription used to pay for the Azure Cache for Redis reservation. The payment method on the subscription is charged the upfront costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with pay-as-you-go pricing (offer numbers: MS-AZR-0003P or MS-AZR-0023P). For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage. For an individual subscription with pay-as-you-go pricing, the charges are billed to the credit card or invoice payment method on the subscription.
| Scope | The reservation’s scope can cover one subscription or multiple subscriptions (shared scope). If you select: </br></br> **Shared**, the reservation discount is applied to Azure Cache for Redis instances running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.</br></br> **Single subscription**, the reservation discount is applied to Azure Cache for Redis instances in this subscription. </br></br> **Single resource group**, the reservation discount is applied to instances in the selected subscription and the selected resource group within that subscription.</br></br>**Management group**, the reservation discount is applied to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
| Region | The Azure region that’s covered by the reservation.
| Pricing tier | The service tier for the instances.
| Term | One year or three years
| Quantity | The amount of compute resources being purchased within the reservation. The quantity is the number of nodes in the selected Azure region and service tier that is being reserved, and will get the billing discount. For example, if you're running or planning to run an instance in the Premium tier with the total cache capacity of 26 GB in the East US region, then you would specify a quantity that gives you the equivalent of 26 GB to maximize the benefit for all caches.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Cache size flexibility

Cache size flexibility helps you scale up or down within a service tier and region, without losing the reservation benefit.

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

The reservation discount is applied automatically to the Azure Cache for Redis instances that match the reservation scope and attributes. You can update the scope of the reservation through the Azure portal, PowerShell, Azure CLI, or the API.

- To learn how reservation discounts are applied to Azure Cache for Redis, see [Understand the Azure reservation discount](../cost-management-billing/reservations/understand-azure-cache-for-redis-reservation-charges.md)

- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)
  - [Manage Azure Reservations](../cost-management-billing/reservations/manage-reserved-vm-instance.md)
  - [Understand Azure Reservations discount](../cost-management-billing/reservations/understand-reservation-charges.md)
  - [Understand reservation usage for your Pay-As-You-Go subscription](../cost-management-billing/reservations/understand-reservation-charges-mysql.md)
  - [Understand reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md)
  - [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](/partner-center/azure-reservations)
