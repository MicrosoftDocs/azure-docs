---
title: Ddv4 and Ddsv4-series 
description: Specifications for the Dv4, Ddv4, Dsv4 and Ddsv4-series VMs.
author: andysports8
ms.author: shuji
ms.reviewer: mimckitt
ms.custom: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 06/01/2020
---

# Ddv4 and Ddsv4-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Ddv4 and Ddsv4-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads. It features an all core Turbo clock speed of 3.4 GHz, [Intel&reg; Turbo Boost Technology 2.0](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Hyper-Threading Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) and [Intel&reg; Advanced Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html). They also support [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). These new VM sizes will have 50% larger local storage, as well as better local disk IOPS for both read and write compared to the [Dv3/Dsv3](./dv3-dsv3-series.md) sizes with [Gen2 VMs](./generation-2.md).

D-series use cases include enterprise-grade applications, relational databases, in-memory caching, and analytics.

## Ddv4-series

Ddv4-series sizes run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake). The Ddv4-series offer a combination of vCPU, memory and temporary disk for most production workloads.

The new Ddv4 VM sizes include fast, larger local SSD storage (up to 2,400 GiB) and are designed for applications that benefit from low latency, high-speed local storage, such as applications that require fast reads/ writes to temp storage or that need temp storage for caches or temporary files. You can attach Standard SSDs and Standard HDDs storage to the Ddv4 VMs. Remote Data disk storage is billed separately from virtual machines.

[ACU](acu.md): 195-210<br>
[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br> 

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps<sup>*</sup> | Max NICs|Expected network bandwidth  (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_D2d_v4<sup>1</sup> | 2  | 8   | 75   | 4  | 9000/125    | 2 | 5000  |
| Standard_D4d_v4             | 4  | 16  | 150  | 8  | 19000/250   | 2 | 10000  |
| Standard_D8d_v4             | 8  | 32  | 300  | 16 | 38000/500   | 4 | 12500  |
| Standard_D16d_v4            | 16 | 64  | 600  | 32 | 75000/1000   | 8 | 12500  |
| Standard_D32d_v4            | 32 | 128 | 1200 | 32 | 150000/2000 | 8 | 16000 |
| Standard_D48d_v4            | 48 | 192 | 1800 | 32 | 225000/3000 | 8 | 24000 |
| Standard_D64d_v4            | 64 | 256 | 2400 | 32 | 300000/4000 | 8 | 30000 |




<sup>*</sup> These IOPs values can be achieved by using [Gen2 VMs](generation-2.md)<br>
<sup>1</sup> Accelerated networking can only be applied to a single NIC. 

## Ddsv4-series

Ddsv4-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) or the Intel&reg; Xeon&reg; Platinum 8272CL (Cascade Lake). The Ddsv4-series offer a combination of vCPU, memory and temporary disk for most production workloads.

The new Ddsv4 VM sizes include fast, larger local SSD storage (up to 2,400 GiB) and are designed for applications that benefit from low latency, high-speed local storage, such as applications that require fast reads/ writes to temp storage or that need temp storage for caches or temporary files. 

 > [!NOTE]
 >The pricing and billing meters for Ddsv4 sizes are the same as Ddv4-series.

[ACU](acu.md): 195-210<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br> 

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps<sup>*</sup> | Max uncached disk throughput: IOPS/MBps |  Max burst uncached disk throughput: IOPS/MBps<sup>1</sup> | Max NICs|Expected network bandwidth  (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_D2ds_v4<sup>2</sup> | 2  | 8   | 75   | 4  | 9000/125    | 3200/48    | 4000/200   | 2 | 5000  |
| Standard_D4ds_v4             | 4  | 16  | 150  | 8  | 19000/250   | 6400/96    | 8000/200   | 2 | 10000  |
| Standard_D8ds_v4             | 8  | 32  | 300  | 16 | 38000/500   | 12800/192  | 16000/400  | 4 | 12500  |
| Standard_D16ds_v4            | 16 | 64  | 600  | 32 | 85000/1000   | 25600/384  | 32000/800  | 8 | 12500  |
| Standard_D32ds_v4            | 32 | 128 | 1200 | 32 | 150000/2000 | 51200/768  | 64000/1600 | 8 | 16000 |
| Standard_D48ds_v4            | 48 | 192 | 1800 | 32 | 225000/3000 | 76800/1152 | 80000/2000 | 8 | 24000 |
| Standard_D64ds_v4            | 64 | 256 | 2400 | 32 | 300000/4000 | 80000/1200 | 80000/2000 | 8 | 30000 |

<sup>*</sup> These IOPs values can be achieved by using [Gen2 VMs](generation-2.md)<br>
<sup>1</sup>  Ddsv4-series VMs can [burst](./disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.<br>
<sup>2</sup> Accelerated networking can only be applied to a single NIC. 

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types : [Disk Types](./disks-types.md#ultra-disks)


## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
