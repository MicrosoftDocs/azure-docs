---
title: NV series migration guide
description: NV series migration guide
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 02/27/2023
ms.author: vikancha
---
# NV series migration guide

As more powerful GPU VM sizes become available in Azure datacenters, assess your workloads and migrate virtual machines (VMs) in the NV and NV_Promo series. These legacy VMs can be migrated into new VM series, such as NVsv3 and NVasv4, for better performance with reduced cost. The NVsv3 VM series is powered by Nvidia M60 GPUs. The NVasv4 series is powered by AMD Radeon Instinct MI25 GPUs.

The main differences between the NV and NV_Promo series and the newer NVsv3 and NVasv4 series are:
- Improved performance.
- Support for Premium storage.
- The option to choose from a fractional GPU size to multi-GPU configurations.

Both the NVsv3 and NVasv4 series have more modern cores and greater capacity.

The following section summarizes the differences between the legacy NV series and the NVsv3 and NVv4 series.
 
 ## NVsv3 series 

The NVv3-series VMs are powered by NVIDIA Tesla M60 GPUs and NVIDIA GRID technology with Intel E5-2690 v4 (Broadwell) CPUs and Intel Hyper-Threading Technology. These VMs are targeted for GPU accelerated graphics applications and virtual desktops where customers want to:
- Visualize their data.
- Simulate results to view.
- Work on CAD.
- Render and stream content. 

These VMs can also run single precision workloads, such as encoding and rendering.

NVv3 VMs support Premium storage and come with twice the system memory (RAM) when compared with the NV series. For the most up-to-date specifications, see [GPU accelerated compute VM sizes: NVsv3 series](nvv3-series.md).

| Current VM size | Target VM size | Difference in specification  |
|---|---|---|
|Standard_NV6 <br> Standard_NV6_Promo |Standard_NV12s_v3  | vCPU: 12 (+6) <br> Memory: GiB 112 (+56) <br> Temp storage (SSD) GiB: 320 (-20) <br> Max data disks: 12 (-12) <br> Accelerated networking: Yes <br> Premium storage: Yes  |
|Standard_NV12 <br> Standard_NV12_Promo |Standard_NV24s_v3  | vCPU: 24 (+12) <br>Memory: GiB 224 (+112) <br>Temp storage (SSD) GiB: 640 (-40)<br>Max data disks: 24 (-24)<br>Accelerated networking: Yes <br>Premium storage: Yes   |
|Standard_NV24 <br> Standard_NV24_Promo |Standard_NV48s_v3  | vCPU: 48 (+24) <br>Memory: GiB 448 (+224) <br>Temp storage (SSD) GiB: 1280 (-160) <br>Max data disks: 32 (-32) <br>Accelerated networking: Yes <br>Premium storage: Yes   |

## NVv4 series 

NVv4-series VMs are powered by AMD Radeon Instinct MI25 GPUs and AMD EPYC 7V12 (Rome) CPUs. With the NVv4 series, Azure introduces VMs with partial GPUs. Choose the right size VM for GPU accelerated graphics applications and virtual desktops that start at one-eighth of a GPU with a 2-GiB frame buffer to a full GPU with a 16-GiB frame buffer.

NVv4 VMs currently support only the Windows guest operating system. For the most up-to-date specifications, see [GPU accelerated compute VM sizes: NVv4 series](nvv4-series.md).

| Current VM size | Target VM size | Difference in specification  |
|---|---|---|
|Standard_NV6 <br> Standard_NV6_Promo |Standard_NV16as_v4  | vCPU: 16 (+10) <br>Memory: GiB 56  <br>Temp storage (SSD) GiB: 352 (+12) <br>Max data disks: 16 (-8) <br>Accelerated networking: Yes <br>Premium storage: Yes   |
|Standard_NV12 <br> Standard_NV12_Promo |Standard_NV32as_v4  | vCPU: 32 (+20) <br>Memory: GiB 112 <br>Temp storage (SSD) GiB: 704 (+24) <br>Max data disks: 32 (+16)<br>Accelerated networking: Yes <br>Premium storage: Yes   |
|Standard_NV24 <br> Standard_NV24_Promo |N/A  | N/A  |

## Migration steps for general changes

To deal with general changes:

1. Choose a series and size for migration. 

1. Get a quota for the target VM series.

1. Resize the current NV-series VM size to the target size.

  If the target size is NVv4, make sure to remove the Nvidia GPU driver and install the AMD GPU driver.

## Migration steps for breaking changes

To deal with breaking changes, follow the steps in the next sections.

### Select a target size for migration

After you assess your current usage, decide what type of GPU VM you need. Depending on the workload requirements, you have a few different choices. Here's how to choose:

- If the workload is graphics or visualizations and has a hard dependency on using the Nvidia GPU, migrate to the NVsv3 series.
- If the workload is graphics or visualizations and has no hard dependency on a specific type of GPU, migrate to the NVsv3 or NVVasv4 series.
 
> [!Note]
>A best practice is to select a VM size based on both cost and performance. 
>The recommendations in this article are based on a one-to-one comparison of performance metrics for the NV and NV_Promo sizes and the nearest match in another VM series.
>Before you decide on the right size, get a cost comparison by using the Azure Pricing Calculator.

### Get a quota for the target VM family 

Follow the guide to [request an increase in vCPU quota by VM family](../azure-portal/supportability/per-vm-quota-requests.md). Select the NVSv3 series or NVv4 series as the VM family name depending on the target VM size you selected for migration.

### Resize the current VM

You can [resize the VM](resize-vm.md).

## FAQ
**Q:** Which GPU driver should I use for the target VM size? 

**A:** For the NVsv3 series, use the [Nvidia GRID driver](./windows/n-series-driver-setup.md). For NVv4, use the [AMD GPU drivers](./windows/n-series-amd-driver-setup.md). 

**Q:** I use the Nvidia GPU driver extension today. Will it work for the target VM size? 

**A:** The current [Nvidia driver extension](./extensions/hpccompute-gpu-windows.md) will work for NVsv3. Use the [AMD GPU driver extensions](./extensions/hpccompute-amd-gpu-windows.md) if the target VM size is NVv4. 
 
**Q:** Which target VM series should I use if I have dependency on CUDA? 

 **A:** NVv3 supports CUDA. The NVv4 VM series with the AMD GPUs doesn't support CUDA.
