---
title: Ddv5 and Ddsv5-series 
description: Specifications for the Ddv5 and Ddsv5-series VMs.
author: styli365
ms.author: sttsinar
ms.reviewer: joelpell
ms.custom: mimckitt
ms.service: virtual-machines
ms.subservice: vm-sizes-general
ms.topic: conceptual
ms.date: 03/11/2021
---

# Ddv5 and Ddsv5-series

The Ddv5 and Ddsv5-series Virtual Machines run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads. This new processor features an all core Turbo clock speed of 3.5 GHz, [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html), [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html).


## Ddv5-series

Ddv5-series sizes run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake). The Ddv5-series offer a combination of vCPU, memory and temporary disk for most production workloads. D-series use cases include enterprise-grade applications, relational databases, in-memory caching, and analytics.

The new Ddv5 VM sizes include fast, larger local SSD storage (up to 2,400 GiB) and are designed for applications that benefit from low latency, high-speed local storage, such as applications that require fast reads/ writes to temp storage or that need temp storage for caches or temporary files. You can attach Standard SSDs and Standard HDDs storage to the Ddv5 VMs. Remote Data disk storage is billed separately from virtual machines.

[ACU](acu.md): Coming Soon<br>
[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported (*Requires a minimum of 4 vCPU*)<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
<br> 

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps | Max NICs|Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_D2d_v5 | 2 | 8 | 75 | 4 | Coming Soon | 2|Coming Soon |
| Standard_D4d_v5 | 4 | 16 | 150 | 8 | Coming Soon | 2|Coming Soon |
| Standard_D8d_v5 | 8 | 32 | 300 | 16 | Coming Soon | 4|Coming Soon |
| Standard_D16d_v5 | 16 | 64 | 600 | 32 | Coming Soon| 8|Coming Soon |
| Standard_D32d_v5 | 32 | 128 | 1200 | 32 | Coming Soon | 8|Coming Soon |
| Standard_D48d_v5 | 48 | 192 | 1800 | 32 | Coming Soon | 8|Coming Soon |
| Standard_D64d_v5 | 64 | 256 | 2400 | 32 | Coming Soon | 8|Coming Soon |
| Standard_D96d_v5 | 96 | 384 | 2400 | 32 | Coming Soon | 8|Coming Soon |


## Ddsv5-series

Ddsv5-series run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake). The Ddsv5-series offer a combination of vCPU, memory and temporary disk for most production workloads.

The new Ddsv5 VM sizes include fast, larger local SSD storage (up to 2,400 GiB) and are designed for applications that benefit from low latency, high-speed local storage, such as applications that require fast reads/ writes to temp storage or that need temp storage for caches or temporary files. 

[ACU](acu.md): Coming Soon<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported (*Requires a minimum of 4 vCPU*)<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
<br> 

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs|Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_D2ds_v5 | 2 | 8 | 75 | 4 | Coming Soon | Coming Soon | 2|Coming Soon |
| Standard_D4ds_v5 | 4 | 16 | 150 | 8 | Coming Soon | Coming Soon| 2|Coming Soon |
| Standard_D8ds_v5 | 8 | 32 | 300 | 16 | Coming Soon | Coming Soon | 4|Coming Soon |
| Standard_D16ds_v5 | 16 | 64 | 600 | 32 | Coming Soon | Coming Soon | 8|Coming Soon |
| Standard_D32ds_v5 | 32 | 128 | 1200 | 32 | Coming Soon | Coming Soon | 8|Coming Soon |
| Standard_D48ds_v5 | 48 | 192 | 1800 | 32 | Coming Soon | Coming Soon | 8|Coming Soon |
| Standard_D64ds_v5 | 64 | 256 | 2400 | 32 | Coming Soon | Coming Soon | 8|Coming Soon |
| Standard_D96ds_v5 | 96 | 256 | 2400 | 32 | Coming Soon | Coming Soon | 8|Coming Soon |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types : [Disk Types](./disks-types.md#ultra-disk)


## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.