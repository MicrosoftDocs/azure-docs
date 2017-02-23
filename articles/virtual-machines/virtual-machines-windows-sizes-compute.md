---
title: Azure Windows VM sizes - Compute | Microsoft Docs
description: Lists the different compute optimized sizes available for Windows virtual machines in Azure.
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

# Compute

<!-- F-series, Fs-series* -->

F-series is based on the 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, which can achieve clock speeds as high as 3.1 GHz with the Intel Turbo Boost Technology 2.0. This is the same CPU performance as the Dv2-series of VMs.  At a lower per-hour list price, the F-series is the best value in price-performance in the Azure portfolio based on the Azure Compute Unit (ACU) per core. 

F-series VMs are an excellent choice for workloads that demand faster CPUs but do not need as much memory or local SSD per CPU core.  Workloads such as analytics, gaming servers, web servers, and batch processing will benefit from the value of the F-series.

The Fs-series provides all of the advantages of the F-series, in addition to Premium storage.

[!INCLUDE [virtual-machines-common-sizes-compute](../../includes/virtual-machines-common-sizes-compute.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]


## Other sizes

- [General purpose](virtual-machines-windows-sizes-general.md)
- [GPU optimized](virtual-machines-windows-sizes-gpu.md)
- [High performance compute](virtual-machines-windows-sizes-hpc.md)
- [Memory optimized](virtual-machines-windows-sizes-memory.md)
- [Storage optimized](virtual-machines-windows-sizes-storage.md)
