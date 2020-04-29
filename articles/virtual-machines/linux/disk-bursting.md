---
title: Managed disk bursting
description: Learn about disk bursting for Azure disks and disk bursting for Azure virtual machines
author: albecker1
ms.author: albecker
ms.date: 04/27/2020
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: disks
---

[!INCLUDE [managed-disks-bursting](../../../includes/managed-disks-bursting.md)]

## Virtual Machine level bursting

### Availability
Our bursting feature is currently enabled for our all virtual machines in the [Lsv2-series](../lsv2-series.md) in all regions that support Lsv2 VMs.
### Enabling bursting
The bursting feature is enabled by default for virtual machines that support it.

## Disk level bursting
### Availability
Bursting is also available on our [premium SSDs](disks-types.md#premium-ssd) for disk sizes P20 and smaller in all regions.
### Enabling bursting
Disk bursting is enabled by default on new deployments of the disk sizes that support it. Existing disk sizes, if they support disk bursting, can enable bursting through either of the following methods: 
- **Restart the VM** 
- **Detach and reattach the disk**


[!INCLUDE [managed-disks-bursting](../../../includes/managed-disks-bursting-2.md)]
