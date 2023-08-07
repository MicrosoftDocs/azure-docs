---
title: NDm A100 v4-series 
description: Specifications for the NDm A100 v4-series VMs.
author: sherrywangms
ms.author: sherrywang
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 03/13/2023

---

# NDm A100 v4-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The NDm A100 v4 series virtual machine(VM) is a new flagship addition to the Azure GPU family. It's designed for high-end Deep Learning training and tightly coupled scale-up and scale-out HPC workloads. 

The NDm A100 v4 series starts with a single VM and eight NVIDIA Ampere A100 80GB Tensor Core GPUs. NDm A100 v4-based deployments can scale up to thousands of GPUs with an 1.6 TB/s of interconnect bandwidth per VM. Each GPU within the VM is provided with its own dedicated, topology-agnostic 200 GB/s NVIDIA Mellanox HDR InfiniBand connection. These connections are automatically configured between VMs occupying the same VM scale set, and support GPUDirect RDMA.

Each GPU features NVLINK 3.0 connectivity for communication within the VM, and the instance is backed by 96 physical 2nd-generation AMD Epyc™ 7V12 (Rome) CPU cores.

These instances provide excellent performance for many AI, ML, and analytics tools that support GPU acceleration 'out-of-the-box,' such as TensorFlow, Pytorch, Caffe, RAPIDS, and other frameworks. Additionally, the scale-out InfiniBand interconnect is supported by a large set of existing AI and HPC tools that are built on NVIDIA's NCCL2 communication libraries for seamless clustering of GPUs.

> [!IMPORTANT]
> To get started with NDm A100 v4 VMs, refer to [HPC Workload Configuration and Optimization](configure.md) for steps including driver and network configuration.
> Due to increased GPU memory I/O footprint, the NDm A100 v4 requires the use of [Generation 2 VMs](generation-2.md) and marketplace images. The [Azure HPC images](configure.md) are strongly recommended. Azure HPC Ubuntu 18.04, 20.04 and Azure HPC CentOS 7.9 images are supported.
> 

<br>

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra Disks](disks-types.md#ultra-disks): Supported ([Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage, and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
InfiniBand: Supported, GPUDirect RDMA, 8 x 200 Gigabit HDR<br>
Nvidia NVLink Interconnect: Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>
The NDm A100 v4 series supports the following kernel versions: <br>
CentOS 7.9 HPC: 3.10.0-1160.24.1.el7.x86_64 <br>
Ubuntu 18.04: 5.4.0-1043-azure <br>
Ubuntu 20.04: 5.4.0-1046-azure <br>
<br>

| Size | vCPU | Memory: GiB | Temp Storage (SSD): GiB | GPU | GPU Memory: GiB | Max data disks | Max uncached disk throughput: IOPS / MBps | Max network bandwidth | Max NICs |
|---|---|---|---|---|---|---|---|---|---|
| Standard_ND96amsr_A100_v4 | 96 | 1900 | 6400 | 8 A100 80 GB GPUs (NVLink 3.0) | 80 | 32 | 80,000 / 800 | 24,000 Mbps | 8 |

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
