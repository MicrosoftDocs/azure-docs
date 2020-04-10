---
title: Understand Azure Dedicated Hosts Reserved Instances discount
description: Learn how Azure Reserved VM Instance discount is applied to Azure Dedicated Hosts.
author: yashesvi
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/28/2020
ms.author: banders
---

# How the Azure reservation discount is applied to Azure Dedicated Hosts

After you buy an Azure Reserved Dedicated Host Instance, the reservation
discount is automatically applied to dedicated hosts that match the attributes
and quantity of the reservation. A reservation covers the compute costs of your
dedicated hosts.

## How reservation discount is applied

A reservation discount is "*use-it-or-lose-it*". So, if you don't have matching
resources for any hour, then you lose a reservation quantity for that hour. You
can't carry forward unused reserved hours.

When you delete a dedicated host, the reservation discount automatically applies
to another matching resource in the specified scope. If no matching resources
are found in the specified scope, then the reserved hours are *lost*.

## Reservation discount for Dedicated Hosts

Azure Reserved Dedicated Hosts Instance provides you with a discount to the cost
of the compute infrastructure used with your dedicated hosts. The discount
applies to your dedicated hosts regardless of whether those are being utilized
by virtual machines or not. The reservation does not cover additional cost such
as licensing, network usage or storage consumption by virtual machine deployed
on the dedicated host.

## Need help? Contact us

If you have questions or need help, [create a support
request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are reservations for Azure?](https://docs.microsoft.com/azure/billing/billing-save-compute-costs-reservations)

- [Using Azure Dedicated Hosts](https://docs.microsoft.com/azure/virtual-machines/windows/dedicated-hosts)

- [Dedicated Hosts Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/)

- [Manage reservations for Azure](https://docs.microsoft.com/azure/billing/billing-manage-reserved-vm-instance)

- [Understand reservation usage for your Pay-As-You-Go subscription](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage)

- [Understand reservation usage for your Enterprise enrollment](https://docs.microsoft.com/azure/billing/billing-understand-reserved-instance-usage-ea)

- [Understand reservation usage for CSP subscriptions](https://docs.microsoft.com/partner-center/azure-reservations)

