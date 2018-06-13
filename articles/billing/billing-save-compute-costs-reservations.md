---
title: What are Azure Reserved Instances? - Azure Billing | Microsoft Docs
description: Learn about Azure Reserved VM Instances and VM pricing to save on your virtual machines costs and get the best effective price.
services: 'billing'
documentationcenter: ''
author: yashesvi
manager: yashesvi
editor: ''

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/09/2018
ms.author: yashar

---
# What are Azure Reserved VM Instances?
[Azure Reserved VM Instances](https://azure.microsoft.com/pricing/reserved-vm-instances) helps you save money by pre-paying for one-year or three-years of compute capacity allowing you to get a discount on the virtual machines you use. Azure Reserved Instances can significantly reduce your virtual machine costs—up to 72 percent on pay-as-you-go prices–with one-year or three-year upfront commitment. Reserved Instances provide a billing discount and do not affect the runtime state of your virtual machines.

You can buy a Reserved Instance (RI) in the [Azure portal](https://aka.ms/reservations). For more information, see [Prepay for virtual machines and save money with Reserved Instances](https://go.microsoft.com/fwlink/?linkid=861721).

## Why should I buy a Reserved Instance?
If you have virtual machines that run for long periods of time, purchasing a Reserved Instance gives you the most cost-effective option. For example, if you continuously run four instances of a Standard D2 VM in the West US region, without a Reserved Instance you are charged at pay-as-you-go rates. If you purchase a Reserved Instance for those four VMs, the VMs immediately get the billing benefit. They are no longer charged at the pay-as-you-go rates. 

## What charges does a Reserved Instance cover?
A Reserved Instance only covers the virtual machine infrastructure charges for your Windows or Linux virtual machines. A Reserved Instance does not cover additional software, networking, or storage charges. For Windows virtual machines, you can cover the Windows licensing costs with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

## Who’s eligible to purchase a Reserved Instance?
Azure customers with these subscriptions types can purchase a Reserved Instance:
-	Enterprise agreement subscription offer type (MS-AZR-0017P).
-	[Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription offer type (MS-AZR-003P). You must be in the role “Owner” on the subscription to buy a Reserved Instance. For purchasing Reserved Instances in an enterprise enrollment, the enterprise administrator must enable Reserved Instance purchases in the EA portal. By default, this setting is enabled.
-	Cloud Solution Provider (CSP) partners can use Azure Portal or [Partner Center](https://docs.microsoft.com/partner-center/azure-reservations) to purchase Reserved Instances.

## How is a Reserved Instance purchase billed?
The Reserved Instance purchase is charged to the payment method tied to the subscription. 
If you have an Enterprise subscription, the Reserved Instance cost is deducted from your monetary commitment balance. If your monetary commitment balance doesn’t cover the cost of the Reserved Instance, you’re billed the overage.
If you have a Pay-As-You-Go subscription, the credit card you have on your account is billed immediately. If you’re billed by invoice, you see the charges on your next invoice.

## How is the purchased Reserved Instance discount applied?
The Reserved Instance discount applies to the virtual machines that match the attributes you select when you purchase the Reserved Instance. The attributes include the scope where the matching VMs run. For example, if you want a Reserved Instance discount for four Standard D2 virtual machines in the West US region, select the subscription where the VMs are running. If the virtual machines are running in different subscriptions within your enrollment/account, then select the scope as shared. Shared scope allows the Reserved Instance discount to be applied across subscriptions. You can change the scope after you buy a Reserved Instance. To change the scope, see documentation on how to manage Reserved Instances.

The Reserved Instance discount only applies to virtual machines associated with enterprise or Pay-As-You-Go subscription types. Virtual machines running in a subscription with other offer types do not receive the Reserved Instance discount. For enterprise enrollments, enterprise Dev/Test subscriptions aren’t eligible for the Reserved Instance benefits.

To better understand how Reserved Instance affects your virtual machine billing, see [Understanding the application of Reserved Instances billing benefit](https://go.microsoft.com/fwlink/?linkid=863405).

## What happens when the Reserved Instance term expires?
At the end of the Reserved Instance term, the billing discount expires, and the virtual machine infrastructure is billed at the pay-as-you go price. Reserved Instances do not auto-renew. To continue getting the billing discount, you must buy a new Reserved Instance. 

## Sizes and Regional Availability
Reserved Instances are available for most VM sizes with some exceptions:
- VMs in Preview – Any VM-series or size that is in preview are not available for Reserved Instance purchase.
- Clouds – Reserved Instances are not available for purchase in the Azure US Government, Germany, or China regions. 
- Insufficient quota – A Reserved Instance that is scoped to a single subscription must have vCPU quota available in the subscription for the new RI. For example, if the target subscription has a quota limit of 10 vCPUs for D-Series, then you can't buy a Reserved Instance for 11 Standard_D1 instances. The quota check for Reserved Instances includes the VMs already deployed in the subscription. For example, if the subscription has a quota of 10 vCPUs for D-Series and has two standard_D1 instances deployed, then you can buy a Reserved Instance for 10 standard_D1 instances in this subscription. 
- Capacity restrictions – In rare circumstances, Azure limits the purchase of new Reserved Instances for subset of VM sizes, due to low capacity in a region.

## Next steps
Start saving on your virtual machines by purchasing a [Azure Reserved Instance](https://go.microsoft.com/fwlink/?linkid=861721). 

To learn more about Reserved Instances, see the following articles:

- [Prepay for Virtual Machines with Reserved Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Manage Reserved Instances](billing-manage-reserved-vm-instance.md)
- [Understand how the Reserved Instance discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand Reserved Instance usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand Reserved Instance usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with Reserved Instances](billing-reserved-instance-windows-software-costs.md)
- [Reserved Instances in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
