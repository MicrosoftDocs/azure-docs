---
title: Prepay for SQL Data Warehouse charges with Azure reserved capacity
description: Learn how you can prepay for SQL Data Warehouse charges with reserved capacity to save money.
services: billing
author: yashesvi
manager: yashar
ms.service: billing
ms.topic: conceptual
ms.date: 07/03/2019
ms.author: banders
---

# Prepay for SQL Data Warehouse charges with reserved capacity

You can save money with Azure SQL Data Warehouse by prepaying for your cDWU usage for a duration of one or three years. To purchase SQL Data Warehouse reserved capacity, you need to choose the Azure region, and term. Then, add the SQL Data Warehouse SKU to your cart and choose the quantity of cDWU units that you want to purchase.

When you purchase a reservation, the SQL Data Warehouse usage that matches the reservation attributes is no longer charged at the pay-as-you go rates.

A reservation doesn't cover storage or networking charges associated with the SQL Data Warehouse usage.

When the reserved capacity expires, SQL Data Warehouse instances continue to run but are billed at the pay-as-you go rate. Reservations don't renew automatically.

For pricing information, see the [SQL Data Warehouse reserved capacity offering](https://azure.microsoft.com/pricing/details/sql-data-warehouse/gen2/).

You can buy Azure SQL Data Warehouse reserved capacity in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/ReservationsBrowseBlade). To buy reserved capacity:

- You must have the owner role for at least one enterprise or Pay-As-You-Go subscription.
- For Enterprise subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). If the setting is disabled, you must be an EA Admin.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can purchase SQL Data Warehouse reserved capacity.

For more information about how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [understand Azure reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md) and [understand Azure reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md).

## Choose the right size before purchase

The SQL Data Warehouse reservation size should be based on the total compute data warehouse units (cDWU) that you consume. Purchases are made in 100 cDWU increments.

For example, assume your total consumption of SQL Data Warehouse is DW3000c. You want to purchase reserved capacity for all of it. So, you should purchase 30 units of cDWU reserved capacity.

## Buy SQL Data Warehouse reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select a subscription. Use the Subscription list to choose the subscription that's used to pay for the reserved capacity. The payment method of the subscription is charged the upfront costs for the reserved capacity. The subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or Pay-As-You-Go (offer numbers: MS-AZR-0003P or MS-AZR-0023P).
  - For an enterprise subscription, the charges are deducted from the enrollment's monetary commitment balance or charged as overage.
  - For Pay-As-You-Go subscription, the charges are billed to the credit card or invoice payment method on the subscription.
4. Select a scope. Use the Scope list to choose a subscription scope.
  - **Single resource group scope** — Applies the reservation discount to the matching resources in the selected resource group only.
  - **Single subscription scope** — Applies the reservation discount to the matching resources in the selected subscription.
  - **Shared scope** — Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment. For individual subscriptions with pay-as-you-go rates, the billing scope is all eligible subscriptions created by the account administrator.
    - For enterprise customers, the billing context is the EA enrollment.
    - For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.
5. Select a region to choose an Azure region that's covered by the reserved capacity.
6. Choose a quantity. Enter the quantity of 100 Data Warehouse units (cDWU) that you want to purchase.    
  For example, a quantity of 30 would give you 3,000 cDWU of reserved capacity every hour.
7. Review the SQL Data Warehouse reserved capacity reservation cost in the **Costs** section.
8. Select **Purchase**.
9. Select **View this Reservation** to see your purchase status.

## Cancellations and exchanges

If you need to cancel your SQL Data Warehouse reserved capacity, there might be a 12% early termination fee. Refunds are based on the lowest price of either your purchase price or the current price of the reservation. Refunds are limited to $50,000.00 per year. The refund you receive is the remaining prorated balance minus the 12% early termination fee. To request a cancellation, go to the reservation in the Azure portal and select **Refund** to create a support request.

If you need to change your SQL Data Warehouse reserved capacity to another region or term, you can exchange it for another reservation that's of equal or greater value. The term start date for the new reservation doesn't carry over from the exchanged reservation. The one or three-year term starts when you create the new reservation. To request an exchange, open the reservation in the Azure portal, and select **Exchange** to create a support request.

For more information about how to exchange or refund reservations, see [Reservation exchanges and refunds](billing-azure-reservations-self-service-exchange-and-refund.md).

The reservation discount is applied automatically to the number of SQL Data Warehouse instances that match the SQL Data Warehouse reserved capacity scope and region. You can update the scope of the SQL Data Warehouse reserved capacity with the [Azure portal](https://portal.azure.com/), PowerShell, CLI or through the API.

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/).

## Next steps

- To learn more about how reservation discounts apply to Azure SQL Data Warehouse, see [How reservation discounts apply to Azure SQL Data Warehouse](billing-prepay-sql-data-warehouse-charges-with-reserved-capacity.md).

- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](billing-save-compute-costs-reservations.md)
  - [Manage Azure Reservations](billing-manage-reserved-vm-instance.md)
  - [Understand Azure Reservations discount](billing-understand-reservation-charges.md)
  - [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
  - [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
