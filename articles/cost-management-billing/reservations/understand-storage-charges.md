---
title: Understand how the reservation discount is applied to Azure Storage | Microsoft Docs
description: Learn about how the Azure Storage reserved capacity discount is applied to block blob and Azure Data Lake Storage Gen2 resources.
author: tamram
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/13/2020
ms.author: tamram
---

# Understand how the reservation discount is applied to Azure Storage

After you purchase Azure Storage reserved capacity, the reservation discount is automatically applied to block blob and Azure Data Lake Storage Gen2 resources that match the terms of the reservation. The reservation discount applies to storage capacity only. Bandwidth and request rate are charged at pay-as-you-go rates.

For more information about Azure Storage reserved capacity, see [Optimize costs for Blob storage with reserved capacity](../../storage/blobs/storage-blob-reserved-capacity.md).

For information about Azure Storage reservation pricing, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) and [Azure Data Lake Storage Gen 2 pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/).

## How the reservation discount is applied

The Azure Storage reserved capacity discount is applied to block blob and Azure Data Lake Storage Gen2 resources on an hourly basis.

The Azure Storage reserved capacity discount is a "use-it-or-lose-it" discount. If you don't have any block blob or Azure Data Lake Storage Gen2 resources that meet the terms of the reservation for a given hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you delete a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are lost.

## Discount examples

The following examples show how the Azure Storage reserved capacity discount applies, depending on the deployments.

Suppose that you have purchased 100 TB of reserved capacity in the in US West 2 region for a 1-year term. Your reservation is for locally redundant storage (LRS) in the hot access tier.

Assume that the cost of this sample reservation is $18,540. You can either choose to pay the full amount up front or to pay fixed monthly installments of $1,545 per month for the next twelve months.

For these examples, assume that you have signed up for a monthly reservation payment plan. The following scenarios describe what happens if you under-use or overuse your reserved capacity.

### Underusing your capacity

Suppose that in a given hour within the reservation period, you used only 80 TB of your 100 TB reserved capacity. The remaining 20 TB is not applied for that hour and does not carry over.

### Overusing your capacity

Suppose that in a given hour within the reservation period, you used 101 TB of storage capacity. The reservation discount applies to 100 TB of your data, and the remaining 1 TB is charged at pay-as-you-go rates for that hour. If in the next hour your usage changes to 100 TB, then all usage is covered by the reservation.

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Optimize costs for Blob storage with reserved capacity](../../storage/blobs/storage-blob-reserved-capacity.md)
- [What are Azure Reservations?](save-compute-costs-reservations.md)
