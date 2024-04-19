---
title: NVv3-series specs include
description: Include file containing specifications of NVv3-series VM sizes.
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
| Processor        | 12 - 48<sup>vCores   | Intel® Xeon® E5-2690 v4 (Broadwell)            |
| Memory           | 112 - 448<sup>GiB    |                                                |
| Data Disks       | 12 - 32<sup>Disks     | 20000 - 80000<sup>IOPS</sup> / 200 - 800<sup>MBps |
| Network          | 1 - 4<sup>NICs       |  6000 - 24000<sup>Mbps                         |
| Accelerators     | 1 - 4<sup>GPUs</sup> | [NVIDIA Tesla M60](https://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) 8<sup>GiB </sup> <br> 8 - 32<sup>GiB</sup> per VM|