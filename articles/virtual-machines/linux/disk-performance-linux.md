---
title: Virtual machine and disk performance
description: Learn more about how VMs and their attached disks work in combination for performance 
author: albecker1
ms.author: albecker
ms.date: 10/12/2020
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: disks
---
# Virtual machine and disk performance
[!INCLUDE [VM and Disk Performance](../../../includes/virtual-machine-disk-performance.md)]

## Virtual machine uncached vs cached limits
Virtual machines that are enabled for both premium storage and premium storage caching have two different storage bandwidth limits. Let’s look at the Standard_D8s_v3 virtual machine as an example. Here is the documentation on the [Dsv3-series](../dv3-dsv3-series.md) and the Standard_D8s_v3:

[!INCLUDE [VM and Disk Performance](../../../includes/virtual-machine-disk-performance-2.md)]

Let's run a benchmarking test on this virtual machine and disk combination that creates IO activity. To learn how to benchmark storage IO on Azure, see [Benchmark your application on Azure Disk Storage](disks-benchmarks.md). From the benchmarking tool, you can see that the VM and Disk combination can achieve 22,800 IOPS:

[!INCLUDE [VM and Disk Performance](../../../includes/virtual-machine-disk-performance-3.md)]