---
title: Preview of the HC-series in Azure | Microsoft Docs
description: Learn about the preview support for the HC-series VM size in Azure. 
services: virtual-machines
documentationcenter: ''
author: githubname
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 04/25/2019
ms.author: msalias
---

# HC-Series overview

# HB-Series overview

Maximizing HPC application performance on AMD EPYC requires a thoughtful approach memory locality and process placement. Below, we outline the AMD EPYC architecture and our implementation of it on Azure for HPC applications. We will use the term “pNUMA” to refer to a physical NUMA domain, and “vNUMA” to refer to a virtualized NUMA domain.

Physically, a HB-series is 2 * 32-core EPYC 7551 CPUs for a total of 64 physical cores. These 64 cores are divided into 16 pNUMA domains (8 per socket), each of which is 4 cores and known as a “CPU Complex” (or “CCX”). Each CCX has its own L3 cache, which is how an OS will see a pNUMA/vNUMA boundary. A pair of adjacent CCXs shares access to 2-channels of physical DRAM (32 GB of DRAM in HB-series servers).

To provide room for the Azure hypervisor to operate without interfering with the VM, we reserve physical pNUMA domain 0 (the first CCX). We then assign pNUMA domains 1-15 (the remaining CCX units) for the VM. The VM will see:

`(15 vNUMA domains) * (4 cores/vNUMA) = 60` cores per VM

The VM, itself, doesn't know that pNUMA 0 wasn't given to it. The VM understands pNUMA 1-15 as vNUMA 0-14, with 7 vNUMA on vSocket 0 and 8 vNUMA on vSocket 1. While this is asymmetrical, your OS should boot and operate normally. Later in this guide, we instruct how best to run MPI applications on this asymmetric NUMA layout.

Process pinning will work on HB-series VMs because we expose the underlying silicon as-is to the guest VM. We strongly recommend process pinning for optimal performance and consistency.

More on AMD EPYC architecture at: https://bit.ly/2GpQIMb and https://bit.ly/2Epv3kC, and an HPC Tuning Guide for AMD EPYC Processors at: https://bit.ly/2T3AWZ9

Topology of EPYC 2P Server

![Topology of EPYC 2P Server](./media/hb-series-overview/dual-socket.png)

Segregation of cores reserved for Azure Hypervisor and HB-series VM
![Segregation of cores reserved for Azure Hypervisor and HB-series VM](./media/hb-series-overview/segregation-of-cores.png)

-------------------------------------------------------------------------------

Maximizing HPC application performance on Intel Xeon Scalable Processors requires a thoughtful approach to process placement on this new architecture. Here, we outline our implementation of it on Azure HC-series VMs for HPC applications. We will use the term “pNUMA” to refer to a physical NUMA domain, and “vNUMA” to refer to a virtualized NUMA domain. Similarly, we will use the term “pCore” to refer to physical CPU cores, and “vCore” to refer to virtualized CPU cores.

Physically, a HC server is 2 * 24-core Intel Xeon Platinum 8168 CPUs for a total of 48 physical cores. Each CPU is a single pNUMA domain, and has unified access to 6 channels of DRAM. Intel Xeon Platinum CPUs feature a 4x larger L2 cache than in prior generations (256KB/core → 1 MB/core), while also reducing the L3 cache compared to prior Intel CPUs (2.5 MB/core → 1.375 MB/core).

The above topology carries over to the HC-series hypervisor configuration, as well. To provide room for the Azure hypervisor to operate without interfering with the VM, we reserve pCores 0-1 and 24-25 (i.e. the first 2 pCores on each socket). We then assign pNUMA domains all remaining cores to the VM. Thus, the VM will see:

`(2 vNUMA domains) * (22 cores/vNUMA)` = 44 cores per VM

The VM, itself, has no awareness that pCores 0-1 and 24-25 were not given to it. Thus, it exposes the each vNUMA as if it natively had 22 cores.

Intel Xeon Platinum, Gold, and Silver CPUs also introduce an on-die 2D mesh network for communication within and external to the CPU socket. We strongly recommend process pinning for optimal performance and consistency. Process pinning will work on HC-series VMs because the underlying silicon is exposed as-is to the guest VM.

More on Intel Xeon SP architecture at: https://bit.ly/2RCYkiE

## Hardware specifications

| Hardware Specifications          | HC-series VM                     |
|----------------------------------|----------------------------------|
| Cores                            | 60 (SMT disabled)                |
| CPU                              | AMD EPYC 7551*                   |
| CPU Frequency (non-AVX)          | ~2.55 GHz (single + all cores)   |
| Memory                           | 4 GB/core (240 total)            |
| Local Disk                       | 700 GB NVMe                      |
| Infiniband                       | 100 Gb EDR Mellanox ConnectX-5** |
| Network                          | 50 Gb Ethernet (40 Gb usable) Azure 2nd Gen SmartNIC*** |

## Software specifications

| Software Specifications     | HC-series VM          |
|-----------------------------|-----------------------|
| Max MPI Job Size            | 6000 cores  (100 VMSS) 12000 cores (200 VMSS)  |
| MPI Support                 | MVAPICH2, OpenMPI, MPICH, Platform MPI, Intel MPI  |
| Additional Frameworks       | Unified Communication X, libfabric, PGAS |
| Azure Storage Support       | Std + Premium (max 4 disks) |
| OS Support for SRIOV RDMA   | CentOS/RHEL 7.6+, SLES 12 SP4+, WinServer 2016+  |
| Azure CycleCloud Support    | Yes                         |
| Azure Batch Support         | Yes                         |