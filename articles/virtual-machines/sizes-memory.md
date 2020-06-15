---
title: Azure VM sizes - Memory | Microsoft Docs
description: Lists the different memory optimized sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks, and NICs as well as storage throughput and network bandwidth for sizes in this series.
services: virtual-machines
documentationcenter: ''
author: mimckitt
manager: gwallace
editor: ''
tags: azure-resource-manager,azure-service-management
keywords: VM isolation,isolated VM,isolation,isolated

ms.assetid: 
ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/03/2020
ms.author: mimckitt

---

# Memory optimized virtual machine sizes

Memory optimized VM sizes offer a high memory-to-CPU ratio that is great for relational database servers, medium to large caches, and in-memory analytics. This article provides information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for each size in this grouping.

- [Dv2 and DSv2-series](dv2-dsv2-series-memory.md), a follow-on to the original D-series, features a more powerful CPU. The Dv2-series is about 35% faster than the D-series. It runs on the Intel&reg; Xeon&reg; 8171M 2.1 GHz (Skylake) or the Intel&reg; Xeon&reg; E5-2673 v4 2.3 GHz (Broadwell) or the Intel&reg; Xeon&reg; E5-2673 v3 2.4 GHz (Haswell) processors, and with the Intel Turbo Boost Technology 2.0. The Dv2-series has the same memory and disk configurations as the D-series.

    Dv2 and DSv2-series are ideal for applications that demand faster vCPUs, better temporary storage performance, or have higher memory demands. They offer a powerful combination for many enterprise-grade applications.

- The [Eav4 and Easv4-series](eav4-easv4-series.md) utilize AMD's 2.35Ghz EPYC<sup>TM</sup> 7452 processor in a multi-threaded configuration with up to 256MB L3 cache, increasing options for running most memory optimized workloads. The Eav4-series and Easv4-series have the same memory and disk configurations as the Ev3 & Esv3-series.

- The [Ev3 and Esv3-series](ev3-esv3-series.md) Intel&reg; Xeon&reg; 8171M 2.1 GHz (Skylake) or the Intel&reg; Xeon&reg; E5-2673 v4 2.3 GHz (Broadwell)  processor in a hyper-threaded configuration, providing a better value proposition for most general purpose workloads, and bringing the Ev3 into alignment with the general purpose VMs of most other clouds. Memory has been expanded (from 7 GiB/vCPU to 8 GiB/vCPU) while disk and network limits have been adjusted on a per core basis to align with the move to hyper-threading. The Ev3 is the follow up to the high memory VM sizes of the D/Dv2 families.

- The [Ev4 and Esv4-series](ev4-esv4-series.md) runs on 2nd Generation Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, are ideal for various memory-intensive enterprise applications and feature up to 504 GiB of RAM. It features  the [Intel&reg; Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) and [Intel&reg; Advanced Vector Extensions 512 (Intel AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html).

- The [Edv4 and Edsv4-series](edv4-edsv4-series.md) runs on 2nd Generation Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors, ideal for extremely large databases or other applications that benefit from high vCPU counts and large amounts of memory. It features a sustained all core Turbo clock speed of 3.4 GHz and features the [Intel&reg; Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) and [Intel&reg; Advanced Vector Extensions 512 (Intel AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html).

- The [M-series](m-series.md) offers a high vCPU count (up to 128 vCPUs) and a large amount of memory (up to 3.8 TiB). It's also ideal for extremely large databases or other applications that benefit from high vCPU counts and large amounts of memory.

- The [Mv2-series](mv2-series.md) offers the highest vCPU count (up to 416 vCPUs) and largest memory (up to 11.4 TiB) of any VM in the cloud. It's ideal for extremely large databases or other applications that benefit from high vCPU counts and large amounts of memory.

Azure Compute offers virtual machine sizes that are Isolated to a specific hardware type and dedicated to a single customer. These virtual machine sizes are best suited for workloads that require a high degree of isolation from other customers for workloads involving elements like compliance and regulatory requirements. Customers can also choose to further subdivide the resources of these Isolated virtual machines by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/). See the pages for virtual machine families below for your isolated VM options.

## Other sizes

- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
