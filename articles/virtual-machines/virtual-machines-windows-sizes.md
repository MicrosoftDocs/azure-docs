
---
title: Windows VM sizes in Azure | Microsoft Docs
description: Lists the different sizes available for Windows virtual machines in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: aabf0d30-04eb-4d34-b44a-69f8bfb84f22
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/22/2017
ms.author: cynthn
---

# Sizes for Windows virtual machines in Azure

This article describes the available sizes and options for the Azure virtual machines you can use to run your Windows apps and workloads. It also provides deployment considerations to be aware of when you're planning to use these resources.  This article is also available for [Linux virtual machines](linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

> [!IMPORTANT]
>* For information about pricing of the various sizes, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Windows). 
>* To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
>* Storage costs are calculated separately based on used pages in the storage account. For details, [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).
> * Learn more about how [Azure compute units (ACU)](windows/acu.md) can help you compare compute performance across Azure SKUs.
>
>
<br>    




| Type                     | Sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [General purpose](virtual-machines-windows-sizes-general.md)          | DSv2, Dv2, DS, D, Av2, A0-7 | Balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. |
| [Compute optimized](virtual-machines-windows-sizes-compute.md)        | Fs, F             | High CPU-to-memory ratio. Good for medium traffic web servers, network appliances, batch processes, and application servers.        |
| [Memory optimized](virtual-machines-windows-sizes-memory.md)         | GS, G, DSv2, DS   | High memory-to-core ratio. Great for relational database servers, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](virtual-machines-windows-sizes-storage.md)        | Ls                | High disk throughput and IO. Ideal for Big Data, SQL, and NoSQL databases.                                                         |
| [GPU](virtual-machines-windows-sizes-gpu.md)            | NV, NC            | Specialized virtual machines targeted for heavy graphic rendering and video editing. Available with single or multiple GPUs.       |
| [High performance compute](virtual-machines-windows-sizes-hpc.md) | H, A8-11          | Our fastest and most powerful CPU virtual machines with optional high-throughput network interfaces (RDMA). 

<br>

Learn more about how [Azure compute units (ACU)](windows/acu.md) can help you compare compute performance across Azure SKUs.

Learn more about the different VM sizes that are available:
- [General purpose](virtual-machines-windows-sizes-general.md)
- [Compute optimized](virtual-machines-windows-sizes-compute.md)
- [Memory optimized](virtual-machines-windows-sizes-memory.md)
- [Storage optimized](virtual-machines-windows-sizes-storage.md)
- [GPU optimized](virtual-machines-windows-sizes-gpu.md)
- [High performance compute](virtual-machines-windows-sizes-hpc.md)



