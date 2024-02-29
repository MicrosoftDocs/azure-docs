---
title: Eav4-series and Easv4-series 
description: Specifications for the Eav4 and Easv4-series VMs.
author: ayshakeen
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 12/21/2022
ms.author: ayshak
ms.reviewer: jushiman
---

# Eav4 and Easv4-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The Eav4-series and Easv4-series run on 2nd Generation AMD EPYC<sup>TM</sup> 7452 or 3rd Generation EPYC<sup>TM</sup> 7763v processors in a multi-threaded configuration. The Eav4-series and Easv4-series have the same memory and disk configurations as the Ev3 & Esv3-series.

## Eav4-series

[ACU](acu.md): 230 - 260<br>
[Premium Storage](premium-storage-performance.md): Not Supported<br>
[Premium Storage caching](premium-storage-performance.md): Not Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generations 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>

The Eav4-series run on 2nd Generation AMD EPYC<sup>TM</sup> 7452 (up to 3.35GHz) or 3rd Generation EPYC<sup>TM</sup> 7763v processors (up to 3.5GHz). The Eav4-series sizes are ideal for memory-intensive enterprise applications. Data disk storage is billed separately from virtual machines. To use premium SSD, use the Easv4-series sizes. The pricing and billing meters for Easv4 sizes are the same as the Eav3-series.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max NICs | Expected network bandwidth  (Mbps) |
| -----|-----|-----|-----|-----|-----|-----|-----|
| Standard\_E2a\_v4<sup>1</sup>|2|16|50|4|3000 / 46 / 23|2 | 2000 |
| Standard\_E4a\_v4|4|32|100|8|6000 / 93 / 46|2 | 4000 |
| Standard\_E8a\_v4|8|64|200|16|12000 / 187 / 93|4 | 8000 |
| Standard\_E16a\_v4|16|128|400|32|24000 / 375 / 187|8 | 10000 |
| Standard\_E20a\_v4|20|160|500|32|30000 / 468 / 234|8 | 12000 |
| Standard\_E32a\_v4|32|256|800|32|48000 / 750 / 375|8 | 16000 |
| Standard\_E48a\_v4|48|384|1200|32|96000 / 1000 (500)|8 | 24000 |
| Standard\_E64a\_v4|64|512|1600|32|96000 / 1000 (500)|8 | 32000 |
| Standard\_E96a\_v4|96|672|2400|32|96000 / 1000 (500)|8 | 32000 |

<sup>1</sup> Accelerated networking can only be applied to a single NIC. 


## Easv4-series

[ACU](acu.md): 230 - 260<br>
[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Supported<br>
[VM Generation Support](generation-2.md): Generations 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>

The Easv4-series run on 2nd Generation AMD EPYC<sup>TM</sup> 7452 (up to 3.35GHz) or 3rd Generation EPYC<sup>TM</sup> 7763v processors (up to 3.5GHz) and use premium SSD. The Easv4-series sizes are ideal for memory-intensive enterprise applications.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max burst cached and temp storage throughput: IOPS / MBps<sup>1</sup> | Max uncached disk throughput: IOPS / MBps | Max burst uncached disk throughput: IOPS/MBps<sup>1</sup> | Max NICs | Expected network bandwidth  (Mbps) |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| Standard_E2as_v4<sup>3</sup>|2|16|32|4|4000 / 32 (50)| 4000/100 |3200 / 48| 4000/200 |2 | 2000 |
| Standard_E4as_v4 <sup>2</sup>|4|32|64|8|8000 / 64 (100)| 8000/200 |6400 / 96| 8000/200 |2 | 4000 |
| Standard_E8as_v4 <sup>2</sup>|8|64|128|16|16000 / 128 (200)| 16000/400 |12800 / 192| 16000/400 |4 | 8000 |
| Standard_E16as_v4 <sup>2</sup>|16|128|256|32|32000 / 255 (400)| 32000/800 |25600 / 384| 32000/800 |8 | 10000 |
| Standard_E20as_v4|20|160|320|32|40000 / 320 (500)| 40000/1000 |32000 / 480| 40000/1000 |8 | 12000 |
| Standard_E32as_v4<sup>2</sup>|32|256|512|32|64000 / 510 (800)| 64000/1600 |51200 / 768| 64000/1600 |8 | 16000 |
| Standard_E48as_v4|48|384|768|32|96000 / 1020 (1200)| 96000/2000 |76800 / 1148| 80000/2000 |8 | 24000 |
| Standard_E64as_v4<sup>2</sup>|64|512|1024|32|128000 / 1020 (1600)| 128000/2000 |80000 / 1200| 80000/2000 |8 | 32000 |
| Standard_E96as_v4 <sup>2</sup>|96|672|1344|32|192000 / 1020 (2400)| 192000/2000 |80000 / 1200| 80000/2000 |8 | 32000 |

<sup>1</sup>  Easv4-series VMs can [burst](./disk-bursting.md) their disk performance and get up to their bursting max for up to 30 minutes at a time. <br>
<sup>2</sup> [Constrained core sizes available](./constrained-vcpu.md). <br>
<sup>3</sup> Accelerated networking can only be applied to a single NIC. 


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

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
