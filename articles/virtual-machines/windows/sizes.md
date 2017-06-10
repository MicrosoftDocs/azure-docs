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
ms.date: 06/07/2017
ms.author: cynthn
---

# Sizes for Windows virtual machines in Azure

This article describes the available sizes and options for the Azure virtual machines you can use to run your Windows apps and workloads. It also provides deployment considerations to be aware of when you're planning to use these resources.  This article is also available for [Linux virtual machines](../linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).


| Type                     | Sizes           |    Description       |
|--------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [General purpose](sizes-general.md)          | DSv2, Dv2, DS, D, Av2, A0-7 | Balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. |
| [Compute optimized](sizes-compute.md)        | Fs, F             | High CPU-to-memory ratio. Good for medium traffic web servers, network appliances, batch processes, and application servers.        |
| [Memory optimized](../virtual-machines-windows-sizes-memory.md)         | M, GS, G, DSv2, DS, Dv2, D   | High memory-to-core ratio. Great for relational database servers, medium to large caches, and in-memory analytics.                 |
| [Storage optimized](../virtual-machines-windows-sizes-storage.md)        | Ls                | High disk throughput and IO. Ideal for Big Data, SQL, and NoSQL databases.                                                         |
| [GPU](sizes-gpu.md)            | NV, NC            | Specialized virtual machines targeted for heavy graphic rendering and video editing. Available with single or multiple GPUs.       |
| [High performance compute](sizes-hpc.md) | H, A8-11          | Our fastest and most powerful CPU virtual machines with optional high-throughput network interfaces (RDMA). 

<br> 

- For information about pricing of the various sizes, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/#Windows). 
- To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../../azure-subscription-service-limits.md).
- Storage costs are calculated separately based on used pages in the storage account. For details, [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).
- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.



## Rest API

For information on using the REST API to query for VM sizes, see the following:

- [List available virtual machine sizes for resizing](https://docs.microsoft.com/rest/api/compute/virtualmachines/virtualmachines-list-sizes-for-resizing)
- [List available virtual machine sizes for a subscription](https://docs.microsoft.com/rest/api/compute/virtualmachines/virtualmachines-list-sizes-region)
- [List available virtual machine sizes in an availability set](
https://docs.microsoft.com/rest/api/compute/virtualmachines/virtualmachines-list-sizes-availability-set)

## ACU

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.

## Next steps

Learn more about the different VM sizes that are available:
- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Memory optimized](../virtual-machines-windows-sizes-memory.md)
- [Storage optimized](../virtual-machines-windows-sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)



