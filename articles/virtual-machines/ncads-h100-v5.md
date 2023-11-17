---
title: NCads H100 v5-series
description: Specifications for the NCads H100 v5-series Azure VMs. These VMs include Linux, Windows, Flexible scale sets, and uniform scale sets.```
author: sherrywangms
ms.author: sherrywang
ms.service: virtual-machines
ms.subservice: sizes
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
---

#  NCads H100 v5-series  (Preview)

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

> [!IMPORTANT]
> The NCads H100 v5 Series is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 


The NCads H100 v5 series virtual machine (VM) is a new addition to the Azure GPU family. You can use this series for real-world Azure Applied AI training and batch inference workloads. 

The NCads H100 v5 series is powered by NVIDIA H100 NVL GPU and 4th-generation AMD EPYC™ Genoa processors.  The VMs feature up to 2 NVIDIA H100 NVL GPUs with 94GB memory each, up to 80 non-multithreaded AMD EPYC Milan processor cores and 640 GiB of system memory. 
These VMs are ideal for real-world Applied AI workloads, such as: 

- GPU-accelerated analytics and databases
- Batch inferencing with heavy pre- and post-processing
- Autonomy model training
- Oil and gas reservoir simulation
- Machine learning (ML) development
- Video processing
- AI/ML web services



## Supported features

To get started with NCads H100 v5 VMs, refer to [HPC Workload Configuration and Optimization](configure.md) for steps including driver and network configuration.

Due to increased GPU memory I/O footprint, the NC A100 v4 requires the use of [Generation 2 VMs](generation-2.md) and marketplace images. Please follow instruction [Azure HPC images](configure.md) for configuration.
 

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



| Size | vCPU | Memory (GiB) | Temp Disk  NVMe (GiB) | GPU | GPU Memory (GiB) | Max data disks | Max uncached disk throughput (IOPS / MBps) | Max NICs/network bandwidth (MBps) |
|---|---|---|---|---|---|---|---|---|
| Standard_NC40ads_H100_v5   | 40  | 320 | 3576| 1 | 94  | 12 | 30000/1000 | 2/40,000  |
| Standard_NC80adis_H100_v5   | 80 | 640 | 7152 | 2 | 188 | 24 | 60000/2000 | 4/80,000  | 

<sup>1</sup> 1 GPU = one H100 card <br>
<sup>2</sup> Local NVMe disks are ephemeral. Data is lost on these disks if you stop/deallocate your VM. Local NVMe disks aren't encrypted by Azure Storage encryption, even if you enable encryption at host. <br>


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: Not available during preview.

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)

## Next step

- [Compare compute performance across Azure SKUs with Azure compute units (ACU)](acu.md)
