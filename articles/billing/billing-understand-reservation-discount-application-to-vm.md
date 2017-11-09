---
title: Understand the application of reservation discount to running Azure Virtual Machines - Azure | Microsoft Dvocs
description: Learn how Azure Reserved VM Instance discount is applied to running VMs. 
services: 'billing'
documentationcenter: ''
author: vikramdesai01
manager: vikramdesai01
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/09/2017
ms.author: vikdesai
---
# Understand application of Reserved VM Instance discount to running VMs
After you buy a Reserved VM Instance, the reservation discount is automatically applied to virtual machines matching the attributes and quantity of the reservation. A reservation covers the infrastructure costs of your virtual machines. The following table illustrates the costs for your virtual machine after you purchase a reservation. In all cases, you are charged for storage and networking separately.

| Virtual Machine Type  | Charges with reservation |    
|-----------------------|--------------------------------------------| 
|Linux VMs without additional software. | Reservation covers your VM infrastructure costs.|
|Linux VMs with software charges (For example, Red Hat). | Reservation covers the infrastructure costs. You are charged for additional software.|
|Windows VMs without additional software. |Reservation covers the infrastructure costs. You are charged for Windows software.|
|Windows VMs with additional software (for example, SQL server). | Reservation covers the infrastructure costs. You are charged for Windows software and for additional software.|
|Windows VMs with [Azure Hybrid Benefit](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing) | Reservation covers the infrastructure costs. The Windows software costs are covered by the Azure Hybrid Benefit. Any additional software is charged separately.| 

## Application of reservation discount to non-Windows VMs
If you purchase a reservation of DS1 US West for quantity 1 and you have two running VM instances Instances. The reservation discount is applied every hour, the following graph demonstrates the application of the benefit:

![Reserved VM Instance application](media/billing-reserved-vm-instance-application/billing-reserved-vm-instance-application.png)

1.	Any usage that’s above the Reserved VM Instance line gets charged at the regular pay-as-you-go rates. Any usage below the Reserved VM Instance line isn’t billed, since it has been prepaid.
2.	In hour 1, instance 1 runs for 0.75 hours and instance 2 runs for 0.5 hours. Total usage for hour 1 is 1.25 hours. You are charged the pay-as-you-go rates for the remaining 0.25 hours.
3.	For hour 2 and hour 3, both instances ran for 1 hour each. One instance is covered by the reservation and the other is charged at pay-as-you-go rates.
4.	For hour 4, instance 1 runs for 0.5 hours and instance 2 runs for 1 hour. Instance 1 is fully covered by the reservation and 0.5 hours of instance 2 is covered. You’re charged the pay-as-you-go rate for the remaining 0.5 hours.

To understand and view the application of your reservations to your VMs, see [Understand Reserved VM Instance usage](https://go.microsoft.com/fwlink/?linkid=862757).

## Application of reservation discount to Windows VMs
If you purchase a reservation of DS1 US West for quantity 1 and you have two running Windows VM instances Instances. The reservation discount is applied every hour. The reservation is applied to the infrastructure charged, and you are charged for Windows software or a per core basis. See [Windows software costs with reservations](https://go.microsoft.com/fwlink/?linkid=862756).

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
