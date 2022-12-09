---
title: 'Easv5 and Eadsv5-series - Azure Virtual Machines'
description: Specifications for the Easv5 and Eadsv5-series VMs.
author: mamccrea 
ms.author: mamccrea
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual 
ms.date: 10/8/2021

---

# Easv5 and Eadsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Easv5-series and Eadsv5-series utilize AMD's 3rd Generation EPYC<sup>TM</sup> 7763v processor in a multi-threaded configuration with up to 256 MB L3 cache, increasing customer options for running most memory optimized workloads. These virtual machines offer a combination of vCPUs and memory to meet the requirements associated with most memory-intensive enterprise applications, such as relational database servers and in-memory analytics workloads.

## Easv5-series

Easv5-series utilize AMD's 3rd Generation EPYC<sup>TM</sup> 7763v processors that can achieve a boosted maximum frequency of 3.5GHz. The Easv5-series sizes offer a combination of vCPU and memory that is ideal for memory-intensive enterprise applications. The new VMs with no local disk provide a better value proposition for workloads that do not require local temp disk.

> [!NOTE]
> For frequently asked questions, see [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml).

Easv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

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
| Standard_E2as_v5              | 2   | 16  | Remote Storage Only | 4  | 3750/82      | 10000/600   | 2 | 12500 |
| Standard_E4as_v5<sup>2</sup>  | 4   | 32  | Remote Storage Only | 8  | 6400/144     | 20000/600   | 2 | 12500 |
| Standard_E8as_v5<sup>2</sup>  | 8   | 64  | Remote Storage Only | 16 | 12800/200    | 20000/600   | 4 | 12500 |
| Standard_E16as_v5<sup>2</sup> | 16  | 128 | Remote Storage Only | 32 | 25600/384    | 40000/800   | 8 | 12500 |
| Standard_E20as_v5             | 20  | 160 | Remote Storage Only | 32 | 32000/480    | 64000/1000  | 8 | 12500 |
| Standard_E32as_v5<sup>2</sup> | 32  | 256 | Remote Storage Only | 32 | 51200/768    | 80000/1600  | 8 | 16000 |
| Standard_E48as_v5             | 48  | 384 | Remote Storage Only | 32 | 76800/1152   | 80000/2000  | 8 | 24000 |
| Standard_E64as_v5<sup>2</sup> | 64  | 512 | Remote Storage Only | 32 | 80000/1200   | 80000/2000  | 8 | 32000 |
| Standard_E96as_v5<sup>2</sup> | 96  | 672 | Remote Storage Only | 32 | 80000/1600   | 80000/2000  | 8 | 40000 |
| Standard_E112ias_v5<sup>3</sup>   | 112 | 672 | Remote Storage Only | 64 | 120000/2000 | 120000/2000 | 8 | 50000 |

<sup>1</sup> Easv5-series VMs can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.<br>
<sup>2</sup> [Constrained core sizes available](constrained-vcpu.md)<br>
<sup>3</sup> Attaching Ultra Disk or Premium SSDs V2 to **Standard_E112ias_v5** results in higher IOPs and MBps than standard premium disks:
- Max uncached Ultra Disk and Premium SSD V2 throughput (IOPS/ MBps): 120000/2000 
- Max burst uncached Ultra Disk and Premium SSD V2 disk throughput (IOPS/ MBps): 120000/2000


## Eadsv5-series

Eadsv5-series utilize AMD's 3rd Generation EPYC<sup>TM</sup> 7763v processors that can achieve a boosted maximum frequency of 3.5GHz. The Eadsv5-series sizes offer a combination of vCPU, memory and temporary storage that is ideal for memory-intensive enterprise applications. The new VMs have 50% larger local storage, as well as better local disk IOPS for both read and write compared to the [Eav4/Easv4](eav4-easv4-series.md) sizes with [Gen2](generation-2.md) VMs.

Eadsv5-series virtual machines support Standard SSD, Standard HDD, and Premium SSD disk types. You can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines. [See pricing for disks](https://azure.microsoft.com/pricing/details/managed-disks/).

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
| Standard_E2ads_v5              | 2   | 16  | 75   | 4  | 9000 / 125    | 3750/82       | 10000/600   | 2 | 12500 |
| Standard_E4ads_v5<sup>2</sup>  | 4   | 32  | 150  | 8  | 19000 / 250   | 6400/144      | 20000/600   | 2 | 12500 |
| Standard_E8ads_v5<sup>2</sup>  | 8   | 64  | 300  | 16 | 38000 / 500   | 12800/200     | 20000/600   | 4 | 12500 |
| Standard_E16ads_v5<sup>2</sup> | 16  | 128 | 600  | 32 | 75000 / 1000  | 25600/384     | 40000/800   | 8 | 12500 |
| Standard_E20ads_v5             | 20  | 160 | 750  | 32 | 94000 / 1250  | 32000/480     | 64000/1000  | 8 | 12500 |
| Standard_E32ads_v5<sup>2</sup> | 32  | 256 | 1200 | 32 | 150000 / 2000 | 51200/768     | 80000/1600  | 8 | 16000 |
| Standard_E48ads_v5             | 48  | 384 | 1800 | 32 | 225000 / 3000 | 76800/1152    | 80000/2000  | 8 | 24000 |
| Standard_E64ads_v5<sup>2</sup> | 64  | 512 | 2400 | 32 | 300000 / 4000 | 80000/1200    | 80000/2000  | 8 | 32000 |
| Standard_E96ads_v5<sup>2</sup> | 96  | 672 | 3600 | 32 | 450000 / 4000 | 80000/1600    | 80000/2000  | 8 | 40000 |
| Standard_E112iads_v5<sup>3</sup> | 112 | 672 | 3800 | 64 | 450000 / 4000 | 120000/2000   | 120000/2000 | 8 | 50000 |

<sup>1</sup> Eadsv5-series VMs can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.

<sup>2</sup> [Constrained core sizes available](constrained-vcpu.md).

<sup>3</sup> Attaching Ultra Disk or Premium SSDs V2 to **Standard_E112iads_v5** results in higher IOPs and MBps than standard premium disks:
- Max uncached Ultra Disk and Premium SSD V2 throughput (IOPS/ MBps): 120000/2000 
- Max burst uncached Ultra Disk and Premium SSD V2 disk throughput (IOPS/ MBps): 120000/2000

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
