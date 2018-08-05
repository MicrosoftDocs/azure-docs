---
title: Understand Azure Reserved Instances discount | Microsoft Docs
description: Learn how a reserved instance discount is applied to running SQL Databases. 
services: 'billing'
documentationcenter: ''
author: yashesvi
manager: yashar
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/08/2018
ms.author: yashar
---
# Understand how the reserved instance discount is applied to SQL Databases

After you buy an Azure SQL Database reserved capacity, the reservation discount is automatically applied to SQL Databases that match the attributes and quantity of the reserved instance. A reserved instance covers the compute costs of your SQL Database. You're charged for software, storage, and networking at the normal rates. You can cover the licensing costs for SQL Databases with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

For Reserved Virtual Machine Instances, see [Understand Azure Reserved VM Instances discount](billing-understand-vm-reservation-charges.md).

## Application of reserved instance discount to SQL Databases

 The SQL Database reserved capacity discount is applied to running SQL Databases on an hourly basis. The reserved instance that you buy is matched to the compute usage emitted by the running SQL Databases. For SQL Databases that don't run the full hour, the reserved instance is automatically applied to other SQL Databases matching the reservation attributes. This can include SQL Databases that are running concurrently. If you don't have SQL Databases that run for the full hour that match the reservation attributes, you don't get the full benefit of the reserved instance discount for that hour.

The following examples show how the a SQL Database reserved capacity discount applies depending on the number of cores you bought, and when they're running.

- Scenario 1: You buy a SQL Database reserved capacity for an 8 core SQL Database. You run a 16 core SQL Database that match the rest of the attributes of the reservation. You're charged the pay-as-you-go price for 8 cores of SQL Database compute usage. You get the reservation discount for one hour of 8 core SQL Database compute usage.

For the rest of these examples, assume that the SQL Database reserved capacity you buy is for a 16 core SQL Database and the rest of the reservation attributes match the running SQL Databases.

- Scenario 2: You run two SQL Databases with 8 cores each for an hour. The 16 core reservation discount is applied to compute usage for both the 8 cores SQL Databases.
- Scenario 3: You run one 16 core SQL Database from 1pm to 1:30pm. You run another 16 core SQL Database from 1:30 to 2pm. Both are covered the by the reservation discount.
- Scenario 4: You run one 16 core SQL Database from 1pm to 1:45pm. You run another 16 core SQL Database from 1:30 to 2pm. You are charged the pay-as-you-go price for the 15 minute overlap. The reservation discount applies to the compute usage for the rest of the time.

To understand and view the application of your Azure reserved instances in billing usage reports, see [Understand reserved instance usage](https://go.microsoft.com/fwlink/?linkid=862757).

## Next steps

To learn more about reserved instances, see the following articles:

- [What are Azure reserved instances?](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md)
- [Manage reserved instances in Azure](billing-manage-reserved-vm-instance.md)
- [Understand reserved instance usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reserved instance usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Understand reserved instance usage for CSP subscriptions](https://docs.microsoft.com/partner-center/azure-reservations)
- [Windows software costs not included with reserved VM instances](billing-reserved-instance-windows-software-costs.md)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
