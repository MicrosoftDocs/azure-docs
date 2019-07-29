---
title: Understand Azure Reserved VM Instances discount | Microsoft Docs
description: Learn how Azure Reserved VM Instance discount is applied to running virtual machines.
author: yashesvi
manager: yashar
ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/11/2019
ms.author: banders
---
# How the Azure reservation discount is applied to virtual machines

After you buy an Azure Reserved Virtual Machine Instance, the reservation discount is automatically applied to virtual machines that match the attributes and quantity of the reservation. A reservation covers the compute costs of your virtual machines.

A reservation discount applies to the base VMs that you purchase from the Azure Marketplace.

For SQL Database reserved capacity, see [Understand Azure Reserved Instances discount](billing-understand-reservation-charges.md).

The following table illustrates the costs for your virtual machine after you purchase a Reserved VM Instance. In all cases, you're charged for storage and networking at the normal rates.

| Virtual Machine Type  | Charges with Reserved VM Instance |
|-----------------------|--------------------------------------------|
|Linux VMs without additional software | The reservation covers your VM infrastructure costs.|
|Linux VMs with software charges (For example, Red Hat) | The reservation covers the infrastructure costs. You're charged for additional software.|
|Windows VMs without additional software |The reservation covers the infrastructure costs. You're charged for Windows software.|
|Windows VMs with additional software (For example, SQL server) | The reservation covers the infrastructure costs. You're charged for Windows software and for additional software.|
|Windows VMs with [Azure Hybrid Benefit](../virtual-machines/windows/hybrid-use-benefit-licensing.md) | The reservation covers the infrastructure costs. The Windows software costs are covered by the Azure Hybrid Benefit. Any additional software is charged separately.|

## How reservation discount is applied

A reservation discount is "*use-it-or-lose-it*". So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are *lost*.

## Reservation discount for non-Windows VMs

 The Azure reservation discount is applied to running VM instances on an hourly basis. The reservations that you have purchased are matched to the usage emitted by the running VMs to apply the reservation discount. For VMs that may not run the full hour, the reservation will be filled from other VMs not using a reservation, including concurrently running VMs. At the end of the hour, the reservation application for VMs in the hour is locked. In the event a VM does not run for an hour or concurrent VMs within the hour do not fill the hour of the reservation, the reservation is underutilized for that hour. The following graph illustrates the application of a reservation to billable VM usage. The illustration is based on one reservation purchase and two matching VM instances.

![Screenshot of one applied reservation and two matching VM instances](./media/billing-reserved-vm-instance-application/billing-reserved-vm-instance-application.png)

1. Any usage that's above the reservation line gets charged at the regular pay-as-you-go rates. You're not charge for any usage below the reservations line, since it has been already paid as part of reservation purchase.
2. In hour 1, instance 1 runs for 0.75 hours and instance 2 runs for 0.5 hours. Total usage for hour 1 is 1.25 hours. You're charged the pay-as-you-go rates for the remaining 0.25 hours.
3. For hour 2 and hour 3, both instances ran for 1 hour each. One instance is covered by the reservation and the other is charged at pay-as-you-go rates.
4. For hour 4, instance 1 runs for 0.5 hours and instance 2 runs for 1 hour. Instance 1 is fully covered by the reservation and 0.5 hours of instance 2 is covered. You’re charged the pay-as-you-go rate for the remaining 0.5 hours.

To understand and view the application of your Azure Reservations in billing usage reports, see [Understand reservation usage](billing-understand-reserved-instance-usage-ea.md).

## Reservation discount for Windows VMs

When you're running Windows VM instances, the reservation is applied to cover the infrastructure costs. The application of the reservation to the VM infrastructure costs for Windows VMs is the same as for non-Windows VMs. You're charged separately for Windows software on a per vCPU basis. See [Windows software costs with Reservations](billing-reserved-Instance-windows-software-costs.md). You can cover your Windows licensing costs with [Azure Hybrid Benefit for Windows Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md).

## Discount can apply to different sizes

When you buy a Reserved VM Instance, if you select **Optimized for**: **instance size flexibility**, the discount coverage depends on the VM size you select. The reservation can apply to the virtual machines (VMs) sizes in the same size series group. For more information, see [Virtual machine size flexibility with Reserved VM Instances](../virtual-machines/windows/reserved-vm-instance-size-flexibility.md).

## Discount applies to matching ServiceType only

A reservation discount applies only to the VM usage where the `ServiceType` value in `AdditionalInfo` matches the reservation that's purchased. Reservation discount application ignores the meter used for VMs and only evaluates `ServiceType`. Know which service type that you purchased the VM for. You can exchange a non-premium storage VM reservation for a premium storage reservation, or in the opposite manner.

## Services that get VM reservation discounts

Your VM reservations can apply to VM usage emitted from multiple services - not just for your VM deployments. Resources that get reservation discounts change depending on the instance size flexibility setting.

### Instance size flexibility setting

The instance size flexibility setting determines which services get the reserved instance discounts.

Whether the setting is on or off, reservation discounts automatically apply to any matching VM usage when the *ConsumedService* is `Microsoft.Compute`. So, check your usage data for the *ConsumedService* value. Some examples include:

- Virtual machines
- Virtual machine scale sets
- Container service
- Azure Batch deployments (in user subscriptions mode)
- Azure Kubernetes Service (AKS)
- Service Fabric

When the setting is on, reservation discounts automatically apply to matching VM usage when the *ConsumedService* is any of the following items:

- Microsoft.Compute
- Microsoft.ClassicCompute
- Microsoft.Batch
- Microsoft.MachineLearningServices
- Microsoft.Kusto

Check the *ConsumedService* value in your usage data to determine if the usage is eligible for reservation discounts.

For more information about instance size flexibility, see [Virtual machine size flexibility with Reserved VM Instances](../virtual-machines/windows/reserved-vm-instance-size-flexibility.md).


## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are reservations for Azure?](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md)
- [Manage reservations for Azure](billing-manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations)
- [Windows software costs not included with reservations](billing-reserved-instance-windows-software-costs.md)
