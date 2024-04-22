---
title: HBv3-series summary include
description: Include file containing a summary of the HBv3-series size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/19/2024
ms.author: mattmcinnes
ms.custom: include file
---
HBv3-series VMs are optimized for HPC applications such as fluid dynamics, explicit and implicit finite element analysis, weather modeling, seismic processing, reservoir simulation, and RTL simulation. HBv3 VMs feature up to 120 AMD EPYC™ 7V73X (Milan-X) CPU cores, 448 GB of RAM, and no simultaneous multithreading. HBv3-series VMs also provide 350 GB/sec of memory bandwidth (amplified up to 630 GB/s), up to 96 MB of L3 cache per core (1.536 GB total per VM), up to 7 GB/s of block device SSD performance, and clock frequencies up to 3.5 GHz. All HBv3-series VMs feature 200 Gb/sec HDR InfiniBand from NVIDIA Networking to enable supercomputer-scale MPI workloads. These VMs are connected in a nonblocking fat tree for optimized and consistent RDMA performance. The HDR InfiniBand fabric also supports Adaptive Routing and the Dynamic Connected Transport (DCT, in addition to standard RC and UD transports). These features enhance application performance, scalability, and consistency.