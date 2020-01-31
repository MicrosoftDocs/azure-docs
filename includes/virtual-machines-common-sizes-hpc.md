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

Azure HPC optimized virtual machines (VMs) are designed to deliver leadership-class performance, MPI scalability, and cost efficiency for a variety of real-world applications.
 
## InfiniBand Networking for Large Scale HPC
HBv2 VMs feature 200 Gb/sec Mellanox HDR InfiniBand, while both HB and HC VMs feature 100 Gb/sec Mellanox EDR InfiniBand. Each of these VM types are connected in a non-blocking fat tree for optimized and consistent RDMA performance.

HBv2 VMs support Adaptive Routing and the Dynamic Connected Transport (DCT, in additional to standard RC and UD transports). These features enhance application performance, scalability, and consistency, and usage of them is strongly recommended.  

HBv2, HB, and HC VMs support standard Mellanox/OFED drivers. As such, all RDMA verbs and MPI types are supported. Each of these VM types  also support hardware-based offload of MPI collectives for increased application performance.
 
Original H-series VMs feature 56 Gb/sec Mellanox FDR InfiniBand. To leverage the InfiniBand interface on H-series, customers must deploy using officially supported images specific to this VM type from the Azure Marketplace. 


## HBv2-series
HBv2-series VMs are optimized for applications driven by memory bandwidth, such as fluid dynamics, finite element analysis, and reservoir simulation. HBv2 VMs feature 120 AMD EPYC 7742 processor cores, 4 GB of RAM per CPU core, and no simultaneous multithreading. Each HBv2 VM provides up to 340 GB/sec of memory bandwidth, and up to 4 teraFLOPS of FP64 compute. 

Premium Storage: Supported

| Size | vCPU | Processor | Memory (GB) | Memory bandwidth GB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (Gb/s) | MPI support | Temp storage (GB) | Max data disks | Max Ethernet NICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HB120rs_v2 | 120 | AMD EPYC 7V12 | 480 | 350 | 2.45 | 3.1 | 3.3 | 200 | All | 480 + 960 | 8 | 1 |

<br>

## HB-series
HB-series VMs are optimized for applications driven by memory bandwidth, such as fluid dynamics, explicit finite element analysis, and weather modeling. HB VMs feature 60 AMD EPYC 7551 processor cores, 4 GB of RAM per CPU core, and no simultaneous multithreading. An HB VM provides up to 260 GB/sec of memory bandwidth.  

ACU: 199-216

Premium Storage: Supported

Premium Storage Caching: Supported

| Size | vCPU | Processor | Memory (GiB) | Memory bandwidth GiB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (GiB/s) | MPI support | Temp storage (GiB) | Max data disks | Max Ethernet NICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HB60rs | 60 | AMD EPYC 7551 | 240 | 263 | 2.0 | 2.55 | 2.55 | 100 | All | 700 | 4 | 1 |

<br>

## HC-series
HC-series VMs are optimized for applications driven by dense computation, such as implicit finite element analysis, molecular dynamics, and computational chemistry. HC VMs feature 44 Intel Xeon Platinum 8168 processor cores, 8 GB of RAM per CPU core, and no hyperthreading. The Intel Xeon Platinum platform supports Intel’s rich ecosystem of software tools such as Intel Math Kernel Library. 

ACU: 297-315

Premium Storage: Supported

Premium Storage Caching: Supported


| Size | vCPU | Processor | Memory (GiB) | Memory bandwidth GiB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (GiB/s) | MPI support | Temp storage (GiB) | Max data disks | Max Ethernet NICs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_HC44rs | 44 | Intel Xeon Platinum 8168 | 352 | 191 | 2.7 | 3.4 | 3.7 | 100 | All | 700 | 4 | 1 |


<br>

## H-series
H-series VMs are optimized for applications driven by high CPU frequencies or large memory per core requirements. H-series VMs feature 8 or 16 Intel Xeon E5 2667 v3 processor cores, up to 14 GB of RAM per CPU core, and no hyperthreading. An H-series VM provides up to provides up to 80 GB/sec of memory bandwidth.

ACU: 290-300

Premium Storage:  Not Supported

Premium Storage Caching:  Not Supported

| Size | vCPU | Processor | Memory (GiB) | Memory bandwidth GiB/s | Base CPU frequency (GHz) | All-cores frequency (GHz, peak) | Single-core frequency (GHz, peak) | RDMA performance (GiB/s) | MPI support | Temp storage (GiB) | Max data disks | Max Ethernet NICs |
| --- | --- |--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_H8 | 8 | Intel Xeon E5 2667 v3 | 56 | 40 | 3.2 | 3.3 | 3.6 | - | Intel 5.x, MS-MPI | 1000 | 32 | 2 |
| Standard_H16 | 16 | Intel Xeon E5 2667 v3 | 112 | 80 | 3.2 | 3.3 | 3.6 |  - | Intel 5.x, MS-MPI | 2000 | 64 | 4 |
| Standard_H8m | 8 | Intel Xeon E5 2667 v3 | 112 | 40 | 3.2 | 3.3 | 3.6 | - | Intel 5.x, MS-MPI | 1000 | 32 | 2 |
| Standard_H16m | 16 | Intel Xeon E5 2667 v3 | 224 | 80 | 3.2 | 3.3 | 3.6 | - | Intel 5.x, MS-MPI | 2000 | 64 | 4 |
| Standard_H16r <sup>1</sup> | 16 | Intel Xeon E5 2667 v3 | 112 | 80 | 3.2 | 3.3 | 3.6 | 56 | Intel 5.x, MS-MPI | 2000 | 64 | 4 |
| Standard_H16mr <sup>1</sup> | 16 | Intel Xeon E5 2667 v3 | 224 | 80 | 3.2 | 3.3 | 3.6 | 56 | Intel 5.x, MS-MPI | 2000 | 64 | 4 |

<sup>1</sup> For MPI applications, dedicated RDMA backend network is enabled by FDR InfiniBand network.

<br>
