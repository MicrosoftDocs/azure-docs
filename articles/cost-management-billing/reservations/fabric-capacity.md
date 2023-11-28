---
title: Save costs with Microsoft Fabric Capacity reservations
description: Learn about how to save costs with Microsoft Fabric Capacity reservations.
author: bandersmsft
ms.reviewer: franciscosa
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 11/17/2023
ms.author: banders
ms.custom: ignite-2023
---

# Save costs with Microsoft Fabric Capacity reservations

You can save money with Fabric capacity reservation by committing to a reservation for your Fabric capacity usage for a duration of one year. This article explains how you can save money with Fabric capacity reservations.

To purchase a Fabric capacity reservation, you choose an Azure region, size, and then add the Fabric capacity SKU to your cart. Then you choose the quantity of capacity units (CUs) that you want to purchase.

When you purchase a reservation, the Fabric capacity usage that matches the reservation attributes is no longer charged at the pay-as-you-go rates.

A reservation doesn't cover storage or networking charges associated with the Microsoft Fabric usage, it only covers Fabric capacity usage.

When the reservation expires, Fabric capacity workloads continue to run but are billed at the pay-as-you-go rate. Reservations don't renew automatically.

You can choose to enable automatic reservation renewal by selecting the option in the renewal settings. With automatic renewal, a replacement reservation is purchased when the reservation expires. By default, the replacement reservation has the same attributes as the expiring reservation. You can optionally change the billing frequency, term, or quantity in the renewal settings. Any user with owner access on the reservation and the subscription used for billing can set up renewal.

For pricing information, see the [Fabric pricing page](https://azure.microsoft.com/pricing/details/microsoft-fabric/#pricing).

You can buy a Fabric capacity reservation in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md). To buy a reservation:

- You must have the owner role or reservation purchaser role on an Azure subscription that's of type Enterprise (MS-AZR-0017P or MS-AZR-0148P) or Pay-As-You-Go (MS-AZR-0003P or MS-AZR-0023P) or Microsoft Customer Agreement for at least one subscription.
- For Enterprise subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). If the setting is disabled, you must be an EA Admin to enable it.
- Direct Enterprise customers can update the **Reserved Instances** policy settings in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). Navigate to the **Policies** menu to change settings.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Fabric capacity reservations.

For more information about how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [Understand Azure reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md) and [Understand Azure reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md).

## Choose the right size before purchase

The Fabric capacity reservation size should be based on the total CUs that you consume. Purchases are made in one CU increments.

For example, assume that your total consumption of Fabric capacity is F64 (which includes 64 CUs). You want to purchase a reservation for all of it, so you should purchase 64 CUs of reservation quantity.

## Buy a Microsoft Fabric Capacity reservation

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **All services** > **Reservations** and then select **Microsoft Fabric**.  
    :::image type="content" source="./media/fabric-capacity/all-reservations.png" alt-text="Screenshot showing the Purchase reservations page where you select Microsoft Fabric." lightbox="./media/fabric-capacity/all-reservations.png" :::
