---
title: ND-series specs include
description: Include file containing specifications of ND-series VM sizes.
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
| Processor        | 6 - 24<sup>vCores   | Intel® Xeon® E5-2690 v4 (Broadwell)            |
| Memory           | 112 - 448<sup>GiB    |                                                |
| Data Disks       | 12 - 32<sup>Disks     |  20000 - 80000<sup>IOPS</sup> / 200 - 800<sup>MBps    |
| Network          | 4 - 8<sup>NICs       |                                                  |
| Accelerators     | 1 - 4<sup>GPUs</sup> | [NVIDIA Tesla P40](https://images.nvidia.com/content/pdf/tesla/184427-Tesla-P40-Datasheet-NV-Final-Letter-Web.pdf) 24<sup>GiB </sup> <br> 24 - 96<sup>GiB</sup> per VM |