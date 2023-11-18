---
title: NC A100 v4-series 
description: Specifications for the NC A100 v4-series Azure VMs. These VMs include Linux, Windows, Flexible scale sets, and uniform scale sets.```
author: sherrywangms
ms.author: sherrywang
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 09/19/2023

---

#  NC A100 v4-series  

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The NC A100 v4 series virtual machine (VM) is a new addition to the Azure GPU family. You can use this series for real-world Azure Applied AI training and batch inference workloads. 

The NC A100 v4 series is powered by NVIDIA A100 PCIe GPU and 3rd-generation AMD EPYC™ 7V13 (Milan) processors.  The VMs feature up to 4 NVIDIA A100 PCIe GPUs with 80GB memory each, up to 96 non-multithreaded AMD EPYC Milan processor cores and 880 GiB of system memory. 
These VMs are ideal for real-world Applied AI workloads, such as: 

- GPU-accelerated analytics and databases
- Batch inferencing with heavy pre- and post-processing
- Autonomy model training
- Oil and gas reservoir simulation
- Machine learning (ML) development
- Video processing
- AI/ML web services



## Supported features

To get started with NC A100 v4 VMs, refer to [HPC Workload Configuration and Optimization](configure.md) for steps including driver and network configuration.

Due to increased GPU memory I/O footprint, the NC A100 v4 requires the use of [Generation 2 VMs](generation-2.md) and marketplace images. While the [Azure HPC images](configure.md) are strongly recommended, Azure HPC Ubuntu 20.04 and Azure HPC CentOS 7.9, RHEL 8.8, RHEL 9.2, Windows Server 2019, and Windows Server 2022 images are supported.

Note: The Ubuntu-HPC 18.04-ncv4 image is only valid during preview and deprecated on 7/29/2022.  All changes have been merged into standard Ubuntu-HPC 18.04 image. Please follow instruction [Azure HPC images](configure.md) for configuration.
 

- [Premium Storage](premium-storage-performance.md): Supported
- [Premium Storage caching](premium-storage-performance.md): Supported
- [Ultra Disks](disks-types.md#ultra-disks): Not Supported
- [Live Migration](maintenance-and-updates.md): Not Supported
- [Memory Preserving Updates](maintenance-and-updates.md): Not Supported
- [VM Generation Support](generation-2.md): Generation 2
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported
- [Ephemeral OS Disks](ephemeral-os-disks.md): Supported
- InfiniBand: Not Supported
- NVIDIA NVLink Interconnect: Supported
- [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported



| Size | vCPU | Memory (GiB) | Temp Disk (GiB)  | NVMe Disks | GPU | GPU Memory (GiB) | Max data disks | Max uncached disk throughput (IOPS / MBps) | Max NICs/network bandwidth (MBps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_NC24ads_A100_v4   | 24  | 220 |64 | 960 GB | 1 | 80  | 12 | 30000/1000 | 2/20,000  |
| Standard_NC48ads_A100_v4   | 48 | 440 | 128| 2x960 GB| 2 | 160 | 24 | 60000/2000 | 4/40,000  | 
| Standard_NC96ads_A100_v4   | 96 | 880 | 256| 4x960 GB | 4 | 320 | 32 | 120000/4000 | 8/80,000  |

1 GPU = one A100 card <br>
1. Local NVMe disk is coming as RAM and it needs to be manually formatted in newly deployed VM.

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
