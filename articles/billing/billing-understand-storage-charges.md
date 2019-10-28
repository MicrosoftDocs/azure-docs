---
title: Understand how the reservation discount is applied to Azure Storage | Microsoft Docs
description: Learn about how the Azure Storage reserved capacity discount is applied to block blob and Azure Data Lake Storage Gen2 resources.
author: tamram

ms.service: billing
ms.topic: conceptual
ms.date: 11/01/2019
ms.author: tamram
---
# Understand how the reservation discount is applied to Azure Storage

After you purchase Azure Storage reserved capacity, the reservation discount is automatically applied to block blob and Azure Data Lake Storage Gen2 resources that match the terms of the reservation. The reservation discount applies to storage capacity only. Bandwidth and request rate are charged at pay-as-you-go rates.

## How the reservation discount is applied

The Azure Storage reserved capacity discount is applied to block blob and Azure Data Lake Storage Gen2 resources on an hourly basis.

The Azure Storage reserved capacity discount is a "use-it-or-lose-it" discount. If you don't have any block blob or Azure Data Lake Storage Gen2 resources that meet the terms of the reservation for a given hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you delete a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are lost.

## Discount examples

The following examples show how the Azure Storage reserved capacity discount applies, depending on the deployments.

Suppose that you have purchased 100 TiB of reserved capacity in the in US West 2 region for a 1-year term. Your reservation is for locally redundant storage (LRS) in the hot access tier.

The cost of this sample reservation is $18,540. You can either choose to pay the full amount up front or to pay fixed monthly installments of $1,545 per month for the next twelve months.

For these examples, assume that you have signed up for a monthly reservation payment plan. The following scenarios describe what happens if you under-use or overuse your reserved capacity.

### Underusing your capacity

Suppose that in a given month within the reservation period, you used only 80 TiB of your 100 TiB reserved capacity. In this scenario, you are billed the full monthly payment of $1,545 for your reservation, even though you did not use it all in that month.

### Overusing your capacity

Suppose that in a given month within the reservation period, you used 101 TiB of storage capacity. Your bill for the month will include $1,545 for the 100 TiB of reserved capacity and $18.80 for an additional 1 TiB at pay-as-you-go prices. Your total bill for that month is $1563.80.

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](billing-save-compute-costs-reservations.md)
- [View reservation transactions](billing-view-reservations.md)
- [Get reservation transactions and utilization through API](billing-reservation-apis.md)
- [Manage reservations](billing-manage-reserved-vm-instance.md)
