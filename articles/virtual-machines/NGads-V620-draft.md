---
title: 'Overview of NGads V620 Series (preview)' #Required; page title is displayed in search results. 60 characters max.
description: Overview of NGads V620 series GPU-enabled virtual machines  #Required; this appears in search as the short description
author: isgonzalez-MSFT #Required. GitHub user alias, with correct capitalization.
ms.author: isgonzalez@microsoft.com #Required. Microsoft alias of author or team alias.
ms.service: virtual-machines #Required
ms.subservice: sizes #Required
ms.topic: conceptual #Required 
ms.date: 06/11/2023 #Required; mm/dd/yyyy format. Date the article was created or the last time it was tested and confirmed correct 

---

# NGads V620-series (preview)

> [!IMPORTANT]
> The NGads V620 Series is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 
>
> Customers can [sign up for NGads V620 Series preview today](https://aka.ms/NGadsV620-Series-Public-Preview). NGads V620 Series VMs are initially available in the East US2 and Europe West Azure regions.

The NGads V620 series are GPU-enabled virtual machines with CPU, memory resources and storage resources balanced to generate and stream high quality graphics for a high performance, interactive gaming experience hosted in Azure.  They are powered by [AMD Radeon(tm) PRO V620 GPU](https://www.amd.com/en/products/server-accelerators/amd-radeon-pro-v620) and [AMD EPYC 7763 (Milan) CPUs](https://www.amd.com/en/products/cpu/amd-epyc-7763).  The AMD Radeon PRO V620 GPUs have a maximum frame buffer of 32GB  which can be divided up to 4 ways through hardware partitioning. The AMD EPYC CPUs have a base clock speed of 2.45GHz and a boost speed of 3.5Ghz. VMs are assigned full cores instead of threads, enabling full access to AMD’s powerful “Zen 3” cores.<br.
<sup>*</sup>EPYC-018: Max boost for AMD EPYC processors is the maximum frequency achievable by any single core on the processor under normal operating conditions for server systems.

NGads instances come in four sizes, allowing customers to right-size their gaming environments for the performance and cost that best fits their business needs. The NG-series virtual machines feature partial GPUs to enable you to pick the right-sized virtual machine for GPU accelerated graphics applications and virtual desktops starting at 1/4th of a GPU with 8 GiB frame buffer to a full GPU with 32 GiB frame buffer. The NGads VMs also feature Direct Disk NVMe ranging from 1 to 4x 960GB disks per VM.

| Size | vCPU<sup>1</sup> | Memory: GiB | Temp storage (SSD) GiB | GPU | GPU Memory GiB<sup>2</sup> | Max data disks |  Max uncached disk throughput: IOPS/MBps | Direct Disk NVMe<sup>3</sup> | Max NICs / Max network bandwidth (Mbps) |
|---|---|---|---|---|---|---|---|---|---|
| Standard_NG8ads_V620_v1               | 8  | 16  | 256  | 1/4 | 8  | 8  | 12800 / 200 | 1x 960 GB | 2 / 10000 |
| Standard_NG16ads_V620_v1              | 16 | 32  | 512  | 1/2 | 16 | 16 | 25600 / 384 | 2x 960 GB | 4 / 20000 |
| Standard_NG32ads_V620_v1              | 32 | 64  | 1024 | 1   | 32 | 32 | 51200 / 768 | 4x 960 GB | 8 / 40000 |
| Standard_NG32adms_V620_v1             | 32 | 176 | 1024 | 1   | 32 | 32 | 51200 / 768 | 4x 960 GB | 8 / 40000 |

<sup>1</sup> Physical Cores.  
<sup>2</sup> The actual GPU VRAM reported in the operating system will be little less due to Error Correcting Code (ECC) support.<br>
<sup>3</sup> Local NVMe disks are ephemeral, data will be lost on these disks if you stop/deallocate your VM. Local NVMe disks aren't encrypted by Azure Storage encryption, even if you enable encryption at host.

[Premium Storage](premium-storage-performance.md): Supported<br>
Premium Storage v2: Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
Ultra Disks: Supported<br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
[VM Generation Support](generation-2.md): Generation 1 and 2<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md)<sup>1</sup>: Required<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported <br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported<br>
<br> 

## Supported operating systems and drivers

The NGads V620 Series VMs will support a new AMD Cloud Software driver that comes in two editions: A Gaming driver with regular updates to support the latest titles, as well as a Professional driver for accelerated Virtual Desktop environments, with Radeon PRO optimizations to support high-end workstation applications. <br>

You can create the VMs using CLI. (Azure AMD GPU driver extensions do not support NGads  V620 Series during preview)

•	Link to the CLI VM creation documentation https://learn.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-cli<br>
•	Install Az CLI https://learn.microsoft.com/en-us/cli/azure/install-azure-cli<br>
•	Login from command prompt:  https://learn.microsoft.com/en-us/cli/azure/authenticate-azure-cli<br>
•	Create a Resource Group: az group create -l <Location_Name> -n <RG_Name><br>
•	Create VM: az vm create   --resource-group <RG_Name> --name <VM_Name> --size <size-name>  --image <OS> --admin-username <admin_user> --admin-password <Password> --location <Location_Name><br>
- The values for “size name” can be<br>
- Standard_NG8ads_V620_v1<br>
- Standard_NG16ads_V620_v1<br>
- Standard_NG32ads_V620_v1<br>
- Standard_NG32adms_V620_v1<br>
  
To take advantage of the GPU capabilities of Azure NGads V620 Series VMs, AMD GPU drivers must be installed. NG virtual machines currently support only Windows guest operating systems.<br> 
- Driver download link::  https://go.microsoft.com/fwlink/?linkid=2234555.<br>
- Download the zip file to a local drive.  Unzip to a local drive.  Run setup.exe.


[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)


