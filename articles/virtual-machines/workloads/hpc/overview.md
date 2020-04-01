---
title: High-performance computing on H-series VMs - Azure Virtual Machines
description: Learn about the features and capabilities of H-series VMs optimized for HPC.
author: vermagit
ms.author: amverma
tags: azure-resource-manager
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: overview
ms.date: 07/02/2019
---

# High-performance computing on H-series VMs

High-performance computing (HPC) on HB-series and HC-series VMs enable the most optimized HPC performance of any VMs on Azure. HPC optimized VMs are used to solve some of the most difficult mathematical problems such as: fluid dynamics, oil and gas simulations, and weather modeling.

This article covers some key features of HB-series and HC-series VMs, why these VMs perform well in HPC scenarios, and how to get started.

## Features and capabilities

HB-series and HC-series VMs are designed to provide the best HPC performance, message passing interface (MPI) scalability, and cost efficiency for HPC workloads.

### Message passing interface

HB-series and HC-series support almost all MPI types and versions. Some of the most common, supported MPI types are: OpenMPI, MVAPICH2, Platform MPI, Intel MPI, and all remote direct memory access (RDMA) verbs. For more information, see [Set up Message Passing Interface for HPC](setup-mpi.md).

### RDMA and InfiniBand

The RDMA interface is standard on HB-series and HC-series VMs. RDMA-capable instances communicate over an InfiniBand network, operating at enhanced data rates (EDR) for HB-series and HC-series virtual machines. RDMA-capable instances can boost the scalability and performance of some MPI applications.

The InfiniBand configuration supporting HB-series and HC-series VMs are non-blocking fat trees with a low-diameter design for consistent RDMA performance.

See [Enable InfiniBand](enable-infiniband.md) to learn more about setting up InfiniBand on your HB-series or HC-series VMs.

## Get started

First, decide which H-series VM you're going to use. For details about HPC optimized VMs, see [HB-series overview](hb-series-overview.md) and [HC-series overview](hc-series-overview.md). For specifications, see [High performance compute VM sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-hpc).

Once you've selected and created a VM for your application, you'll need to configure it by enabling InfiniBand. To learn how to enable InfiniBand on both Windows and Linux VMs, see [Enable InfiniBand](enable-infiniband.md).

A critical component of HPC workloads is MPI. HB-series and HC-series support almost all MPI types and versions. For more information, see [Set up Message Passing Interface for HPC](setup-mpi.md).

Once you've chosen your VM series, set up Infiniband and MPI, you're ready to start building your HPC workloads.

## Next steps

- Review the [HB-series overview](hb-series-overview.md) and [HC-series overview](hc-series-overview.md) to learn about key differences and specifications.

- For a higher level, architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/).
