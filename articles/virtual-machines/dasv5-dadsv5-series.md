---
title: 'Dasv5 and Dadsv5-series - Azure Virtual Machines'
description: Specifications for the Dasv5 and Dadsv5-series VMs. 
author: mamccrea 
ms.author: mamccrea
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 10/8/2021

---

# Dasv5 and Dadsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Dasv5-series and Dadsv5-series utilize AMD's 3rd Generation EPYC<sup>TM</sup> 7763v processor in a multi-threaded configuration with up to 256 MB L3 cache, increasing customer options for running their general purpose workloads. These virtual machines offer a combination of vCPUs and memory to meet the requirements associated with most enterprise workloads, such as small-to-medium databases, low-to-medium traffic web servers, application servers and more.

## Dasv5-series

Dasv5-series VMs utilize AMD's 3rd Generation EPYC<sup>TM</sup> 7763v processors that can achieve a boosted maximum frequency of 3.5GHz. The Dasv5-series sizes offer a combination of vCPU and memory for most production workloads. The new VMs with no local disk provide a better value proposition for workloads that do not require local temp disk.

> [!NOTE]
> For frequently asked questions, see [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml).

Dasv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

[Premium Storage](premium-storage-performance.md): Supported <br>
[Premium Storage caching](premium-storage-performance.md): Supported <br>
[Live Migration](maintenance-and-updates.md): Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported <br>
[VM Generation Support](generation-2.md): Generation 1 and 2 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|
| Standard_D2as_v5  | 2  | 8   | Remote Storage Only | 4  | 3750/82    | 10000/600   | 2 | 12500  |
| Standard_D4as_v5  | 4  | 16  | Remote Storage Only | 8  | 6400/144   | 20000/600   | 2 | 12500  |
| Standard_D8as_v5  | 8  | 32  | Remote Storage Only | 16 | 12800/200  | 20000/600   | 4 | 12500  |
| Standard_D16as_v5 | 16 | 64  | Remote Storage Only | 32 | 25600/384  | 40000/800   | 8 | 12500 |
| Standard_D32as_v5 | 32 | 128 | Remote Storage Only | 32 | 51200/768  | 80000/1600  | 8 | 16000 |
| Standard_D48as_v5 | 48 | 192 | Remote Storage Only | 32 | 76800/1152 | 80000/2000  | 8 | 24000 |
| Standard_D64as_v5 | 64 | 256 | Remote Storage Only | 32 | 80000/1200 | 80000/2000  | 8 | 32000 |
| Standard_D96as_v5 | 96 | 384 | Remote Storage Only | 32 | 80000/1600 | 80000/2000  | 8 | 40000 |


<sup>1</sup> Dasv5-series VMs can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.


## Dadsv5-series

Dadsv5-series utilize AMD's 3rd Generation EPYC<sup>TM</sup> 7763v processors that can achieve a boosted maximum frequency of 3.5GHz. The Dadsv5-series sizes offer a combination of vCPU, memory and temporary storage for most production workloads. The new VMs have 50% larger local storage, as well as better local disk IOPS for both read and write compared to the [Dav4/Dasv4](dav4-dasv4-series.md) sizes with [Gen2](generation-2.md) VMs.

Dadsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).


[Premium Storage](premium-storage-performance.md): Supported <br>
[Premium Storage caching](premium-storage-performance.md): Supported <br>
[Live Migration](maintenance-and-updates.md): Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported <br>
[VM Generation Support](generation-2.md): Generation 1 and 2 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_D2ads_v5  | 2  | 8   | 75   | 4  | 9000 / 125    | 3750/82    | 10000/600  | 2 | 12500  |
| Standard_D4ads_v5  | 4  | 16  | 150  | 8  | 19000 / 250   | 6400/144   | 20000/600  | 2 | 12500  |
| Standard_D8ads_v5  | 8  | 32  | 300  | 16 | 38000 / 500   | 12800/200  | 20000/600  | 4 | 12500  |
| Standard_D16ads_v5 | 16 | 64  | 600  | 32 | 75000 / 1000  | 25600/384  | 40000/800  | 8 | 12500 |
| Standard_D32ads_v5 | 32 | 128 | 1200 | 32 | 150000 / 2000 | 51200/768  | 80000/1000 | 8 | 16000 |
| Standard_D48ads_v5 | 48 | 192 | 1800 | 32 | 225000 / 3000 | 76800/1152 | 80000/2000 | 8 | 24000 |
| Standard_D64ads_v5 | 64 | 256 | 2400 | 32 | 300000 / 4000 | 80000/1200 | 80000/2000 | 8 | 32000 |
| Standard_D96ads_v5 | 96 | 384 | 3600 | 32 | 450000 / 4000 | 80000/1600 | 80000/2000 | 8 | 40000 |

<sup>*</sup> These IOPs values can be achieved by using Gen2 VMs.<br>
<sup>1</sup> Dadsv5-series VMs can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.


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
