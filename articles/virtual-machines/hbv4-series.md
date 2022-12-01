---
title: HBv4-series - Azure Virtual Machines
description: Specifications for the HBv4-series VMs.
ms.service: virtual-machines
author: Padmalathas
ms.author: padmalathas
ms.subservice: sizes
ms.topic: conceptual
ms.date: 11/1/2022
ms.reviewer: wwilliams
---

# HBv4-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

HBv4-series VMs are optimized for various HPC workloads such as computational fluid dynamics, finite element analysis, frontend and backend EDA, rendering, molecular dynamics, computational geoscience, weather simulation, and financial risk analysis. During preview, HBv4 VMs will feature up to 176 AMD EPYC™ 7004-series (Genoa) CPU cores, 688 GB of RAM, and no simultaneous multithreading. HBv4-series VMs also provide 800 GB/s of DDR5 memory bandwidth and 768MB L3 cache per VM, up to 12 GB/s (reads) and 7 GB/s (writes) of block device SSD performance, and clock frequencies up to 3.7 GHz.

> [!NOTE] 
> At General Availability, Azure HBv4-series VMs will automatically be upgraded to Genoa-X processors featuring 3D V-Cache. Updates to technical specifications for HBv4 will be posted at that time.

All HBv4-series VMs feature 400 GB/s NDR InfiniBand from NVIDIA Networking to enable supercomputer-scale MPI workloads. These VMs are connected in a non-blocking fat tree for optimized and consistent RDMA performance. NDR continues to support features like Adaptive Routing and the Dynamically Connected Transport (DCT). This newest generation of InfiniBand also brings greater support for offload of MPI collectives, optimized real-world latencies due to congestion control intelligence, and enhanced adaptive routing capabilities. These features enhance application performance, scalability, and consistency, and their usage is recommended. 

[Premium Storage](premium-storage-performance.md): Supported\
[Premium Storage caching](premium-storage-performance.md): Supported\
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage and performance)\
[Live Migration](maintenance-and-updates.md): Not Supported\
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported\
[VM Generation Support](generation-2.md): Generation 1 and 2\
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported at preview\
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported  
<br>

|Size |Physical CPU cores |Processor |Memory (GB) |Memory bandwidth (GB/s) |Base CPU frequency (GHz) |Single-core frequency (GHz, peak) |RDMA performance (GB/s) |MPI support |Temp storage (TB) |Max data disks |Max Ethernet vNICs |
|----|----|----|----|----|----|----|----|----|----|----|----|
|Standard_HB176rs_v4    |176 |AMD EPYC Genoa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HB176-144rs_v4|144 |AMD EPYC Genoa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HB176-96rs_v4 |96  |AMD EPYC Genoa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HB176-48rs_v4 |48  |AMD EPYC Genoa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HB176-24rs_v4 |24  |AMD EPYC Genoa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |

[!INCLUDE [hpc-include](./workloads/hpc/includes/hpc-include.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]


## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)


## Next steps

- Read about the latest announcements, HPC workload examples, and performance results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
