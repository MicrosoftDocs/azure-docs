---
title: NVv4-series 
description: Specifications for the NVv4-series VMs.
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 01/12/2020
ms.author: vikancha
---

# NVv4-series 

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The NVv4-series virtual machines are powered by [AMD Radeon Instinct MI25](https://www.amd.com/en/products/professional-graphics/instinct-mi25) GPUs and AMD EPYC 7V12(Rome) CPUs with a base frequency of 2.45GHz, all-cores peak frequency of 3.1GHz and single-core peak frequency of 3.3GHz. With NVv4-series Azure is introducing virtual machines with partial GPUs. Pick the right sized virtual machine for GPU accelerated graphics applications and virtual desktops starting at 1/8th of a GPU with 2 GiB frame buffer to a full GPU with 16 GiB frame buffer. NVv4 virtual machines currently support only Windows guest operating system.

<br>

[ACU](acu.md): 230-260<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs / Expected network bandwidth (MBps) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NV4as_v4 |4 |14 |88 | 1/8 | 2 | 4 | 6400 / 96 | 2 / 1000 |
| Standard_NV8as_v4 |8 |28 |176 | 1/4 | 4 | 8 | 12800 / 192 | 4 / 2000 |
| Standard_NV16as_v4 |16 |56 |352 | 1/2 | 8 | 16 | 25600 / 384 | 8 / 4000 |
| Standard_NV32as_v4 |32 |112 |704 | 1 | 16 | 32 | 51200 / 768 |8 / 8000 |

<sup>1</sup> NVv4-series VMs feature AMD Simultaneous multithreading Technology



## Supported operating systems and drivers

To take advantage of the GPU capabilities of Azure NVv4-series VMs running Windows, AMD GPU drivers must be installed.

To install AMD GPU drivers manually, see [N-series AMD GPU driver setup for Windows](./windows/n-series-amd-driver-setup.md) for supported operating systems, drivers, installation, and verification steps.


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
