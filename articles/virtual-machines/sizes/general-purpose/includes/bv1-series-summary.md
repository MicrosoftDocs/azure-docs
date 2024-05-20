---
title: B-series burstable summary include
description: Include file containing a summary of the B-series burstable size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/11/2024
ms.author: mattmcinnes
ms.custom: include file
---
The B-series VMs can be deployed on a variety of hardware types and processors, so competitive bandwidth allocation is provided. B-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake), the Intel® Xeon® Platinum 8272CL (Cascade Lake), the Intel® Xeon® 8171M 2.1 GHz (Skylake), the Intel® Xeon® E5-2673 v4 2.3 GHz (Broadwell), or the Intel® Xeon® E5-2673 v3 2.4 GHz (Haswell) processors.  B-series VMs are ideal for workloads that do not need the full performance of the CPU continuously, like web servers, proof of concepts, small databases and development build environments. These workloads typically have burstable performance requirements. To determine the physical hardware on which this size is deployed, query the virtual hardware from within the virtual machine. The B-series provides you with the ability to purchase a VM size with baseline performance that can build up credits when it is using less than its baseline. When the VM has accumulated credits, the VM can burst above the baseline using up to 100% of the vCPU when your application requires higher CPU performance.
