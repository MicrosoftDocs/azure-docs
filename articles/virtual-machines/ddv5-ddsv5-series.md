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

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Ddv5 and Ddsv5-series Virtual Machines run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads. This new processor features an all core Turbo clock speed of 3.5 GHz, [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html), [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html).


## Ddv5-series

Ddv5-series sizes run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake). The Ddv5-series offer a combination of vCPU, memory and temporary disk for most production workloads. D-series use cases include enterprise-grade applications, relational databases, in-memory caching, and analytics.

The new Ddv5 VM sizes include fast, larger local SSD storage (up to 2,400 GiB) and are designed for applications that benefit from low latency, high-speed local storage, such as applications that require fast reads/ writes to temp storage or that need temp storage for caches or temporary files. You can attach Standard SSDs and Standard HDDs storage to the Ddv5 VMs. Remote Data disk storage is billed separately from virtual machines.

[ACU](acu.md): 195<br>
[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
<br> 

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps | Max NICs|Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_D2d_v5<sup>1</sup>  | 2  | 8   | 75   | 4  | 19000/120   | 2 | 1000  |
| Standard_D4d_v5              | 4  | 16  | 150  | 8  | 38500/242   | 2 | 2000  |
| Standard_D8d_v5              | 8  | 32  | 300  | 16 | 77000/485   | 4 | 4000  |
| Standard_D16d_v5             | 16 | 64  | 600  | 32 | 154000/968  | 8 | 8000  |
| Standard_D32d_v5             | 32 | 128 | 1200 | 32 | 308000/1936 | 8 | 16000 |
| Standard_D48d_v5             | 48 | 192 | 1800 | 32 | 462000/2904 | 8 | 24000 |
| Standard_D64d_v5             | 64 | 256 | 2400 | 32 | 615000/3872 | 8 | 30000 |
| Standard_D96d_v5             | 96 | 384 | 2400 | 32 | 615000/3872 | 8 | 30000 |

<sup>1</sup> Accelerated networking can only be applied to a single NIC.

## Ddsv5-series

Ddsv5-series run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake). The Ddsv5-series offer a combination of vCPU, memory and temporary disk for most production workloads.

The new Ddsv5 VM sizes include fast, larger local SSD storage (up to 2,400 GiB) and are designed for applications that benefit from low latency, high-speed local storage, such as applications that require fast reads/ writes to temp storage or that need temp storage for caches or temporary files. 

[ACU](acu.md): 195 <br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
<br> 

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max NICs | Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_D2ds_v5<sup>1</sup>  | 2  | 8   | 75   | 4  | 38500/242(100)    | 8000/200   | 2 | 2000  |
| Standard_D4ds_v5              | 4  | 16  | 150  | 8  | 38500/242(100)    | 8000/200   | 2 | 2000  |
| Standard_D8ds_v5              | 8  | 32  | 300  | 16 | 77000/485(200)    | 16000/400  | 4 | 4000  |
| Standard_D16ds_v5             | 16 | 64  | 600  | 32 | 154000/968(400)   | 32000/800  | 8 | 8000  |
| Standard_D32ds_v5             | 32 | 128 | 1200 | 32 | 154000/968(400)   | 32000/800  | 8 | 8000  |
| Standard_D48ds_v5             | 48 | 192 | 1800 | 32 | 462000/2904(1200) | 80000/2000 | 8 | 24000 |
| Standard_D64ds_v5             | 64 | 256 | 2400 | 32 | 615000/3872(1600) | 80000/2000 | 8 | 30000 |
| Standard_D96ds_v5             | 96 | 256 | 2400 | 32 | 615000/3872(1600) | 80000/2000 | 8 | 30000 |

<sup>1</sup> Accelerated networking can only be applied to a single NIC.

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