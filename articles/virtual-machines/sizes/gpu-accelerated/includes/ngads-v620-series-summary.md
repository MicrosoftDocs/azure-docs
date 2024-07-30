---
title: NGads-v620-series summary include
description: Include file containing a summary of the NGads-V620-series size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/18/2024
ms.author: mattmcinnes
ms.custom: include file
---
The NGads V620 series are GPU-enabled virtual machines with CPU, memory resources and storage resources balanced to generate and stream high quality graphics for a high performance, interactive gaming experience hosted in Azure. They're powered by [AMD Radeon™ PRO V620 GPUs](https://www.amd.com/en/newsroom/press-releases/2021-11-4-amd-radeon-pro-v620-gpu-delivers-powerful-multi-.html) and AMD EPYC 7763 (Milan) CPUs. The AMD Radeon PRO V620 GPUs have a maximum frame buffer of 32 GB, which can be divided up to four ways through hardware partitioning. The AMD EPYC CPUs have a base clock speed of 2.45 GHz and a boost speed of 3.5Ghz. VMs are assigned full cores instead of threads, enabling full access to AMD’s powerful “Zen 3” cores. NGads instances come in four sizes, allowing customers to right-size their gaming environments for the performance and cost that best fits their business needs. The NG-series virtual machines feature partial GPUs to enable you to pick the right-sized virtual machine for GPU accelerated graphics applications and virtual desktops. The vm sizes start with 1/4 of a GPU with 8-GiB frame buffer up to a full GPU with 32-GiB frame buffer. The NGads VMs also feature Direct Disk NVMe ranging from 1 to 4x 960 GB disks per VM.