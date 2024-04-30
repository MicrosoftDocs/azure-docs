---
title: HBv2-series VM overview - Azure Virtual Machines | Microsoft Docs
description: Learn about the HBv2-series VM size in Azure.
services: virtual-machines
ms.custom:
ms.service: virtual-machines
ms.subservice: hpc
ms.topic: article
ms.date: 04/08/2024
ms.reviewer: cynthn
ms.author: jushiman
author: ju-shim
---


# HBv2 series virtual machine overview

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and plan accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets.

Maximizing high performance compute (HPC) application performance on AMD EPYC requires a thoughtful approach memory locality and process placement. Below we outline the AMD EPYC architecture and our implementation of it on Azure for HPC applications. We use the term **pNUMA** to refer to a physical NUMA domain, and **vNUMA** to refer to a virtualized NUMA domain.

Physically, an [HBv2-series](hbv2-series.md) server is 2 * 64-core EPYC 7V12 CPUs for a total of 128 physical cores. Simultaneous Multithreading (SMT) is disabled on HBv2. These 128 cores are divided into 16 sections (8 per socket), each section containing 8 processor cores. Azure HBv2 servers also run the following AMD BIOS settings:

```output
Nodes per Socket (NPS) = 2
L3 as NUMA = Disabled
NUMA domains within VM OS = 4
C-states = Enabled
```

As a result, the server boots with 4 NUMA domains (2 per socket) each 32 cores in size. Each NUMA has direct access to 4 channels of physical DRAM operating at 3200 MT/s.

To provide room for the Azure hypervisor to operate without interfering with the VM, we reserve 8 physical cores per server.

## VM topology

We reserve these 8 hypervisor host cores symmetrically across both CPU sockets, taking the first 2 cores from specific Core Complex Dies (CCDs) on each NUMA domain, with the remaining cores for the HBv2-series VM.
The CCD boundary isn't equivalent to a NUMA boundary. On HBv2, a group of four consecutive (4) CCDs is configured as a NUMA domain, both at the host server level and within a guest VM. Thus, all HBv2 VM sizes expose 4 NUMA domains that appear to an OS and application. 4 uniform NUMA domains, each with different number of cores depending on the specific [HBv2 VM size](hbv2-series.md).

Process pinning works on HBv2-series VMs because we expose the underlying silicon as-is to the guest VM. We strongly recommend process pinning for optimal performance and consistency.


## Hardware specifications

| Hardware Specifications          | HBv2-series VM                   |
|----------------------------------|----------------------------------|
| Cores                            | 120 (SMT disabled)               |
| CPU                              | AMD EPYC 7V12                    |
| CPU Frequency (non-AVX)          | ~3.1 GHz (single + all cores)    |
| Memory                           | 4 GB/core (480 GB total)         |
| Local Disk                       | 960 GiB NVMe (block), 480 GB SSD (page file) |
| Infiniband                       | 200 Gb/s HDR Mellanox ConnectX-6 |
| Network                          | 50 Gb/s Ethernet (40 Gb/s usable) Azure second Gen SmartNIC |


## Software specifications

| Software Specifications     | HBv2-series VM                                            |
|-----------------------------|-----------------------------------------------------------|
| Max MPI Job Size            | 36000 cores (300 VMs in a single virtual machine scale set with singlePlacementGroup=true) |
| MPI Support                 | HPC-X, Intel MPI, OpenMPI, MVAPICH2, MPICH, Platform MPI  |
| Additional Frameworks       | UCX, libfabric, PGAS |
| Azure Storage Support       | Standard and Premium Disks (maximum 8 disks) |
| OS Support for SRIOV RDMA   | CentOS/RHEL 7.9+, Ubuntu 18.04+, SLES 12 SP5+, WinServer 2016+  |
| Orchestrator Support        | CycleCloud, Batch, AKS; [cluster configuration options](sizes-hpc.md#cluster-configuration-options)  |

> [!NOTE]
> Windows Server 2012 R2 is not supported on HBv2 and other VMs with more than 64 (virtual or physical) cores. For more information, see [Supported Windows guest operating systems for Hyper-V on Windows Server](/windows-server/virtualization/hyper-v/supported-windows-guest-operating-systems-for-hyper-v-on-windows). 

## Next steps

- For more information about [AMD EPYC architecture](https://bit.ly/2Epv3kC) and [multi-chip architectures](https://bit.ly/2GpQIMb), see the [HPC Tuning Guide for AMD EPYC Processors](https://bit.ly/2T3AWZ9).
- For latest announcements on HPC workload examples, and performance results see [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
