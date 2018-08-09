---
title: What are Azure reservations? | Microsoft Docs
description: Learn about Azure reservations and pricing to save on your virtual machines, SQL databases, and other resources costs.
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
ms.date: 08/08/2018
ms.author: yashar

---
# What are Azure reservations?

Azure reservations helps you save money by pre-paying for one-year or three-years of virtual machine or SQL Database compute capacity. Pre-paying allows you to get a discount on the resources you use. Azure reservations can significantly reduce your virtual machine or SQL database compute costs—up to 72 percent on pay-as-you-go prices–with one-year or three-year upfront commitment. reservations provide a billing discount and don't affect the runtime state of your virtual machines or SQL databases.

You can buy a reservation in the [Azure portal](https://aka.ms/reservations). For more information, see the following topics:

- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md)

## Why should I buy a reservation?

If you have virtual machines or SQL databases that run for long periods of time, purchasing a reservation gives you the most cost-effective option. For example, if you continuously run four instances of a service without a reservation, you are charged at pay-as-you-go rates. If you purchase a reservation for those resources, you immediately get the reservation discount. The resources are no longer charged at the pay-as-you-go rates.

## What charges does a reservation cover?

- Reserved Virtual Machine Instance: A reservation only covers the virtual machine compute costs. It doesn't cover additional software, networking, or storage charges.
- SQL Database reserved vCore: Only the compute costs are included with a reservation. The license is billed separately.

For Windows virtual machines and SQL Database, you can cover the licensing costs with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

## Who’s eligible to purchase a reservation?

Azure customers with these subscriptions types can purchase a reservation:

- Enterprise agreement subscription offer type (MS-AZR-0017P).
- [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription offer type (MS-AZR-003P). You must have the “Owner” role on the subscription to buy a reservation. To purchase reservations in an enterprise enrollment, the enterprise administrator must enable reservation purchases in the EA portal. By default, this setting is enabled.
- Cloud Solution Provider (CSP) partners can use Azure portal or [Partner Center](https://docs.microsoft.com/partner-center/azure-reservations) to purchase Azure reservations. 

An Azure reservation discount only applies to virtual machines or SQL Databases associated with Enterprise, Pay-As-You-Go, or CSP subscription types.

## How is a reservation billed?

The reservation is charged to the payment method tied to the subscription. If you have an Enterprise subscription, the reservation cost is deducted from your monetary commitment balance. If your monetary commitment balance doesn’t cover the cost of the reservation, you’re billed the overage. If you have a Pay-As-You-Go subscription, the credit card you have on your account is billed immediately. If you’re billed by invoice, you see the charges on your next invoice.

## How is the reservation discount applied?

The reservation discount applies to the resource usage that matches the attributes you select when you buy the reservation. The attributes include the scope where the matching VMs, SQL databases, or other resources run. For example, if you want a reservation discount for four Standard D2 virtual machines in the West US region, select the subscription where the VMs are running. If the virtual machines are running in different subscriptions within your enrollment/account, then select the scope as shared. Shared scope allows the reservation discount to be applied across subscriptions. You can change the scope after you buy a reservation. For more information, see [Manage reservations in Azure](billing-manage-reserved-vm-instance.md).

The reservation discount only applies to virtual machines or SQL databases associated with enterprise or Pay-As-You-Go subscription types. Virtual machines or SQL databases that run in a subscription with other offer types don't receive the reservation discount. For enterprise enrollments, enterprise Dev/Test subscriptions aren’t eligible for the reservation benefits.

To better understand how reservations affects your virtual machine or SQL database billing, see [Understand how the reservation discount is applied](billing-understand-vm-reservation-charges.md).

## What happens when the reservation term expires?

At the end of the reservation term, the billing discount expires, and the virtual machine, SQL database, or other resources are billed at the pay-as-you go price. Azure reservations don't auto-renew. To continue getting the billing discount, you must buy a new reservation for reservation eligible services.

## Next steps

Start saving on your virtual machines by purchasing a [Reserved VM Instance](../virtual-machines/windows/prepay-reserved-vm-instances.md) or [SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md).

To learn more about reservations, see the following articles:

- [Manage Azure reservations](billing-manage-reserved-vm-instance.md)
- [Understand how the reservation discount is applied](billing-understand-vm-reservation-charges.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reservations](billing-reserved-instance-windows-software-costs.md)
- [Azure reservations in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
