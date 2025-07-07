---
title: Understand reservations discount for Azure SQL Managed Instance
description: Learn how a reservation discount is applied to running Azure SQL Managed Instance. The discount is applied to these instances on an hourly basis.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 03/26/2025
ms.author: primittal
---

# How a reservation discount is applied to Azure SQL Managed Instance

> [!div class="op_single_selector"]
> * [Azure SQL Database](understand-reservation-charges.md)
> * [Azure SQL Managed Instance](understand-reservation-charges-sql-managed-instance.md)

After you buy an Azure SQL Managed Instance reserved capacity, the reservation discount is automatically applied to SQL instances that match the attributes and quantity of the reservation. A reservation applies to the compute costs of your SQL Managed Instance, including the primary replica and any billable secondary replicas. You're charged for software, storage, and networking at the normal rates. You can cover the licensing costs for SQL Managed Instance with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

## How reservation discount is applied

A reservation discount is *use-it-or-lose-it*. So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are *lost*.

When an instance that's eligible for reserved pricing is [stopped](/azure/azure-sql/managed-instance/instance-stop-start-how-to#reservation-pricing), reserved pricing is automatically redirected to another instance, if one exists. To use your available reservation hours with other workloads, deallocate or delete resources or scale-in other resources. If no other instances are available, the reservation hours are lost.

## Discount applied to running SQL managed instances

The SQL Managed Instance reserved capacity discount is applied to running SQL managed instances on an hourly basis. The reservation that you buy is matched to the compute usage emitted by the running SQL managed instance. For SQL managed instances that don't run the full hour, the reservation is automatically applied to other SQL managed instances matching the reservation attributes. The discount can apply to SQL managed instances that are running concurrently. If your SQL managed instances don't operate for the entire hour or don't align with the reservation attributes, you don't fully utilize the hourly reservation discount.

The following examples show how the SQL managed instance reserved capacity discount applies depending on the number of cores you bought, and when they're running.

- Scenario 1: You buy a SQL Managed Instance reserved capacity for an 8 vCores. You run a 16 vCore SQL Managed Instance that matches the rest of the attributes of the reservation. You're charged the pay-as-you-go price for eight vCores of SQL Managed Instance compute usage. You get the reservation discount for one hour of eight vCore SQL Managed Instance compute usage.
- Scenario 2: You buy a SQL Managed Instance reserved capacity for 8 vCores. You are running a 16 vCore [instance pool](/azure/azure-sql/managed-instance/instance-pools-overview) with four instances, each with four cores. You're charged the pay-as-you-go price for 8 vCores of SQL Managed Instance compute usage. You get the reservation discount for eight core SQL Managed Instance compute usage.

For the rest of these examples, assume that the SQL Managed Instance reserved capacity you buy is for 16 vCores and the rest of the reservation attributes match the running SQL managed instances.

- Scenario 3: You run two SQL managed instances with eight vCores each for an hour. The 16 vCore reservation discount is applied to compute usage for both the eight vCores SQL managed instances.
- Scenario 4: You run one 16 vCore SQL Managed Instance from 1 pm to 1:30 pm. You run another 16 vCore SQL Managed Instance from 1:30 to 2 pm. Both are covered by the reservation discount.
- Scenario 5: You run one 16 vCore SQL Managed Instance from 1 pm to 1:45 pm. You run another 16 vCore SQL Managed Instance from 1:30 to 2 pm. You're charged the pay-as-you-go price for the 15-minute overlap. The reservation discount applies to the compute usage for the rest of the time.

To understand and view the application of your Azure Reservations in billing usage reports, see [Understand Azure reservation usage](understand-reserved-instance-usage-ea.md).

> [!NOTE]
> For instances in the **Business Critical service tier of Azure SQL Managed Instance**, compute costs for standard compute and the zone-redundancy add-on are billed separately. Refer to [reservations for zone-redundant resources](/azure/azure-sql/database/reservations-discount-overview#reservations-for-zone-redundant-resources) for more details.


## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved virtual machine Instances](/azure/virtual-machines/prepay-reserved-vm-instances)
- [Prepay for Azure SQL compute resources with Azure SQL reserved capacity](/azure/azure-sql/database/reserved-capacity-overview)
- [Manage Azure Reservations](manage-reserved-vm-instance.md)
- [Understand reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
- [Understand reservation usage for Cloud Solution Provider subscriptions](/partner-center/azure-reservations)
