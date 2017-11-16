---
title: Understand Azure Reserved Virtual Machine Instances discount application | Microsoft Docs
description: Learn how Azure Reserved VM Instance discount is applied to running VMs. 
services: 'billing'
documentationcenter: ''
author: vikramdesai01
manager: vikdesai
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/10/2017
ms.author: vikdesai
---
# Understand how the Reserved Virtual Machine Instance discount is applied
After you buy a Reserved VM Instance, the reservation discount is automatically applied to virtual machines matching the attributes and quantity of the reservation. A reservation covers the infrastructure costs of your virtual machines. The following table illustrates the costs for your virtual machine after you purchase a reservation. In all cases, you are charged for storage and networking at the normal rates.

| Virtual Machine Type  | Charges with reservation |    
|-----------------------|--------------------------------------------| 
|Linux VMs without additional software | Reservation covers your VM infrastructure costs.|
|Linux VMs with software charges (For example, Red Hat) | Reservation covers the infrastructure costs. You are charged for additional software.|
|Windows VMs without additional software |Reservation covers the infrastructure costs. You are charged for Windows software.|
|Windows VMs with additional software (For example, SQL server) | Reservation covers the infrastructure costs. You are charged for Windows software and for additional software.|
|Windows VMs with [Azure Hybrid Benefit](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing) | Reservation covers the infrastructure costs. The Windows software costs are covered by the Azure Hybrid Benefit. Any additional software is charged separately.| 

## Application of reservation discount to non-Windows VMs
 The reservation discount is applied to running VM instances on an hourly basis. The reservations that you have bought are matched to the usage emitted by the running VMs to apply the reservation discount. The following graph illustrates the application of a reservation to billable VM usage. The illustration is based on one reservation purchase and two matching VM instances.

![Reserved VM Instance application](media/billing-reserved-vm-instance-application/billing-reserved-vm-instance-application.png)

1.	Any usage that’s above the Reserved VM Instance line gets charged at the regular pay-as-you-go rates. You're not charge for any usage below the Reserved VM Instances line, since it has been already paid as part of reservation purchase.
2.	In hour 1, instance 1 runs for 0.75 hours and instance 2 runs for 0.5 hours. Total usage for hour 1 is 1.25 hours. You are charged the pay-as-you-go rates for the remaining 0.25 hours.
3.	For hour 2 and hour 3, both instances ran for 1 hour each. One instance is covered by the reservation and the other is charged at pay-as-you-go rates.
4.	For hour 4, instance 1 runs for 0.5 hours and instance 2 runs for 1 hour. Instance 1 is fully covered by the reservation and 0.5 hours of instance 2 is covered. You’re charged the pay-as-you-go rate for the remaining 0.5 hours.

To understand and view the application of your reservations in billing usage reports, see [Understand Reserved VM Instance usage](https://go.microsoft.com/fwlink/?linkid=862757).

## Application of reservation discount to Windows VMs
When you are running Windows VM instances, the reservation is applied to cover the infrastructure costs. The application of the reservation to the VM infrastructure costs for Windows VMs is the same as for non-Windows VMs. You are charged separately for Windows software on a per vCPU basis. See [Windows software costs with reservations](https://go.microsoft.com/fwlink/?linkid=862756). You can cover your Windows licensing costs with [Azure Hybrid Benefit for Windows Server] (https://docs.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing).

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
