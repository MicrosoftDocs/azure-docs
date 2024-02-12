---
title: Overview of the Dplsv5 and Dpldsv5-series sizes
description: Overview of Dplsv5 and Dpldsv5 series of ARM64-based Azure Virtual Machines featuring the 80 core, 3.0 GHz Ampere Altra processor.
author: noahwood28
ms.author: noahwood
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 08/26/2022
ms.custom: template-sizes

---

# Dplsv5 and Dpldsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Client VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Dplsv5-series and Dpldsv5-series virtual machines are based on the Arm architecture, delivering outstanding price-performance for general-purpose workloads. These virtual machines feature the Ampere® Altra® Arm-based processor operating at 3.0 GHz, which provides an entire physical core for each virtual machine vCPU. These virtual machines offer a range of vCPU sizes, up to 2 GiB of memory per vCPU, and temporary storage options able to meet the requirements of most non-memory-intensive and scale-out workloads such as microservices, small databases, caches, gaming servers, and more. 

## Dplsv5-series

Dplsv5-series virtual machines feature the Ampere® Altra® Arm-based processor operating at 3.0 GHz, which provides an entire physical core for each virtual machine vCPU. These virtual machines offer up to 64 vCPU and 128 GiB of RAM and offer a better value proposition for non-memory-intensive scale-out workloads. Dplsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types with no local-SSD support. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

- [Premium Storage](premium-storage-performance.md): Supported 
- [Premium Storage caching](premium-storage-performance.md): Supported 
- [Live Migration](maintenance-and-updates.md): Supported 
- [Memory Preserving Updates](maintenance-and-updates.md): Supported 
- [VM Generation Support](generation-2.md): Generation 2 
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported 
- [Ephemeral OS Disks](ephemeral-os-disks.md): Not supported
- [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_D2pls_v5	| 2	| 4	| Remote Storage Only	| 4	| 3750/85	| 10000/1200 | 2 | 12500 |
| Standard_D4pls_v5	| 4	| 8	| Remote Storage Only	| 8	| 6400/145	| 20000/1200 | 2 | 12500 |
| Standard_D8pls_v5	| 8	| 16	| Remote Storage Only	| 16	| 12800/290	| 20000/1200 | 4 | 12500 |
| Standard_D16pls_v5	| 16	| 32	| Remote Storage Only	| 32	| 25600/600	| 40000/1200 | 4 | 12500 |
| Standard_D32pls_v5	| 32	| 64	| Remote Storage Only	| 32	| 51200/865	| 80000/2000 | 8 | 16000 |
| Standard_D48pls_v5	| 48	| 96	| Remote Storage Only	| 32	| 76800/1315	| 80000/3000 | 8 | 24000 |
| Standard_D64pls_v5	| 64	| 128	| Remote Storage Only	| 32	| 80000/1735	| 80000/3000 | 8 | 40000 |

> [!NOTE]
> Accelerated networking is required and turned on by default on all Dplsv5 machines.

## Dpldsv5-series

Dpldsv5-series virtual machines feature the Ampere® Altra® Arm-based processor operating at 3.0 GHz, which provides an entire physical core for each virtual machine vCPU. These virtual machines offer up to 64 vCPU, 128 GiB of RAM, and fast local SSD storage up to 2,400 GiB built for scale-out, non-memory-intensive workloads that require local disk. Dpldsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

- [Premium Storage](premium-storage-performance.md): Supported 
- [Premium Storage caching](premium-storage-performance.md): Supported 
- [Live Migration](maintenance-and-updates.md): Supported 
- [Memory Preserving Updates](maintenance-and-updates.md): Supported 
- [VM Generation Support](generation-2.md): Generation 2 
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported 
- [Ephemeral OS Disks](ephemeral-os-disks.md): Supported
- [Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_D2plds_v5    | 2  | 4  | 75   | 4  | 9375/125     | 3750/85  | 10000/1200 | 2 | 12500 |
| Standard_D4plds_v5 | 4 | 8 | 150 | 8 | 19000/250 | 6400/145 | 20000/1200 | 2 | 12500 |
| Standard_D8plds_v5 | 8 | 16 | 300 | 16 | 38000/500 | 12800/290 | 20000/1200 | 4 | 12500 |
| Standard_D16plds_v5 | 16 | 32 | 600 | 32 | 75000/1000 | 25600/600 | 40000/1200 | 4 | 12500 |
| Standard_D32plds_v5 | 32 | 64 | 1200 | 32 | 150000/2000 | 51200/865 | 80000/2000 | 8 | 16000 |
| Standard_D48plds_v5 | 48 | 96 | 1800 | 32 | 225000/3000 | 76800/1315 | 80000/3000 | 8 | 24000 |
| Standard_D64plds_v5 | 64 | 128 | 2400 | 32 | 300000/4000 | 80000/1735 | 80000/3000 | 8 | 40000 |

> [!NOTE]
> Accelerated networking is required and turned on by default on all Dplsv5 machines.

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
