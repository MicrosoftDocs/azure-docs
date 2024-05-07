---
title: HBv4-series summary include
description: Include file containing a summary of the HBv4-series size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/19/2024
ms.author: mattmcinnes
ms.custom: include file
---
HBv4-series VMs are optimized for various HPC workloads such as computational fluid dynamics, finite element analysis, frontend and backend EDA, rendering, molecular dynamics, computational geoscience, weather simulation, and financial risk analysis. HBv4 VMs feature up to 176 AMD EPYC™ 9V33X ("Genoa-X") CPU cores with AMD's 3D V-Cache, clock frequencies up to 3.7 GHz, and no simultaneous multithreading. HBv4-series VMs also provide 768 GB of RAM, 2.3 GB L3 cache. The 2.3 GB L3 cache per VM can deliver up to 5.7 TB/s of bandwidth to amplify up to 780 GB/s of bandwidth from DRAM, for a blended average of 1.2 TB/s of effective memory bandwidth across a broad range of customer workloads. The VMs also provide up to 12 GB/s (reads) and 7 GB/s (writes) of block device SSD performance. All HBv4-series VMs feature 400-Gb/s NDR InfiniBand from NVIDIA Networking to enable supercomputer-scale MPI workloads. These VMs are connected in a nonblocking fat tree for optimized and consistent RDMA performance. NDR continues to support features like Adaptive Routing and the Dynamically Connected Transport (DCT). This newest generation of InfiniBand also brings greater support for offload of MPI collectives, optimized real-world latencies due to congestion control intelligence, and enhanced adaptive routing capabilities. These features enhance application performance, scalability, and consistency, and their usage is recommended.