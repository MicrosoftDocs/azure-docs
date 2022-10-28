---
title: Ev5 and Esv5-series - Azure Virtual Machines
description: Specifications for the Ev5 and Esv5-series VMs.
author: andysports8
ms.author: shuji
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 10/20/2021
---

# Ev5 and Esv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Ev5 and Esv5-series virtual machines run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processor in a [hyper threaded](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) configuration, providing a better value proposition for most general-purpose workloads. This new processor features an all core turbo clock speed of 3.5 GHz with [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). Featuring up to 672 GiB of RAM, these virtual machines are ideal for memory-intensive enterprise applications, relational database servers, and in-memory analytics workloads. The Ev5 and Esv5-series provide a better value proposition for workloads that don't require local temp disk. For information about similar virtual machines with local disk, see [Edv5 and Edsv5-series VMs](edv5-edsv5-series.md).

> [!NOTE]
> For frequently asked questions, see [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml).

## Ev5-series

Ev5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  These virtual machines offer up to 104 vCPU and 672 GiB of RAM. Ev5-series virtual machines don't have temporary storage thus lowering the price of entry.

Ev5-series supports Standard SSD and Standard HDD disk types. To use Premium SSD or Ultra Disk storage, select Esv5-series virtual machines. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

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
| Standard_E2_v5  | 2   | 16  | Remote Storage Only | 4  | 2 | 12500 |
| Standard_E4_v5                | 4   | 32  | Remote Storage Only | 8  | 2 | 12500 |
| Standard_E8_v5                | 8   | 64  | Remote Storage Only | 16 | 4 | 12500 |
| Standard_E16_v5               | 16  | 128 | Remote Storage Only | 32 | 8 | 12500 |
| Standard_E20_v5               | 20  | 160 | Remote Storage Only | 32 | 8 | 12500  |
| Standard_E32_v5               | 32  | 256 | Remote Storage Only | 32 | 8 | 16000  |
| Standard_E48_v5               | 48  | 384 | Remote Storage Only | 32 | 8 | 24000  |
| Standard_E64_v5               | 64  | 512 | Remote Storage Only | 32 | 8 | 30000  |
| Standard_E96_v5               | 96  | 672 | Remote Storage Only | 32 | 8 | 30000  |
| Standard_E104i_v5<sup>3</sup> | 104 | 672 | Remote Storage Only | 64 | 8 | 100000 |

<sup>1</sup> Accelerated networking is required and turned on by default on all Ev5 virtual machines.<br>
<sup>2</sup> Instance is [isolated](../security/fundamentals/isolation-choices.md#compute-isolation) to hardware dedicated to a single customer.<br>

## Esv5-series

Esv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  These virtual machines offer up to 104 vCPU and 672 GiB of RAM. Esv5-series virtual machines don't have temporary storage thus lowering the price of entry.

Esv5-series supports Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>4</sup> | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_E2s_v5  | 2   | 16  | Remote Storage Only | 4  | 3750/85     | 10000/1200 | 2 | 12500 |
| Standard_E4s_v5                | 4   | 32  | Remote Storage Only | 8  | 6400/145    | 20000/1200 | 2 | 12500 |
| Standard_E8s_v5                | 8   | 64  | Remote Storage Only | 16 | 12800/290   | 20000/1200 | 4 | 12500 |
| Standard_E16s_v5               | 16  | 128 | Remote Storage Only | 32 | 25600/600   | 40000/1200 | 8 | 12500 |
| Standard_E20s_v5               | 20  | 160 | Remote Storage Only | 32 | 32000/750   | 64000/1600 | 8 | 12500  |
| Standard_E32s_v5               | 32  | 256 | Remote Storage Only | 32 | 51200/865   | 80000/2000 | 8 | 16000  |
| Standard_E48s_v5               | 48  | 384 | Remote Storage Only | 32 | 76800/1315  | 80000/3000 | 8 | 24000  |
| Standard_E64s_v5               | 64  | 512 | Remote Storage Only | 32 | 80000/1735  | 80000/3000 | 8 | 30000  |
| Standard_E96s_v5<sup>3</sup>   | 96  | 672 | Remote Storage Only | 32 | 80000/2600  | 80000/4000 | 8 | 35000  |
| Standard_E104is_v5<sup>3,5</sup> | 104 | 672 | Remote Storage Only | 64 | 120000/4000 | 120000/4000 | 8 | 100000 |

<sup>1</sup> Accelerated networking is required and turned on by default on all Esv5 virtual machines.

<sup>2</sup> [Constrained core](constrained-vcpu.md) sizes available.

<sup>3</sup> Instance is [isolated](../security/fundamentals/isolation-choices.md#compute-isolation) to hardware dedicated to a single customer.

<sup>4</sup> Esv5-series VMs can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

<sup>5</sup> Attaching Ultra Disk or Premium SSDs V2 to **Standard_E104is_v5** results in higher IOPs and MBps than standard premium disks:
- Max uncached Ultra Disk and Premium SSD V2 throughput (IOPS/ MBps): 120000/4000 
- Max burst uncached Ultra Disk and Premium SSD V2 disk throughput (IOPS/ MBps): 120000/4000





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
