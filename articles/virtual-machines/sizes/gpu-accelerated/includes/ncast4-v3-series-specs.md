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
| Processor        | 4 - 64<sup>vCores    | AMD EPYC™ 7V12 (Rome)                  |
| Memory           | 28 - 440<sup>GiB     |                                                |
| Data Disks       | 8 - 32<sup>Disks     | 20000 - 80000<sup>IOPS</sup> / 200 - 800<sup>MBps    |
| Network          | 2 - 8 <sup>NICs       | 8000 - 32000<sup>Mbps                           |
| Accelerators     | 1 - 4<sup>GPUs</sup> | NVIDIA Tesla T4 16<sup>GiB </sup> <br> 16 - 64<sup>GiB</sup> per VM|