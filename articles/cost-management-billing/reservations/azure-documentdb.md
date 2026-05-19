---
title: Save costs with Azure DocumentDB Reservations
description: Save costs with Azure DocumentDB Reservations by committing to a reservation for your vCore compute resources.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 05/15/2026
ms.author: primittal
# customer intent: As a billing administrator, I want to learn about saving costs with Azure DocumentDB Reservations and buy one.
---

# Save costs with Azure DocumentDB Reservations

You can save money on Azure DocumentDB by committing to a reservation for your vCore compute resources for a duration of one year or three years. This article explains how you can save money with Azure DocumentDB Reservations.

To purchase an Azure DocumentDB Reservation, you choose an Azure region, vCore tier, and quantity. Then add the Azure DocumentDB reserved capacity SKU to your cart. Then verify the quantity of vCores that you want to purchase and complete your order.

When you purchase a reservation, the Azure DocumentDB compute usage that matches the reservation attributes is no longer charged at the pay-as-you-go rates.

Azure DocumentDB reservations are applicable only for Compute vCore and do not include Storage costs.

## Reservation application

An Azure DocumentDB reservation applies to vCore compute resources only and doesn't include storage, backup, or networking costs. Azure DocumentDB Reservations also don't guarantee capacity availability. To ensure capacity availability, the recommended best practice is to create your clusters before you buy your reservation.

When the reservation expires, Azure DocumentDB clusters continue to run but are billed at the pay-as-you-go rate.

## Renewal options

Enable automatic renewal in Renewal settings or at purchase. Azure DocumentDB Reservations support two renewal behaviors:

### Renew on the same reservation order ID

Renews the reservation using the same reservation order ID. No new reservation is created.

### Replace with a new reservation

Creates a new reservation when the current reservation expires. By default, the new reservation uses the same attributes, and it does not automatically renew (it has auto-renew turned off). You can change the name, billing frequency, term, or quantity in Renewal settings.

Users with Owner access to both the reservation and the billing subscription can configure renewal.

### Renewal behavior by term (auto-renew enabled at purchase)

- **1-year term:** Creates a replacement reservation.
- **3-year term:** Creates a replacement reservation.

> [!NOTE]
> When a reservation is set to renew on the same reservation order ID, auto-renew remains enabled for all subsequent renewals until you explicitly turn it off.

>[!NOTE]
>When you exchange a reservation, it will be set to purchase a replacement reservation at expiration instead of automatically renewing. Please review your renewal settings after completing an exchange to make sure they match your preference.

## Prerequisites

You can buy an Azure DocumentDB reservation in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md). To buy a reservation:

- You must have owner role or reservation purchaser role on an Azure subscription.
- For Enterprise subscriptions, the **Reserved Instances** policy option must be enabled in the [Azure portal](../manage/direct-ea-administration.md#view-and-manage-enrollment-policies). If the setting is disabled, you must be an EA Admin to enable it.
- Direct Enterprise customers can update the **Reserved Instances** policy settings in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). Navigate to the **Policies** menu to change settings.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure DocumentDB Reservations.

For more information about how enterprise customers and pay-as-you-go customers are charged for reservation purchases, see [Understand Azure reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md) and [Understand Azure reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md).

## Choose the right size before purchase

The Azure DocumentDB reservation size should be based on the total vCore compute that you consume across your clusters. Reservation purchases are made in vCore increments.

For example, assume you have a cluster with 16 vCores and another cluster with 8 vCores in the same region. In this example, you should purchase a reservation for a quantity of 24 vCores to cover all your compute resources.

> [!CAUTION]
> To prevent buying a reservation for more vCores than you can use, review your current cluster configurations first. Then buy the reservation to cover the vCores you have deployed. This best practice ensures that you maximize the reservation discount and helps to prevent you from purchasing a term commitment that you can't fully use.

## Buy an Azure DocumentDB reservation

When you buy a reservation, the current UTC date and time are used to record the transaction.

