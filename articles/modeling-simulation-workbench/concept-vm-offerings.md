---
title: "VM Offerings: Azure Modeling and Simulation Workbench"
description: VM offerings available in the Azure Modeling and Simulation Workbench
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: concept-article
ms.date: 08/12/2024

#CustomerIntent: As a Workbench User, I want to understand what VMs are offered on the Azure Modeling and Simulation Workbench so that I can pick the right VM for my needs.
---
# VM Offerings: Azure Modeling and Simulation Workbench

Azure Modeling and Simulation Workbench offers a select set of virtual machines (VM) that are optimized for  large-scale, complex modeling, simulation, digital twin, semiconductor design, and other scientific or industrial workloads.  

This article presents the VMs that are available in Modeling and Simulation Workbench Chamber Workloads, giving an overview of available offerings within each family and high-level information to enable selecting the right VM for the workload.

## Quotas

VM quotas in Modeling and Simulation Workbench are handled differently than in mainstream Azure.  Modeling and Simulation Workbench operates in a Microsoft managed environment, therefore VM quotas are not directly associated with the owner's Azure subscription.  Quota requests should be sent the Modeling and Simulation Workbench product team TODO: NEED LINK.

## General purpose

General purpose VM sizes provide balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers.  They make ideal management VMs for managing Chambers, facilitiating file imports or exports, compiling applications, or installing applications to shared storage.

### Dv4 series

The 'D' family of VM sizes are one of Azure's general purpose VM sizes. They're designed for a variety of demanding workloads, such as enterprise applications, web and application servers, development and test environments, and batch processing tasks. They are particularly favored for running enterprise-grade applications, supporting moderate to high-traffic web servers, and performing data-intensive batch processing.

The Dv4 run on Intel® Xeon® Platinum 8473C (Sapphire Rapids), Intel® Xeon® Platinum 8370C (Ice Lake), or Intel® Xeon® Platinum 8272CL (Cascade Lake) processors in a hyper-threaded configuration, providing a better value proposition for most general-purpose workloads.  Dv4 series do not have local storage.

[View the Dv4 family page](../virtual-machines/sizes/general-purpose/dv4-series.md)

vCPUs (Qty.), Memory and Max Bandwidth for each size

| Size Name | vCPUs (Qty.) | Memory (GB) | Max Bandwidth (Mbps) |
| --- | --- | --- | --- |
| Standard_D2_v4 | 2 | 8 | 5000 |
| Standard_D4_v4 | 4 | 16 | 10000 |
| Standard_D8_v4 | 8 | 32 | 12500 |
| Standard_D16_v4 | 16 | 64 | 12500 |
| Standard_D32_v4 | 32 | 128 | 16000 |
| Standard_D48_v4 | 48 | 192 | 24000 |
| Standard_D64_v4 | 64 | 256 | 30000 |

## Compute optimized

Compute optimized VM sizes have a high CPU-to-memory ratio. These sizes are good for medium traffic web servers, network appliances, batch processes, and application servers.

### Fsv2 series

The Fsv2-series run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake), the Intel® Xeon® Platinum 8272CL (Cascade Lake) processors, or the Intel® Xeon® Platinum 8168 (Skylake) processors. It features a sustained all core Turbo clock speed of 3.4 GHz and a maximum single-core turbo frequency of 3.7 GHz. Intel® AVX-512 instructions are new on Intel Scalable Processors. These instructions provide up to a 2X performance boost to vector processing workloads on both single and double precision floating point operations. Fsv2-series VMs feature Intel® Hyper-Threading Technology.  

Fsv2-series have fixed-sized local storage.

| Size | vCPUs | Memory: GiB | Temp storage (SSD) GiB | Expected network bandwidth (Mbps) |
|---|---|---|---|---|
| Standard_F16s_v2 | 16 | 32  | 128 | 12500 |
| Standard_F32s_v2 | 32 | 64  | 256 | 16000 |
| Standard_F48s_v2 | 48 | 96  | 384 | 21000 |
| Standard_F64s_v2 | 64 | 128 | 512 | 28000 |
| Standard_F72s_v2 | 72 | 144 | 576 | 30000 |

## Memory optimized

Memory optimized VM sizes offer a high memory-to-CPU ratio that is great for relational database servers, medium to large caches, and in-memory analytics.

### Esv5 series

Esv5-series virtual machines run on Intel® Xeon® Platinum 8473C (Sapphire Rapids), or Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz.  Esv5-series virtual machines don't have temporary storage.

| Size | vCPU  (Qty.) | Memory: GiB | Max bandwidth (Mbps) |
|---|---|---|---|
| Standard_E2s_v5   | 2   | 16  | 12500 |
| Standard_E4s_v5   | 4   | 32  | 12500 |
| Standard_E8s_v5   | 8   | 64  | 12500 |
| Standard_E16s_v5  | 16  | 128 | 12500 |
| Standard_E20s_v5  | 20  | 160 | 12500 |
| Standard_E32s_v5  | 32  | 256 | 16000 |
| Standard_E48s_v5  | 48  | 384 | 24000 |
| Standard_E64s_v5  | 64  | 512 | 30000 |
| Standard_E96s_v5  | 96  | 672 | 35000 |

### M family

The 'M' family of VM size series are one of Azure's ultra memory-optimized VM instances. They're designed for extremely memory-intensive workloads, such as large in-memory databases, data warehousing, and high-performance computing (HPC). Equipped with substantial RAM capacities and high vCPU capabilities, M-family VMs support applications and services that require massive amounts of memory and significant computational power. This makes them particularly well-suited for handling tasks like real-time data processing, complex scientific simulations, and large-scale enterprise resource planning (ERP) systems, ensuring peak performance for the most demanding data-centric applications.

M-series VMs have fixed-size temporary storage.

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | Expected network bandwidth (Mbps) |
|---|---|---|---|---|
| Standard_M64s  | 64  | 1024   | 2048  | 16000 |
| Standard_M128s | 128 | 2048   | 4096  | 30000 |
| Standard_M64m  | 64  | 1792   | 7168  | 16000 |
| Standard_M128m | 128 | 3892   | 14336 | 32000 |

## Next step

> [!div class="nextstepaction"]
> [Create a Chamber VM](./how-to-guide-chamber-vm.md)
