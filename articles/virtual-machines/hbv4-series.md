---
title: HBv4-series - Azure Virtual Machines
description: Specifications for the HBv4-series VMs.
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 11/1/2022
ms.reviewer: cynthn
---

# HBv4-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

HBv4-series VMs are optimized for a variety of HPC workloads such as computational fluid dynamics, finite element analysis, frontend and backend EDA, rendering, molecular dynamics, computational geoscience, weather simulation, and financial risk analysis. During Preview, HBv4 VMs will feature up to 176 AMD EPYC™ 7004-series (Genoa) CPU cores, 688 GB of RAM, and no simultaneous multithreading. HBv4-series VMs also provide 800 GB/s of DDR5 memory bandwidth, up to 32 MB of L3 cache per core (768 MB per VM), up to 12GB/s (reads) and 7GB/s (writes) of block device SSD performance, and clock frequencies up to 3.7 GHz.

**NOTE:** At General Availability, Azure HBv4-series VMs will automatically be upgraded to Genoa-X processors featuring 3D V-Cache. Updates to technical specifications for HBv4 will be posted at that time.

All HBv4-series VMs feature 400 Gb/sec NDR InfiniBand from NVIDIA Networking to enable supercomputer-scale MPI workloads. These VMs are connected in a non-blocking fat tree for optimized and consistent RDMA performance. NDR continues to support features like Adaptive Routing and the Dynamically Connected Transport (DCT). This newest generation of InfiniBand also brings greater support for offload of MPI collectives, optimized real-world latencies due to congestion control intelligence, and enhanced adaptive routing capabilities. These features enhance application performance, scalability, and consistency, and their usage is strongly recommended. 

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported at preview<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
<br>

|Size |vCPU |Processor |Memory (GB) |Memory bandwidth GB/s |Base CPU frequency (GHz) |Single-core frequency (GHz, peak) |RDMA performance (GB/s) |MPI support |Temp storage (TB) |Max data disks |Max Ethernet vNICs |
|----|----|----|----|----|----|----|----|----|----|----|----|
|Standard_HB176rs_v4    |176 |AMD EPYC Gen oa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HB176-144rs_v4|144 |AMD EPYC Gen oa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HB176-96rs_v4 |96  |AMD EPYC Gen oa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HB176-48rs_v4 |48  |AMD EPYC Gen oa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |
|Standard_HB176-24rs_v4 |24  |AMD EPYC Gen oa |688 |800 |2.4 |3.7 |400 |All |2 * 1.8 |32 |8 |

## Getting started 

- [Overview](./workloads/hpc/overview.md) of HPC on InfiniBand-enabled H-series and N-series VMs. 
- [Configuring](./workloads/hpc/configure.md) VMs and supported [OS and VM Images](./workloads/hpc/configure.md#vm-images). 
- [Enabling InfiniBand](./workloads/hpc/enable-infiniband.md) with HPC VM images, VM extensions or manual installation. 
- [Setting up MPI](./workloads/hpc/setup-mpi.md), including code snippets and recommendations. 
- [Cluster configuration options](./sizes-hpc.md#cluster-configuration-options). 
- [Deployment considerations](./sizes-hpc.md#deployment-considerations). 

[!INCLUDE [hpc-include](./workloads/hpc/includes/hpc-include.md)]

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Size definitions 

- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB. 

- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec. 

- Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**. For uncached data disk operation, the host cache mode is set to **None**. 

- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](disks-performance.md). 

- **Expected network bandwidth** is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see [Virtual machine network bandwidth](../virtual-network/virtual-machine-network-throughput.md). 

- Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance will depend on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimize network throughput for Azure virtual machines](../virtual-network/virtual-network-optimize-network-bandwidth.md). To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see [Bandwidth/Throughput testing (NTTTCP)](../virtual-network/virtual-network-bandwidth-testing.md). 

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
