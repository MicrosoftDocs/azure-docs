---
title: NCv2-series - Azure Virtual Machines
description: Specifications for the NCv2-series VMs.
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.date: 02/03/2020
ms.author: jushiman
---

# NCv2-series

NCv2-series VMs are powered by [NVIDIA Tesla P100](https://www.nvidia.com/data-center/tesla-p100/) GPUs. These GPUs can provide more than 2x the computational performance of the NC-series. Customers can take advantage of these updated GPUs for traditional HPC workloads such as reservoir modeling, DNA sequencing, protein analysis, Monte Carlo simulations, and others. In addition to the GPUs, the NCv2-series VMs are also powered by Intel Xeon E5-2690 v4 (Broadwell) CPUs.

The NC24rs v2 configuration provides a low latency, high-throughput network interface optimized for tightly coupled parallel computing workloads.

Premium Storage:  Supported

Premium Storage caching:  Supported

Live Migration: Not Supported

Memory Preserving Updates: Not Supported

> [!IMPORTANT]
> For this VM series, the vCPU (core) quota in your subscription is initially set to 0 in each region. [Request a vCPU quota increase](../azure-supportability/resource-manager-core-quotas-request.md) for this series in an [available region](https://azure.microsoft.com/regions/services/).
>
| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU memory: GiB | Max data disks | Max uncached disk throughput: IOPS/MBps | Max NICs |
|---|---|---|---|---|---|---|---|---|
| Standard_NC6s_v2    | 6  | 112 | 736  | 1 | 16 | 12 | 20000/200 | 4 |
| Standard_NC12s_v2   | 12 | 224 | 1474 | 2 | 32 | 24 | 40000/400 | 8 |
| Standard_NC24s_v2   | 24 | 448 | 2948 | 4 | 64 | 32 | 80000/800 | 8 |
| Standard_NC24rs_v2* | 24 | 448 | 2948 | 4 | 64 | 32 | 80000/800 | 8 |

1 GPU = one P100 card.

*RDMA capable

[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Supported operating systems and drivers

To take advantage of the GPU capabilities of Azure N-series VMs, NVIDIA GPU drivers must be installed.

The [NVIDIA GPU Driver Extension](./extensions/hpccompute-gpu-windows.md) installs appropriate NVIDIA CUDA or GRID drivers on an N-series VM. Install or manage the extension using the Azure portal or tools such as Azure PowerShell or Azure Resource Manager templates. See the [NVIDIA GPU Driver Extension documentation](./extensions/hpccompute-gpu-windows.md) for supported operating systems and deployment steps. For general information about VM extensions, see [Azure virtual machine extensions and features](./extensions/overview.md).

If you choose to install NVIDIA GPU drivers manually, see [N-series GPU driver setup for Windows](./windows/n-series-driver-setup.md) or [N-series GPU driver setup for Linux](./linux/n-series-driver-setup.md) for supported operating systems, drivers, installation, and verification steps.

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
