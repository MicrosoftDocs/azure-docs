---
title: Edv5 and Edsv5-series - Azure Virtual Machines
description: Specifications for the Edv5 and Edsv5-series VMs.
author: andysports8
ms.author: shuji
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 10/20/2021
---

# Edv5 and Edsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Edv5 and Edsv5-series Virtual Machines run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processor in a [hyper threaded](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) configuration, providing a better value proposition for most general-purpose workloads. This new processor features an all core turbo clock speed of 3.5 GHz with [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). The Edv5 and Edsv5-series feature up to 672 GiB of RAM. These virtual machines are ideal for memory-intensive enterprise applications, relational database servers, and in-memory analytics workloads. These VMs also feature fast and large local SSD storage (up to 3,900 GiB).

## Edv5-series

Edv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  These virtual machines offer up to 104 vCPU and 672 GiB of RAM and fast, local SSD storage up to 3800 GiB. Edv5-series virtual machines are ideal for memory-intensive enterprise applications and applications that benefit from low latency, high-speed local storage.

Edv5-series virtual machines support Standard SSD and Standard HDD disk types. To use Premium SSD or Ultra Disk storage, select Edsv5-series virtual machines. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br><br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB)<sup>*</sup> | Max NICs |Max network egress bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_E2d_v5                | 2   | 16  | 75   | 4  | 9000/125    | 2 | 12500 |
| Standard_E4d_v5                | 4   | 32  | 150  | 8  | 19000/250   | 2 | 12500 |
| Standard_E8d_v5                | 8   | 64  | 300  | 16 | 38000/500   | 4 | 12500 |
| Standard_E16d_v5               | 16  | 128 | 600  | 32 | 75000/1000  | 8 | 12500 |
| Standard_E20d_v5               | 20  | 160 | 750  | 32 | 94000/1250  | 8 | 12500  |
| Standard_E32d_v5               | 32  | 256 | 1200 | 32 | 150000/2000 | 8 | 16000  |
| Standard_E48d_v5               | 48  | 384 | 1800 | 32 | 225000/3000 | 8 | 24000  |
| Standard_E64d_v5               | 64  | 512 | 2400 | 32 | 300000/4000 | 8 | 30000  |
| Standard_E96d_v5               | 96  | 672 | 3600 | 32 | 450000/4000 | 8 | 35000  |
| Standard_E104id_v5<sup>2</sup> | 104 | 672 | 3800 | 64 | 450000/4000 | 8 | 100000 |

<sup>*</sup> These IOPs values can be guaranteed by using [Gen2 VMs](generation-2.md)<br>
<sup>1</sup> Accelerated networking is required and turned on by default on all Edv5 virtual machines.<br>
<sup>2</sup> Instance is [isolated](../security/fundamentals/isolation-choices.md#compute-isolation) to hardware dedicated to a single customer.


## Edsv5-series

Edsv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  These virtual machines offer up to 104 vCPU and 672 GiB of RAM and fast, local SSD storage up to 3800 GiB. Edsv5-series virtual machines are ideal for memory-intensive enterprise applications and applications that benefit from low latency, high-speed local storage.

Edsv5-series virtual machines support Standard SSD and Standard HDD disk types. You can attach Standard SSD, Standard HDD, and Premium SSD disk storage to these VMs. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/). The Edsv5-series virtual machines can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS/MBps (cache size in GiB)<sup>*</sup> | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps | Max NICs | Max network egress bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_E2ds_v5                  | 2   | 16  | 75   | 4  | 9000/125    | 3750/85      | 10000/1200 | 2 | 12500 |
| Standard_E4ds_v5                  | 4   | 32  | 150  | 8  | 19000/250   | 6400/145     | 20000/1200 | 2 | 12500 |
| Standard_E8ds_v5                  | 8   | 64  | 300  | 16 | 38000/500   | 12800/290    | 20000/1200 | 4 | 12500 |
| Standard_E16ds_v5                 | 16  | 128 | 600  | 32 | 75000/1000  | 25600/600    | 40000/1200 | 8 | 12500 |
| Standard_E20ds_v5                 | 20  | 160 | 750  | 32 | 94000/1250  | 32000/750    | 64000/1600 | 8 | 12500  |
| Standard_E32ds_v5                 | 32  | 256 | 1200 | 32 | 150000/2000 | 51200/865    | 80000/2000 | 8 | 16000  |
| Standard_E48ds_v5                 | 48  | 384 | 1800 | 32 | 225000/3000 | 76800/1315   | 80000/3000 | 8 | 24000  |
| Standard_E64ds_v5                 | 64  | 512 | 2400 | 32 | 375000/4000 | 80000/1735   | 80000/3000 | 8 | 30000  |
| Standard_E96ds_v5                 | 96  | 672 | 3600 | 32 | 450000/4000 | 80000/2600   | 80000/4000 | 8 | 35000  |
| Standard_E104ids_v5<sup>2,3,4</sup> | 104 | 672 | 3800 | 64 | 450000/4000 | 120000/4000  | 120000/4000 | 8 | 100000 |

<sup>*</sup> These IOPs values can be guaranteed by using [Gen2 VMs](generation-2.md)

<sup>1</sup> Accelerated networking is required and turned on by default on all Edsv5 virtual machines.

<sup>2</sup> [Constrained Core](constrained-vcpu.md) sizes available.

<sup>3</sup> Instance is [isolated](../security/fundamentals/isolation-choices.md#compute-isolation) to hardware dedicated to a single customer.

<sup>4</sup> Attaching Ultra Disk or Premium v2 SSD to **Standard_E104ids_v5** results in higher IOPs and MBps than standard premium disks:
- Max uncached Ultra Disk and Premium v2 SSD throughput (IOPS/ MBps): 120000/4000 
- Max burst uncached Ultra Disk and Premium v2 SSD disk throughput (IOPS/ MBps): 120000/4000


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
