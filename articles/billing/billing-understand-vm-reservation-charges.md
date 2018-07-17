---
title: Understand Azure reserved instances discount | Microsoft Docs
description: Learn how Azure Reserved VM Instance discount is applied to running virtual machines. 
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
ms.date: 05/09/2018
ms.author: yashar
---
# Understand how the reserved instance discount is applied
After you buy a Azure Reserved VM Instance, the reserved instance discount is automatically applied to virtual machines matching the attributes and quantity of the reserved instance. A reserved instance covers the infrastructure costs of your virtual machines. The following table illustrates the costs for your virtual machine after you purchase a reserved instance. In all cases, you are charged for storage and networking at the normal rates.

| Virtual Machine Type  | Charges with reserved instance |    
|-----------------------|--------------------------------------------|
|Linux VMs without additional software | The reserved instance covers your VM infrastructure costs.|
|Linux VMs with software charges (For example, Red Hat) | The reserved instance covers the infrastructure costs. You are charged for additional software.|
|Windows VMs without additional software |The reserved instance covers the infrastructure costs. You are charged for Windows software.|
|Windows VMs with additional software (For example, SQL server) | The reserved instance covers the infrastructure costs. You are charged for Windows software and for additional software.|
|Windows VMs with [Azure Hybrid Benefit](https://docs.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing) | The reserved instance covers the infrastructure costs. The Windows software costs are covered by the Azure Hybrid Benefit. Any additional software is charged separately.| 

## Application of reserved instance discount to non-Windows VMs
 The Azure Reserved Instance discount is applied to running VM instances on an hourly basis. The reserved instances that you have purchased are matched to the usage emitted by the running VMs to apply the Reserved Instance discount. For VMs that may not run the full hour, the reserved instance will be filled from other VMs not using a reserved instance, including concurrently running VMs. At the end of the hour, the reserved instance application for VMs in the hour is locked. In the event a VM does not run for an hour or concurrent VMs within the hour do not fill the hour of the reserved instance, the reserved instance is underutilized for that hour. The following graph illustrates the application of a reserved instance to billable VM usage. The illustration is based on one reserved instance purchase and two matching VM instances.

![Screenshot of one applied Reserved Instance and two matching VM instances](media/billing-reserved-vm-instance-application/billing-reserved-vm-instance-application.png)

1.	Any usage that’s above the reserved instance line gets charged at the regular pay-as-you-go rates. You're not charge for any usage below the reserved instances line, since it has been already paid as part of reserved instance purchase.
2.	In hour 1, instance 1 runs for 0.75 hours and instance 2 runs for 0.5 hours. Total usage for hour 1 is 1.25 hours. You are charged the pay-as-you-go rates for the remaining 0.25 hours.
3.	For hour 2 and hour 3, both instances ran for 1 hour each. One instance is covered by the reserved instance and the other is charged at pay-as-you-go rates.
4.	For hour 4, instance 1 runs for 0.5 hours and instance 2 runs for 1 hour. Instance 1 is fully covered by the reserved instance and 0.5 hours of instance 2 is covered. You’re charged the pay-as-you-go rate for the remaining 0.5 hours.

To understand and view the application of your Azure reserved instances in billing usage reports, see [Understand Reserved Instance usage](https://go.microsoft.com/fwlink/?linkid=862757).

## Application of reserved instance discount to Windows VMs
When you are running Windows VM instances, the reserved instance is applied to cover the infrastructure costs. The application of the reserved instance to the VM infrastructure costs for Windows VMs is the same as for non-Windows VMs. You are charged separately for Windows software on a per vCPU basis. See [Windows software costs with reserved instances](https://go.microsoft.com/fwlink/?linkid=862756). You can cover your Windows licensing costs with [Azure Hybrid Benefit for Windows Server] (https://docs.microsoft.com/azure/virtual-machines/windows/hybrid-use-benefit-licensing).

## Next steps
To learn more about reserved instances, see the following articles:

- [What are Azure Reserved VM Instances?](billing-save-compute-costs-reservations.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Manage reserved instances in Azure](billing-manage-reserved-vm-instance.md)
- [Understand how the reserved instance discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand reserved instance usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reserved instance usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Understand reserved instance usage for CSP subscriptions](https://docs.microsoft.com/partner-center/azure-reservations)
- [Windows software costs not included with reserved instances](billing-reserved-instance-windows-software-costs.md)


## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
