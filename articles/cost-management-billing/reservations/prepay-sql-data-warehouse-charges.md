---
title: Save on Azure Synapse Analytics - Dedicated SQL pool (formerly SQL DW) charges with Azure reserved capacity
description: Learn how you save costs for Azure Synapse Analytics charges with reserved capacity to save money.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 12/06/2022
ms.author: banders
---

# Save costs for Azure Synapse Analytics - Dedicated SQL pool (formerly SQL DW) charges with reserved capacity

You can save money with Azure Synapse Analytics - Dedicated SQL pool (formerly SQL DW) by committing to a reservation for your cDWU usage for a duration of one or three years. To purchase Azure Synapse Analytics reserved capacity, you need to choose the Azure region, and term. Then, add the Azure Synapse Analytics SKU to your cart and choose the quantity of cDWU units that you want to purchase.

When you purchase a reservation, the Azure Synapse Analytics usage that matches the reservation attributes is no longer charged at the pay-as-you go rates.

A reservation doesn't cover storage or networking charges associated with the Azure Synapse Analytics usage, it only covers data warehousing usage.

When the reserved capacity expires, Azure Synapse Analytics instances continue to run but are billed at the pay-as-you go rate. Reservations don't renew automatically.

For pricing information, see the [Azure Synapse Analytics reserved capacity offering](https://azure.microsoft.com/pricing/details/synapse-analytics/).

You can buy Azure Synapse Analytics reserved capacity in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). Pay for the reservation [up front or with monthly payments](./prepare-buy-reservation.md). To buy reserved capacity:

- You must have the owner role for at least one enterprise or Pay-As-You-Go subscription.
- For Enterprise subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). If the setting is disabled, you must be an EA Admin to enable it. Direct Enterprise customers can now update **Reserved Instance** settings on [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). Navigate to the Policies menu to change settings.

- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase Azure Synapse Analytics reserved capacity.

For more information about how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [understand Azure reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md) and [understand Azure reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md).

## Choose the right size before purchase

The Azure Synapse Analytics reservation size should be based on the total compute data warehouse units (cDWU) that you consume. Purchases are made in 100 cDWU increments.

For example, assume your total consumption of Azure Synapse Analytics is DW3000c. You want to purchase reserved capacity for all of it. So, you should purchase 30 units of cDWU reserved capacity.

## Buy Azure Synapse Analytics reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select a subscription. Use the Subscription list to choose the subscription that's used to pay for the reserved capacity. The payment method of the subscription is charged the costs for the reserved capacity. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Pay-As-You-Go (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
   - For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
   - For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.
4. Select a scope. Use the Scope list to choose a subscription scope.
   - **Single resource group scope** — Applies the reservation discount to the matching resources in the selected resource group only.
   - **Single subscription scope** — Applies the reservation discount to the matching resources in the selected subscription.
   - **Shared scope** — Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment. For individual subscriptions with pay-as-you-go rates, the billing scope is all eligible subscriptions created by the account administrator.
       - For enterprise customers, the billing context is the EA enrollment.
       - For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.
   - **Management group** — Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
5. Select a region to choose an Azure region that's covered by the reserved capacity.
6. Choose a quantity. Enter the quantity of 100 Data Warehouse units (cDWU) that you want to purchase.    
   For example, a quantity of 30 would give you 3,000 cDWU of reserved capacity every hour.
7. Review the Azure Synapse Analytics reserved capacity reservation cost in the **Costs** section.
8. Select **Purchase**.
9. Select **View this Reservation** to see your purchase status.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

A reservation discount is applied automatically to the number of Azure Synapse Analytics instances that match the Azure Synapse Analytics reserved capacity scope and region. You can update the scope of the Azure Synapse Analytics reserved capacity with the [Azure portal](https://portal.azure.com/), PowerShell, CLI or through the API.

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/).

## Next steps

- To learn more about how reservation discounts apply to Azure Synapse Analytics, see [How reservation discounts apply to Azure Synapse Analytics](prepay-sql-data-warehouse-charges.md).

- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Azure Reservations](manage-reserved-vm-instance.md)
  - [Understand Azure Reservations discount](understand-reservation-charges.md)
  - [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
