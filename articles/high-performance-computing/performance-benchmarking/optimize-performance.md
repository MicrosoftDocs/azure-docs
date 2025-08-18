---
title: "Optimizing Performance for Azure HPC and AI Virtual Machines"
description: Learn about enhancing the performance of HPC and AI workloads on Azure VM using Azure offered suite of tools and techniques.
author: padmalathas
ms.author: padmalathas
ms.date: 03/25/2025
ms.topic: concept-article
ms.service: azure-virtual-machines
ms.subservice: hpc
# Customer intent: As an HPC engineer, I want to utilize Azure's performance optimization tools for virtual machines, so that I can enhance the efficiency and effectiveness of my high-performance computing and AI applications.
---

# Optimizing Performance for Azure HPC and AI Virtual Machines

In the realm of high-performance computing (HPC) and artificial intelligence (AI), optimizing the performance of virtual machines (VMs) is crucial. Azure offers a suite of tools and techniques to ensure that HPC and AI workloads run efficiently on its platform. Two key aspects of this optimization are the pinning of processes and threads, and the optimal placement of MPI processes. 

This article provides a detailed guidance on how to enhance the performance of HPC and AI workloads on Azure VMs. It aims on the importance of process and thread pinning, optimal placement of MPI processes, and the use of Azure's tools like checkapppinning.py to achieve these optimizations. Also, it covers strategies for MPI process placement, performance metrics collection, and recommendations for different MPI implementations to ensure efficient and effective execution of HPC and AI applications on Azure's HPC specialty VMs. 

## Tool to Assist in Optimal Pinning of Processes/Threads for Azure HPC/AI VMs

To maximize the performance of HPC applications, it is essential to distribute processes and threads evenly across the VM, utilizing all sockets, NUMA domains, and L3 caches. This distribution ensures that memory bandwidth and floating-point performance are optimized. In hybrid parallel applications, each process has multiple threads. To maximize data sharing and reuse, it's best to keep a process and its threads on the same L3 cache.

Azure provides a tool called [**Check App Pinning**](https://github.com/Azure/azurehpc/tree/master/experimental/check_app_pinning_tool)  to help in this process. It helps view the VM CPU topology, check where parallel application processes, and threads are running, and generate optimal MPI and Slurm scheduler process affinity arguments. Using this tool, ensure that their HPC/AI applications are running in an optimal manner on Azure HPC specialty VMs.

Example: Using the tool
- View VM CPU topology
```python
# python check_app_pinning.py --view-topology
```
- Check process and thread placement
```python
# python check_app_pinning.py --check-placement
```
- Generate affinity arguments
```python
# python check_app_pinning.py --generate-affinity
```
By leveraging this tool, you can achieve better performance for the HPC and AI workloads on Azure, ensuring that the applications run efficiently and effectively.

### Optimal MPI process placement for Azure HB series VMs

For MPI applications, optimal pinning of processes can lead to significant performance improvements, especially for undersubscribed systems. The introduction of AMDs Chiplet design adds complexity to this process. In the Chiplet design, AMD integrates smaller CPUs together to provide a socket with 64 cores. To maximize performance, it is important to balance the amount of L3 cache and memory bandwidth per core.

Azure HB series VMs, such as the HB60rs and HBv2, come with multiple NUMA domains and cores. For instance, the HB60rs VM has 60 AMD Naples cores, with each socket containing 8 NUMA domains. When under subscribing the VM, you need to balance the L3 cache and memory bandwidth between cores. It can be achieved by selecting the appropriate number of cores per node and using specific MPI process placement strategies.

Example: MPI Process Placement
- Selecting number of cores per node
```bash
# mpirun -np 60 --map-by ppr:8:node --bind-to core my_mpi_application
```
- Distribute MPI Processes evenly across NUMA domains
```bash
# mpirun -np 60 --map-by ppr:8:node:pe=8 --bind-to numa my_mpi_application
```

### Performance metrics collection

Collecting performance metrics is essential for understanding and optimizing the performance of HPC and AI workloads. Azure provides several tools and methods for collecting these metrics.

Example: Collecting Performance Metrics
- Using Azure Monitor:
  * Set up Azure Monitor to collect metrics such as CPU utilization, memory usage, and network bandwidth.
  * Create a Log Analytics workspace and configure diagnostic settings to send metrics to the workspace.

- Using PerfCollect:
  * Install PerfCollect on your VM
  ```shell script
  # wget https://aka.ms/perfcollect -O perfcollect
  # chmod +x perfcollect
  # sudo ./perfcollect install
  ```
  * Start collecting metrics
  ```shell script
  # sudo ./perfcollect start mysession
  ```
  * Stop collecting metrics and generate a report
  ```shell script
  # sudo ./perfcollect stop mysession
  ```
### MPI Implementations

Different MPI implementations can have varying performance characteristics on Azure HPC/AI VMs. Common MPI implementations include OpenMPI, MPICH, and Intel MPI. Each implementation has its strengths and may perform differently based on the specific workload and VM configuration.

Recommendations for MPI Setup and Process Pinning
- OpenMPI 
  * Use the *--bind-to* and *--map-by* options to control process placement
    Example:
  ```bash
  # mpirun -np 60 --bind-to core --map-by ppr:8:node my_mpi_application
  ```
- MPICH
  * Use the HYDRA_BIND and HYDRA_RANK environment variables to control process placement
    Example:
  ```shell script
  # export HYDRA_BIND=core
  # export HYDRA_RANK=8
  # mpiexec -np 60 my_mpi_application
  ```
- Intel MPI
  * Use the I_MPI_PIN and I_MPI_PIN_DOMAIN environment variables to control process placement.
    Example:
  ```shell script
  # export I_MPI_PIN=1
  # export I_MPI_PIN_DOMAIN=socket
  # mpirun -np 60 my_mpi_application
  ```
  
By following these recommendations and using the tools and techniques provided by Azure, you can optimize the performance of their HPC and AI workloads, ensuring efficient and effective execution on Azure's HPC specialty VMs. 

## Resources:

- [Tool to assist in optimal pinning of processes/threads for Azure HPC/AI VMs](https://techcommunity.microsoft.com/blog/azurehighperformancecomputingblog/tool-to-assist-in-optimal-pinning-of-processesthreads-for-azure-hpcai-vm%e2%80%99s/2672201).
- [Optimal MPI Process Placement for Azure HB Series VMs](https://techcommunity.microsoft.com/blog/azurehighperformancecomputingblog/optimal-mpi-process-placement-for-azure-hb-series-vms/2450663).

