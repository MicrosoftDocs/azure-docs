---
title: HC-series - Azure Virtual Machines
description: Specifications for the HC-series VMs.
author: ju-shim
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 09/09/2020
ms.author: amverma
ms.reviewer: jushiman
---

# HC-series

HC-series VMs are optimized for applications driven by dense computation, such as implicit finite element analysis, molecular dynamics, and computational chemistry. HC VMs feature 44 Intel Xeon Platinum 8168 processor cores, 8 GB of RAM per CPU core, and no hyperthreading. The Intel Xeon Platinum platform supports Intel’s rich ecosystem of software tools such as the Intel Math Kernel Library and advanced vector processing capabilities such as AVX-512.

HC-series VMs feature 100 Gb/sec Mellanox EDR InfiniBand. These VMs are connected in a non-blocking fat tree for optimized and consistent RDMA performance. These VMs support Adaptive Routing and the Dynamic Connected Transport (DCT, in additional to standard RC and UD transports). These features enhance application performance, scalability, and consistency, and usage of them is strongly recommended.

ACU: 297-315

Premium Storage: Supported

Premium Storage Caching: Supported

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

| Size | vCPU | Processor | Memory (GB) | Memory bandwidth GB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (Gb/s) | MPI support | Temp storage (GB) | Max data disks | Max Ethernet NICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HC44rs | 44 | Intel Xeon Platinum 8168 | 352 | 191 | 2.7 | 3.4 | 3.7 | 100 | All | 700 | 4 | 1 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

- Learn more about [configuring your VMs](./workloads/hpc/configure.md), [enabling InfiniBand](./workloads/hpc/enable-infiniband.md), [setting up MPI](./workloads/hpc/setup-mpi.md), and optimizing HPC applications for Azure at [HPC Workloads](./workloads/hpc/overview.md).
- Read about the latest announcements and some HPC examples and results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a high level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
