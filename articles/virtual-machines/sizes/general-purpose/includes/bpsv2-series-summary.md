---
title: Bpsv2-series summary include
description: Include file containing a summary of the Bpsv2-series size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/11/2024
ms.author: mattmcinnes
ms.custom: include file
---
The Bpsv2-series virtual machines are based on the Arm architecture, featuring the Ampere® Altra® Arm-based processor operating at 3.0 GHz, delivering outstanding price-performance for general-purpose workloads, These virtual machines offer a range of VM sizes, from 0.5 GiB to up to 4 GiB of memory per vCPU, to meet the needs of applications that do not need the full performance of the CPU continuously, such as development and test servers, low traffic web servers, small databases, micro services, servers for proof-of-concepts, build servers, and code repositories. These workloads typically have burstable performance requirements. The Bpsv2-series VMs provides you with the ability to purchase a VM size with baseline performance that can build up credits when it is using less than its baseline performance. When the VM has accumulated credits, the VM can burst above the baseline using up to 100% of the vCPU when your application requires higher CPU performance.

Bpsv2 VMs offer up to 16 vCPU and 64 GiB of RAM and are optimized for scale-out and most enterprise workloads. Bpsv2-series virtual machines support Standard SSD, Standard HDD, Premium SSD disk types with no local-SSD support (i.e. no local or temp disk) and you can also attach Ultra Disk storage based on its regional availability. Disk storage is billed separately from virtual machines.
