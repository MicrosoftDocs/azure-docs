---
title: NVadsA10 v5-series specs include
description: Include file containing specifications of NVadsA10 v5-series VM sizes.
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
| Processor        | 6 - 72<sup>vCores   | AMD EPYC™ 74F3V (Milan)                |
| Memory           | 55 - 880<sup>GiB    |                                                |
| Data Disks       | 4 - 32<sup>Disks     | 20000 - 80000<sup>IOPS</sup> / 200 - 800<sup>MBps |
| Network          | 2 - 8<sup>NICs       |  5000 - 80000<sup>Mbps                         |
| Accelerators     | 1/6 - 2<sup>GPUs</sup>  | [NVIDIA A10](https://www.nvidia.com/en-us/data-center/products/a10-gpu/) 24<sup>GiB </sup> <br> 2 - 48<sup>GiB</sup> per VM |