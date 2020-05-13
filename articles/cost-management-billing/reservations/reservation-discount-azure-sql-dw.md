---
title: How reservation discounts apply to Azure Synapse Analytics | Microsoft Docs
description: Learn how reservation discounts apply to Azure Synapse Analytics to help save you money.
author: yashesvi
ms.reviewer: yashar
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: banders
---

# How reservation discounts apply to Azure Synapse Analytics

After you buy Azure Synapse Analytics reserved capacity, the reservation discount is automatically applied to your provisioned instances that exist in that region. The reservation discount applies to the usage emitted by the Azure Synapse Analytics cDWU meter. Storage and networking are charged at pay-as-you-go rates.

## Reservation discount application

The Azure Synapse Analytics reserved capacity discount is applied to running warehouses on an hourly basis. If you don't have a warehouse deployed for an hour, then the reserved capacity is wasted for that hour. It doesn't carry over.

After purchase, the reservation that you buy is matched to Azure Synapse Analytics usage emitted by running warehouses at any point in time. If you shut down some warehouses, then reservation discounts automatically apply to any other matching warehouses.

For warehouses that don't run for a full hour, the reservation is automatically applied to other matching instances in that hour.

## Discount examples

The following examples show how the Azure Synapse Analytics reserved capacity discount applies, depending on the deployments.

- **Example 1**: You purchase 5 units of 100 cDWU reserved capacity. You run a DW1500c Azure Synapse Analytics instance for an hour. In this case, usage is emitted for 15 units of 100 cDWU usage. The reservation discount applies to the 5 units that you used. You are charged using pay-as-you-go rates for the remaining 10 units of 100 cDWU usage that you used. In other words, partial coverage is possible for multiple reservations.

- **Example 2**: You purchase 5 units of 100 cDWU reserved capacity. You run two DW100c Azure Synapse Analytics instances for an hour. In this case, two usage events are emitted for 1 unit of 100 cDWU usage. Both usage events get reserved capacity discounts. The remaining 3 units of 100 cDWU reserved capacity are wasted and don't carry over for future use. In other words, a single reservation can get matched to multiple Azure Synapse Analytics instances.

- **Example 3**: You purchase 1 unit of 100 cDWU reserved capacity. You run two DW100c Azure Synapse Analytics instances. Each runs for 30 minutes. In this case, both usage events get reserved capacity discounts. No usage is charged using pay-as-you-go rates.

## Need help? Contact us

- If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [View reservation transactions](view-reservations.md)
- [Get reservation transactions and utilization through API](reservation-apis.md)
- [Manage reservations](manage-reserved-vm-instance.md)
