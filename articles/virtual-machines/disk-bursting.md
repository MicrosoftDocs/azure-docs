---
title: Managed disk bursting
description: Learn about disk bursting for Azure disks and Azure virtual machines.
author: albecker1
ms.author: albecker
ms.date: 09/22/2020
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---
# Managed disk bursting
[!INCLUDE [managed-disks-bursting](../../includes/managed-disks-bursting.md)]

## Virtual Machine level bursting
VM level bursting support is enabled in all regions in Public Cloud on these supported sizes: 
- [Lsv2-series](lsv2-series.md)

VM level bursting is also available in West Central US for the following supported sizes:
- [Dsv3-series](dv3-dsv3-series.md)
- [Esv3-series](ev3-esv3-series.md)

Bursting is enabled by default for virtual machines that support it.

## Disk level bursting
Bursting is also available on our [premium SSDs](disks-types.md#premium-ssd) for disk sizes P20 and smaller in all regions in Azure Public, Government, and China Clouds. Disk bursting is enabled by default on all new and existing deployments of the disk sizes that support it. 

[!INCLUDE [managed-disks-bursting](../../includes/managed-disks-bursting-2.md)]