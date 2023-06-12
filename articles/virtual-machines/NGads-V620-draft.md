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

# NGads V620-series (Preview)

ADD HIGHLIGHT
Customers can sign up for NGads V620 Series preview today. NGads V620 Series VMs are initially available in the East US2, Europe West and West US3 Azure regions.
END HIGHLIGHT
The NGads V620 series are GPU-enabled virtual machines powered by AMD Radeon PRO V620 GPU and AMD EPYC 7763 CPUs.  The AMD Radeon PRO V620 GPUs have a maximum frame buffer of 32GB  which can be divided up to 4 ways through hardware partitioning. The AMD EPYC CPUs have a base clock speed of 2.45GHz and a boost speed of 3.5Ghz<sup>*</sup>. VMs are assigned full cores instead of threads, enabling full access to AMD’s powerful “Zen 3” cores.
<sup>*</sup>EPYC-018: Max boost for AMD EPYC processors is the maximum frequency achievable by any single core on the processor under normal operating conditions for server systems.

NGads instances come in four sizes, allowing customers to right-size their gaming environments for the performance and cost that best fits their business needs. The NG-series virtual machines feature partial GPUs to enable you to pick the right-sized virtual machine for GPU accelerated graphics applications and virtual desktops starting at 1/4th of a GPU with 8 GiB frame buffer to a full GPU with 32 GiB frame buffer. The NGads VMs also feature Direct Disk NVMe ranging from 1 to 4x 960GB disks per VM.

TEMPLATE TEXT FOR FORMATTING STARTING BELOW
The Ddv5 and Ddsv5-series Virtual Machines run on the 3rd Generation Intel&reg; Xeon&reg; Platinum 8370C (Ice Lake) processor in a [hyper threaded](https://www.intel.com/content/www/us/en/architecture-and-technology/hyper-threading/hyper-threading-technology.html) configuration, providing a better value proposition for most general-purpose workloads. This new processor features an all core turbo clock speed of 3.5 GHz with [Intel&reg; Turbo Boost Technology](https://www.intel.com/content/www/us/en/architecture-and-technology/turbo-boost/turbo-boost-technology.html), [Intel&reg; Advanced-Vector Extensions 512 (Intel&reg; AVX-512)](https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html) and [Intel&reg; Deep Learning Boost](https://software.intel.com/content/www/us/en/develop/topics/ai/deep-learning-boost.html). These virtual machines offer a combination of vCPUs, memory and temporary storage able to meet the requirements associated with most enterprise workloads, such as small-to-medium databases, low-to-medium traffic web servers, application servers and more.


## Ddv5-series
Ddv5-series virtual machines run on the 3rd Generation Intel® Xeon® Platinum 8370C (Ice Lake) processor reaching an all core turbo clock speed of up to 3.5 GHz. These virtual machines offer up to 96 vCPU and 384 GiB of RAM as well as fast, local SSD storage up to 3,600 GiB. Ddv5-series virtual machines provide a better value proposition for most general-purpose workloads compared to the prior generation (for example, increased scalability and an upgraded CPU class). These virtual machines also feature fast and large local SSD storage (up to 3,600 GiB).

REMOVE TEXT STARTING ABOVE

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


