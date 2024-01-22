---
title: Understand reservations discount for Azure SQL Edge
description: Learn how a reservation discount is applied to Azure SQL Edge.
author: bandersmsft
ms.reviewer: kendalv
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 11/17/2023
ms.author: banders
---

# How a reservation discount is applied to Azure SQL Edge

After you buy Azure SQL Edge reserved capacity, the reservation discount is automatically applied to SQL Edge deployed to edge devices that match the attributes and quantity of the reservation. A reservation applies to the future use of Azure SQL Edge deployments. You're charged for software, storage, and networking at the normal rates.

## How reservation discount is applied

A reservation discount is "_use-it-or-lose-it_". So, if you don't have matching resources for any month, then you lose a reservation quantity for that month. You can't carry forward unused reserved months.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved months are _lost_.

Stopped resources are billed and continue to use reservation hours. Deallocate or delete resources or scale-in other resources to use your available reservation months with other workloads.

## Discount applied to deployed devices

The reserved capacity discount is applied to deployed devices monthly. The reservation that you buy is matched to the usage emitted by the deployed device. For devices that don't run the full month, the reservation is automatically applied to other deployed devices matching the reservation attributes. The discount can apply to deployed devices that are running concurrently. If you don't have deployed devices that run for the full month that match the reservation attributes, you don't get the full benefit of the reservation discount for that month.

If your number of devices deployed exceeds your reservation quantity, then you're charged the non-discounted cost for the number beyond the reservation quantity.

To understand and view the application of your Azure Reservations in billing usage reports, see [Understand Azure reservation usage](understand-reserved-instance-usage-ea.md).

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Manage Azure Reservations](manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
- [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations)