---
title: Understand reservations discount for Azure SQL Databases | Microsoft Docs
description: Learn how a reservation discount is applied to running Azure SQL Databases.
documentationcenter: ''
author: yashesvi
manager: yashar
editor: ''
ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2019
ms.author: banders
---
# How a reservation discount is applied to Azure SQL Databases

After you buy an Azure SQL Database reserved capacity, the reservation discount is automatically applied to SQL Databases that match the attributes and quantity of the reservation. A reservation covers the compute costs of your SQL Database. You're charged for software, storage, and networking at the normal rates. You can cover the licensing costs for SQL Databases with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

For Reserved Virtual Machine Instances, see [Understand Azure Reserved VM Instances discount](billing-understand-vm-reservation-charges.md).

## How reservation discount is applied

A reservation discount is "*use-it-or-lose-it*". So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are *lost*.

## Discount applied to SQL Databases

 The SQL Database reserved capacity discount is applied to running SQL Databases on an hourly basis. The reservation that you buy is matched to the compute usage emitted by the running SQL Databases. For SQL Databases that don't run the full hour, the reservation is automatically applied to other SQL Databases matching the reservation attributes. The discount can apply to SQL Databases that are running concurrently. If you don't have SQL Databases that run for the full hour that match the reservation attributes, you don't get the full benefit of the reservation discount for that hour.

The following examples show how the SQL Database reserved capacity discount applies depending on the number of cores you bought, and when they're running.

- Scenario 1: You buy a SQL Database reserved capacity for an 8 core SQL Database. You run a 16 core SQL Database that match the rest of the attributes of the reservation. You're charged the pay-as-you-go price for 8 cores of SQL Database compute usage. You get the reservation discount for one hour of 8 core SQL Database compute usage.

For the rest of these examples, assume that the SQL Database reserved capacity you buy is for a 16 core SQL Database and the rest of the reservation attributes match the running SQL Databases.

- Scenario 2: You run two SQL Databases with 8 cores each for an hour. The 16 core reservation discount is applied to compute usage for both the 8 cores SQL Databases.
- Scenario 3: You run one 16 core SQL Database from 1 pm to 1:30 pm. You run another 16 core SQL Database from 1:30 to 2 pm. Both are covered by the reservation discount.
- Scenario 4: You run one 16 core SQL Database from 1 pm to 1:45 pm. You run another 16 core SQL Database from 1:30 to 2 pm. You're charged the pay-as-you-go price for the 15-minute overlap. The reservation discount applies to the compute usage for the rest of the time.

To understand and view the application of your Azure Reservations in billing usage reports, see [Understand Azure reservation usage](billing-understand-reserved-instance-usage-ea.md).

## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md)
- [Manage Azure Reservations](billing-manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations)
