---
title: Dav4 and Dasv4-series
description: Specifications for the Dav4 and Dasv4-series VMs.
author: migerdes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.date: 02/03/2020
ms.author: jushiman
---

# Dav4 and Dasv4-series

The Dav4-series and Dasv4-series are new sizes utilizing AMD's 2.35Ghz EPYC<sup>TM</sup> 7452 processor in a multi-threaded configuration with up to 256 MB L3 cache dedicating 8 MB of that L3 cache to every 8 cores increasing customer options for running their general purpose workloads. The Dav4-series and Dasv4-series have the same memory and disk configurations as the D & Dsv3-series.

## Dav4-series

ACU: 230-260

Premium Storage: Not Supported

Premium Storage caching: Not Supported

Live Migration: Supported

Memory Preserving Updates: Supported

Dav4-series sizes are based on the 2.35Ghz AMD EPYC<sup>TM</sup> 7452 processor that can achieve a boosted maximum frequency of 3.35GHz. The Dav4-series sizes offer a combination of vCPU, memory and temporary storage for most production workloads. Data disk storage is billed separately from virtual machines. To use premium SSD, use the Dasv4 sizes. The pricing and billing meters for Dasv4 sizes are the same as the Dav4-series.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max temp storage throughput: IOPS / Read MBps / Write MBps | Max NICs / Expected network bandwidth (MBps) |
|-----|-----|-----|-----|-----|-----|-----|
| Standard_D2a_v4 |  2  | 8  | 50  | 4  | 3000 / 46 / 23   | 2 / 1000 |
| Standard_D4a_v4 |  4  | 16 | 100 | 8  | 6000 / 93 / 46   | 2 / 2000 |
| Standard_D8a_v4 |  8  | 32 | 200 | 16 | 12000 / 187 / 93 | 4 / 4000 |
| Standard_D16a_v4|  16 | 64 | 400 |32  | 24000 / 375 / 187 |8 / 8000 |
| Standard_D32a_v4|  32 | 128| 800 | 32 | 48000 / 750 / 375 |8 / 16000 |
| Standard_D48a_v4| 48 | 192| 1200 | 32 | 96000 / 1000 / 500 | 8 / 24000 |
| Standard_D64a_v4| 64 | 256 | 1600 | 32 | 96000 / 1000 / 500 | 8 / 30000 |
| Standard_D96a_v4| 96 | 384 | 2400 | 32 | 96000 / 1000 / 500 | 8 / 30000 |

## Dasv4-series

ACU:  230-260

Premium Storage: Supported

Premium Storage caching: Supported

Live Migration: Supported

Memory Preserving Updates: Supported

Dasv4-series sizes are based on the 2.35Ghz AMD EPYC<sup>TM</sup> 7452 processor that can achieve a boosted maximum frequency of 3.35GHz and use premium SSD. The Dasv4-series sizes offer a combination of vCPU, memory and temporary storage for most production workloads.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Max data disks | Max cached and temp storage throughput: IOPS / MBps (cache size in GiB) | Max uncached disk throughput: IOPS / MBps | Max NICs / Expected network bandwidth (MBps) |
|-----|-----|-----|-----|-----|-----|-----|-----|
| Standard_D2as_v4|2|8|16|4|4000 / 32 (50)|3200 / 48|2 / 1000 |
| Standard_D4as_v4|4|16|32|8|8000 / 64 (100)|6400 / 96|2 / 2000 |
| Standard_D8as_v4|8|32|64|16|16000 / 128 (200)|12800 / 192|4 / 4000 |
| Standard_D16as_v4|16|64|128|32|32000 / 255 (400)|25600 / 384|8 / 8000 |
| Standard_D32as_v4|32|128|256|32|64000 / 510 (800)|51200 / 768|8 / 16000 |
| Standard_D48as_v4|48|192|384|32|96000 / 1020 (1200)|76800 / 1148|8 / 24000 |
| Standard_D64as_v4|64|256|512|32|128000 / 1020 (1600)|80000 / 1200|8 / 30000 | 
| Standard_D96as_v4|96|384|768|32|192000 / 1020 (2400)|80000 / 1200|8 / 30000 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
