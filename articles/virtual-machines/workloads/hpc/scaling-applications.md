---
title: Scaling HPC applications on Azure | Microsoft Docs
description: Learn how to scale HPC applications on Azure VMs. 
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

# Scaling applications

At this time, the following is recommended for optimal application scaling efficiency, performance, and consistency:

- Pin processes to cores 0-59 using a sequential pinning approach (as opposed to an auto-balance approach). 
- Binding by Numa/Core/HwThread is better than default binding.
- For hybrid parallel applications (OpenMP+MPI), use 4 threads and 1 MPI rank per CCX.
- For pure MPI applications, experiment with 1-4 MPI ranks per CCX for optimal performance.
- Some applications with extreme sensitivity to memory bandwidth may benefit from using a reduced number of cores per CCX. For these applications, using 3 or 2 cores per CCX may reduce memory bandwidth contention and yield higher real-world performance or more consistent scalability. MPI Allreduce, in particular, may benefit from this.
- For significantly larger scale runs, it is recommended to use UD or hybrid RC+UD transports. Many MPI libraries/runtime libraries do this internally (like UCX or MVAPICH2). Please check your transport configurations for large scale runs.

**Next steps**

Learn more about [HPC](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) on Azure.
