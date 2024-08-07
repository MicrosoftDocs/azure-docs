---
title: NC_A100_v4 series specs include
description: Include file containing specifications of NC_A100_v4-series VM sizes.
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
| Processor      | 24 - 96 vCPUs       | AMD EPYC 7V13 (Milan) [x86-64]                               |
| Memory         | 220 - 880 GiB          |                                  |
| Local Storage  | 1 Temp Disk <br> 1 - 4 NVMe Disks          | 64 - 256 GiB Temp Disk <br> 960 GiB NVMe Disks                         |
| Remote Storage | 8 - 32 Disks    | 30000 - 120000 IOPS <br>1000 - 4000 MBps   |
| Network        | 2 - 8 NICs          | 20,000 - 80,000 Mbps                          |
| Accelerators   | 1 - 4 GPUs              | Nvidia PCIe A100 GPU (80GB)                                  |
