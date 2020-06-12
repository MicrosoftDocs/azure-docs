---
title: HBv2-series - Azure Virtual Machines
description: Specifications for the HBv2-series VMs.
author: vermagit
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.date: 02/03/2020
ms.author: amverma
---

# HBv2-series

HBv2-series VMs are optimized for applications driven by memory bandwidth, such as fluid dynamics, finite element analysis, and reservoir simulation. HBv2 VMs feature 120 AMD EPYC 7742 processor cores, 4 GB of RAM per CPU core, and no simultaneous multithreading. Each HBv2 VM provides up to 340 GB/sec of memory bandwidth, and up to 4 teraFLOPS of FP64 compute.

Premium Storage: Supported

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

| Size | vCPU | Processor | Memory (GB) | Memory bandwidth GB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (Gb/s) | MPI support | Temp storage (GB) | Max data disks | Max Ethernet NICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HB120rs_v2 | 120 | AMD EPYC 7V12 | 480 | 350 | 2.45 | 3.1 | 3.3 | 200 | All | 480 + 960 | 8 | 1 |


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