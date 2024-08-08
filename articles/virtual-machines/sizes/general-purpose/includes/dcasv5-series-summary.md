---
title: DCasv5-series summary include file
description: Include file for DCasv5-series summary
author: mattmcinnes
ms.topic: include
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.date: 07/30/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
ms.custom: include file
---
DCasv5-series VMs offer a combination of vCPU and memory for most production workloads. These confidential VMs use AMD's third-Generation EPYC™  7763v processor in a multi-threaded configuration with up to 256 MB L3 cache. These processors can achieve a boosted maximum frequency of 3.5 GHz. Both series offer Secure Encrypted Virtualization-Secure Nested Paging (SEV-SNP). SEV-SNP provides hardware-isolated VMs that protect data from other VMs, the hypervisor, and host management code. Confidential VMs offer hardware-based VM memory encryption. These series also offer OS disk pre-encryption before VM provisioning with different key management solutions. These VMs with no local disk provide a better value proposition for workloads where you don't need a local temporary disk. For more information, see the FAQ for Azure VM sizes with no local temporary disk.
