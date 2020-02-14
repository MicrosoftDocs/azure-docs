---
title: Understand how a reservation discount is applied to Azure Managed Disks storage
description: Learn how an Azure reserved disks discount is applied to your Azure Premium SSD managed disks.
author: roygara
ms.service: cost-management-billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/30/2020
ms.author: rogarana
---

# Understand how your reservation discount is applied to Azure Managed Disks storage

After you purchase Azure Managed Disks reserved capacity, a reservation discount is automatically applied to disk resources that match the terms of your reservation. The reservation discount applies to disk capacity only. Disk snapshots are charged at pay-as-you-go rates.

For more information about Azure-Managed Disks Reservation, see [Save costs with Azure Managed Disks reservation](../../virtual-machines/linux/disks-reserved-capacity.md).
For information about Managed Disks Reservation pricing, see [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

## How the reservation discount is applied

The Managed Disk Reservation discount is a use-it-or-lost-it discount. It's applied to Managed Disks resources hourly. For a given hour, if you have no Managed Disks resources that meet the reservation terms, you lose a reservation quantity for that hour. Unused hours don't carry forward.

When you delete a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resource is found, the reserved hours are lost.

## Discount examples

The following examples show how the Managed Disks Reservation discount applies depending on your deployments.

Suppose you purchase and reserve 100 P30 Azure Premium Storage disks in the US West 2 region for a one-year term. Each disk has approximately 1 TiB of storage. Assume the cost of this sample reservation is $140,100‬. You can choose to pay the full amount up front. You can also choose to pay fixed monthly installments of $11,675 for the next 12 months.

For the following examples, assume you've signed up for a monthly reservation-payment plan. The following scenarios describe what happens if you underuse, overuse, or tier your reserved capacity.

### Underusing your capacity

Suppose you deploy only 99 of your 100 reserved P30 disks for an hour within the reservation period. The remaining P30 disk isn't applied during that hour. It also doesn't carry over.

### Overusing your capacity

Suppose that for an hour within the reservation period, you use 101 Azure Premium SSD P30 disks.

The reservation discount applies only to 100 P30 disks. The remaining P30 disk is charged at pay-as-you-go rates for that hour.

For the next hour, if your usage goes down to 100 P30 disks, all usage is covered by the reservation.

### Tiering your capacity

Suppose you use 200 Premium SSD P30 disks for an hour within your reservation period. Also suppose you use only 100 disks for the first 30 minutes. Because you reserved 100 P30 disks, your use is fully covered for this period.

If you switch to the other 100 disks for the remaining 30 minutes, your reservation also covers that usage.

![Example of underusing, overusing, and tiering capacity](media/understand-disk-reservations/reserved-disks-example-scenarios.png)

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Reduce costs with Azure Disks Reservation (Linux)](../../virtual-machines/linux/disks-reserved-capacity.md)
- [Reduce costs with Azure Disks Reservation (Windows)](../../virtual-machines/windows/disks-reserved-capacity.md)
- [What are Azure Reservations?](save-compute-costs-reservations.md)