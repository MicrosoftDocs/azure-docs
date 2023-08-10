---
title: HB-series 
description: Specifications for the HB-series VMs.
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 05/30/2023
ms.reviewer: jushiman
---

# HB-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

HB-series VMs are optimized for applications that are driven by memory bandwidth, such as fluid dynamics, explicit finite element analysis, and weather modeling. HB VMs feature 60 AMD EPYC 7551 processor cores, 4 GB of RAM per CPU core, and no simultaneous multithreading. An HB VM provides up to 260 GB/sec of memory bandwidth.

HB-series VMs feature 100 Gb/sec Mellanox EDR InfiniBand. These VMs are connected in a non-blocking fat tree for optimized and consistent RDMA performance. These VMs support Adaptive Routing and the Dynamic Connected Transport (DCT, in addition to standard RC and UD transports). These features enhance application performance, scalability, and consistency, and their usage is recommended.

[ACU](acu.md): 199-216<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/accelerated-networking-on-hb-hc-hbv2-and-ndv2/ba-p/2067965) about performance and potential issues) <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
<br>

| Size | vCPU | Processor | Memory (GiB) | Memory bandwidth GB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (Gb/s) | MPI support | Temp storage (GiB) | Max data disks | Max Ethernet vNICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HB60rs | 60 | AMD EPYC 7551 | 228 | 263 | 2.0 | 2.55 | 2.55 | 100 | All | 700 | 4 | 8 |
| Standard_HB60-45rs | 45 | AMD EPYC 7551 | 228 | 263 | 2.0 | 2.55 | 2.55 | 100 | All | 700 | 4 | 8 |
| Standard_HB60-30rs | 30 | AMD EPYC 7551 | 228 | 263 | 2.0 | 2.55 | 2.55 | 100 | All | 700 | 4 | 8 |
| Standard_HB60-15rs | 15 | AMD EPYC 7551 | 228 | 263 | 2.0 | 2.55 | 2.55 | 100 | All | 700 | 4 | 8 |

Learn more about the:
- [Architecture and VM topology](hb-series-overview.md)
- Supported [software stack](hb-series-overview.md#software-specifications) including supported OS
- Expected [performance](hb-series-performance.md) of the HB-series VM

[!INCLUDE [hpc-include.md](./includes/hpc-include.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator : [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)


## Next steps

- Read about the latest announcements, HPC workload examples, and performance results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
