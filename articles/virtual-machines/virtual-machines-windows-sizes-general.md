---
title: Azure Windows VM sizes - General purpose | Microsoft Docs
description: Lists the different general purpose sizes available for Windows virtual machines in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 02/22/2017
ms.author: cynthn

---

# General-purpose

<!-- A-series, Av2-series, D-series, Dv2-series, DS-series*, DSv2-series* -->

The [A-series](../../includes/virtual-machines-common-sizes-general.md#a-series) and Av2-series VMs can be deployed on a variety of hardware types and processors. The size is throttled, based upon the hardware, to offer consistent processor performance for the running instance, regardless of the hardware it is deployed on. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the Virtual Machine.

D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).

Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.


[!INCLUDE [virtual-machines-common-sizes-general](../../includes/virtual-machines-common-sizes-general.md)]


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]


## Other sizes

- [Memory optimized](virtual-machines-windows-sizes-memory.md)
- [Compute optimized](virtual-machines-windows-sizes-compute.md)
- [GPU optimized](virtual-machines-windows-sizes-gpu.md)
- [High performance compute](virtual-machines-windows-sizes-hpc.md)
- [Storage optimized](virtual-machines-windows-sizes-storage.md)
