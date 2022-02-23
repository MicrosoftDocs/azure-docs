---
title: NC A100 v4-series (Preview)
description: Specifications for the NC A100 v4-series VMs.
author: sherrywangms
ms.author: sherrywang
ms.service: virtual-machines
ms.subservice: vm-sizes-gpu
ms.topic: conceptual
ms.date: 03/01/2022

---

#  NC A100 v4-series (Preview)

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The NC A100 v4 series virtual machine is a new addition to the Azure GPU family, designed for real worl Applied AI training and batch inferencing workloads. 

The NC A100 v4 series is powered by NVIDIA A100 PCIe GPU and 3rd-generation AMD Epyc™ 7V13 (Milan) processor.  The VMs feature up to 4 NVIDIA A100 PCIe GPUs with 80GB memory each, up to 96 non-multithreaded AMD EPYC Milan processor cores and 880 GiB of system memory. 
These virtual machines are ideal for real world Applied AI workload including GPU accelerated analytics and databases, batch inferencing with heavy pre- and post-processing, autonomous driving reinforcement learning, oil & gas reservoir simulation, ML development, video processing, AI/ML web services, and more.

> [!IMPORTANT]
> To get started with NC A100 v4 VMs, refer to [HPC Workload Configuration and Optimization](./workloads/hpc/configure.md) for steps including driver and network configuration.
> Due to increased GPU memory I/O footprint, the NC A100 v4 requires the use of [Generation 2 VMs](./generation-2.md) and marketplace images. The [Azure HPC images](./workloads/hpc/configure.md) are strongly recommended. Azure HPC Ubuntu 18.04, 20.04 and Azure HPC CentOS 7.9 images are supported.
> 


[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage, and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
InfiniBand: Not Supported<br>
Nvidia NVLink Interconnect: Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>

<br>
The NC A100 v4 series supports the following kernel versions: <br>
Ubuntu 18.04: 5.4.0-1043-azure <br>
Ubuntu 20.04: 5.4.0-1046-azure <br>
CentOS 7.9 HPC: 3.10.0-1160.24.1.el7.x86_64 <br>
Windows Service 2019 <br>
<br>

> [!IMPORTANT]
> This VM series is under Preview. The specification lists down below is preliminary version, subject to change. Please signup preview [here](https://aka.ms/AzureNCA100v4Signup).
> 

| Size | vCPU | Memory: GiB | Temp Storage (with NVMe): GiB | GPU | GPU Memory: GiB | Max data disks | Max uncached disk throughput: IOPS / MBps | Max NICs/network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_NC24ads_A100_v4   | 24  | 220 | 1123  | 1 | 80 | 12 | 20000/200 | 4/20,000  |
| Standard_NC48ads_A100_v4   | 48 | 440 | 2246 | 2 | 160 | 24 | 40000/400 | 8/40,000  | 
| Standard_NC96ads_A100_v4   | 96 | 880 | 4492 | 4 | 320 | 32 | 80000/800 | 8/80,000  |

1 GPU = one A100 card

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

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
