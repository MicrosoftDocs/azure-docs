---
title: HBv3-series VM sizes performance and scalability
description: Learn about performance and scalability of HBv3-series VM sizes in Azure.
services: virtual-machines
ms.service: virtual-machines
ms.subservice: hpc
ms.custom:
ms.topic: article
ms.date: 03/04/2023
ms.reviewer: cynthn
ms.author: jushiman
author: ju-shim
---

# HBv3-series virtual machine performance

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Performance expectations using common HPC microbenchmarks are as follows:

| Workload                                        | HBv3                                                              |
|-------------------------------------------------|-------------------------------------------------------------------|
| STREAM Triad                                    | 330-350 GB/s (amplified up to 630 GB/s)                                     |
| High-Performance Linpack (HPL)                  | 4 TF (Rpeak, FP64), 8 TF (Rpeak, FP32) for 120-core VM size               |
| RDMA latency & bandwidth                        | 1.2 microseconds (1 byte), 192 GB/s (one-way)                                        |
| FIO on local NVMe SSDs (RAID0)                  | 7 GB/s reads, 3 GB/s writes; 186k IOPS reads, 201k IOPS writes |

## Process pinning

[Process pinning](compiling-scaling-applications.md#process-pinning) works well on HBv3-series VMs because we expose the underlying silicon as-is to the guest VM. We strongly recommend process pinning for optimal performance and consistency.

## MPI latency

The MPI latency test from the OSU microbenchmark suite can be executed as shown. Sample scripts are on [GitHub](https://github.com/Azure/azhpc-images/blob/04ddb645314a6b2b02e9edb1ea52f079241f1297/tests/run-tests.sh).

```bash
./bin/mpirun_rsh -np 2 -hostfile ~/hostfile MV2_CPU_MAPPING=[INSERT CORE #] ./osu_latency
```

## MPI bandwidth
The MPI bandwidth test from the OSU microbenchmark suite can be executed per below. Sample scripts are on [GitHub](https://github.com/Azure/azhpc-images/blob/04ddb645314a6b2b02e9edb1ea52f079241f1297/tests/run-tests.sh).
```bash
./mvapich2-2.3.install/bin/mpirun_rsh -np 2 -hostfile ~/hostfile MV2_CPU_MAPPING=[INSERT CORE #] ./mvapich2-2.3/osu_benchmarks/mpi/pt2pt/osu_bw
```
## Mellanox Perftest
The [Mellanox Perftest package](https://community.mellanox.com/s/article/perftest-package) has many InfiniBand tests such as latency (ib_send_lat) and bandwidth (ib_send_bw). An example command is below.
```bash
numactl --physcpubind=[INSERT CORE #]  ib_send_lat -a
```
## Next steps
- Learn about [scaling MPI applications](compiling-scaling-applications.md).
- Review the performance and scalability results of HPC applications on the HBv3 VMs at the [TechCommunity article](https://techcommunity.microsoft.com/t5/azure-compute/hpc-performance-and-scalability-results-with-azure-hbv3-vms/bc-p/2235843).
- Read about the latest announcements, HPC workload examples, and performance results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher-level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
