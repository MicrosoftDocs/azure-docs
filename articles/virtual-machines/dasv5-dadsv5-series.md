---
title: 'Dasv5 and Dadsv5-series - Azure Virtual Machines'
description: Specifications for the Dasv5 and Dadsv5-series VMs. 
author: lenayo 
ms.author: leyeoh
ms.reviewer: mimckitt
ms.service: virtual-machines
ms.subservice: vm-sizes-general
ms.topic: conceptual
ms.date: 10/8/2021

---

# Dasv5 and Dadsv5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Dasv5-series and Dadsv5-series are sizes utilizing AMD's 3rd Generation EPYC<sup>TM</sup> processor in a multi-threaded configuration with up to 256 MB L3 cache, increasing customer options for running their general purpose workloads. 

## Dasv5-series

> [!NOTE]
> For frequently asked questions, see [Azure VM sizes with no local temp disk](azure-vms-no-temp-disk.yml).

Dasv5-series VMs utilize AMD's 3rd Generation EPYC<sup>TM</sup> processors that can achieve a boosted maximum frequency of 3.7GHz. The Dasv5-series sizes offer a combination of vCPU and memory for most production workloads. The new VMs offer a diskless alternative, providing a better value proposition for workloads that do not require local temp disk. Data disk storage is billed separately from virtual machines.

[ACU](acu.md): 230 - 260 <br>
[Premium Storage](premium-storage-performance.md): Supported <br>
[Premium Storage caching](premium-storage-performance.md): Supported <br>
[Live Migration](maintenance-and-updates.md): Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported <br>
[VM Generation Support](generation-2.md): Generation 1 and 2 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br><br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs | Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|
| Standard_D2as_v5<sup>1</sup>  | 2  | 8   | Remote Storage Only | 4  | 3750/82    | 2 | 2000  |
| Standard_D4as_v5              | 4  | 16  | Remote Storage Only | 8  | 6400/144   | 2 | 4000  |
| Standard_D8as_v5              | 8  | 32  | Remote Storage Only | 16 | 12800/200  | 4 | 8000  |
| Standard_D16as_v5             | 16 | 64  | Remote Storage Only | 32 | 25600/384  | 8 | 10000 |
| Standard_D32as_v5             | 32 | 128 | Remote Storage Only | 32 | 51200/768  | 8 | 16000 |
| Standard_D48as_v5             | 48 | 192 | Remote Storage Only | 32 | 76800/1152 | 8 | 24000 |
| Standard_D64as_v5             | 64 | 256 | Remote Storage Only | 32 | 80000/1200 | 8 | 32000 |
| Standard_D96as_v5             | 96 | 384 | Remote Storage Only | 32 | 80000/1600 | 8 | 40000 |

<sup>1</sup> Accelerated networking can only be applied to a single NIC.


## Dadsv5-series

Dadsv5-series utilize AMD's 3rd Generation EPYC<sup>TM</sup> processors that can achieve a boosted maximum frequency of 3.7GHz. The Dadsv5-series sizes offer a combination of vCPU, memory and temporary storage for most production workloads. The new VMs have 50% larger local storage, as well as better local disk IOPS for both read and write compared to the [Dav4/Dasv4](dav4-dasv4-series.md) sizes with [Gen2](generation-2.md) VMs. Data disk storage is billed separately from virtual machines.

[ACU](acu.md): 230 - 260 <br>
[Premium Storage](premium-storage-performance.md): Not Supported <br>
[Premium Storage caching](premium-storage-performance.md): Not Supported <br>
[Live Migration](maintenance-and-updates.md): Supported <br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported <br>
[VM Generation Support](generation-2.md): Generation 1 and 2 <br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br><br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS/MBps (cache size in GiB) | Max uncached disk throughput: IOPS/MBps | Max burst uncached disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Expected Network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_D2ads_v5<sup>2</sup> | 2  | 8   | 75   | 4  | 9375 / 120 (50)      | 3750/82    | 10000/600  | 2 | 2000  |
| Standard_D4ads_v5             | 4  | 16  | 150  | 8  | 18750 / 242 (100)    | 6400/144   | 20000/600  | 2 | 4000  |
| Standard_D8ads_v5             | 8  | 32  | 300  | 16 | 37500 / 485 (200)    | 12800/200  | 20000/600  | 4 | 8000  |
| Standard_D16ads_v5            | 16 | 64  | 600  | 32 | 75000 / 968 (400)    | 25600/384  | 40000/600  | 8 | 10000 |
| Standard_D32ads_v5            | 32 | 128 | 1200 | 32 | 150000 / 1936 (800)  | 51200/768  | 80000/1200 | 8 | 16000 |
| Standard_D48ads_v5            | 48 | 192 | 1800 | 32 | 225000 / 2904 (1200) | 76800/1152 | 80000/1800 | 8 | 24000 |
| Standard_D64ads_v5            | 64 | 256 | 2400 | 32 | 300000 / 3872 (1600) | 80000/1200 | 80000/1800 | 8 | 32000 |
| Standard_D96ads_v5            | 96 | 384 | 2400 | 32 | 450000 / 3872 (1600) | 80000/1600 | 80000/2000 | 8 | 40000 |

<sup>1</sup> Dadsv5-series VMs can [burst](disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time.
<sup>2</sup> Accelerated networking can only be applied to a single NIC.




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