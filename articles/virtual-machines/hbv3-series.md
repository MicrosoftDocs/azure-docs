---
title: HBv3-series - Azure Virtual Machines
description: Specifications for the HBv3-series VMs.
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 03/04/2023
ms.reviewer: cynthn
---

# HBv3-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

HBv3-series VMs are optimized for HPC applications such as fluid dynamics, explicit and implicit finite element analysis, weather modeling, seismic processing, reservoir simulation, and RTL simulation. HBv3 VMs feature up to 120 AMD EPYC™ 7V73X (Milan-X) CPU cores, 448 GB of RAM, and no simultaneous multithreading. HBv3-series VMs also provide 350 GB/sec of memory bandwidth (amplified up to 630 GB/s), up to 96 MB of L3 cache per core (1.536 GB total per VM), up to 7 GB/s of block device SSD performance, and clock frequencies up to 3.5 GHz. 

All HBv3-series VMs feature 200 Gb/sec HDR InfiniBand from NVIDIA Networking to enable supercomputer-scale MPI workloads. These VMs are connected in a non-blocking fat tree for optimized and consistent RDMA performance. The HDR InfiniBand fabric also supports Adaptive Routing and the Dynamic Connected Transport (DCT, in additional to standard RC and UD transports). These features enhance application performance, scalability, and consistency, and their usage is strongly recommended.

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Not supported<br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/accelerated-networking-on-hb-hc-hbv2-and-ndv2/ba-p/2067965) about performance and potential issues) <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
<br>

|Size |vCPU |Processor |Memory (GiB) |Memory bandwidth GB/s |Base CPU frequency (GHz) |All-cores frequency (GHz, peak) |Single-core frequency (GHz, peak) |RDMA performance (Gb/s) |MPI support |Temp storage (GiB) |Max data disks |Max Ethernet vNICs |
|----|----|----|----|----|----|----|----|----|----|----|----|----|
|Standard_HB120rs_v3    |120 |AMD EPYC 7V73X |448 |350 |1.9 |3.0 |3.5 |200 |All |2 * 960 |32 |8 |
|Standard_HB120-96rs_v3 |96  |AMD EPYC 7V73X |448 |350 |1.9 |3.0 |3.5 |200 |All |2 * 960 |32 |8 |
|Standard_HB120-64rs_v3 |64  |AMD EPYC 7V73X |448 |350 |1.9 |3.0 |3.5 |200 |All |2 * 960 |32 |8 |
|Standard_HB120-32rs_v3 |32  |AMD EPYC 7V73X |448 |350 |1.9 |3.0 |3.5 |200 |All |2 * 960 |32 |8 |
|Standard_HB120-16rs_v3 |16  |AMD EPYC 7V73X |448 |350 |1.9 |3.0 |3.5 |200 |All |2 * 960 |32 |8 |

Learn more about the:
- [Architecture and VM topology](hbv3-series-overview.md)
- Supported [software stack](hbv3-series-overview.md#software-specifications) including supported OS
- Expected [performance](hbv3-performance.md) of the HBv3-series VM

[!INCLUDE [hpc-include](./includes/hpc-include.md)]

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
