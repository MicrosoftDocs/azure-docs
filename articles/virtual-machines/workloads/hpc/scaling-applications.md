---
title: Scaling applications for high-performance computing in Azure | Microsoft Docs
description: Learn how to scale high-performance computing applications for use on Azure VMs. 
services: virtual-machines
documentationcenter: ''
author: githubname
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 02/28/2019
ms.author: msalias
---

# Scaling applications

At this time, it is recommended the following for optimal application scaling efficiency, performance, and consistency:

- Pin processes to cores 0-59 using a sequential pinning approach (as opposed to an auto-balance approach). 
	Example: OpenFOAM with OpenMPI
	Binding (Numa/Core/HwThread) is better than default binding
	Small cases (~10K cells on 1 node): 22% improvement
	Large cases(~10M cells on 1 node): deadlocked with default binding

- For applications that support hybrid modes (OpenMP+MPI), use 4 threads and 1-2 MPI ranks per CCX
- We support MPICH-CH4, OpenMPI , MVAPICH2, Platform MPI, and Intel MPI for HB-series VMs.
- For optimal performance and scaling, use MPICH-CH4 (bit.ly/2zXzK2e).
- Some applications with extreme sensitivity to memory bandwidth may benefit from using a reduced number of cores per CCX. For these applications, using 3 or 2 cores per CCX may reduce memory bandwidth contention and yield higher real-world performance or more consistent scalability. MPI Allreduce, in particular, may benefit from this.
- For significantly larger scale runs, it is recommended to use UD or hybrid RC+UD transports. Many MPI libraries/runtime libraries do this internally (like UCX or MVAPICH2). Please check your transport configurations for large scale runs.

**Next steps**

Learn more about [high-performance computing](../../linux/high-performance-computing.md) in Azure.