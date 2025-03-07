---
title: Understand Azure Dedicated Hosts Reserved Instances discount
description: Learn how Azure Reserved virtual machine (VM) Instance discount is applied to Azure Dedicated Hosts.
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 12/06/2024
ms.author: banders
---

# How the Azure reservation discount is applied to Azure Dedicated Hosts

After you buy an Azure Reserved Dedicated Host Instance, the reservation
discount is automatically applied to dedicated hosts that match the attributes
and quantity of the reservation. A reservation covers the compute costs of your
dedicated hosts.

## How reservation discount is applied

A reservation discount is "*use-it-or-lose-it*." So, if you don't have matching
resources for any hour, then you lose a reservation quantity for that hour. You
can't carry forward unused reserved hours.

When you delete a dedicated host, the reservation discount automatically applies
to another matching resource in the specified scope. If no matching resources
are found in the specified scope, then the reserved hours are *lost*.

## Reservation discount for Dedicated Hosts

Azure Reserved Dedicated Hosts Instance provides you with a discount to the cost
of the compute infrastructure used with your dedicated hosts. The discount
applies to your dedicated hosts regardless of whether they're actively used
by virtual machines or not. The reservation doesn't cover other costs such
as licensing, network usage, or storage consumption by virtual machine deployed
on the dedicated host.

## Need help? Contact us

If you have questions or need help, [create a support
request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

To learn more about Azure Reservations, see the following articles:

- [What are reservations for Azure?](./save-compute-costs-reservations.md)
- [Using Azure Dedicated Hosts](/azure/virtual-machines/dedicated-hosts)
- [Dedicated Hosts Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/)
- [Manage reservations for Azure](./manage-reserved-vm-instance.md)
- [Understand reservation usage for your pay-as-you-go subscription](./understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](./understand-reserved-instance-usage-ea.md)
- [Understand reservation usage for Cloud Solution Provider subscriptions](/partner-center/azure-reservations)