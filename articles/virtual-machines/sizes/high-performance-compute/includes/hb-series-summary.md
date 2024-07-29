---
title: HB-series V1 summary include
description: Include file containing a summary of the HB-series V1 size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/19/2024
ms.author: mattmcinnes
ms.custom: include file
---
HB-series VMs are optimized for applications that are driven by memory bandwidth, such as fluid dynamics, explicit finite element analysis, and weather modeling. HB VMs feature 60 AMD EPYC™ 7551 processor cores, 4 GB of RAM per CPU core, and no simultaneous multithreading. An HB VM provides up to 260 GB/sec of memory bandwidth. HB-series VMs feature 100 Gb/sec Mellanox EDR InfiniBand. These VMs are connected in a nonblocking fat tree for optimized and consistent RDMA performance. These VMs support Adaptive Routing and the Dynamic Connected Transport (DCT, in addition to standard RC and UD transports). These features enhance application performance, scalability, and consistency, and their usage is recommended.