---
title: nv-series migration guide
description: NV-series migration guide
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: vm-sizes-gpu
ms.topic: conceptual
ms.date: 01/12/2020
ms.author: vikancha
---
#  NV-series migration guide 

As more powerful GPU VM sizes  become available in Microsoft Azure datacenters, we recommend assessing your workloads and migrating the virtual machines (VMs) in the NV and NV_Promo series. These legacy VMs can be migrated into new VM series such as NVsv3 and NVasv4 series for better performance with reduced cost. NVsv3 VM series is powered by the Nvidia M60 GPUs and NVasv4 series by AMD Radeon Instinct MI25 GPUs.  The main difference between the NV, NV_Promo series, and the newer NVsv3 and NVasv4 is improved performance, support for premium storage and the option to choose from a fractional GPU size to multi-GPU configurations. Both NVsv3 and NVasv4 series have more modern cores and greater capacity.  

The following section summarizes the difference between the legacy NV series and the NVsv3 and NVv4  series.
 
 ## NVsv3 series 

The NVv3-series virtual machines are powered by NVIDIA Tesla M60 GPUs and NVIDIA GRID technology with Intel E5-2690 v4 (Broadwell) CPUs and Intel Hyper-Threading Technology. These virtual machines are targeted for GPU accelerated graphics applications and virtual desktops where customers want to visualize their data, simulate results to view, work on CAD, or render and stream content. Additionally, these virtual machines can run single precision workloads such as encoding and rendering. NVv3 virtual machines support Premium Storage and come with twice the system memory (RAM) when compared with NV-series. For the most up-to-date specifications, see [GPU Accelerated Compute VM Sizes: NVsv3-series](nvv3-series.md)

| Current VM Size | Target VM Size | Difference in Specification  |
|---|---|---|
|Standard_NV6 <br> Standard_NV6_Promo |Standard_NV12s_v3  | vCPU: 12 (+6) <br> Memory: GiB 112 (+56) <br> Temp Storage (SSD) GiB: 320 (-20) <br> Max data disks: 12 (-12) <br> Accelerated Networking: Yes <br> Premium Storage: Yes  |
|Standard_NV12 <br> Standard_NV12_Promo |Standard_NV24s_v3  | vCPU: 24 (+12) <br>Memory: GiB 224 (+112) <br>Temp Storage (SSD) GiB: 640 (-40)<br>Max data disks: 24 (-24)<br>Accelerated Networking: Yes <br>Premium Storage: Yes   |
|Standard_NV24 <br> Standard_NV24_Promo |Standard_NV48s_v3  | vCPU: 48 (+24) <br>Memory: GiB 448 (+224) <br>Temp Storage (SSD) GiB: 1280 (-160) <br>Max data disks: 32 (-32) <br>Accelerated Networking: Yes <br>Premium Storage: Yes   |

## NVsv4 series 

The NVv4-series virtual machines are powered by AMD Radeon Instinct MI25 GPUs and AMD EPYC 7V12(Rome) CPUs. With NVv4-series Azure is introducing virtual machines with partial GPUs. Pick the right sized virtual machine for GPU accelerated graphics applications and virtual desktops starting at 1/8th of a GPU with 2 GiB frame buffer to a full GPU with 16 GiB frame buffer. NVv4 virtual machines currently support only Windows guest operating system. For the most up-to-date specifications, see [GPU Accelerated Compute VM Sizes: NVsv4-series](nvv4-series.md)

| Current VM Size | Target VM Size | Difference in Specification  |
|---|---|---|
|Standard_NV6 <br> Standard_NV6_Promo |Standard_NV16as_v4  | vCPU: 16 (+10) <br>Memory: GiB 56  <br>Temp Storage (SSD) GiB: 352 (+12) <br>Max data disks: 16 (-8) <br>Accelerated Networking: Yes <br>Premium Storage: Yes   |
|Standard_NV12 <br> Standard_NV12_Promo |Standard_NV32as_v4  | vCPU: 32 (+20) <br>Memory: GiB 112 <br>Temp Storage (SSD) GiB: 704 (+24) <br>Max data disks: 32 (+16)<br>Accelerated Networking: Yes <br>Premium Storage: Yes   |
|Standard_NV24 <br> Standard_NV24_Promo |N/A  | N/A  |

## Migration Steps 
 

General Changes 

1. Choose a series and size for migration. 

2. Get quota for the target VM series 

3. Resize the current NV series VM size to the target size 

  If the target size is NVv4 then make sure to remove the Nvidia GPU driver and install the AMD GPU driver 
  
## Breaking Changes 

## Select target size for migration 
After assessing your current usage, decide what type of GPU VM you need. Depending on the workload requirements, you have few different choices. Here’s how to choose:  

If the workload is graphics/visualization and has a hard dependency on using Nvidia GPU then we recommend migrating to the NVsv3 series.  

If the workload is graphics/visualization and has no hard dependency on a specific type of GPU then we recommend NVsv3 or NVVasv4 series. 
> [!Note]
>A best practice is to select a VM size based on both cost and performance. 
>The recommendations in this guide are based on a one-to-one comparison of performance metrics for the NV and NV_Promo sizes and the nearest match in another VM series.
>Before deciding on the right size, get a cost comparison using the Azure Pricing Calculator.

## Get quota for the target VM family 

Follow the guide to [request an increase in vCPU quota by VM family](../azure-portal/supportability/per-vm-quota-requests.md). Select NVSv3 Series or NVv4 Series as the VM family name depending on the target VM size you have selected for migration.
## Resize the current virtual machine
You can [resize the virtual machine through Azure portal or PowerShell](./windows/resize-vm.md). You can also [resize the virtual machine using Azure CLI](./linux/change-vm-size.md). 

## FAQ
**Q:** Which GPU driver should I use for the target VM size? 

**A:** For NVsv3 series, use the [Nvidia GRID driver](./windows/n-series-driver-setup.md). For NVv4, use the [AMD GPU drivers](./windows/n-series-amd-driver-setup.md). 

**Q:** I use Nvidia GPU driver extension today. Will it work for the target VM size? 

**A:** The current [Nvidia driver extension](./extensions/hpccompute-gpu-windows.md) will work for NVsv3. Use the [AMD GPU driver extensions](./extensions/hpccompute-amd-gpu-windows.md) if the target VM size is NVv4. 
       
**Q:** Which target VM series should I use if I have dependency on CUDA? 

 **A:** NVv3 supports CUDA. NVv4 VM series with the AMD GPUs do not support CUDA.  
