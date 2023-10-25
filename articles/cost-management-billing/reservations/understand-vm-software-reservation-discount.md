---
title: Understand how the Azure virtual machine software reservation discount is applied
description: Learn how Azure virtual machine software reservation discount is applied before you buy.
author: bandersmsft
ms.reviewer: nitinarora
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 12/06/2022
ms.author: banders
---

# Understand how the virtual machine software reservation (Azure Marketplace) discount is applied

After you buy a virtual machine software reservation, the discount is automatically applied to deployed plan that matches the reservation. A software reservation only covers the cost of running the software plan you chose on an Azure VM.

To buy the right virtual machine software reservation, you need to understand the software plan you want to run and the number of vCPUs on those VMs.

## Discount applies to different VM sizes

Like Reserved VM Instances, virtual machine software reservation purchases offer instance size flexibility. So, your discount applies even when you deploy a VM with a different vCPU count. The discount applies to different VM sizes within the virtual machine software reservation.

For example, if you buy a virtual machine software reservation for a VM with one vCPU, the ratio for that reservation is 1 and using a two vCPU machine. It covers 50% of the cost if the ratio is 1:2. It's based on how the software plan was configured by the publisher.

## Prepay for virtual machine software reservations

When you prepay for your virtual machine software usage (available in the Azure Marketplace), you can save money over your pay-as-you-go costs. The discount is automatically applied to a deployed plan that matches the reservation, not on the virtual machine usage. You can buy reservations for virtual machines separately for more savings.

You can buy a virtual machine software reservation in the Azure portal. To buy a reservation:

- You must have the owner role for at least one Enterprise or individual subscription with pay-as-you-go pricing.
- For Enterprise subscriptions, the **Add Reserved Instances** option must be enabled in the [EA portal](https://ea.azure.com/). If the setting is disabled, you must be an EA Admin for the subscription.
- For the Cloud Solution Provider (CSP) program, the admin agents or sales agents can buy the software plans.

## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are reservations for Azure?](save-compute-costs-reservations.md)
- [Prepay for Azure virtual machine software reservations](buy-vm-software-reservation.md)
- [Prepay for Virtual Machines with Azure Reserved VM Instances](../../virtual-machines/prepay-reserved-vm-instances.md)
- [Prepay for SQL Database compute resources with Azure SQL Database reserved capacity](/azure/azure-sql/database/reserved-capacity-overview)
- [Manage reservations for Azure](manage-reserved-vm-instance.md)
- [Understand reservation usage for your Pay-As-You-Go subscription](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
- [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations)
- [Windows software costs not included with reservations](reserved-instance-windows-software-costs.md)
