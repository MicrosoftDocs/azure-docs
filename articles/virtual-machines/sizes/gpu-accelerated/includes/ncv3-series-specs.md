---
title: NCv3 series specs include
description: Include file containing specifications of NCv3-series VM sizes.
author: mattmcinnes
ms.topic: include
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.date: 07/31/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
ms.custom: include file
---
| Part | Quantity <br><sup>Count Units | Specs <br><sup>SKU ID, Performance Units, etc.  |
|---|---|---|
| Processor      | 6 - 24 vCPUs       | Intel Xeon E5-2690 v4 (Broadwell) [x86-64]                               |
| Memory         | 112 - 448 GiB          |                                  |
| Local Storage  | 1 Disk           | 736 - 2948 GiB <br> IOPS (RR) <br> MBps (RR)                               |
| Remote Storage | 12 - 32 Disks    | 20000 - 80000 IOPS <br>200 - 800 MBps   |
| Network        | 4 - 8 NICs          |  Mbps                          |
| Accelerators   | 1 - 4              | Nvidia Tesla V100 GPU (16GB)                           |
