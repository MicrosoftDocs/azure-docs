---
title: "VM offerings: Azure Modeling and Simulation Workbench"
description: VM offerings available in the Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: concept-article
ms.date: 08/12/2024

#CustomerIntent: As a Workbench User, I want to understand what VMs are offered on the Azure Modeling and Simulation Workbench so that I can pick the right VM for my needs.
---
# VM Offerings in Azure Modeling and Simulation Workbench

Azure Modeling and Simulation Workbench offers a select set of virtual machines (VM) optimized for large, complex modeling and simulation workloads, semiconductor design, and other scientific or industrial workloads.

This article provides an overview of the Azure VM families that are available in Modeling and Simulation Workbench. A summary of the series, common and optimal workloads, and additional information can help you choose the best VM for your scenario.

## Quotas

VM quotas in Modeling and Simulation Workbench are handled differently than in traditional Azure VM offerings. Modeling and Simulation Workbench operates in a Microsoft managed environment, therefore VM quotas aren't directly associated with the owner's Azure subscription. Quota requests should be sent through your Microsoft account manager.

## General purpose

General purpose VM sizes provide balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers. They make ideal management VMs for managing chambers, Facilitating file imports or exports, compiling applications, or installing applications to shared storage.

### Dv4-series

The 'D' family of VM sizes are one of Azure's general purpose VM sizes. They're designed for a range of demanding workloads, such as enterprise applications, web and application servers, development and test environments, and batch processing tasks. They're favored for running enterprise-grade applications, supporting moderate to high-traffic web servers, and performing data-intensive batch processing.

The Dv4 run on Intel® Xeon® Platinum 8473C (Sapphire Rapids), Intel® Xeon® Platinum 8370C (Ice Lake), or Intel® Xeon® Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads. Dv4 series don't have local storage.

[View the Dv4 family page](/azure/virtual-machines/sizes/general-purpose/dv4-series)

| Size Name       | vCPUs (Qty.) | Memory (GB) | Max Bandwidth (Mbps) |
|-----------------|--------------|-------------|----------------------|
| Standard_D2_v4  | 2            | 8           | 5000                 |
| Standard_D4_v4  | 4            | 16          | 10000                |
| Standard_D8_v4  | 8            | 32          | 12500                |
| Standard_D16_v4 | 16           | 64          | 12500                |
| Standard_D32_v4 | 32           | 128         | 16000                |
| Standard_D48_v4 | 48           | 192         | 24000                |
| Standard_D64_v4 | 64           | 256         | 30000                |

## Compute optimized

Compute optimized VM sizes have a high CPU-to-memory ratio. These sizes are good for medium traffic web servers, network appliances, batch processes, application servers, and Electronic Design Automation (EDA) workloads.

### Fsv2-series

The Fsv2-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake), the Intel® Xeon® Platinum 8272CL (Cascade Lake) processors, or the Intel® Xeon® Platinum 8168 (Skylake) processors. It features a sustained all core Turbo clock speed of 3.4 GHz and a maximum single-core turbo frequency of 3.7 GHz. Intel® AVX-512 instructions are new on Intel Scalable Processors. These instructions provide up to a 2X performance boost to vector processing workloads on both single and double precision floating point operations. Fsv2-series VMs feature Intel® Hyper-Threading Technology.

Fsv2-series have fixed-sized local storage.

[View the Fsv2 family page](/azure/virtual-machines/sizes/compute-optimized/fsv2-series)

| Size | vCPUs | Memory: GiB | Temp storage (SSD) GiB | Expected network bandwidth (Mbps) |
|---|---|---|---|---|
| Standard_F16s_v2 | 16 | 32 | 128 | 12500 |
| Standard_F32s_v2 | 32 | 64 | 256 | 16000 |
| Standard_F48s_v2 | 48 | 96 | 384 | 21000 |
| Standard_F64s_v2 | 64 | 128 | 512 | 28000 |
| Standard_F72s_v2 | 72 | 144 | 576 | 30000 |

