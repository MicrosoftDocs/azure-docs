---
 title: include file
 description: include file
 services: virtual-machines
 author: vermagit
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/26/2019
 ms.author: azcspmt;jonbeck;cynthn;amverma
 ms.custom: include file
---

Azure H-series virtual machines (VMs) are designed to deliver leadership-class performance, MPI scalability, and cost efficiency for a variety of real-world HPC workloads.

HB-series VMs are optimized for applications driven by memory bandwidth, such as fluid dynamics, explicit finite element analysis, and weather modeling. HB VMs feature 60 AMD EPYC 7551 processor cores, 4 GB of RAM per CPU core, and no hyperthreading. The AMD EPYC platform provides more than 260 GB/sec of memory bandwidth.

HC-series VMs are optimized for applications driven by dense computation, such as implicit finite element analysis, molecular dynamics, and computational chemistry. HC VMs feature 44 Intel Xeon Platinum 8168 processor cores, 8 GB of RAM per CPU core, and no hyperthreading. The Intel Xeon Platinum platform supports Intel’s rich ecosystem of software tools such as the Intel Math Kernel Library.

Both HB and HC VMs feature 100 Gb/sec Mellanox EDR InfiniBand in a non-blocking fat tree configuration for consistent RDMA performance. HB and HC VMs support standard Mellanox/OFED drivers such that all MPI types and versions, as well as RDMA verbs, are supported as well.

H-series VMs are optimized for applications driven by high CPU frequencies or large memory per core requirements. H-series VMs feature 8 or 16 Intel Xeon E5 2667 v3 processor cores, 7 or 14 GB of RAM per CPU core, and no hyperthreading. H-series features 56 Gb/sec Mellanox FDR InfiniBand in a non-blocking fat tree configuration for consistent RDMA performance. H-series VMs support Intel MPI 5.x and MS-MPI.

## HB-series

ACU: 199-216

Premium Storage: Supported

Premium Storage Caching: Supported

| Size | vCPU | Processor | Memory (GB) | Memory bandwidth GB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (Gb/s) | MPI support | Temp storage (GB) | Max data disks | Max Ethernet NICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HB60rs | 60 | AMD EPYC 7551 | 240 | 263 | 2.0 | 2.55 | 2.55 | 100 | All | 700 | 4 | 1 |

<br>

## HC-series

ACU: 297-315

Premium Storage: Supported

Premium Storage Caching: Supported


| Size | vCPU | Processor | Memory (GB) | Memory bandwidth GB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (Gb/s) | MPI support | Temp storage (GB) | Max data disks | Max Ethernet NICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HC44rs | 44 | Intel Xeon Platinum 8168 | 352 | 191 | 2.7 | 3.4 | 3.7 | 100 | All | 700 | 4 | 1 |


<br>

## H-series

ACU: 290-300

Premium Storage:  Not Supported

Premium Storage Caching:  Not Supported

| Size | vCPU | Processor | Memory (GB) | Memory bandwidth GB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (Gb/s) | MPI support | Temp storage (GB) | Max data disks | Max Ethernet NICs |
| --- | --- |--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_H8 | 8 | Intel Xeon E5 2667 v3 | 56 | 40 | 3.2 | 3.3 | 3.6 | - | Intel 5.x, MS-MPI | 1000 | 32 | 2 |
| Standard_H16 | 16 | Intel Xeon E5 2667 v3 | 112 | 80 | 3.2 | 3.3 | 3.6 |  - | Intel 5.x, MS-MPI | 2000 | 64 | 4 |
| Standard_H8m | 8 | Intel Xeon E5 2667 v3 | 112 | 40 | 3.2 | 3.3 | 3.6 | - | Intel 5.x, MS-MPI | 1000 | 32 | 2 |
| Standard_H16m | 16 | Intel Xeon E5 2667 v3 | 224 | 80 | 3.2 | 3.3 | 3.6 | - | Intel 5.x, MS-MPI | 2000 | 64 | 4 |
| Standard_H16r <sup>1</sup> | 16 | Intel Xeon E5 2667 v3 | 112 | 80 | 3.2 | 3.3 | 3.6 | 56 | Intel 5.x, MS-MPI | 2000 | 64 | 4 |
| Standard_H16mr <sup>1</sup> | 16 | Intel Xeon E5 2667 v3 | 224 | 80 | 3.2 | 3.3 | 3.6 | 56 | Intel 5.x, MS-MPI | 2000 | 64 | 4 |

<sup>1</sup> For MPI applications, dedicated RDMA backend network is enabled by FDR InfiniBand network.

<br>
