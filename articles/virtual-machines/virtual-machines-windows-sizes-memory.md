
---
title: Windows VM sizes | Microsoft Docs
description: Lists the different memory optimized sizes available for Windows virtual machines in Azure.
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

# Memory

<!-- D11-15 – v2, D11-14 – v1, G-series, GS-series* -->

* Dv2-series, D-series, G-series, and the DS/GS counterparts  are ideal for applications that demand faster CPUs, better local disk performance, or have higher memory demands.  They offer a powerful combination for many enterprise-grade applications.

D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](https://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).

Dv2-series, a follow-on to the original D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.1 GHz. The Dv2-series has the same memory and disk configurations as the D-series.

[!INCLUDE [virtual-machines-common-sizes-memory](../../includes/virtual-machines-common-sizes-memory.md)]

## Other sizes
- [General purpose](virtual-machines-windows-sizes-general.md)
- [Compute optimized](virtual-machines-windows-sizes-compute.md)
- [GPU optimized](virtual-machines-windows-sizes-gpu.md)
- [High performance compute](virtual-machines-windows-sizes-hpc.md)
- [Storage optimized](virtual-machines-windows-sizes-storage.md)

