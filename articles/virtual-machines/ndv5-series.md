---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title:       # ND H100 v5-series- Azure Virtual Machines
description: # Add a meaningful description for search results
author:      iamwilliew # GitHub alias
ms.author:   iamwilliew # Microsoft alias
ms.service:  # virtual-machines
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # conceptual
ms.date:     08/04/2023
---

# ND H100 v5-series

The ND H100 v5 series virtual machine (VM) is a new flagship addition to the Azure GPU family. It’s designed for high-end Deep Learning training and tightly coupled scale-up and scale-out Generative AI and HPC workloads. 

The ND H100 v5 series starts with a single VM and eight NVIDIA H100 Tensor Core GPUs. ND H100 v5-based deployments can scale up to thousands of GPUs with 3.2Tb/s of interconnect bandwidth per VM. Each GPU within the VM is provided with its own dedicated, topology-agnostic 400 Gb/s NVIDIA Quantum-2 CX7 InfiniBand connection. These connections are automatically configured between VMs occupying the same VM scale set, and support GPUDirect RDMA. 

Each GPU features NVLINK 4.0 connectivity for communication within the VM, and the instance is backed by 96 physical 4th Gen Intel Xeon Scalable processor cores. 

These instances provide excellent performance for many AI, ML, and analytics tools that support GPU acceleration ‘out-of-the-box,’ such as TensorFlow, Pytorch, Caffe, RAPIDS, and other frameworks. Additionally, the scale-out InfiniBand interconnect is supported by a large set of existing AI and HPC tools that are built on NVIDIA’s NCCL communication libraries for seamless clustering of GPUs." 

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Ultra disk]: Supported(Learn more(add link) about availability, usage, and performance) <br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Supported <br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Infiniband]: Supported, GPUDirect RDMA, 8x400 Gigabit NDR <br>
[NVIDIA NVLink Interconnect]: Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization):Not Supported <br>
<br> 

>[!IMPORTANT]
>To get started with ND H100 v5 VMs, refer to HPC Workload Configuration and Optimization for steps including driver and network configuration. Due to increased GPU memory I/O footprint, the ND H100 v5 requires the use of Generation 2 VMs and marketplace images. The Azure HPC images are strongly recommended. Azure HPC Ubuntu 20.04 image is supported. 

# Example
The ND H100 v5 series supports the following kernel version: 
Ubuntu 20.04: 5.4.0-1046-azure 

| Size                | vCPU | Memory:GiB | Temp storage (SSD) Gib | GPU                        | GPU Memory GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max network bandwidth (Mbps) | Max NICs |
|---------------------|------|------------|------------------------|----------------------------|----------------|----------------|-----------------------------------------|------------------------------|----------|
| Standard_ND96isr_v5 | 96   | 1900       | 1000                   | 8 H100 80 GB GPUs(NVLink)  | 80             | 32             | 40800/612                               | 2400                         | 8        |

# Size table definitions
Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.

Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.

Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to ReadOnly or ReadWrite. For uncached data disk operation, the host cache mode is set to None.

To learn how to get the best storage performance for your VMs, see Virtual machine and disk performance.

Expected network bandwidth is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see Virtual machine network bandwidth.

Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance will depend on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see Optimize network throughput for Azure virtual machines. To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see Bandwidth/Throughput testing (NTTTCP).

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types: [Disk Types](./disks-types.md#ultra-disks)
