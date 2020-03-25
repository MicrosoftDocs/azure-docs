---
title: Reservation discounts for Azure App Service
description: Learn how reservation discounts apply to Azure App Service Isolated Stamps.
author: yashesvi
ms.reviewer: yashar
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/12/2020
ms.author: banders
---

# How reservation discounts apply to Azure App Service Isolated Stamps

After you buy App Service Isolated Stamp Fee reserved capacity, the reservation discount is automatically applied to the Stamp Fee in a region. The reservation discount applies to the usage emitted by the Isolated Stamp Fee meter. Workers, additional Front Ends, and any other resources associated with the stamp continue to get billed at the regular rate.

## Reservation discount application

The App Service Isolated Stamp Fee discount is applied to running isolated stamps on an hourly basis. If you don't have a stamp deployed for an hour, then the reserved capacity is wasted for that hour. It doesn't carry over.

After purchase, the reservation that you buy is matched to an isolated stamp running in a specific region. If you shut down that stamp, then reservation discounts are automatically applied to any other stamps running in the region. When no stamps exist, the reservation is applied to the next stamp that's created in the region.

When stamps don't run for a full hour, the reservation automatically applies to other matching stamps in the same region during the same hour.

## Choose a stamp type - Windows or Linux

An empty Isolated Stamp emits the Windows stamp meter by default. For example, when no workers are deployed. It continues to emit the meter when Windows workers are deployed. The meter changes to the Linux stamp meter if you deploy a Linux worker. The stamp emits the Windows meter when both Linux and Windows workers are deployed.

As a result, the stamp meter can change between Windows and Linux over the life of the stamp. Meanwhile, reservations are operating system specific. You'll need to buy a reservation that supports the workers you plan to deploy to the stamp. Windows-only stamps and mixed stamps use the Windows reservation. Stamps with only Linux workers use the Linux reservation.

The only time you should purchase a Linux reservation is when you plan to _only_ have Linux workers in the stamp.

## Discount examples

The following examples show how the Isolated Stamp Fee reserved instance discount applies, depending on the deployments.

- **Example 1**: You purchase one instance of Isolated Reserved Stamp capacity in a region with no App Service Isolated stamps. You deploy a new stamp to the region and pay reserved rates for that stamp.
- **Example 2**: You purchase one instance of Isolated Reserved Stamp capacity in a region that already has an App Service Isolated stamp deployed. You start receiving the reserved rate for the deployed stamp.
- **Example 3**: You purchase one instance of Isolated Reserved Stamp capacity in a region with an App Service Isolated stamp already deployed. You start receiving the reserved rate on the deployed stamp. Later, you delete the stamp and deploy a new one. You receive the reserved rate for the new stamp. Discounts don't carry over for durations without deployed stamps.
- **Example 4**: You purchase one instance of Isolated Linux Reserved Stamp capacity in a region then deploy a new stamp to the region. When the stamp is initially deployed without workers, it emits the Windows stamp meter. No discount is received. When the first Linux worker is deployed the stamp, it emits the Linux Stamp meter and the reservation discount applies. If a windows worker is later deployed to the stamp, the stamp meter reverts to Windows. You no longer receive a discount for the Isolated Linux Reserved Stamp reservation.

## Next steps

- To learn how to manage a reservation, see [Manage Azure Reservations](manage-reserved-vm-instance.md).
- To learn more about pre-purchasing App Service Isolated Stamp reserved capacity to save money, see [Prepay for Azure App Service Isolated Stamp Fee with reserved capacity](prepay-app-service-isolated-stamp.md).
- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Reservations in Azure](manage-reserved-vm-instance.md)
  - [Understand reservation usage for a subscription with pay-as-you-go rates](understand-reserved-instance-usage.md)
  - [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
