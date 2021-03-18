--- 
title: HBv3-series VM overview - Azure Virtual Machines | Microsoft Docs 
description: Learn about the HBv3-series VM size in Azure.  
services: virtual-machines 
author: vermagit 
tags: azure-resource-manager 
ms.service: virtual-machines 
ms.subservice: workloads
ms.workload: infrastructure-services 
ms.topic: article 
ms.date: 03/12/2021 
ms.author: amverma 
ms.reviewer: cynthn
--- 

# HBv3-series virtual machine overview 

An [HBv3-series](../../hbv3-series.md) server features 2 * 64-core EPYC 7V13 CPUs for a total of 128 physical "Zen3" cores. Simultaneous Multithreading (SMT) is disabled on HBv3. These 128 cores are divided into 16 sections (8 per socket), each section containing 8 processor cores with uniform access to a 32 MB L3 cache. Azure HBv3 servers also run the following AMD BIOS settings:

```bash
Nodes per Socket =2
L3 as NUMA = Disabled
```

As a result, the server boots with 4 NUMA domains (2 per socket) each 32-cores in size. Each NUMA has direct access to 4 channels of physical DRAM operating at 3200 MT/s.

To provide room for the Azure hypervisor to operate without interfering with the VM, we reserve 8 physical cores per server. 

Note that Constrained Cores VM sizes only reduce the number of physical cores exposed to the VM. All global shared assets (RAM, memory bandwidth, L3 cache, GMI and xGMI connectivity, InfiniBand, Azure Ethernet network, local SSD) stay constant. This allows a customer to pick a VM size best tailored to a given set of workload or software licensing needs.

## InfiniBand networking
HBv3 VMs also feature Nvidia Mellanox HDR InfiniBand network adapters (ConnectX-6) operating at up to 200 Gigabits/sec. The NIC is passed through to the VM via SRIOV, enabling network traffic to bypass the hypervisor. As a result, customers load standard Mellanox OFED drivers on HBv3 VMs as they would a bare metal environment.

HBv3 VMs support Adaptive Routing, the Dynamic Connected Transport (DCT, in additional to standard RC and UD transports), and hardware-based offload of MPI collectives to the onboard processor of the ConnectX-6 adapter. These features enhance application performance, scalability, and consistency, and usage of them is strongly recommended.

## Temporary storage
HBv3 VMs feature 3 physically local SSD devices. One device is preformatted to serve as a page file and will appear within your VM as a generic "SSD" device.

Two other, larger SSDs are provided as unformatted block NVMe devices via NVMeDirect. As the block NVMe device bypasses the hypervisor, it will have higher bandwidth, higher IOPS, and lower latency per IOP.

When paired in a striped array, the NVMe SSD provides up to 7 GB/s reads and 3 GB/s writes, and up to 186,000 IOPS (reads) and 201,000 IOPS (writes) for deep queue depths.

## Hardware specifications 

| Hardware specifications          | HBv3-series VMs              |
|----------------------------------|----------------------------------|
| Cores                            | 120, 96, 64, 32, or 16 (SMT disabled)               | 
| CPU                              | AMD EPYC 7V13                   | 
| CPU Frequency (non-AVX)          | 3.1 GHz (all cores), 3.675 GHz (up to 10 cores)    | 
| Memory                           | 448 GB (RAM per core depends on VM size)         | 
| Local Disk                       | 2 * 960 GB NVMe (block), 480 GB SSD (page file) | 
| Infiniband                       | 200 Gb/s Mellanox ConnectX-6 HDR InfiniBand | 
| Network                          | 50 Gb/s Ethernet (40 Gb/s usable) Azure second Gen SmartNIC | 

## Software specifications 

| Software specifications        | HBv3-series VMs                                            | 
|--------------------------------|-----------------------------------------------------------|
| Max MPI Job Size               | 36,000 cores (300 VMs in a single virtual machine scale set with singlePlacementGroup=true) |
| MPI Support                    | HPC-X, Intel MPI, OpenMPI, MVAPICH2, MPICH  |
| Additional Frameworks          | Unified Communication X, libfabric, PGAS                  |
| Azure Storage Support          | Standard and Premium Disks (maximum 32 disks)              |
| OS Support for SRIOV RDMA      | CentOS/RHEL 7.6+, SLES 12 SP4+, WinServer 2016+           |
| Recommended OS for Performance | CentOS 8.1, Windows Server 2019+
| Orchestrator Support           | Azure CycleCloud, Azure Batch, Azure Kubernetes Service                      | 

## Next steps

- Read about the latest announcements and some HPC examples in the [Azure Compute Tech Community Blogs](https://techcommunity.microsoft.com/t5/azure-compute/bg-p/AzureCompute).
- For a higher level architectural view of running HPC workloads, see [High Performance Computing (HPC) on Azure](/azure/architecture/topics/high-performance-computing/).