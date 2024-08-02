---
title: NCads_H100_v5 series specs include
description: Include file containing specifications of NCads_H100_v5-series VM sizes.
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 07/31/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
ms.custom: include file
---
| Part | Quantity <br><sup>Count Units | Specs <br><sup>SKU ID, Performance Units, etc.  |
|---|---|---|
| Processor      | 40 - 80 vCPUs       | AMD EPYC (Genoa) [x86-64]                               |
| Memory         | 320 - 640 GiB          |                                  |
| Local Storage  | 1 Disk           | 3576 - 7152 GiB <br> IOPS (RR) <br> MBps (RR)                               |
| Remote Storage | 8 - 16 Disks    | 100000 - 240000 IOPS <br>3000 - 7000 MBps   |
| Network        | 2 - 4 NICs          | 40,000 - 80,000 Mbps                          |
| Accelerators   | 1 - 2 GPUs              | Nvidia PCIe H100 GPU (94GB)                     |
