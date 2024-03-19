---
title: ND A100 v4-series 
description: Specifications for the ND A100 v4-series VMs.
ms.service: virtual-machines
ms.subservice: sizes
author: sherrywangms
ms.author: sherrywang
ms.topic: conceptual
ms.date: 03/13/2023
---

# ND A100 v4-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets.

The ND A100 v4 series virtual machine(VM) is a new flagship addition to the Azure GPU family. It's designed for high-end Deep Learning training and tightly coupled scale-up and scale-out HPC workloads. 

The ND A100 v4 series starts with a single VM and eight NVIDIA Ampere A100 40GB Tensor Core GPUs. ND A100 v4-based deployments can scale up to thousands of GPUs with an 1.6 TB/s of interconnect bandwidth per VM. Each GPU within the VM is provided with its own dedicated, topology-agnostic 200 GB/s NVIDIA Mellanox HDR InfiniBand connection. These connections are automatically configured between VMs occupying the same VM scale set, and support GPUDirect RDMA.

Each GPU features NVLINK 3.0 connectivity for communication within the VM, and the instance is backed by 96 physical 2nd-generation AMD Epyc™ 7V12 (Rome) CPU cores.

These instances provide excellent performance for many AI, ML, and analytics tools that support GPU acceleration 'out-of-the-box,' such as TensorFlow, Pytorch, Caffe, RAPIDS, and other frameworks. Additionally, the scale-out InfiniBand interconnect is supported by a large set of existing AI and HPC tools that are built on NVIDIA's NCCL2 communication libraries for seamless clustering of GPUs.

> [!IMPORTANT]
> To get started with ND A100 v4 VMs, refer to [HPC Workload Configuration and Optimization](configure.md) for steps including driver and network configuration.
> Due to increased GPU memory I/O footprint, the ND A100 v4 requires the use of [Generation 2 VMs](generation-2.md) and marketplace images.
> 
> Azure supports Ubuntu 20.04/22.04, RHEL 7.9/8.7/9.3, AlmaLinux 8.8/9.2, and SLES 15 for ND A100 v4 VMs. On Azure marketplace, there are offerings of optimized and pre-configured [Linux VM images](configure.md#vm-images) for HPC/AI workloads with a variety of HPC tools and libraries installed, and thus they are strongly recommended. Currently, Ubuntu-HPC 20.04/22.04 and AlmaLinux-HPC 8.6/8.7 VM images are supported.

<br>

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage, and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
[InfiniBand](./extensions/enable-infiniband.md): Supported, GPUDirect RDMA, 8 x 200 Gigabit HDR<br>
NVIDIA NVLink Interconnect: Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp Storage (SSD): GiB | GPU | GPU Memory: GiB | Max data disks | Max uncached disk throughput: IOPS / MBps | Max network bandwidth | Max NICs |
|---|---|---|---|---|---|---|---|---|---|
| Standard_ND96asr_A100_v4 | 96 | 900 | 6000 | 8 A100 40-GB GPUs (NVLink 3.0) | 320 | 32 | 80,000 / 800 | 24,000 Mbps | 8 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
