---
title:       ND MI300X v5-series
description: Specifications for the ND MI300X v5-series VMs
author:      charest
ms.author:   marccharest
ms.reviewer: mattmcinnes
ms.service:  virtual-machines
ms.custom:
  - build-2024
ms.topic:    conceptual
ms.date:     05/21/2024
---

# ND MI300X v5-series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

[!INCLUDE [Size series summary](./includes/nd-mi300x-v5-series-summary.md)]

## Host specifications
[!INCLUDE [series-specs](./includes/nd-mi300x-v5-series-specs.md)]

## Feature support
[Premium Storage](../../premium-storage-performance.md): Supported<br>
[Premium Storage caching](../../premium-storage-performance.md): Supported<br>
[Ultra disk](../../disks-types.md#ultra-disks): Supported [Learn more](https://techcommunity.microsoft.com/t5/azure-compute/ultra-disk-storage-for-hpc-and-gpu-vms/ba-p/2189312) about availability, usage, and performance <br>
[Live Migration](../../maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](../../maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](../../generation-2.md): Generation 2<br>
[Accelerated Networking](../../../virtual-network/create-vm-accelerated-networking-cli.md): Supported <br>
[Ephemeral OS Disks](../../ephemeral-os-disks.md): Supported <br>
Infiniband: Supported, GPUDirect RDMA, 8x400 Gigabit NDR <br>
NVIDIA NVLink Interconnect: Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br> 

>[!IMPORTANT]
>To get started with ND MI300X v5 VMs, refer to HPC Workload Configuration and Optimization for steps including driver and network configuration. Due to increased GPU memory I/O footprint, the ND MI300X v5 requires the use of Generation 2 VMs and marketplace images.

## Sizes in series

| Size                | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU                        | GPU Memory GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max network bandwidth  | Max NICs |
|---------------------|------|------------|------------------------|----------------------------|----------------|----------------|-----------------------------------------|------------------------------|----------|
| Standard_ND96isr_MI300X_v5 | 96 | 1850 | 1000 | 8 MI300X | 192 | 32 | 40800/612 | 80,000 Mbps | 8 |

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../../../includes/virtual-machines-common-sizes-table-defs.md)]

[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]
