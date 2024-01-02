---
title: Virtual machine and disk performance
description: Learn more about how virtual machines and their attached disks work in combination for performance.
author: roygara
ms.author: rogarana
ms.date: 05/31/2023
ms.topic: conceptual
ms.service: azure-disk-storage
---
# Virtual machine and disk performance

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

[!INCLUDE [VM and Disk Performance](../../includes/virtual-machine-disk-performance.md)]

## Virtual machine uncached vs cached limits
Virtual machines that are enabled for both premium storage and premium storage caching have two different storage bandwidth limits. Let's look at the Standard_D8s_v3 virtual machine as an example. Here is the documentation on the [Dsv3-series](dv3-dsv3-series.md) and the Standard_D8s_v3:

[!INCLUDE [VM and Disk Performance](../../includes/virtual-machine-disk-performance-2.md)]

