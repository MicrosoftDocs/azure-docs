---
title: Save on JBoss EAP Integrated Support on Azure App Service with reservations
description: Learn how you can save on your JBoss EAP Integrated Support fee on Azure App Service.
author: bandersmsft
ms.reviewer: nitinarora
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 12/06/2022
ms.author: banders
ms.custom: references_regions
---

# Reduce costs with JBoss EAP Integrated Support reservations

You can save on your JBoss EAP Integrated Support costs on Azure App Service when you purchase reservations for one year. You can purchase a reservation for JBoss EAP Integrated Support at any time.

## Save with JBoss EAP Integrated Support reservations

When you purchase a JBoss EAP Integrated Support reservation, the discount is automatically applied to the JBoss apps that match the reservation scope. You don't need to assign a reservation to an instance to receive the discount.

## Buy a JBoss EAP Integrated Support reservation

You can buy a reservation for JBoss EAP Integrated Support in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/documentation/filters/%7B%22reservedResourceType%22%3A%22VirtualMachines%22%7D). Pay for the reservation [up front or with monthly payments](prepare-buy-reservation.md).

- You must be in an Owner role for at least one EA subscription or a subscription with a pay-as-you-go rate.
- For EA subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). Or, if that setting is disabled, you must be an EA Admin for the subscription.
- For the Cloud Solution Provider (CSP) program, only the admin agents or sales agents can buy reservations.

To buy an instance:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** > **Reservations**.
3. Select **Add** to purchase a new reservation and then select **Instance**.
4. Enter required fields. 

If you have an EA agreement, you can use the **Add more option** to quickly add additional instances. The option isn't available for other subscription types.


## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).

## Discount application shown in usage data

Your usage data has an effective price of zero for the usage that gets a reservation discount. The usage data shows the reservation discount for each stamp instance in each reservation.

For more information about how reservation discount shows in usage data, see [Get Enterprise Agreement reservation costs and usage](understand-reserved-instance-usage-ea.md) if you're an Enterprise Agreement (EA) customer. Otherwise see, [Understand Azure reservation usage for your individual subscription with pay-as-you-go rates](understand-reserved-instance-usage.md).

## Next steps

- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Understand how an Azure App Service Isolated Stamp reservation discount is applied](reservation-discount-app-service.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
