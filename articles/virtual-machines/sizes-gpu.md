---
title: Azure VM sizes - GPU | Microsoft Docs
description: Lists the different GPU optimized sizes available for virtual machines in Azure. Lists information about the number of vCPUs, data disks and NICs as well as storage throughput and network bandwidth for sizes in this series.
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/03/2020
ms.author: jushiman
---

# GPU optimized virtual machine sizes

GPU optimized VM sizes are specialized virtual machines available with single, multiple, or fractional GPUs. These sizes are designed for compute-intensive, graphics-intensive, and visualization workloads. This article provides information about the number and type of GPUs, vCPUs, data disks, and NICs. Storage throughput and network bandwidth are also included for each size in this grouping.

- [NC-series](nc-series.md), [NCv2-series](ncv2-series.md), [NCv3-series](ncv3-series.md) sizes are optimized for compute-intensive and network-intensive applications and algorithms. Some examples are CUDA and OpenCL-based applications and simulations, AI, and Deep Learning. The NCv3-series is focused on high-performance computing workloads featuring NVIDIA’s Tesla V100 GPU. The NC-series uses the Intel Xeon E5-2690 v3 2.60GHz v3 (Haswell) processor, and the NCv2-series and NCv3-series VMs use the Intel Xeon E5-2690 v4 (Broadwell) processor.

- [ND-series](nd-series.md), and [NDv2-series](ndv2-series.md) sizes are focused on training and inference scenarios for deep learning. They use the NVIDIA Tesla P40 GPU and the Intel Xeon E5-2690 v4 (Broadwell) processor. The NDv2-series uses the Intel Xeon Platinum 8168 (Skylake) processor.

- [NV-series](nv-series.md) and [NVv3-series](nvv3-series.md) sizes are optimized and designed for remote visualization, streaming, gaming, encoding, and VDI scenarios using frameworks such as OpenGL and DirectX. These VMs are backed by the NVIDIA Tesla M60 GPU.

- [NVv4-series](nvv4-series.md) VM sizes optimized and designed for VDI and remote visualization. With partitioned GPUs, NVv4 offers the right size for workloads requiring smaller GPU resources. These VMs are backed by the AMD Radeon Instinct MI25 GPU. NVv4 VMs currently support only Windows guest operating system.

## Supported operating systems and drivers

To take advantage of the GPU capabilities of Azure N-series VMs, NVIDIA or AMD GPU drivers must be installed.

- For VMs backed by NVIDIA GPUs, the [NVIDIA GPU Driver Extension](/azure/virtual-machines/extensions/hpccompute-gpu-windows) installs appropriate NVIDIA CUDA or GRID drivers. Install or manage the extension using the Azure portal or tools such as Azure PowerShell or Azure Resource Manager templates. See the [NVIDIA GPU Driver Extension documentation](/azure/virtual-machines/extensions/hpccompute-gpu-windows) for supported operating systems and deployment steps. For general information about VM extensions, see [Azure virtual machine extensions and features](/azure/virtual-machines/extensions/overview).

   Alternatively, you may install NVIDIA GPU drivers manually. See [Install NVIDIA GPU drivers on N-series VMs running Windows](/azure/virtual-machines/windows/n-series-driver-setup) or [Install NVIDIA GPU drivers on N-series VMs running Linux](/azure/virtual-machines/linux/n-series-driver-setup) for supported operating systems, drivers, installation, and verification steps.

- For VMs backed by AMD GPUs, see [Install AMD GPU drivers on N-series VMs running Windows](/azure/virtual-machines/windows/n-series-amd-driver-setup) for supported operating systems, drivers, installation, and verification steps.

## Deployment considerations

- For availability of N-series VMs, see [Products available by region](https://azure.microsoft.com/regions/services/).

- N-series VMs can only be deployed in the Resource Manager deployment model.

- N-series VMs differ in the type of Azure Storage they support for their disks. NC and NV VMs only support VM disks that are backed by Standard Disk Storage (HDD). NCv2, NCv3, ND, NDv2, and NVv2 VMs only support VM disks that are backed by Premium Disk Storage (SSD).

- If you want to deploy more than a few N-series VMs, consider a pay-as-you-go subscription or other purchase options. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.

- You might need to increase the cores quota (per region) in your Azure subscription, and increase the separate quota for NC, NCv2, NCv3, ND, NDv2, NV, or NVv2 cores. To request a quota increase, [open an online customer support request](../azure-portal/supportability/how-to-create-azure-support-request.md) at no charge. Default limits may vary depending on your subscription category.

## Other sizes

- [General purpose](sizes-general.md)
- [Compute optimized](sizes-compute.md)
- [High performance compute](sizes-hpc.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
