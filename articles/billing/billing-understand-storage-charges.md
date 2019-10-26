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

- **Example 1**: You purchase 5 units of 100 cDWU reserved capacity. You run a DW1500c SQL Data Warehouse instance for an hour. In this case, usage is emitted for 15 units of 100 cDWU usage. The reservation discount applies to the 5 units that you used. You are charged using pay-as-you-go rates for the remaining 10 units of 100 cDWU usage that you used.

- **Example 2**: You purchase 5 units of 100 cDWU reserved capacity. You run two DW100c SQL Data Warehouse instances for an hour. In this case, two usage events are emitted for 1 unit of 100 cDWU usage. Both usage events get reserved capacity discounts. The remaining 3 units of 100 cDWU reserved capacity are wasted and don't carry over for future use.

- **Example 3**: You purchase 1 unit of 100 cDWU reserved capacity. You run two DW100c SQL Data Warehouse instances. Each runs for 30 minutes. In this case, both usage events get reserved capacity discounts. No usage is charged using pay-as-you-go rates.

## Need help? Contact us

- If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](billing-save-compute-costs-reservations.md)
- [View reservation transactions](billing-view-reservations.md)
- [Get reservation transactions and utilization through API](billing-reservation-apis.md)
- [Manage reservations](billing-manage-reserved-vm-instance.md)