### FX-series

The FX-series runs on the Intel® Xeon® Gold 6246R (Cascade Lake) processors. It features an all-core-turbo frequency of 4.0 GHz, 21 GB RAM per vCPU, up to 1 TB total RAM, and local temporary storage. The FX-series will benefit workloads that require a high CPU clock speed and high memory to CPU ratio, workloads with high per-core licensing costs, and applications requiring a high single-core performance. A typical use case for FX-series is the Electronic Design Automation (EDA) workload. FX-series VMs feature Intel® Turbo Boost Technology 2.0, Intel® Hyper-Threading Technology, and Intel® Advanced Vector Extensions 512 (Intel® AVX-512).

| Size Name | vCPUs (Qty.) | Memory (GB) | Temp Disk Size (GiB) | Temp Disk Random Read (RR) IOPS | Temp Disk Random Read (RR) Speed (MBps) |
| --- | --- | --- |
| Standard_FX4mds | 4 | 84 | 168 | 40000 | 343 |
| Standard_FX12mds | 12 | 252 | 504 | 100000 | 1029 |
| Standard_FX24mds | 24 | 504 | 1008 | 200000 | 2057 |
| Standard_FX36mds | 36 | 756 | 1512 | 300000 | 3086 |
| Standard_FX48mds | 48 | 1008 | 2016 | 400000 | 3871 |

[View the FX-series family page](/azure/virtual-machines/sizes/compute-optimized/fx-series)

## Memory optimized

Memory optimized VM sizes offer a high memory-to-CPU ratio that is great for relational database servers, medium to large caches, and in-memory analytics.

### Esv5-series

Esv5-series virtual machines run on Intel® Xeon® Platinum 8473C (Sapphire Rapids), or Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz. Esv5-series virtual machines don't have temporary storage.

[View the Esv5 family page](/azure/virtual-machines/ev5-esv5-series)

| Size | vCPU (Qty.) | Memory: GiB | Max bandwidth (Mbps) |
|---|---|---|---|
| Standard_E2s_v5  | 2  | 16 | 12500 |
| Standard_E4s_v5  | 4  | 32 | 12500 |
| Standard_E8s_v5  | 8  | 64 | 12500 |
| Standard_E16s_v5 | 16 | 128 | 12500 |
| Standard_E20s_v5 | 20 | 160 | 12500 |
| Standard_E32s_v5 | 32 | 256 | 16000 |
| Standard_E48s_v5 | 48 | 384 | 24000 |
| Standard_E64s_v5 | 64 | 512 | 30000 |
| Standard_E96s_v5 | 96 | 672 | 35000 |

### M family

The 'M' family of VM size series are one of Azure's ultra memory-optimized VM instances. They're designed for memory-intensive workloads, such as large in-memory databases, data warehousing, and high-performance computing (HPC). The M-family is equipped with substantial RAM capacities and high vCPU capabilities, M-family VMs support applications and services that require massive amounts of memory and significant computational power. This makes them well-suited for handling tasks like real-time data processing, complex scientific simulations, and large-scale enterprise resource planning (ERP) systems, ensuring peak performance for the most demanding data-centric applications.

M-series VMs have fixed-size temporary storage.

[View the M series page](/azure/virtual-machines/m-series)

| Size      | vCPU | Memory: GiB | Temp storage (SSD) GiB | Expected network bandwidth (Mbps) |
|----------------|------|-------------|------------------------|-----------------------------------|
| Standard_M64s | 64  | 1024    | 2048          | 16000               |
| Standard_M128s | 128 | 2048    | 4096          | 30000               |
| Standard_M64m | 64  | 1792    | 7168          | 16000               |
| Standard_M128m | 128 | 3892    | 14336         | 32000               |

## Next step

> [!div class="nextstepaction"]
> [Create a chamber VM](./how-to-guide-chamber-vm.md)
