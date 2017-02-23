---
title: Azure Windows VM sizes - HPC | Microsoft Docs
description: Lists the different sizes available for Windows high performance computing virtual machines in Azure.
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

# High performance computing (HPC) VM sizes

<!-- A-series - compute-intensive instances, H-series -->

The A8-A11 and H-series sizes are also known as *compute-intensive instances*. The hardware that runs these sizes is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations. The A8-A11 series uses Intel Xeon E5-2670 @ 2.6 GHZ and the H-series uses Intel Xeon E5-2667 v3 @ 3.2 GHz. For detailed information and considerations about using these sizes, see [About the H-series and compute-intensive A-series VMs](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

Azure H-series virtual machines are the next generation high performance computing VMs aimed at high end computational needs, like molecular modeling, and computational fluid dynamics. These 8 and 16 core VMs are built on the Intel Haswell E5-2667 V3 processor technology featuring DDR4 memory and local SSD based storage. 

In addition to the substantial CPU power, the H-series offers diverse options for low latency RDMA networking using FDR InfiniBand and several memory configurations to support memory intensive computational requirements.

For information and considerations about using these sizes, see [About the H-series and compute-intensive A-series VMs](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

[!INCLUDE [virtual-machines-common-sizes-hpc](../../includes/virtual-machines-common-sizes-hpc.md)]


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes

- [General purpose](virtual-machines-windows-sizes-general.md)
- [Compute optimized](virtual-machines-windows-sizes-compute.md)
- [GPU optimized](virtual-machines-windows-sizes-gpu.md)
- [Memory optimized](virtual-machines-windows-sizes-memory.md)
- [Storage optimized](virtual-machines-windows-sizes-storage.md)




