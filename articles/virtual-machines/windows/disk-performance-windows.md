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
 Virtual machines that are both premium storage enabled and premium storage caching enabled have two different storage bandwidth limits. Let’s continue with looking at the Standard_D8s_v3 virtual machine as an example. Here is the documentation on the [Dsv3-series](../dv3-dsv3-series.md) and on it the Standard_D8s_v3:

[!INCLUDE [VM and Disk Performance](../../../includes/virtual-machine-disk-performance-2.md)]

Let's run a benchmarking test on this VM and disk combination that will do create IO activity and you can learn all about how to benchmark storage IO on Azure [here](disks-benchmarks.md). From the benchmarking tool, you can see that the VM and Disk combination is able to achieve 22,800 IOPS:

[!INCLUDE [VM and Disk Performance](../../../includes/virtual-machine-disk-performance-3.md)]