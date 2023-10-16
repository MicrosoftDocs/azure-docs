---
title: Overview of the Epsv5 and Epdsv5-series sizes
description: Overview of memory-optimized Epsv5 and Epdsv5-series of ARM64-based Azure Virtual Machines featuring the 80 core, 3.0 GHz Ampere Altra processor. 
author: noahwood28
ms.author: noahwood
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual 
ms.date: 08/26/2022
ms.custom: template-sizes 

---

# Epsv5 and Epdsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Client VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Epsv5-series and Epdsv5-series virtual machines are based on the Arm architecture, delivering outstanding price-performance for memory-intensive workloads. These virtual machines feature the Ampere® Altra® Arm-based processor operating at 3.0 GHz, which provides an entire physical core for each virtual machine vCPU. These virtual machines offer a range of vCPU sizes, up to 8 GiB of memory per vCPU, and are best suited for memory-intensive scale-out and enterprise workloads, such as relational database servers, large databases, data analytics engines, in-memory caches, and more.

## Epsv5-series

Epsv5-series virtual machines feature the Ampere® Altra® Arm-based processor operating at 3.0 GHz, which provides an entire physical core for each virtual machine vCPU. These virtual machines offer up to 32 vCPU and 208 GiB of RAM and are ideal for memory-intensive scale-out and most Enterprise workloads. Epsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types with no local-SSD support. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

- [Premium Storage](premium-storage-performance.md): Supported 
- [Premium Storage caching](premium-storage-performance.md): Supported 
- [Live Migration](maintenance-and-updates.md): Supported 
- [Memory Preserving Updates](maintenance-and-updates.md): Supported 
- [VM Generation Support](generation-2.md): Generation 2 
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported 
- [Ephemeral OS Disks](ephemeral-os-disks.md): Not supported
- [Nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|
| Standard_E2ps_v5	| 2	| 16	| Remote Storage Only	| 4	| 3750/85	| 10000/1200 | 2 | 12500 |
| Standard_E4ps_v5	| 4	| 32	| Remote Storage Only	| 8	| 6400/145	| 10000/1200 | 2 | 12500 |
| Standard_E8ps_v5	| 8	| 64	| Remote Storage Only	| 16	| 12800/290	| 20000/1200 | 4 | 12500 |
| Standard_E16ps_v5	| 16	| 128	| Remote Storage Only	| 32	| 25600/600	| 40000/1200 | 4 | 12500 |
| Standard_E20ps_v5	| 20	| 160	| Remote Storage Only	| 32	| 32000/750	| 64000/1600 | 8 | 12500 |
| Standard_E32ps_v5	| 32	| 208	| Remote Storage Only	| 32	| 51200/865	| 80000/2000 | 8 | 16000 |

> [!NOTE]
> Accelerated networking is required and turned on by default on all Epsv5 machines.

## Epdsv5-series

Epdsv5-series virtual machines feature the Ampere® Altra® Arm-based processor operating at 3.0 GHz, which provides an entire physical core for each virtual machine vCPU. These virtual machines offer up to 32 vCPU, 208 GiB of RAM, and fast local SSD storage up to 1,200 GiB and are ideal for memory-intensive scale-out and most Enterprise workloads. Epdsv5-series virtual machines support Standard SSD, Standard HDD, and premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

- [Premium Storage](premium-storage-performance.md): Supported 
- [Premium Storage caching](premium-storage-performance.md): Supported 
- [Live Migration](maintenance-and-updates.md): Supported 
- [Memory Preserving Updates](maintenance-and-updates.md): Supported 
- [VM Generation Support](generation-2.md): Generation 2 
- [Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported 
- [Ephemeral OS Disks](ephemeral-os-disks.md): Supported
- [Nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not supported

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|
| Standard_E2pds_v5    | 2  | 16  | 75   | 4  | 9375/125     | 3750/85  | 10000/1200 | 2 | 12500 |
| Standard_E4pds_v5 | 4 | 32 | 150 | 8 | 19000/250 | 6400/145 | 20000/1200 | 2 | 12500 |
| Standard_E8pds_v5 | 8 | 64 | 300 | 16 | 38000/500 | 12800/290 | 20000/1200 | 4 | 12500 |
| Standard_E16pds_v5 | 16 | 128 | 600 | 32 | 75000/1000 | 25600/600 | 40000/1200 | 4 | 12500 |
| Standard_E20pds_v5 | 20 | 160 | 750 | 32 | 95000/1250 | 32000/750 | 64000/1600 | 8 | 12500 |
| Standard_E32pds_v5 | 32 | 208 | 1200 | 32 | 150000/2000 | 51200/865 | 80000/2000 | 8 | 16000 |

> [!NOTE]
> Accelerated networking is required and turned on by default on all Epsv5 machines.

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
