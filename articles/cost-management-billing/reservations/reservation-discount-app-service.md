---
title: Reservation discounts for Azure App Service
description: Learn how reservation discounts apply to Azure App Service Premium v3 and Isolated v2 instances.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 03/26/2025
ms.author: primittal
---

# How reservation discounts apply to Azure App Service

This article helps you understand how discounts apply to Azure App Service Premium v3 and Isolated v2 instances. To use Isolated v2 you must have an App Service Environment.

## How reservation discounts apply to instances

After you buy an Azure App Service Premium v3 or Isolated v2 Reserved Instance, the reservation discount is automatically applied to App Service instances that match the attributes and quantity of the reservation. A reservation covers the cost of your instances.

### How the discount is applied to Azure App Service

A reservation discount is *use-it-or-lose-it*. So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are lost.

Any management group and shared scope reservations include any development and testing workloads that might be running. Although dev/test subscriptions may have lower rates under [Azure Dev/Test pricing](https://azure.microsoft.com/pricing/dev-test/#overview) than other subscription types, reservations that you bought apply reservation pricing to your workloads.

### Reservation discount for instances

The Azure reservation discount is applied to running instances on an hourly basis. The reservations that you have purchased are matched to the usage emitted by the running instances to apply the reservation discount. For instances that may not run the full hour, the reservation is filled from other instances not using a reservation, including concurrently running instances. At the end of the hour, the reservation application for instances in the hour is locked. A reservation is underutilized when it doesn't run for an hour or when concurrent instances within the hour don't fill the hour of the reservation. The following graph illustrates the application of a reservation to billable instance usage. The illustration is based on one P1v3 instance reservation purchase and two matching P1v3 instances.

:::image type="content" border="true" source="./media/reservation-discount-app-service/reserved-premium-v3-instance-application.png" alt-text="Screenshot showing the application of a reservation to billable instance usage.":::

1.	Any usage that's above the reservation line gets charged at the regular pay-as-you-go rates. You're not charged for any usage below the reservations line, since it has been already paid as part of reservation purchase.
2.	In hour 1, instance 1 runs for 0.75 hours and instance 2 runs for 0.5 hours. Total usage for hour 1 is 1.25 hours. You're charged the pay-as-you-go rates for the remaining 0.25 hours.
3.	For hour 2 and hour 3, both instances ran for 1 hour each. One instance is covered by the reservation and the other is charged at pay-as-you-go rates.
4.	For hour 4, instance 1 runs for 0.5 hours and instance 2 runs for 1 hour. Instance 1 is fully covered by the reservation and 0.5 hours of instance 2 is covered. You’re charged the pay-as-you-go rate for the remaining 0.5 hours.

To understand and view the application of your Azure Reservations in billing usage reports, see [Understand reservation usage](understand-reserved-instance-usage-ea.md).

## Related content

- To learn how to manage a reservation, see [Manage Azure Reservations](manage-reserved-vm-instance.md).
- To learn more about prepurchasing App Service Premium v3 and Isolated v2 reserved capacity to save money, see [Prepay for Azure App Service with reserved capacity](prepay-app-service.md).
- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Reservations in Azure](manage-reserved-vm-instance.md)
  - [Understand reservation usage for a subscription with pay-as-you-go rates](understand-reserved-instance-usage.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