To buy an Azure DocumentDB reservation, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations** and then select **Azure DocumentDB**.
3. Select a subscription. Use the Subscription list to choose the subscription that gets used to pay for the reservation. The payment method of the subscription is charged the costs for the reservation. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreement, or pay-as-you-go (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
    - For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
    - For a pay-as-you-go subscription, the charges are billed to the credit card or invoice payment method on the subscription.
4. Select a scope. Use the Scope list to choose a subscription scope. You can change the reservation scope after purchase.
    - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
    - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
    - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. If a subscription is moved to different billing context, the benefit no longer applies to the subscription. It continues to apply to other subscriptions in the billing context.
        - For enterprise customers, the billing context is the EA enrollment. The reservation shared scope would include multiple Microsoft Entra tenants in an enrollment.
        - For Microsoft Customer Agreement customers, the billing scope is the billing profile.
        - For pay-as-you-go customers, the shared scope is all pay-as-you-go subscriptions created by the account administrator.
    - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope. The management group scope applies to all subscriptions throughout the entire management group hierarchy. To buy a reservation for a management group, you must have at least read permission on the management group and be a reservation owner or reservation purchaser on the billing subscription.
5. Select a region to choose an Azure region that gets covered by the reservation.
6. Select the vCore tier and quantity, then select **Add to cart**.
7. In the cart, choose the quantity of vCores that you want to purchase.
8. Select **Next: Review + Buy** and review your purchase choices and their prices.
9. Select **Buy now**.
10. After purchase, you can select **View this Reservation** to see your purchase status.

## Cancel, exchange, or refund reservations

You can exchange or cancel reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

When you exchange an Azure DocumentDB reservation, you can change the following attributes:
- **Region**: Exchange a reservation from one Azure region to another
- **vCore quantity**: Exchange when you want to increase or decrease the number of vCores (e.g., scale from 8 vCores to 16 vCores, or reduce from 32 vCores to 16 vCores)
- **Term**: Change between one-year and three-year terms
- **Payment option**: Change between upfront and monthly payment options

>[!NOTE]
>When exchanging for a different region, vCore quantity, term, or payment option, the term is reset for the new reservation.
>
>Standard [exchange policies](exchange-and-refund-azure-reservations.md) apply to all Azure DocumentDB reservation exchanges.

If you want to exchange your Azure DocumentDB reservation, you can do so by following these steps:

1. Sign in to the Azure portal and go to the Reservations page.
2. Select the Azure DocumentDB reservation that you want to exchange and select **Exchange**.
3. Select the new reservation to purchase.
4. Review the terms and conditions and agree to them.

If you want to request a refund for your Azure DocumentDB reservation, you can do so by following these steps:

1. Sign in to the Azure portal and go to the Reservations page.
2. Select the Azure DocumentDB reservation that you want to refund and select **Return**.
3. On the Refund reservation page, review the refund amount and select a **Reason for return**.
4. Select **Return reserved instance**.
5. Review the terms and conditions and agree to them.

The refund amount is based on the prorated remaining term and the current price of the reservation. The refund amount is applied as a credit to your Azure account.

After you request a refund, the reservation is canceled and you can view the status of your refund request on the [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) page in the Azure portal.

The sum total of all canceled reservation commitment in your billing scope (such as EA, Microsoft Customer Agreement, and Microsoft Partner Agreement) can't exceed USD 50,000 in a 12-month rolling window.

## How reservation discounts apply to Azure DocumentDB

After you buy a reservation for Azure DocumentDB, the discount associated with the reservation automatically gets applied to any vCore compute resources that are deployed in the specified region, as long as they fall within the scope of the reservation. The reservation discount applies to the usage emitted by the vCore compute pay-as-you-go meters.

### Reservation discount application

The application of the Azure DocumentDB reservation is based on an hourly comparison between the reserved and deployed vCores. The sum of deployed vCores up to the amount reserved are covered (paid for) via the reservation, while any deployed vCores more than the reserved amount get charged at the hourly, pay-as-you-go rate. There are a few other points to keep in mind:

- vCores for partial-hour deployments are pro-rated based on the number of minutes the cluster runs during the hour. For example, a 16 vCore cluster that exists for only 30 minutes of an hour period is considered as an 8 vCore deployment for billing and reservation application during that hour.
- Clusters are matched to reservations based on the reservation scope before the reservation is applied. For example, a reservation scoped to a single subscription only covers clusters within that subscription. Clusters in other subscriptions are charged at the hourly pay-as-you-go rate, unless they're covered by other reservations that have them in scope.

The reservation price assumes 24x7 usage of the reserved vCores. In periods with fewer deployed vCores than reserved vCores, all deployed vCores get covered by the reservation, but the excess reserved vCores aren't used. These excess reserved vCores are lost and don't carry over to other periods.

### Discount examples

The following examples show how the Azure DocumentDB reservation discount applies, depending on the deployments.

**Example 1** - A reservation that's exactly the same size as the deployed vCores. For example, you purchase a reservation for 16 vCores and you deploy a cluster with 16 vCores. In this example, you only pay the reservation price.

**Example 2** - A reservation that's larger than your deployed vCores. For example, you purchase a reservation for 32 vCores and you only deploy a cluster with 16 vCores. In this example, the reservation discount is applied to 16 vCores. The remaining 16 vCores in the reservation will go unused, and won't carry forward to future billing periods.

**Example 3** - A reservation that's smaller than the deployed vCores. For example, you purchase a reservation for 8 vCores and you deploy a cluster with 32 vCores. In this example, the reservation discount is applied to 8 vCores. The remaining 24 vCores are charged at the pay-as-you-go rate.

**Example 4** - A reservation that covers multiple clusters. For example, you purchase a reservation for 32 vCores and you have two clusters of 16 vCores each in the same region and scope. In this example, the discount is applied to the sum of deployed vCores across both clusters.

## Increase Azure DocumentDB reservation

You can't change the size of a purchased reservation. If you want to increase your Azure DocumentDB reservation capacity to cover more vCores, you can buy more Azure DocumentDB reservations or exchange the existing reservation with the quantity you need.

## Related content

- To learn more about Azure reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Azure Reservations](manage-reserved-vm-instance.md)
  - [Understand Azure Reservations discount](understand-reservation-charges.md)
