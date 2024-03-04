---
title:       ND H100 v5-series
description: Specifications for the ND H100 v5-series VMs
author:      iamwilliew 
ms.author:   wwilliams 
ms.service:  virtual-machines
ms.topic:    conceptual
ms.date:     08/04/2023
---

# ND H100 v5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets


The ND H100 v5 series virtual machine (VM) is a new flagship addition to the Azure GPU family. It’s designed for high-end Deep Learning training and tightly coupled scale-up and scale-out Generative AI and HPC workloads. 

The ND H100 v5 series starts with a single VM and eight NVIDIA H100 Tensor Core GPUs. ND H100 v5-based deployments can scale up to thousands of GPUs with 3.2Tb/s of interconnect bandwidth per VM. Each GPU within the VM is provided with its own dedicated, topology-agnostic 400 Gb/s NVIDIA Quantum-2 CX7 InfiniBand connection. These connections are automatically configured between VMs occupying the same virtual machine scale set, and support GPUDirect RDMA. 

Each GPU features NVLINK 4.0 connectivity for communication within the VM, and the instance is backed by 96 physical 4th Gen Intel Xeon Scalable processor cores. 

These instances provide excellent performance for many AI, ML, and analytics tools that support GPU acceleration ‘out-of-the-box,’ such as TensorFlow, Pytorch, Caffe, RAPIDS, and other frameworks. Additionally, the scale-out InfiniBand interconnect is supported by a large set of existing AI and HPC tools that are built on NVIDIA’s NCCL communication libraries for seamless clustering of GPUs. 

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra disk](disks-types.md#ultra-disks): Supported [Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage, and performance <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
Infiniband: Supported, GPUDirect RDMA, 8x400 Gigabit NDR <br>
NVIDIA NVLink Interconnect: Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br> 

>[!IMPORTANT]
>To get started with ND H100 v5 VMs, refer to HPC Workload Configuration and Optimization for steps including driver and network configuration. Due to increased GPU memory I/O footprint, the ND H100 v5 requires the use of Generation 2 VMs and marketplace images. The Azure HPC images are strongly recommended. Azure HPC Ubuntu 20.04 image is supported. 

## Example
The ND H100 v5 series supports the following kernel version: 
Ubuntu 20.04: 5.4.0-1046-azure 

| Size                | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU                        | GPU Memory GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max network bandwidth (Mbps) | Max NICs |
|---------------------|------|------------|------------------------|----------------------------|----------------|----------------|-----------------------------------------|------------------------------|----------|
| Standard_ND96isr_v5 | 96   | 1900       | 1000                   | 8 H100 80 GB GPUs(NVLink)  | 80             | 32             | 40800/612                               | 2400                         | 8        |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)


More information on Disks Types: [Disk Types](./disks-types.md#ultra-disks)
