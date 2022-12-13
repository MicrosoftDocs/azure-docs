---
title: Prepay for Azure SQL Edge reservations
description: Learn how you can prepay for Azure SQL Edge to save money over your pay-as-you-go costs.
author: bandersmsft
ms.reviewer: kendalv
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 12/06/2022
ms.author: banders
---

# Prepay for Azure SQL Edge reservations

When you prepay for your SQL Edge reserved capacity, you can save money over your pay-as-you-go costs. With reserved capacity, you make a commitment for SQL Edge device use for a period of one or three years to get a significant discount on usage costs. The discounts only apply to SQL Edge deployed devices and not on other software or other container usage. The reservation discount is applied automatically to the deployed devices in the selected reservation scope. Because of this automatic application, you don't need to assign a reservation to a specific deployed device to get the discounts.

You can buy SQL Edge reserved capacity from the [Azure portal](https://portal.azure.com/). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md). To buy reserved capacity:

- You must be in the Owner role for at least one Enterprise or individual subscription with pay-as-you-go rates.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin on the subscription.
- For the Cloud Solution Provider (CSP) program, only admin agents or sales agents can buy SQL Edge reserved capacity.

## Buy a software plan

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add** and then in the **Purchase Reservations** pane, select **Azure SQL Edge**.
4. Select a scope. The reservation's scope can cover one subscription or multiple subscriptions (shared scope):
    - **Shared** - The reservation discount is applied to SQL Edge devices running in any subscriptions within your billing context. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment. For Pay-As-You-Go customers, the shared scope is all Pay-As-You-Go subscriptions created by the account administrator.
    - **Management Group** - The reservation discount is applied to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
    - **Single subscription** - The reservation discount is applied to the SQL Edge devices in this subscription.
    - **Single resource group** - The reservation discount is applied to the SQL Edge devices in the selected subscription and the selected resource group within that subscription. 
5. Select a **Subscription**. The subscription used to pay for the capacity reservation. The subscription payment method is charged the upfront costs for the reservation.
    - For an enterprise subscription, the charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
    - For an individual subscription with pay-as-you-go pricing, the charges are billed to the subscription's credit card or invoice payment method. 
6. Select a **Region**. The Azure region that's covered by the capacity reservation. 
7. Select the **Billing frequency**. It indicates how often the account is billed for the reservation. Options include _Monthly_ or _Upfront_. 
8. Select a **Term**. One year or three years.
9. Add the product to the cart.
10. Choose a quantity, which is the number of prepaid SQL Edge deployments that can get the billing discount.
11. Review your selections and purchase.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

To learn how to manage a reservation, see [Manage Azure reservations](manage-reserved-vm-instance.md).

To learn more, see the following articles:

- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Manage Reservations in Azure](manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)