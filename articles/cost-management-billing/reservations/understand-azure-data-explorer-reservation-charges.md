---
title: Reservation discount for Azure Data Explorer
description: Learn how the reservation discount is applied to Azure Data Explorer markup meter.
author: avneraa
ms.author: avnera
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 12/05/2022
ms.custom: kr2b-contr-experiment
---

# How the reservation discount is applied to Azure Data Explorer

After you buy an Azure Data Explorer reserved capacity, the reservation discount is automatically applied to Azure Data Explorer resources that match the attributes and quantity of the reservation. A reservation includes the Azure Data Explorer markup charges. It doesn't include compute, networking, storage, or any other Azure resource used to operate Azure Data Explorer cluster. Reservations for these resources should be bought separately.

## Reservation discount usage

A reservation discount is on a "*use-it-or-lose-it*" basis. So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward discounts for unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are *lost*.

Stopped or suspended Azure Data Explorer clusters are not using reservation hours for compute and Azure Data Explorer markup since the cluster's underlying compute resources are deallocated when the cluster is stopped or suspended.

## Discount for other resources

A reservation discount is applied to Azure Data Explorer markup consumption on an hour-by-hour basis. For Azure Data Explorer resources that don't run the full hour, the reservation discount is automatically applied to other Data Explorer resources that match the reservation attributes. The discount can apply to Azure Data Explorer resources that are running concurrently. If you don't have Azure Data Explorer resources that run for the full hour and that match the reservation attributes, you don't get the full benefit of the reservation discount for that hour.

> [!NOTE]
> * It is **highly recommended** to purchase [reservation capacity](../../virtual-machines/prepay-reserved-vm-instances.md) for the virtual machines used for the Azure Data Explorer cluster to maximize the reserved capacity savings.
> * The reservation purchase will apply discounts to all regions.

## Examples

The following examples show how the Azure Data Explorer reserved capacity discount is applied, depending on the number of markup units you bought, and when they're running.
For example, for engine cluster size: **2 D11_v2 VMs**, your total on-demand charges are for four units of Azure Data Explorer markup meter per hour.

**Scenario 1**

You buy an Azure Data Explorer reserved capacity for 8 Azure Data Explorer markup units. You run an engine cluster of two D13_v2 VMs with a total of 16 cores that charges for 16 units of Azure Data Explorer markup units per hour and matches the rest of the attributes of the reservation. You are charged the pay-as-you-go price for eight cores of Azure Data Explorer compute usage and get the reservation discount for one hour of eight core Azure Data Explorer markup unit usage.

For the rest of these examples, assume that the Azure Data Explorer reserved capacity you buy is for a 16 core Azure Data Explorer cluster and the rest of the reservation attributes match the running Azure Data Explorer cluster.

**Scenario 2**

You run two Azure Data Explorer engine clusters with eight cores each for an hour in two different regions. The 16 core reservation discount is applied for both of the cluster and the 16 units of Azure Data Explorer markup units they consume.

**Scenario 3**

You run one 16 core Azure Data Explorer engine cluster from 1 pm to 1:30 pm. You run another 16 core Azure Data Explorer engine cluster from 1:30 to 2 pm. Both are covered by the reservation discount.

**Scenario 4**

You run one 16 core Azure Data Explorer engine cluster from 1 pm to 1:45 pm. You run another 16 core Azure Data Explorer engine cluster from 1:30 to 2 pm. You are charged the pay-as-you-go price for the 15-minute overlap. The reservation discount applies to the Azure Data Explorer markup usage for the rest of the time.

To understand and view the application of your Azure Reservations in billing usage reports, see [understand Azure reservation usage](understand-reserved-instance-usage-ea.md).

## Need help? Contact us

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

To learn more about Azure reservations, see the following articles:

* [Prepay for Azure Data Explorer compute resources with Azure Data Explorer reserved capacity](/azure/data-explorer/pricing-reserved-capacity)  
* [What are reservations for Azure?](save-compute-costs-reservations.md)  
* [Manage Azure reservations](manage-reserved-vm-instance.md)  
* [Understand reservation usage for your pay-as-you-go subscription](understand-reserved-instance-usage.md)
* [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
* [Understand reservation usage for CSP subscriptions](/partner-center/azure-reservations)
