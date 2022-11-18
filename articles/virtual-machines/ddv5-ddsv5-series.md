---
title: Ddv5 and Ddsv5-series - Azure Virtual Machines
description: Specifications for the Ddv5 and Ddsv5-series VMs.
author: andysports8
ms.author: shuji
ms.custom: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 10/20/2021
---

# Ddv5 and Ddsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Ddv5 and Ddsv5-series Virtual Machines run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processor in a [hyper threaded](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) configuration, providing a better value proposition for most general-purpose workloads. This new processor features an all core turbo clock speed of 3.5 GHz with [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). These virtual machines offer a combination of vCPUs, memory and temporary storage able to meet the requirements associated with most enterprise workloads, such as small-to-medium databases, low-to-medium traffic web servers, application servers and more.


## Ddv5-series
Ddv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz. These virtual machines offer up to 96 vCPU and 384 GiB of RAM as well as fast, local SSD storage up to 3,600 GiB. Ddv5-series virtual machines provide a better value proposition for most general-purpose workloads compared to the prior generation (for example, increased scalability and an upgraded CPU class). These virtual machines also feature fast and large local SSD storage (up to 3,600 GiB).

Ddv5-series virtual machines support Standard SSD and Standard HDD disk types. To use Premium SSD or Ultra Disk storage, select Ddsv5-series virtual machines. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).


[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br> 

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps<sup>*</sup> | Max NICs|Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_D2d_v5 | 2  | 8   | 75   | 4  | 9000/125    | 2 | 12500 |
| Standard_D4d_v5               | 4  | 16  | 150  | 8  | 19000/250   | 2 | 12500 |
| Standard_D8d_v5               | 8  | 32  | 300  | 16 | 38000/500   | 4 | 12500 |
| Standard_D16d_v5              | 16 | 64  | 600  | 32 | 75000/1000  | 8 | 12500 |
| Standard_D32d_v5              | 32 | 128 | 1200 | 32 | 150000/2000 | 8 | 16000 |
| Standard_D48d_v5              | 48 | 192 | 1800 | 32 | 225000/3000 | 8 | 24000 |
| Standard_D64d_v5              | 64 | 256 | 2400 | 32 | 300000/4000 | 8 | 30000 |
| Standard_D96d_v5              | 96 | 384 | 3600 | 32 | 450000/4000 | 8 | 35000 |

<sup>*</sup> These IOPs values can be guaranteed by using [Gen2 VMs](generation-2.md)<br>
<sup>1</sup> Accelerated networking is required and turned on by default on all Ddv5 virtual machines.<br>

## Ddsv5-series

Ddsv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  These virtual machines offer up to 96 vCPU and 384 GiB of RAM as well as fast, local SSD storage up to 3,600 GiB. Ddsv5-series virtual machines provide a better value proposition for most general-purpose workloads compared to the prior generation (for example, increased scalability and an upgraded CPU class).

Ddsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br> 


| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps<sup>*</sup> | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>3</sup> | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_D2ds_v5 | 2  | 8   | 75   | 4  | 9000/125    | 3750/85     | 10000/1200 | 2 | 12500 |
| Standard_D4ds_v5               | 4  | 16  | 150  | 8  | 19000/250   | 6400/145    | 20000/1200 | 2 | 12500 |
| Standard_D8ds_v5               | 8  | 32  | 300  | 16 | 38000/500   | 12800/290   | 20000/1200 | 4 | 12500 |
| Standard_D16ds_v5              | 16 | 64  | 600  | 32 | 75000/1000  | 25600/600   | 40000/1200 | 8 | 12500 |
| Standard_D32ds_v5              | 32 | 128 | 1200 | 32 | 150000/2000 | 51200/865   | 80000/2000 | 8 | 16000 |
| Standard_D48ds_v5              | 48 | 192 | 1800 | 32 | 225000/3000 | 76800/1315  | 80000/3000 | 8 | 24000 |
| Standard_D64ds_v5              | 64 | 256 | 2400 | 32 | 375000/4000 | 80000/1735  | 80000/3000 | 8 | 30000 |
| Standard_D96ds_v5              | 96 | 384 | 3600 | 32 | 450000/4000 | 80000/2600  | 80000/4000 | 8 | 35000 |

<sup>*</sup> These IOPs values can be guaranteed by using [Gen2 VMs](generation-2.md)<br>
<sup>1</sup> Accelerated networking is required and turned on by default on all Ddsv5 virtual machines.<br>
<sup>2</sup> Ddsv5-series virtual machines can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types: [Disk Types](./disks-types.md#ultra-disks)
