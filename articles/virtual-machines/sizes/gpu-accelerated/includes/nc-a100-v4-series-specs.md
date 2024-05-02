---
title: NCasT4_v3-series specs include
description: Include file containing specifications of NCasT4_v3-series VM sizes.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/18/2024
ms.author: mattmcinnes
ms.custom: include file
---
| Part | Quantity <br><sup>Count <sup>Units | Specs <br><sup>SKU ID, Performance <sup>Units</sup>, etc.  |
|---|---|---|
| Processor        | 24 - 96<sup>vCores    | EPYC™ 7V13 (Milan)                  |
| Memory           | 220 - 880<sup>GiB     |                                                |
| Data Disks       | 8 - 32<sup>Disks     | 30000 - 120000<sup>IOPS</sup> / 1000 - 4000<sup>MBps    |
| Network          | 2 - 8 <sup>NICs       | 20000 - 80000<sup>Mbps                           |
| Accelerators     | 1 - 4<sup>GPUs</sup>  | NVIDIA A100 (PCIe) 80<sup>GiB </sup> <br> 80 - 320<sup>GiB</sup> per VM|