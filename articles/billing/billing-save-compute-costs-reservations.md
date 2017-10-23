---
title: Save compute costs by purchasing a Azure Reserved Virtual Machine Instance - Azure | Microsoft Docs
description: Learn about Azure Reserved Virtual Machine Instance. 
author: vikdesai
manager: vikdesai
editor: ''

ms.assetid: 65AD86FC-0774-4AC7-BF84-4AF3BA282827
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/22/2017
ms.author: vikdesai
---
# Save compute costs with Azure Reserved Virtual Machine Instances 
Reserved Virtual Machine Instances allow you to pre-purchase 1 to 3 years of compute capacity and get a discount on the virtual machines you use. It significantly reduces your virtual machine costs compared to pay-as-you-go prices – with one-year or three-year upfront commitment. Reserved Virtual Machine Instances is a billing benefit and does not affect the runtime state of virtual machines.
To purchase a Reserved Instance, see purchasing Reserved Instance documentation.
## Why should I buy a Reserved Instance?
If you have virtual machines that run for long periods of time, purchasing a Reserved Virtual Machine Instance gives you the best effective price. For example, if you continuously run four instances of Standard D2 in West US region, without a reservation you are charged at pay-as-go-you rates. If you purchase a Reserved Virtual Machine Instance for those four VMs, the VMs immediately get the billing benefit. They are no longer charged at the pay-as-you go rates. 
## What charges does a Reversed Instance cover?
A reservation only covers the virtual machine infrastructure charges for your Windows or Linux machines, it does not cover additional software, networking, or storage charges. For Windows virtual machines, you can cover the Windows licensing costs with Azure Hybrid Benefit.

## Who’s eligible to purchase a Reserved Virtual Machine Instance?
Azure customers with these subscriptions types that can purchase a Reserved Virtual Machine Instance:
-	Enterprise agreement subscription offer type (MS-AZR-0017P)
-	Pay-As-You-Go subscription offer type (MS-AZR-003P)
You must be in the role “Owner” on the subscription to buy a Reserved Instance. For purchasing reservations in an enterprise enrollment, the enterprise administrator must enable reservation purchases in the EA portal.

## How is a Reserved Virtual Machine Instance billed?
The reservation purchase is charged to the payment method tied to the subscription. 
If you have an Enterprise subscription, the reservation cost is deducted from your balance. If your balance doesn’t cover the cost of the reservation, you’re billed the overage.
If you have a Pay-As-You-Go subscription, the credit card you have on your account is billed immediately. If you’re billed by invoice, you see the charges on your next invoice.

## How is the Reserved Virtual Machine Instance discount applied?
The Reserved Virtual Machine Instance discount applies to the virtual machines that match the attributes you select when you purchase the reservation. The attributes include the scope where the matching VMs run. For example, if you want a Reserved VM Instance discount for four Standard D2 virtual machines in the West US region, select the subscription where the VMs are running. If the virtual machines are running in different subscriptions within your enrollment/account, then select the scope as shared. Shared scope allows the reservation discount to be applied across subscriptions.
You can change the scope after you buy a Reserved VM Instance. To change the scope, see documentation on how to manage reservations.

The reservation discount only applies to virtual machines in subscriptions with enterprise or Pay-As-You-Go offer types. Virtual machines running in a subscription with other offer types do not receive the reservation discount. For enterprise enrollments, enterprise Dev/Test subscriptions aren’t eligible for the Reserved Instance benefits.

How reservation affects the virtual machine billing is explained in understanding the application of reservation billing benefit.
## What happens when the reservation term expires?
At the end of the reservation term, the billing discount expires, and the virtual machine infrastructure is billed at the pay-as-you go price. Reservations do not auto-renew. To continue getting the billing discount, you must buy a new Reserved Virtual Machine Instance. 
## Sizes and Regional Availability
Reservations are available for most VM sizes with some exceptions:
1.	Preview VM Sizes – Any size that is in preview are not available for Reserved Virtual Machine Instance purchase.
2.	Clouds – Reserved Virtual Machine Instances are not available for purchase in the Azure US Government, Germany, or China regions. 
3.	Insufficient Quota – A RI that is scoped to a single subscription must have vCPU quota available in the subscription for the new RI. For example, if the target subscription had a quota of 10 vCPUs for D-Series family, then it would not be possible to purchase a Reserved VM Instance for 11 Standard_D1 instances. In this case, the subscription would not have enough quota to support the Reserved VM Instance purchase. This quota check is based on the VM sizes already deployed in the subscription. For example, if the subscription had a quota of 10 vCPUs for D-Series Family. If this subscription has two standard_D1 instances deployed, then it is possible to purchase a Reserved VM instance for 10 standard_D1 instances in this subscription. 
4.	Capacity Restrictions – In rare circumstances, Azure limits access to a subset of VM sizes due to low capacity in a region. This same scenario can cause new reservations to be restricted for those VM sizes that are in low capacity in the region. 

