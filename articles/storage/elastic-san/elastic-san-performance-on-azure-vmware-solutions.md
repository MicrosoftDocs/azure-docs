---
title: Elastic SAN datastore performance on Azure VMware solutions
description: Benchmark results and guidance for Azure Elastic SAN datastores used with Azure VMware Solution, including IOPS- and throughput-intensive workloads.
author: eshanchomsft
ms.author: rogarana
ms.topic: concept-article
ms.service: azure-elastic-san-storage
ms.date: 02/26/2026
---

# Elastic SAN datastore performance on Azure VMware Solution

This article describes the performance characteristics of Azure Elastic SAN datastores when used with Azure VMware Solution. It presents benchmark results for common workload patterns and provides enough configuration and test details to help you compare these results with your own environments results.

The results in this article are intended as **reference only**, not as guaranteed performance targets. Actual performance changes depending on workload characteristics, VM configuration, and Elastic SAN provisioning.

## Workload categories

This article covers two common storage workload categories:

- **I/O‑intensive workloads**
  - Transactional or metadata‑driven workloads are common examples of I/O‑intensive workloads. These workloads have small, random I/O patterns that are typically read‑heavy.

- **Throughput‑intensive workloads**
  - Backup, scanning, analytics, and read‑ahead workloads are common examples of throughput‑intensive workloads. These workloads generate large, sequential I/O patterns.

All tests use a single Elastic SAN–backed AVS datastore, sized and configured as described in the following sections.

## Benchmark environment

### Azure VMware Solution configuration

This article uses the following Azure VMware Solution environment:

- Private cloud generation: **Gen 2**
- ESXi hosts: **Three AV64 hosts**
- Guest virtual machines: **Windows and Linux**
- Operating systems:
  - Windows Server 2022
  - Ubuntu 24.04
- VM size: **32 vCPU, 256 GB RAM**
- VM disk configuration:
  - Disk sizes: **1 TiB or 500 GiB**
  - Provisioning: **Eager‑zeroed thick**

### Azure Elastic SAN configuration

This article uses the following Elastic SAN environment:

- Deployed in the **same region and availability zone** as the AVS private cloud
- Base capacity provisioned: **100 TiB**
- Datastore backing volume size: **20 TiB**
  - Maximum supported performance:
    - **80,000 IOPS**
    - **1,280 MBps**
- Private endpoints: **8**

The Elastic SAN used also follows all the best practices outlined in [Optimize the performance of your Elastic SAN](elastic-san-best-practices.md).

## Benchmark tools

The benchmarks use industry‑standard storage testing tools, [DiskSPD](https://github.com/microsoft/diskspd) (used with Windows environments) and [Fio](https://github.com/axboe/fio) (used with Linux environments).

## Perform the benchmark tests

This section provides example commands used to generate the benchmark results shown later in this article. The examples include both **I/O‑intensive** and **throughput‑intensive** scenarios for Windows and Linux. For each workload scenario, the benchmarks are executed on one or more guest VMs connected to the same Elastic SAN datastore.

### I/O‑intensive workload benchmark

#### Windows (DiskSPD)

Each guest VM runs the following command independently. All VMs run concurrently against the same datastore.

```powershell
diskspd.exe -b4K -d900 -Sh -L -o32 -t3 -r -w25 -Z1G -c20G G:\Testdata\IO.dat
```

Key parameters:

- `b4K` – 4‑KB I/O size
- `r -w25` – Random I/O with a 75% read / 25% write mix
- `t3` – Three threads per VM
- `o32` – Queue depth of 32 per thread
- `d900` – 15‑minute steady‑state runtime
- `c20G` – Per‑VM test file size

##### Results

In this scenario, multiple guest VMs run concurrently against the same Elastic SAN–backed datastore. Reported results reflect aggregate datastore‑level performance across all participating VMs.

| Number of Guest VMs | I/O Pattern                    | I/O Size | Threads per VM | Queue Depth | IOPS Achieved | MBps Achieved |
|---------------:|--------------------------------|----------|---------------:|------------:|--------------:|--------------:|
| 4              | Random (Read/Write 75/25)      | 4K       | 3              | 96          | 100,000       | 414           |

### Linux (fio)

```shell
fio --name=randrw \
    --rw=randrw \
    --rwmixread=75 \
    --bs=4k \
    --iodepth=32 \
    --numjobs=3 \
    --time_based \
    --runtime=900 \
    --direct=1 \
    --ioengine=libaio \
    --group_reporting \
    --filename=/mnt/esan/testfile
```

Key parameters:

- `bs=4k` – 4‑KB I/O size
- `rw=randrw`, `rwmixread=75` – 75% read / 25% write mix
- `numjobs=3` – Three threads per VM
- `iodepth=32` – Outstanding I/Os per thread
- `runtime=900` – 15‑minute steady‑state runtime

##### Results

In this scenario, multiple guest VMs run concurrently against the same Elastic SAN–backed datastore. Reported results reflect aggregate datastore‑level performance across all participating VMs.

| Number of Guest VMs | I/O Pattern                    | I/O Size | Threads per VM | Queue Depth | IOPS Achieved | MBps Achieved |
|---------------:|--------------------------------|----------|---------------:|------------:|--------------:|--------------:|
| 6              | Random (Read/Write 75/25)      | 4K       | 3              | 96          | 85,000        | 356           |

## Throughput‑intensive workload benchmark
Throughput intensive workloads are represented by large sequential I/O patterns typical of backup, scan, and read ahead workloads.

### Windows (DiskSPD)

```powershell
diskspd.exe -b1M -d900 -Sh -L -o32 -t3 -si -w0 -c200G G:\Testdata\BackupIO.dat
```

Key parameters:

- `b1M` – 1‑MB I/O size
- `si` -w0 – Sequential, read‑only I/O
- `t3` – Three threads per VM
- `o32` – Queue depth
- `d900` – 15‑minute steady‑state runtime

#### Results

In this scenario, a single guest VM runs the benchmark against the Elastic SAN–backed datastore.

| Number of Guest VMs | I/O Pattern               | I/O Size | Threads per VM | Queue Depth | IOPS Achieved | MBps Achieved |
|---------------:|---------------------------|----------|---------------:|------------:|--------------:|--------------:|
| 1              | Sequential (Read 100%)    | 1M       | 3              | 96          | 12,790        | 1,648         |

### Linux (fio)

```shell
fio --name=readseq \
    --rw=read \
    --bs=1M \
    --iodepth=32 \
    --numjobs=3 \
    --time_based \
    --runtime=900 \
    --direct=1 \
    --ioengine=libaio \
    --group_reporting \
    --filename=/mnt/esan/testfile
```

#### Results

In this scenario, a single guest VM runs the benchmark against the Elastic SAN–backed datastore.

| Number of Guest VMs | I/O Pattern               | I/O Size | Threads per VM | Queue Depth | IOPS Achieved | MBps Achieved |
|---------------:|---------------------------|----------|---------------:|------------:|--------------:|--------------:|
| 1              | Sequential (Read 100%)    | 1M       | 3              | 96          | 13,000        | 1,519         |


## Next steps

- Review [ESAN best practices](/azure/storage/elastic-san/elastic-san-best-practices)
- [Resize your Elastic SAN's base capacity so it meets IOPS and throughput requirements](/azure/storage/elastic-san/elastic-san-expand)
- Connect to [Azure VMware Solution using Elastic SAN](/azure/azure-vmware/configure-azure-elastic-san)
