---
title: Understand Azure reserved disk instances discount | Microsoft Docs
description: Learn how Azure reserved disk instance discount is applied to your managed disks.
author: roygara
ms.service: cost-management-billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/08/2020
ms.author: rogarana
---

# Understand how your reservation discount is applied to Azure Disk

After you purchase Azure disk reserved capacity, the reservation discount is automatically applied to disk resources that match the terms of your reservation. The reservation discount applies to disk capacity only, disk snapshots are charged at pay-as-you-go rates.

For more information about Azure Disk reservation, see [Save costs with Azure Disks Reservation](../virtual-machines/linux/disks-reserved-capacity.md).
For information about Azure Disk reservation pricing, see [Azure Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

## How the reservation discount is applied

The Azure disk reservation discount is a "use-it-or-lose-it" discount and is applied to managed disk resources on an hourly basis. If you don't have any managed disk resources that meet the terms of your reservation in a given hour, then you lose a reservation quantity for that hour, unused hours do not carry forward.

When you delete a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are lost.

## Discount examples

The following examples show how the Azure Disk reservation discount applies, depending on your deployments:

Suppose that you have purchased 100 P30 disks (~1 TiB per disk) of reserved capacity in the US West 2 region for a 1-year term. Assuming that the cost of this sample reservation is $140,100‬. You can either choose to pay the full amount up front or to pay fixed monthly installments of $11,675‬ per month for the next 12 months.
For these examples, assume that you have signed up for a monthly reservation payment plan. The following scenarios describe what happens if you under-use or overuse your reserved capacity.

### Underusing your capacity

Suppose that in a given hour within the reservation period, you have deployed only 99 P30 premium SSD managed Disks of your 100 P30 disk reservation. The remaining 1 P30 is not applied during that hour and does not carry over.

### Overusing your capacity

Suppose that in a given hour within the reservation period, you are using 101 P30 premium managed disks. The reservation discount only applies to 100 P30 disks and the remaining 1 P30 disk is charged at pay-as-you-go rates for that hour. For the next hour, if your usage decreases to 100 P30 disks, then all usage is covered by the reservation.

## Need help? Contact us
If you have questions or need help, create a support request.

## Next steps
•	Optimize costs for Blob storage with reserved capacity
•	What are Azure Reservations?
