---
title: Linux VM sizes in Azure | Microsoft Docs
description: Lists the different sizes available for Linux virtual machines in Azure.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: da681171-f045-4c80-a5a9-d8bd47964673
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/22/2017
ms.author: cynthn
---

# Sizes for Linux virtual machines in Azure
This article describes the available sizes and options for the Azure virtual machines you can use to run your Linux apps and workloads. It also provides deployment considerations to be aware of when you're planning to use these resources. This article is also available for [Windows virtual machines](virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

> [!IMPORTANT]
> * For information about pricing of the various sizes, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Linux). 
> * For availability of VM sizes in Azure regions, see [Products available by region](https://azure.microsoft.com/regions/services/).
> * To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
> * Learn more about how [Azure compute units (ACU)](virtual-machines-linux-acu.md) can help you compare compute performance across Azure SKUs.
> 
> 

<br>   


| Type                     | Sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [General purpose](virtual-machines-linux-sizes-general.md)          | DSv2, Dv2, DS, D, A0-7, Av2 | Balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. |
| [Compute optimized](virtual-machines-linux-sizes-compute.md)        | Fs, F             | High CPU-to-memory ratio. Good for medium traffic web servers, network appliances, bath processes, and application servers.        |
| [Memory optimized](virtual-machines-linux-sizes-memory.md)         | GS, G, DSv2, DS   | High memory-to-core ratio. Great for relational database servers, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](virtual-machines-linux-sizes-storage.md)        | Ls                | High disk throughput and IO. Ideal for Big Data, SQL, and NoSQL databases.                                                         |
| [GPU](virtual-machines-linux-sizes-gpu.md)            | NV, NC            | Specialized virtual machines targeted for heavy graphic rendering and video editing. Available with single or multiple GPUs.       |
| [High performance compute](virtual-machines-linux-sizes-hpc.md) | H, A8-11          | Our fastest and most powerful CPU virtual machines with optional high-throughput network interfaces (RDMA). 

## Next steps
- [General purpose](virtual-machines-linux-sizes-general.md)
- [Compute optimized](virtual-machines-linux-sizes-compute.md)
- [Memory optimized](virtual-machines-linux-sizes-memory.md)
- [Storage optimized](virtual-machines-linux-sizes-storage.md)
- [GPU](virtual-machines-linux-sizes-gpu.md)
- [High performance compute](virtual-machines-linux-sizes-hpc.md)