1. Select a subscription. Use the Subscription list to choose the subscription that gets used to pay for the reserved capacity. The payment method of the subscription is charged the costs for the reserved capacity. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P), Microsoft Customer Agreement, or Pay-As-You-Go (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
    - For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
    - For a Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.
1. Select a scope. Use the Scope list to choose a subscription scope. You can change the reservation scope after purchase.
    - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
    - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
    - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context.  If a subscription is moved to different billing context, the benefit no longer applies to the subscription. It continues to apply to other subscriptions in the billing context.
        - For enterprise customers, the billing context is the EA enrollment. The reservation shared scope would include multiple Microsoft Entra tenants in an enrollment.
        - For Microsoft Customer Agreement customers, the billing scope is the billing profile.
        - For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.
    - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope. The management group scope applies to all subscriptions throughout the entire management group hierarchy. To buy a reservation for a management group, you must have at least read permission on the management group and be a reservation owner or reservation purchaser on the billing subscription.
1. Select a region to choose an Azure region that gets covered by the reservation and select **Add to cart**.  
    :::image type="content" source="./media/fabric-capacity/select-product.png" alt-text="Screenshot showing the Select the product page where you select Fabric Capacity reservation." lightbox="./media/fabric-capacity/select-product.png" :::
1. In the cart, choose the quantity of CUs that you want to purchase.
 For example, a quantity of 64 CUs would give you 64 CUs of reservation capacity units every hour.
1. Select **Next: Review + Buy** and review your purchase choices and their prices.
1. Select **Buy now**.
1. After purchase, you can select **View this Reservation** to see your purchase status.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

If you want to request a refund for your Fabric capacity reservation, you can do so by following these steps:

1. Sign in to the Azure portal and go to the Reservations page.
2. Select the Fabric capacity reservation that you want to refund and select **Return**.
3. On the Refund reservation page, review the refund amount and select a **Reason for return**.
4. Select **Return reserved instance**.
5. Review the terms and conditions and select the box to agree and submit your request.

The refund amount is based on the prorated remaining term and the current price of the reservation. The refund amount is applied as a credit to your Azure account.

After you request a refund, the reservation is canceled, and the reserved capacity is released. You can view the status of your refund request on the [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) page in the Azure portal.

The sum total of all canceled reservation commitment in your billing scope (such as EA, Microsoft Customer Agreement, and Microsoft Partner Agreement) can't exceed USD 50,000 in a 12 month rolling window.

## Exchange Azure Synapse Analytics reserved capacity for a Fabric Capacity reservation

If you already bought a reservation for Azure Synapse Analytics Dedicated SQL pool (formerly SQL DW) and want to exchange it for a Fabric capacity reservation, you can do so using the following steps. This process returns the original reservation and purchases a new reservation as separate transactions.

1. Sign into the Azure portal and go to the [Reservations](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade) page.
2. Select the Azure Synapse Analytics reserved capacity item that you want to exchange and then select **Exchange**.
3. On the Return reservation page, enter the quantity to return then select **Next: Purchase**.
4. On the Select the product you want to purchase page, select the Fabric capacity reservation to buy, add to cart, then select **Next: Review**.
5. Select a reservation size and payment option for the Fabric capacity reservation. You can see the estimated exchange value and the remaining balance or amount due.
6. Review the terms and conditions and select the box to agree.
7. Select **Exchange** to complete the transaction.

The new reservation's lifetime commitment should equal or be greater than the returned reservation's remaining commitment. For example, assume you have a three-year reservation that costs $100 per month. You exchange it after the 18th payment. The new reservation's lifetime commitment should be $1,800 or more (paid monthly or upfront).

The exchange value of your Azure Synapse Analytics reserved capacity is based on the prorated remaining term and the current price of the reservation. The exchange value is applied as a credit to your Azure account. If the exchange value is less than the cost of the Fabric capacity reservation, you must pay the difference.

After you exchange the reservation, the Fabric capacity reservation is applied to your Fabric capacity automatically. You can view and manage your reservations on the Reservations page in the Azure portal.

## How reservation discounts apply to Microsoft Fabric Capacity

After you buy a Fabric capacity reservation, the reservation discount is automatically applied to your provisioned instances that exist in that region. The reservation discount applies to the usage emitted by the Fabric capacity meters. Storage and networking aren't covered by the reservation and they're charged at pay-as-you-go rates.

### Reservation discount application

The Fabric capacity reservation discount is applied to CUs on an hourly basis. If you don't have workloads consuming CUs for a full hour, you don't receive the full discount benefit of the reservation. It doesn't carry over.

After purchase, the reservation is matched to Fabric capacity usage emitted by running workloads (Power BI, Data Warehouse, and so on) at any point in time.

### Discount examples

The following examples show how the Fabric capacity reservation discount applies, depending on the deployments.

- **Example 1** - You purchase a Fabric capacity reservation of 64 CUs. You deploy one hour of Power BI using 32 CUs per hour and you also deploy Synapse Data Warehouse using 32 CUs per hour. In this case, both usage events get reservation discounts. No usage is charged using pay-as-you-go rates.
- **Example 2** - This example explains the relationship between smoothing and reservations. [Smoothing](/power-bi/enterprise/service-premium-smoothing) is enabled for Fabric capacity reservations. Smoothing spreads usage spikes into 24-hour intervals (except for interactive usage such as reports read from Power BI or KQL). Therefore, reservations examine the average CU consumption over a 24-hour interval. You purchase a Fabric capacity reservation of two CUs, and you enable smoothing for Fabric capacity. Assume that your usage spikes to 4 CUs within an hour. You pay the pay-as-you-go rate only if the CU consumption exceeds an average of two CU per hour during the 24-hour interval.

## Increase the size of a Fabric Capacity reservation

If you want to increase the size of your Fabric capacity reservation, use the exchange process or buy more Fabric capacity reservations.

## Next steps

- To learn more about Azure reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Azure Reservations](manage-reserved-vm-instance.md)
  - [Understand Azure Reservations discount](understand-reservation-charges.md)