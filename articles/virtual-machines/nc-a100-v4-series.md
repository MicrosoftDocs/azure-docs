---
title: NC A100 v4-series 
description: Specifications for the NC A100 v4-series Azure VMs. These VMs include Linux, Windows, Flexible scale sets, and uniform scale sets.```
author: sherrywangms
ms.author: sherrywang
ms.service: virtual-machines
ms.subservice: vm-sizes-gpu
ms.topic: conceptual
ms.date: 03/01/2022

---

#  NC A100 v4-series  

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The NC A100 v4 series virtual machine (VM) is a new addition to the Azure GPU family. You can use this series for real-world Azure Applied AI training and batch inference workloads. 

The NC A100 v4 series is powered by NVIDIA A100 PCIe GPU and 3rd-generation AMD Epyc™ 7V13 (Milan) processors.  The VMs feature up to 4 NVIDIA A100 PCIe GPUs with 80GB memory each, up to 96 non-multithreaded AMD EPYC Milan processor cores and 880 GiB of system memory. 
These VMs are ideal for real-world Applied AI workloads, such as: 

- GPU-accelerated analytics and databases
- Batch inferencing with heavy pre- and post-processing
- Autonomous driving reinforcement learning
- Oil and gas reservoir simulation
- Machine learning (ML) development
- Video processing
- AI/ML web services



## Supported features

To get started with NC A100 v4 VMs, refer to [HPC Workload Configuration and Optimization](./workloads/hpc/configure.md) for steps including driver and network configuration.

Due to increased GPU memory I/O footprint, the NC A100 v4 requires the use of [Generation 2 VMs](./generation-2.md) and marketplace images. The [Azure HPC images](./workloads/hpc/configure.md) are strongly recommended. Azure HPC Ubuntu 18.04, 20.04 and Azure HPC CentOS 7.9, CentOS 8.4, RHEL 7.9 and RHEL 8.5 images are supported. Windows Service 2019 and Windows Service 2022 images are supported.
 
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Not Supported <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
InfiniBand: Not Supported<br>
Nvidia NVLink Interconnect: Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>

These features are not supported:[Live Migration](maintenance-and-updates.md), [Memory Preserving Updates](maintenance-and-updates.md) and [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization) . 


| Size | vCPU | Memory: GiB | Temp Storage (with NVMe) : GiB  | GPU | GPU Memory: GiB | Max data disks | Max uncached disk throughput: IOPS / MBps | Max NICs/network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_NC24ads_A100_v4   | 24  | 220 | 1123 | 1 | 80  | 12 | 30000/1000 | 2/20,000  |
| Standard_NC48ads_A100_v4   | 48 | 440 | 2246  | 2 | 160 | 24 | 60000/2000 | 4/40,000  | 
| Standard_NC96ads_A100_v4   | 96 | 880 | 4492 | 4 | 320 | 32 | 120000/4000 | 8/80,000  |

1 GPU = one A100 card

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

You can [use the pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate your Azure VMs costs.

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)

## Next step

- [Compare compute performance across Azure SKUs with Azure compute units (ACU)](acu.md)
