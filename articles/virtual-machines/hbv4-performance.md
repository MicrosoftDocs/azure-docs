---
title: HBv4-series VM sizes performance and scalability
description: Learn about performance and scalability of HBv4-series VM sizes in Azure.  
services: virtual-machines 
ms.service: virtual-machines 
ms.subservice: hpc
ms.workload: infrastructure-services 
ms.topic: article 
ms.date: 05/22/2023 
ms.reviewer: cynthn
ms.author: padmalathas
author: padmalathas
---

# HBv4-series virtual machine performance

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Performance expectations using common HPC microbenchmarks are as follows:

| Workload                                        | HBv4                                                              |
|-------------------------------------------------|-------------------------------------------------------------------|
| STREAM Triad                                    | 750-780 GB/s of DDR5, up to 5.7 TB/s of 3D V-Cache bandwidth                                                |
| High-Performance Linpack (HPL)                  | Up to 7.6 TF (Rpeak, FP64) for 144-core VM size                   |
| RDMA latency & bandwidth                        | < 2 microseconds (1 byte), 400 Gb/s (one-way)                     |
| FIO on local NVMe SSDs (RAID0)                  | 12 GB/s reads, 7 GB/s writes; 186k IOPS reads, 201k IOPS writes |

## Process pinning

[Process pinning](./workloads/hpc/compiling-scaling-applications.md#process-pinning) works well on HBv4-series VMs because we expose the underlying silicon as-is to the guest VM. We strongly recommend process pinning for optimal performance and consistency.

## Memory bandwidth test 

The STREAM memory test can be run using the scripts in this GitHub repository. 
```bash
git clone https://github.com/Azure/woc-benchmarking 
cd woc-benchmarking/apps/hpc/stream/ 
sh build_stream.sh 
sh stream_run_script.sh $PWD “hbrs_v4” 
```
## Compute performance test 

The HPL benchmark can be run using the script in this GitHub repository. 
```bash
git clone https://github.com/Azure/woc-benchmarking 
cd woc-benchmarking/apps/hpc/hpl 
sh hpl_build_script.sh 
sh hpl_run_scr_hbv4.sh $PWD 
```

## MPI latency

The MPI latency test from the OSU microbenchmark suite can be executed as shown. Sample scripts are on [GitHub](https://github.com/Azure/azurehpc/tree/master/apps/health_checks).

```bash
module load mpi/hpcx 
mpirun -np 2 --host $src,$dst --map-by node -x LD_LIBRARY_PATH $HPCX_OSU_DIR/osu_latency
```

## MPI bandwidth
The MPI bandwidth test from the OSU microbenchmark suite can be executed per below. Sample scripts are on [GitHub](https://github.com/Azure/azurehpc/tree/master/apps/health_checks).

```bash
module load mpi/hpcx 
mpirun -np 2 --host $src,$dst --map-by node -x LD_LIBRARY_PATH $HPCX_OSU_DIR/osu_bw
```
[!NOTE]
Define source(src) and destination(dst).

## Mellanox Perftest
The [Mellanox Perftest package](https://github.com/linux-rdma/perftest) has many InfiniBand tests such as latency (ib_send_lat) and bandwidth (ib_send_bw). An example command is below.

```console
numactl --physcpubind=[INSERT CORE #]  ib_send_lat -a
```

> [!NOTE]
> The NUMA node affinity for InfiniBand NIC is NUMA0.

## Next steps
- Learn about [scaling MPI applications](./workloads/hpc/compiling-scaling-applications.md).
- Review the performance and scalability results of HPC applications on the HBv4 VMs at the [TechCommunity article](https://techcommunity.microsoft.com/t5/azure-compute/hpc-performance-and-scalability-results-with-azure-hbv4-vms/bc-p/2235843).
- Read about the latest announcements, HPC workload examples, and performance results at the [Azure HPC Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/bg-p/AzureHighPerformanceComputingBlog).
- For a higher-level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).


