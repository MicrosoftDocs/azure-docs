---
title: NVv4-series specs include
description: Include file containing specifications of NVv4-series VM sizes.
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
| Processor        | 4 - 32<sup>vCores   | AMD EPYC™ 7V12 (Rome)            |
| Memory           | 14 - 112<sup>GiB    |                                                |
| Data Disks       | 4 - 32<sup>Disks     | 6400 - 51200<sup>IOPS</sup> / 96 - 768<sup>MBps |
| Network          | 2 - 4<sup>NICs       |  1000 - 8000<sup>Mbps                         |
| Accelerators     | 1/8 - 1<sup>GPUs</sup> | [AMD Radeon™ Instinct MI25](https://www.amd.com/en/newsroom/press-releases/2020-3-25-2nd-gen-amd-epyc-processors-and-amd-radeon-instin.html) 16<sup>GiB </sup> <br>  2 - 16<sup>GiB </sup>per VM|