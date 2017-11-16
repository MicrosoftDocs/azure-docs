---
title: Save money by pre-paying for Azure virtual machines - Azure | Microsoft Docs
description: Learn about Azure Reserved Virtual Machine Instance to save on your virtual machines costs. 
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
# Save money on virtual machines with Reserved Virtual Machine Instances 
Reserved Virtual Machine Instances allow you to pre-pay for one-year or three-years of compute capacity to get a discount on the virtual machines you use. It significantly reduces your virtual machine costs—up to 72 percent on pay-as-you-go prices–with one-year or three-year upfront commitment. Reserved Virtual Machine Instances is a billing discount and does not affect the runtime state of virtual machines.

You can buy a Reserved Virtual Machine Instance in the [Azure portal](https://aka.ms/reservations). For more information, see [Prepay for virtual machines and save money with Reserved Virtual Machine Instances](https://go.microsoft.com/fwlink/?linkid=861721).

## Why should I buy a Reserved Virtual Machine Instance?
If you have virtual machines that run for long periods of time, purchasing a Reserved Virtual Machine Instance gives you the best effective price. For example, if you continuously run four instances of Standard D2 in West US region, without a reservation you are charged at pay-as-go-you rates. If you purchase a Reserved Virtual Machine Instance for those four VMs, the VMs immediately get the billing benefit. They are no longer charged at the pay-as-you go rates. 

## What charges does a Reserved Virtual Machine Instance cover?
A reservation only covers the virtual machine infrastructure charges for your Windows or Linux virtual machines. A reservation does not cover additional software, networking, or storage charges. For Windows virtual machines, you can cover the Windows licensing costs with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

## Who’s eligible to purchase a Reserved Virtual Machine Instance?
Azure customers with these subscriptions types can purchase a Reserved Virtual Machine Instance:
-	Enterprise agreement subscription offer type (MS-AZR-0017P).
-	[Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription offer type (MS-AZR-003P).
You must be in the role “Owner” on the subscription to buy a Reserved Instance. For purchasing reservations in an enterprise enrollment, the enterprise administrator must enable reservation purchases in the EA portal, by default the setting is enabled.

## How is a Reserved Virtual Machine Instances purchase billed?
The reservation purchase is charged to the payment method tied to the subscription. 
If you have an Enterprise subscription, the reservation cost is deducted from your monetary commitment balance. If your monetary commitment balance doesn’t cover the cost of the reservation, you’re billed the overage.
If you have a Pay-As-You-Go subscription, the credit card you have on your account is billed immediately. If you’re billed by invoice, you see the charges on your next invoice.

## How is the purchased Reserved Virtual Machine Instance discount applied?
The Reserved Virtual Machine Instance discount applies to the virtual machines that match the attributes you select when you purchase the reservation. The attributes include the scope where the matching VMs run. For example, if you want a Reserved VM Instance discount for four Standard D2 virtual machines in the West US region, select the subscription where the VMs are running. If the virtual machines are running in different subscriptions within your enrollment/account, then select the scope as shared. Shared scope allows the reservation discount to be applied across subscriptions.
You can change the scope after you buy a Reserved VM Instance. To change the scope, see documentation on how to manage reservations.

The reservation discount only applies to virtual machines in subscriptions with enterprise or Pay-As-You-Go offer types. Virtual machines running in a subscription with other offer types do not receive the reservation discount. For enterprise enrollments, enterprise Dev/Test subscriptions aren’t eligible for the Reserved Instance benefits.

How reservation affects the virtual machine billing is explained in [understanding the application of reservation billing benefit](https://go.microsoft.com/fwlink/?linkid=861721).

## What happens when the reservation term expires?
At the end of the reservation term, the billing discount expires, and the virtual machine infrastructure is billed at the pay-as-you go price. Reservations do not auto-renew. To continue getting the billing discount, you must buy a new Reserved Virtual Machine Instance. 

## Sizes and Regional Availability
Reservations are available for most VM sizes with some exceptions:
- Preview VM sizes – Any size that is in preview are not available for Reserved Virtual Machine Instance purchase.
- Clouds – Reserved Virtual Machine Instances are not available for purchase in the Azure US Government, Germany, or China regions. 
- Insufficient quota – A Reserved VM Instance that is scoped to a single subscription must have vCPU quota available in the subscription for the new RI. For example, if the target subscription has a quota limit of 10 vCPUs for D-Series family, then you can't buy a Reserved VM Instance for 11 Standard_D1 instances. The quota check for reservations includes the VMs already deployed in the subscription. For example, if the subscription has a quota of 10 vCPUs for D-Series Family. If this subscription has two standard_D1 instances deployed, then you can buy a Reserved VM instance for 10 standard_D1 instances in this subscription. 
- Capacity restrictions – In rare circumstances, Azure limits purchase of new reservations for subset of VM sizes, due to low capacity in a region.

## Next steps
Start saving on your virtual machines by purchasing a [Reserved Virtual Machine Instance](https://go.microsoft.com/fwlink/?linkid=861721). 

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
