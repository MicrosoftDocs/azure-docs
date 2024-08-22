---
title: HBv2-series summary include file
description: Include file for HBv2-series summary
author: mattmcinnes
ms.topic: include
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.date: 08/01/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
ms.custom: include file
---
HBv2-series VMs are optimized for applications that are driven by memory bandwidth, such as fluid dynamics, finite element analysis, and reservoir simulation. HBv2 VMs feature 120 AMD EPYC 7V12 processor cores, 4 GB of RAM per CPU core, and no simultaneous multithreading. Each HBv2 VM provides up to 350 GB/s of memory bandwidth, and up to 4 teraFLOPS of FP64 compute. HBv2-series VMs feature 200 Gb/sec Mellanox HDR InfiniBand. These VMs are connected in a non-blocking fat tree for optimized and consistent RDMA performance. These VMs support Adaptive Routing and the Dynamic Connected Transport (DCT, in addition to standard RC and UD transports). These features enhance application performance, scalability, and consistency, and their usage is recommended.
