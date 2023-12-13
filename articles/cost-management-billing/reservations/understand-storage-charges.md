---
title: Understand how reservation discounts are applied to Azure storage services | Microsoft Docs
description: Learn about how reserved capacity discounts are applied to Azure Blob storage, Azure Files, and Azure Data Lake Storage Gen2 resources.
author: tamram
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 11/17/2023
ms.author: tamram
---

# Understand how reservation discounts are applied to Azure storage services 
Azure storage services enable you to save money on storage costs by reserving capacity. Azure Blob storage, Azure Files, and Azure Data Lake storage Gen 2 support reserve instances. After you purchase reserved capacity, the reservation discount is automatically applied to the storage resources that match the terms of the reservation. The reservation discount applies to storage capacity only. Bandwidth and request rate are charged at pay-as-you-go rates.

For more information about Azure Blob storage and Azure Data Lake storage Gen 2 reserved capacity, see [Optimize costs for Blob storage with reserved capacity](../../storage/blobs/storage-blob-reserved-capacity.md). For more information about Azure Files reserved capacity, see [Optimize costs for Azure Files with reserved capacity](../../storage/files/files-reserve-capacity.md).

For information about Azure Blob storage reservation pricing, see [Block blob pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) and [Azure Data Lake Storage Gen 2 pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/). For information about Azure Files storage reservation pricing, see [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files).

## How the reservation discount is applied

The reserved capacity discount is applied to supported storage resources on an hourly basis.

The reserved capacity discount is a "use-it-or-lose-it" discount. If you don't have any block blobs, Azure file shares, or Azure Data Lake Storage Gen2 resources that meet the terms of the reservation for a given hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you delete a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are lost.

Stopped resources are billed and continue to use reservation hours. Deallocate or delete resources or scale-in other resources to use your available reservation hours with other workloads. 

## Discount examples
The following examples show how the reserved capacity discount applies, depending on the deployments.

Suppose that you have purchased 100 TiB of reserved capacity in the US West 2 region for a 1-year term. Your reservation is for locally redundant storage (LRS) blob storage in the hot access tier.

Assume that the cost of this sample reservation is $18,540. You can either choose to pay the full amount up front or to pay fixed monthly installments of $1,545 per month for the next twelve months.

For these examples, assume that you have signed up for a monthly reservation payment plan. The following scenarios describe what happens if you under-use or overuse your reserved capacity.

### Underusing your capacity
Suppose that in a given hour within the reservation period, you used only 80 TiB of your 100 TiB reserved capacity. The remaining 20 TiB is not applied for that hour and does not carry over.

### Overusing your capacity
Suppose that in a given hour within the reservation period, you used 101 TiB of storage capacity. The reservation discount applies to 100 TiB of your data, and the remaining 1 TiB is charged at pay-as-you-go rates for that hour. If in the next hour your usage changes to 100 TiB, then all usage is covered by the reservation.

## Need help? Contact us
If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps
- [Optimize costs for Blob storage with reserved capacity](../../storage/blobs/storage-blob-reserved-capacity.md)
- [Optimize costs for Azure Files with reserved capacity](../../storage/files/files-reserve-capacity.md)
- [What are Azure Reservations?](save-compute-costs-reservations.md)
