---
title: HB-series 
description: Specifications for the HB-series VMs.
author: ju-shim
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.date: 02/03/2020
ms.author: jushiman
---

# HB-series

HB-series VMs are optimized for applications driven by memory bandwidth, such as fluid dynamics, explicit finite element analysis, and weather modeling. HB VMs feature 60 AMD EPYC 7551 processor cores, 4 GB of RAM per CPU core, and no simultaneous multithreading. An HB VM provides up to 260 GB/sec of memory bandwidth.

ACU: 199-216

Premium Storage: Supported

Premium Storage Caching: Supported

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

| Size | vCPU | Processor | Memory (GB) | Memory bandwidth GB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (Gb/s) | MPI support | Temp storage (GB) | Max data disks | Max Ethernet NICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HB60rs | 60 | AMD EPYC 7551 | 240 | 263 | 2.0 | 2.55 | 2.55 | 100 | All | 700 | 4 | 1 |

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