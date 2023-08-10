---
title: HX-series - Azure Virtual Machines
description: Specifications for the HX-series VMs.
ms.service: virtual-machines
ms.subservice: sizes
author: Padmalathas
ms.author: padmalathas
ms.topic: conceptual
ms.date: 05/25/2023
ms.reviewer: wwilliams
---

# HX-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

HX-series VMs are optimized for workloads that require significant memory capacity with twice the memory capacity as HBv4. For example, workloads such as silicon design can use HX-series VMs to enable EDA customers targeting the most advanced manufacturing processes to run their most memory-intensive workloads. 

HX VMs feature up to 176 AMD EPYC™ 9V33X ("Genoa-X") CPU cores with AMD's 3D V-Cache, clock frequencies up to 3.7 GHz, and no simultaneous multithreading. HX-series VMs also provide 1.4 TB of RAM, 2.3 GB L3 cache. The 2.3 GB L3 cache per VM can deliver up to 5.7 TB/s of bandwidth to amplify up to 780 GB/s of bandwidth from DRAM, for a blended average of 1.2 TB/s of effective memory bandwidth across a broad range of customer workloads. The VMs also provide up to 12 GB/s (reads) and 7 GB/s (writes) of block device SSD performance. 

All HX-series VMs feature 400 Gb/s NDR InfiniBand from NVIDIA Networking to enable supercomputer-scale MPI workloads. These VMs are connected in a non-blocking fat tree for optimized and consistent RDMA performance. NDR continues to support features like Adaptive Routing and the Dynamically Connected Transport (DCT). This newest generation of InfiniBand also brings greater support for offload of MPI collectives, optimized real-world latencies due to congestion control intelligence, and enhanced adaptive routing capabilities. These features enhance application performance, scalability, and consistency, and their usage is recommended.  

[Premium Storage](premium-storage-performance.md): Supported\
[Premium Storage caching](premium-storage-performance.md): Supported\
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage and performance)\
[Live Migration](maintenance-and-updates.md): Not Supported\
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported\
[VM Generation Support](generation-2.md): Generation 2\
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)\
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported
<br>

|Size |Physical CPU cores |Processor |Memory (GB) |Memory per core (GB) |Memory bandwidth (GB/s) |Base CPU frequency (GHz) |Single-core frequency (GHz, peak) |RDMA performance (Gb/s) |MPI support |Temp storage (TB) |Max data disks |Max Ethernet vNICs |
|----|----|----|----|----|----|----|----|----|----|----|----|----|
|Standard_HX176rs    |176 |AMD EPYC 9V33X (Genoa-X) |1408 |8 |780 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HX176-144rs|144 |AMD EPYC 9V33X (Genoa-X) |1408 |10|780 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HX176-96rs |96  |AMD EPYC 9V33X (Genoa-X) |1408 |15|780 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HX176-48rs |48  |AMD EPYC 9V33X (Genoa-X) |1408 |29|780 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HX176-24rs |24  |AMD EPYC 9V33X (Genoa-X) |1408 |59|780 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |


[!INCLUDE [hpc-include](./includes/hpc-include.md)]

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

- Read about the latest announcements, HPC workload examples and performance results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a high-level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
- Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
