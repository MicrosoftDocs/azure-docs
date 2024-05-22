---
title: B family VM size series summary include
description: Include file containing a summary of the 'B' family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/19/2024
ms.author: mattmcinnes
ms.custom: include file
---
The 'B' family of VM size series are one of Azure's general purpose VM instances. While traditional Azure virtual machines provide fixed CPU performance, B-series virtual machines are the only VM type that use credits for CPU performance provisioning. B-series VMs utilize a CPU credit model to track how much CPU is consumed - the virtual machine accumulates CPU credits when a workload is operating below the base CPU performance threshold and, uses credits when running above the base CPU performance threshold until all of its credits are consumed. Upon consuming all the CPU credits, a B-series virtual machine is throttled back to its base CPU performance until it accumulates the credits to CPU burst again.