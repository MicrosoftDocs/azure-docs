---
title: Save costs with reservations for Nutanix Cloud Clusters on Azure BareMetal infrastructure
description: Save costs with Nutanix on Azure BareMetal reservations by committing to a reservation for your provisioned throughput units.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 12/06/2024
ms.author: banders
# customer intent: As a billing administrator, I want to learn about saving costs with Nutanix Cloud Clusters on Azure BareMetal Infrastructure Reservations and buy one.
---

# Save costs with reservations for Nutanix Cloud Clusters on Azure BareMetal infrastructure

You can save money on [Nutanix Cloud Clusters (NC2) on Azure](../../baremetal-infrastructure/workloads/nc2-on-azure/nc2-baremetal-overview.md) with reservations. The reservation discount automatically applies to the running NC2 workload on Azure hosts that match the reservation scope and attributes. A reservation purchase covers only the compute part of your usage and doesn't include software licensing costs.

## Purchase restriction considerations

Reservations for NC2 on Azure BareMetal Infrastructure are available with some exceptions.

- **Clouds** - Reservations are available only in the regions listed on the [Supported regions](../../baremetal-infrastructure/workloads/nc2-on-azure/architecture.md#supported-regions) page.
- **Capacity restrictions** - In rare circumstances, Azure limits the purchase of new reservations for NC2 on Azure host SKUs because of low capacity in a region.

## Reservation scope

When you purchase a reservation, you choose a scope that determines which resources get the reservation discount. A reservation applies to your usage within the purchased scope.

To choose a subscription scope, use the Scope list at the time of purchase. You can change the reservation scope after purchase.

- **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
- **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
- **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. If a subscription is moved to different billing context, the benefit no longer applies to the subscription. It continues to apply to other subscriptions in the billing context.
  - For enterprise customers, the billing context is the EA enrollment. The reservation shared scope would include multiple Microsoft Entra tenants in an enrollment.
  - For Microsoft Customer Agreement customers, the billing scope is the billing profile.
  - For pay-as-you-go customers, the shared scope is all pay-as-you-go subscriptions created by the account administrator.
- **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope. The management group scope applies to all subscriptions throughout the entire management group hierarchy. To buy a reservation for a management group, you must have at least read permission on the management group and be a reservation owner or reservation purchaser on the billing subscription.

For more information on Azure reservations, see [What are Azure Reservations](save-compute-costs-reservations.md).

## Purchase requirements

To purchase reservation:

- You must be in the **Owner** role for at least one Enterprise or individual subscription with pay-as-you-go rates.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the EA portal. Or, if that setting is disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy an Azure Nutanix reservation.

##  Purchase Nutanix on Azure BareMetal reservation

You can purchase a Nutanix on Azure BareMetal reservation through the [Azure portal](https://portal.azure.com/). You can pay for the reservation up front or with monthly payments. For more information about purchasing with monthly payments, see [Purchase Azure reservations with up front or monthly payments](prepare-buy-reservation.md).

To purchase reserved capacity:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations** and then select **Nutanix on Azure BareMetal** to buy a new reservation.
3. Select a subscription. Use the Subscription list to choose the subscription that gets used to pay for the reservation. The payment method of the subscription is charged the costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreement, or pay-as-you-go (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
    1. For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
    2. For a pay-as-you-go subscription, the charges are billed to the credit card or invoice payment method on the subscription.
4. Select a scope.
5. Select AN36 or AN36P and select a region to choose an Azure region that gets covered by the reservation and select **Add to cart**.
6. The number of instances to purchase within the reservation. The quantity is the number of running NC2 hosts that can get the billing discount.
7. Select **Next: Review + Buy** and review your purchase choices and their prices.
8. Select **Buy now**.
9. After purchase, you can select **View this Reservation** to see your purchase status.

After you purchase a reservation, it gets applied automatically to any existing usage that matches the terms of the reservation.

##  Usage data and reservation usage

Your usage that gets a reservation discount has an effective price of zero. You can see which NC2 instance received the reservation discount for each reservation.

For more information about how reservation discounts appear in usage data:

- For EA customers, see [Understand Azure reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
- For individual subscriptions, see [Understand Azure reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md)

## Exchange or refund a reservation

Exchange is allowed between NC2 AN36 and AN36P. You can exchange or refund a reservation, with certain limitations. For more information about Azure Reservations policies, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

## Reservation expiration

When a reservation expires, any usage that you were covered under that reservation is billed at the pay-as-you go rate. Reservations are set to autorenewal on at time of purchase and you can choose to change the option as necessary at time of or after purchase.

An email notification is sent 30 days before the reservation expires, and again on the expiration date. To continue taking advantage of the cost savings that a reservation provides, renew it no later than the expiration date.

##  Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

- To learn more about Azure reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Azure Reservations](manage-reserved-vm-instance.md)
  - [Understand Azure Reservations discount](understand-reservation-charges.md)
