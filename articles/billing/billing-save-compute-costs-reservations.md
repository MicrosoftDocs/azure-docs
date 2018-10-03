---
title: What are Azure Reservations? | Microsoft Docs
description: Learn about Azure Reservations and pricing to save on your virtual machines, SQL databases, Azure Cosmos DB and other resource costs.
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
ms.author: cwatson

---
# What are Azure Reservations?

Azure Reservations helps you save money by pre-paying for one-year or three-years of virtual machine, SQL Database compute capacity, Azure Cosmos DB throughput, or other Azure resources. Pre-paying allows you to get a discount on the resources you use. Reservations can significantly reduce your virtual machine, SQL database compute, Azure Cosmos DB, or other resource costs up to 72% on pay-as-you-go prices. Reservations provide a billing discount and don't affect the runtime state of your resources.

You can buy a reservation in the [Azure portal](https://aka.ms/reservations). For more information, see the following topics:

- [Prepay for Virtual Machines with Azure Reserved VM Instances](../virtual-machines/windows/prepay-reserved-vm-instances.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md)
- [Prepay for Azure Cosmos DB resources with Azure Cosmos DB reserved capacity](../cosmos-db/cosmos-db-reserved-capacity.md)

## Why should I buy a reservation?

If you have virtual machines, Azure Cosmos DB or SQL databases that run for long periods of time, purchasing a reservation gives you the most cost-effective option. For example, if you continuously run four instances of a service without a reservation, you are charged at pay-as-you-go rates. If you purchase a reservation for those resources, you immediately get the reservation discount. The resources are no longer charged at the pay-as-you-go rates.

## What charges does a reservation cover?

- Reserved Virtual Machine Instance: A reservation only covers the virtual machine compute costs. It doesn't cover additional software, networking, or storage charges.
- SQL Database reserved vCore: Only the compute costs are included with a reservation. The license is billed separately.
- Azure Cosmos DB reserved capacity: A reservation covers throughput provisioned for your resources, it does not cover the storage and networking charges. 

For Windows virtual machines and SQL Database, you can cover the licensing costs with [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

## Who’s eligible to purchase a reservation?

Azure customers with these subscriptions types can buy a reservation:

- Enterprise agreement subscription offer type (MS-AZR-0017P).
- [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription offer type (MS-AZR-003P). You must have the “Owner” role on the subscription to buy a reservation.
- Cloud Solution Provider (CSP) partners can use Azure portal or [Partner Center](https://docs.microsoft.com/partner-center/azure-reservations) to purchase Azure Reservations.

A reservation discount only applies to resources associated with Enterprise, Pay-As-You-Go, or CSP subscription types.

## How is a reservation billed?

The reservation is charged to the payment method tied to the subscription. If you have an Enterprise subscription, the reservation cost is deducted from your monetary commitment balance. If your monetary commitment balance doesn’t cover the cost of the reservation, you’re billed the overage. If you have a Pay-As-You-Go subscription, the credit card you have on your account is billed immediately. If you’re billed by invoice, you see the charges on your next invoice.

## How is the reservation discount applied?

The reservation discount applies to the resource usage that matches the attributes you select when you buy the reservation. The attributes include the scope where the matching VMs, SQL databases, Azure Cosmos DB, or other resources run. For example, if you want a reservation discount for four Standard D2 virtual machines in the West US region, select the subscription where the VMs are running. If the virtual machines are running in different subscriptions within your enrollment/account, then select the scope as shared. Shared scope allows the reservation discount to be applied across subscriptions. You can change the scope after you buy a reservation. For more information, see [Manage Azure Reservations](billing-manage-reserved-vm-instance.md).

A reservation discount only applies to resources associated with Enterprise, Pay-As-You-Go, or CSP subscription types. Resources that run in a subscription with other offer types don't receive the reservation discount. For enterprise enrollments, enterprise Dev/Test subscriptions aren’t eligible for the reservation benefits.

To better understand how Reservations affects your billing, see the following topics:

-  [Understand Azure Reserved VM Instances discount](billing-understand-vm-reservation-charges.md)
- [Understand Azure reservation discount](billing-understand-vm-reservation-charges.md)
- [Understand Azure Cosmos DB reservation discount](billing-understand-cosmosdb-reservation-charges.md)
- [Understand Azure reservation discount and usage for SUSE](billing-understand-suse-reservation-charges.md)

## What happens when the reservation term expires?

At the end of the reservation term, the billing discount expires, and the virtual machine, SQL database, Azure Cosmos DB, or other resource is billed at the pay-as-you go price. Azure Reservations don't auto-renew. To continue getting the billing discount, you must buy a new reservation for eligible services and software.

## Discount applies to different sizes with instance size flexibility

When you buy a reservation, the discount can apply to other instances with attributes that are within the same size group. The flexibility of the discount coverage depends on the type of reservation and the attributes you pick when you buy the reservation.

- Reserved VM Instances: When you buy the reservation, if you select **Optimized for**: **instance size flexibility**, the discount coverage depends on the VM size you select. The reservation can apply to the virtual machines (VMs) sizes in the same size series group. For more information, see [Virtual machine size flexibility with Reserved VM Instances](../virtual-machines/windows/reserved-vm-instance-size-flexibility.md).
- SUSE Linux Enterprise software plan: The discount coverage depends on the vCPUs of the VMs where you run the SUSE software. For more information, see [Understand how the SUSE Linux Enterprise software plan discount is applied](billing-understand-suse-reservation-charges.md).
- SQL Database reserved capacity: The discount coverage depends on the performance tier you pick. For more information, see [Understand how an Azure reservation discount is applied](billing-understand-reservation-charges.md).
- Azure Cosmos DB reserved capacity: The discount coverage depends on the provisioned throughput. For more information, see [Understand how an Azure Cosmos DB reservation discount is applied](billing-understand-cosmosdb-reservation-charges.md).

## Next steps

Start saving on your virtual machines by purchasing a [Reserved VM Instance](../virtual-machines/windows/prepay-reserved-vm-instances.md), [SQL Database reserved capacity](../sql-database/sql-database-reserved-capacity.md), or [Azure Cosmos DB reserved capacity](../cosmos-db/cosmos-db-reserved-capacity.md).

To learn more about Azure Reservations, see the following articles:

- [Manage Azure Reservations](billing-manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](billing-understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](billing-understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reservations](billing-reserved-instance-windows-software-costs.md)
- [Azure Reservations in Partner Center Cloud Solution Provider (CSP) program](https://docs.microsoft.com/partner-center/azure-reservations)

## Need help? Contact support

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
