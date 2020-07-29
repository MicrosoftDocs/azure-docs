---
title: Mv2-series - Azure Virtual Machines
description: Specifications for the Mv2-series VMs.
author: ayshakeen
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.date: 04/07/2020
ms.author: jushiman
---

# Mv2-series

The Mv2-series features high throughput, low latency platform running on a hyper-threaded Intel® Xeon® Platinum 8180M 2.5GHz (Skylake) processor with an all core base frequency of 2.5 GHz and a max turbo frequency of 3.8 GHz. All Mv2-series virtual machine sizes can use both standard and premium persistent disks. Mv2-series instances are memory optimized VM sizes providing unparalleled computational performance to support large in-memory databases and workloads, with a high memory-to-CPU ratio that is ideal for relational database servers, large caches, and in-memory analytics.

Mv2-series VM’s feature Intel® Hyper-Threading Technology

Premium Storage: Supported

Premium Storage caching: Supported

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

Write Accelerator: [Supported](https://docs.microsoft.com/azure/virtual-machines/windows/how-to-enable-write-accelerator)

|Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_M208ms_v2<sup>1</sup> | 208 | 5700 | 4096 | 64 | 80000 / 800 (7040) | 40000 / 1000 | 8 / 16000 |
| Standard_M208s_v2<sup>1</sup> | 208 | 2850 | 4096 | 64 | 80000 / 800 (7040) | 40000 / 1000 | 8 / 16000 |
| Standard_M416ms_v2<sup>1</sup> | 416 | 11400 | 8192 | 64 | 250000 / 1600 (14080) | 80000 / 2000 | 8 / 32000 |
| Standard_M416s_v2<sup>1</sup> | 416 | 5700 | 8192 | 64 | 250000 / 1600 (14080) | 80000 / 2000 | 8 / 32000 |

<sup>1</sup> Mv2-series VMs are generation 2 only and support  a subset of generation 2 supported Images. Please see below for the complete list of supported images for Mv2-series. If you're using Linux, see [Support for generation 2 VMs on Azure](./linux/generation-2.md) for instructions on how to find and select an image. If you're using Windows, see [Support for generation 2 VMs on Azure](./windows/generation-2.md) for instructions on how to find and select an image. 

- Windows Server 2019 or later
- SUSE Linux Enterprise Server 12 SP4 and later or SUSE Linux Enterprise Server 15 SP1 and later
- Red Hat Enterprise Linux 7.6, 7.7, 8.1 or later 
- Oracle Enterprise Linux 7.7 or later



[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
