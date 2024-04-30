---
title: NCads-h100-v5-series specs include
description: Include file containing specifications of NCads-h100-v5-series VM sizes.
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
| Processor        | 40 - 80<sup>vCores   | AMD EPYC™ (Genoa)                   |
| Memory           | 320 - 640<sup>GiB    |                                                |
| Data Disks       | 8 - 16<sup>Disks     | 100000 - 240000<sup>IOPS</sup> / 3000 - 7000<sup>MBps                                                |
| Network          | 2 - 4<sup>NICs       | 40000 - 80000<sup>Mbps </sup>                                |
| Accelerators     | 1 - 2<sup>GPUs</sup> | NVIDIA H100 NVL 94<sup>GiB </sup> <br> 94 - 188<sup>GiB</sup> per VM|