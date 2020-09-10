---
title: HB-series VM size performance - Azure Virtual Machines | Microsoft Docs
description: Learn about performance testing results for HB-series VM sizes in Azure. 
services: virtual-machines
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 09/09/2020
ms.author: amverma
---

# HB-series virtual machine sizes

Several performance tests have been run on HB-series sizes. The following are some of the results of this performance testing.

| Workload                                        | HB                    |
|-------------------------------------------------|-----------------------|
| STREAM Triad                                    | ~260 GB/s (32-33 GB/s per CCX)  |
| High-Performance Linpack (HPL)                  | ~1,000 GigaFLOPS (Rpeak), ~860 GigaFLOPS (Rmax) |
| RDMA latency & bandwidth                        | 1.27 usec, 99.1 Gb/s   |
| FIO on local NVMe SSD                           | ~1.7 GB/s reads, ~1.0 GB/s writes      |  
| IOR on 4 * Azure Premium SSD (P30 Managed Disks, RAID0)**  | ~725 MB/s reads,  ~780 MB/writes   |


## MPI latency

MPI latency test from the OSU microbenchmark suite is run. Sample scripts are on [GitHub](https://github.com/Azure/azhpc-images/blob/04ddb645314a6b2b02e9edb1ea52f079241f1297/tests/run-tests.sh)

```bash
./bin/mpirun_rsh -np 2 -hostfile ~/hostfile MV2_CPU_MAPPING=[INSERT CORE #] ./osu_latency 
```
![MPI latency on Azure HB](./media/latency-hb.png)


## MPI bandwidth

MPI bandwidth test from the OSU microbenchmark suite is run. Sample scripts are on [GitHub](https://github.com/Azure/azhpc-images/blob/04ddb645314a6b2b02e9edb1ea52f079241f1297/tests/run-tests.sh)

```bash
./mvapich2-2.3.install/bin/mpirun_rsh -np 2 -hostfile ~/hostfile MV2_CPU_MAPPING=[INSERT CORE #] ./mvapich2-2.3/osu_benchmarks/mpi/pt2pt/osu_bw
```

![MPI bandwidth on Azure HB](./media/bandwidth-hb.png)


## Mellanox Perftest

The [Mellanox Perftest package](https://community.mellanox.com/s/article/perftest-package) has many InfiniBand tests such as latency (ib_send_lat) and bandwidth (ib_send_bw). An example command is below.

```console
numactl --physcpubind=[INSERT CORE #]  ib_send_lat -a
```

## Next steps

- Read about the latest announcements and some HPC examples and results at the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).
