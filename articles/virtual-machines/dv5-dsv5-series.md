---
title: Dv5 and Dsv5-series - Azure Virtual Machines
description: Specifications for the Dv5 and Dsv5-series VMs.
author: andysports8
ms.author: shuji
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 10/20/2021
---

# Dv5 and Dsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Dv5 and Dsv5-series virtual machines run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processor in a [hyper threaded](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) configuration, providing a better value proposition for most general-purpose workloads. This new processor features an all core turbo clock speed of 3.5 GHz with [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). These virtual machines offer a combination of vCPUs and memory to meet the requirements associated with most enterprise workloads, such as small-to-medium databases, low-to-medium traffic web servers, application servers and more. The Dv5 and Dsv5-series provide a better value proposition for workloads that don't require local temp disk. For information about similar virtual machines with local disk, see [Ddv5 and Ddsv5-series VMs](ddv5-ddsv5-series.md).

> [!NOTE]
> For frequently asked questions, see  [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml).

## Dv5-series

Dv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  These virtual machines offer up to 96 vCPU and 384 GiB of RAM.  Dv5-series virtual machines provide a better value proposition for most general-purpose workloads compared to the prior generation (for example, increased scalability and an upgraded CPU class).

Dv5-series virtual machines do not have any temporary storage thus lowering the price of entry.  You can attach Standard SSDs, and Standard HDDs disk storage to these virtual machines. To use Premium SSD or Ultra Disk storage, select Dsv5-series virtual machines. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max NICs|Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|
| Standard_D2_v5 | 2  | 8   | Remote Storage Only | 4  | 2 | 12500 |
| Standard_D4_v5                | 4  | 16  | Remote Storage Only | 8  | 2 | 12500 |
| Standard_D8_v5                | 8  | 32  | Remote Storage Only | 16 | 4 | 12500 |
| Standard_D16_v5               | 16 | 64  | Remote Storage Only | 32 | 8 | 12500 |
| Standard_D32_v5               | 32 | 128 | Remote Storage Only | 32 | 8 | 16000 |
| Standard_D48_v5               | 48 | 192 | Remote Storage Only | 32 | 8 | 24000 |
| Standard_D64_v5               | 64 | 256 | Remote Storage Only | 32 | 8 | 30000 |
| Standard_D96_v5               | 96 | 384 | Remote Storage Only | 32 | 8 | 35000 |

<sup>1</sup> Accelerated networking is required and turned on by default on all Dv5 virtual machines.<br>

## Dsv5-series

Dsv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  These virtual machines offer up to 96 vCPU and 384 GiB of RAM.  Dsv5-series virtual machines provide a better value proposition for most general-purpose workloads compared to the prior generation (for example, increased scalability and an upgraded CPU class).

Dsv5-series virtual machines do not have any temporary storage thus lowering the price of entry.  You can attach Standard SSDs, Standard HDDs, and Premium SSDs disk storage to these virtual machines. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>2</sup> | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_D2s_v5 | 2  | 8   | Remote Storage Only | 4  | 3750/85    | 10000/1200 | 2 | 12500 |
| Standard_D4s_v5               | 4  | 16  | Remote Storage Only | 8  | 6400/145   | 20000/1200 | 2 | 12500 |
| Standard_D8s_v5               | 8  | 32  | Remote Storage Only | 16 | 12800/290  | 20000/1200 | 4 | 12500 |
| Standard_D16s_v5              | 16 | 64  | Remote Storage Only | 32 | 25600/600  | 40000/1200 | 8 | 12500 |
| Standard_D32s_v5              | 32 | 128 | Remote Storage Only | 32 | 51200/865  | 80000/2000 | 8 | 16000 |
| Standard_D48s_v5              | 48 | 192 | Remote Storage Only | 32 | 76800/1315 | 80000/3000 | 8 | 24000 |
| Standard_D64s_v5              | 64 | 256 | Remote Storage Only | 32 | 80000/1735 | 80000/3000 | 8 | 30000 |
| Standard_D96s_v5              | 96 | 384 | Remote Storage Only | 32 | 80000/2600 | 80000/4000 | 8 | 35000 |

<sup>1</sup> Accelerated networking is required and turned on by default on all Dsv5 virtual machines.<br>
<sup>2</sup> Dsv5-series virtual machines can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

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
