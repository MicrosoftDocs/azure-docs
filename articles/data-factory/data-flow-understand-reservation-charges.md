---
title: Understand reservations discount for Azure Data Factory data flows | Microsoft Docs
description: Learn how a reservation discount is applied to running ADF data flows. The discount is applied to these data flows on an hourly basis.
author: kromerm
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.date: 07/17/2023
ms.author: makromer
---

# How a reservation discount is applied to Azure Data Factory data flows

After you buy ADF data flow reserved capacity, the reservation discount is automatically applied to data flows using an Azure integration runtime that match the compute type and core count of the reservation.

## How reservation discount is applied

A reservation discount is "*use-it-or-lose-it*". So, if you don't have matching Azure integration resources used for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you stop using the integration runtime for data flows, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are *lost*.

## Discount applied to ADF data flows

The ADF data flow reserved capacity discount is applied to executing integration runtimes on an hourly basis. The reservation that you buy is matched to the compute type being used by the integration runtimes for your data flows. For data flows that don't run the full hour, the reservation is automatically applied to other data flows matching the reservation attributes. The discount can also apply to data flows that are running concurrently. If you don't have data flows that run for the full hour that match the reservation attributes, you don't get the full benefit of the reservation discount for that hour.

The following examples show how the ADF data flow reserved capacity discount applies depending on the number of cores you bought, and when they're running.

- Scenario 1: You buy an ADF data flow reservation for 1 hour of 80 cores of memory optimized compute by entering 80 as the quantity for memory optimized compute type. You run a data flow with an Azure integration runtime set to 144 cores of memory optimized for one hour. You're charged the pay-as-you-go price for 64 cores of data flow usage for one hour. You get the reservation discount for one hour of 80 cores of memory optimized usage.
- Scenario 2: You buy an ADF data flow reservation for 1 hour of 32 cores of general purpose compute by entering 32 as the quantity for general purpose compute type. You debug your data flows for 1 hour using 32 cores of general compute Azure integration runtime. You get the reservation discount for that entire hour of usage.

To understand and view the application of your Azure Reservations in billing usage reports, see [Understand Azure reservation usage](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md).

## Need help? Contact us

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure Reservations, see the following article:

- [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)