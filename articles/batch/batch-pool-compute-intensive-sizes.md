---
title: Use compute-intensive Azure VMs with Batch | Microsoft Docs
description: How to take advantage of HPC and GPU VM sizes in Azure Batch pools
documentationcenter: ''
author: laurenhughes
manager: jeconnoc
editor: ''
ms.assetid: 
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/17/2018
ms.author: lahugh


---
# Use RDMA or GPU instances in Batch pools

To run certain Batch jobs, you can take advantage of Azure VM sizes designed for large-scale computation. For example:

* To run multi-instance [MPI workloads](batch-mpi.md), choose H-series or other sizes that have a network interface for Remote Direct Memory Access (RDMA). These sizes connect to an InfiniBand network for inter-node communication, which can accelerate MPI applications. 

* For CUDA applications, choose N-series sizes that include NVIDIA Tesla graphics processing unit (GPU) cards.

This article provides guidance and examples to use some of Azure's specialized sizes in Batch pools. For specs and background, see:

* High performance compute VM sizes ([Linux](../virtual-machines/linux/sizes-hpc.md), [Windows](../virtual-machines/windows/sizes-hpc.md)) 

* GPU-enabled VM sizes ([Linux](../virtual-machines/linux/sizes-gpu.md), [Windows](../virtual-machines/windows/sizes-gpu.md)) 

> [!NOTE]
> Certain VM sizes might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/) and [Choose a VM size for a Batch pool](batch-pool-vm-sizes.md).

## Dependencies

The RDMA or GPU capabilities of compute-intensive sizes in Batch are supported only in certain operating systems. (The list of supported operating systems is a subset of those supported for virtual machines created in these sizes.) Depending on how you create your Batch pool, you might need to install or configure additional driver or other software on the nodes. The following tables summarize these dependencies. See linked articles for details. For options to configure Batch pools, see later in this article.

### Linux pools - Virtual machine configuration

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | -------- | ----- |  -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/linux/sizes-hpc.md#rdma-capable-instances)<br/>[NC24r, NC24rs_v2, NC24rs_v3, ND24rs<sup>*</sup>](../virtual-machines/linux/n-series-driver-setup.md#rdma-network-connectivity) | RDMA | Ubuntu 16.04 LTS, or<br/>CentOS-based HPC<br/>(Azure Marketplace) | Intel MPI 5<br/><br/>Linux RDMA drivers | Enable inter-node communication, disable concurrent task execution |
| [NC, NCv2, NCv3, NDv2 series](../virtual-machines/linux/n-series-driver-setup.md) | NVIDIA Tesla GPU (varies by series) | Ubuntu 16.04 LTS, or<br/>CentOS 7.3 or 7.4<br/>(Azure Marketplace) | NVIDIA CUDA or CUDA Toolkit drivers | N/A | 
| [NV, NVv2 series](../virtual-machines/linux/n-series-driver-setup.md) | NVIDIA Tesla M60 GPU | Ubuntu 16.04 LTS, or<br/>CentOS 7.3<br/>(Azure Marketplace) | NVIDIA GRID drivers | N/A |

<sup>*</sup>RDMA-capable N-series sizes also include NVIDIA Tesla GPUs

### Windows pools - Virtual machine configuration

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | ------ | -------- | -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/windows/sizes-hpc.md#rdma-capable-instances)<br/>[NC24r, NC24rs_v2, NC24rs_v3, ND24rs<sup>*</sup>](../virtual-machines/windows/n-series-driver-setup.md#rdma-network-connectivity) | RDMA | Windows Server 2016, 2012 R2, or<br/>2012 (Azure Marketplace) | Microsoft MPI 2012 R2 or later, or<br/> Intel MPI 5<br/><br/>Windows RDMA drivers | Enable inter-node communication, disable concurrent task execution |
| [NC, NCv2, NCv3, ND, NDv2 series](../virtual-machines/windows/n-series-driver-setup.md) | NVIDIA Tesla GPU (varies by series) | Windows Server 2016 or <br/>2012 R2 (Azure Marketplace) | NVIDIA CUDA or CUDA Toolkit drivers| N/A | 
| [NV, NVv2 series](../virtual-machines/windows/n-series-driver-setup.md) | NVIDIA Tesla M60 GPU | Windows Server 2016 or<br/>2012 R2 (Azure Marketplace) | NVIDIA GRID drivers | N/A |

<sup>*</sup>RDMA-capable N-series sizes also include NVIDIA Tesla GPUs

### Windows pools - Cloud services configuration

> [!NOTE]
> N-series sizes are not supported in Batch pools with the Cloud Service configuration.
>

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | ------- | -------- | -------- | ----- |
| [H16r, H16mr, A8, A9](../virtual-machines/windows/sizes-hpc.md#rdma-capable-instances) | RDMA | Windows Server 2016, 2012 R2, 2012, or<br/>2008 R2 (Guest OS family) | Microsoft MPI 2012 R2 or later, or<br/>Intel MPI 5<br/><br/>Windows RDMA drivers | Enable inter-node communication,<br/> disable concurrent task execution |

## Pool configuration options

To configure a specialized VM size for your Batch pool, you have several options to install required software or drivers:

* For pools in the virtual machine configuration, choose a preconfigured [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/) VM image that has drivers and software preinstalled. Examples: 

  * [CentOS-based 7.4 HPC](https://azuremarketplace.microsoft.com/marketplace/apps/RogueWave.CentOSbased74HPC?tab=Overview) - includes RDMA drivers and Intel MPI 5.1

  * [Data Science Virtual Machine](../machine-learning/data-science-virtual-machine/overview.md) for Linux or Windows - includes NVIDIA CUDA drivers

  * Linux images for Batch container workloads that also include GPU and RDMA drivers:

    * [CentOS (with GPU and RDMA drivers) for Azure Batch container pools](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-batch.centos-container-rdma?tab=Overview)

    * [Ubuntu Server (with GPU and RDMA drivers) for Azure Batch container pools](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-batch.ubuntu-server-container-rdma?tab=Overview)

* Create a [custom Windows or Linux VM image](batch-custom-images.md) on which you have installed drivers, software, or other settings required for the VM size. 

* Create a Batch [application package](batch-application-packages.md) from a zipped driver or application installer, and configure Batch to deploy the package to pool nodes and install once when each node is created. For example, if the application package is an installer, create a [start task](batch-api-basics.md#start-task) command line to silently install the app on all pool nodes. Consider using an application package and a pool start task if your workload depends on a particular driver version.

  > [!NOTE] 
  > The start task must run with elevated (admin) permissions, and it must wait for success. Long-running tasks will increase the time to provision a Batch pool.
  >

* [Batch Shipyard](https://github.com/Azure/batch-shipyard) automatically configures the GPU and RDMA drivers to work transparently with containerized workloads on Azure Batch. Batch Shipyard is entirely driven with configuration files. There are many sample recipe configurations available that enable GPU and RDMA workloads such as the [CNTK GPU Recipe](https://github.com/Azure/batch-shipyard/tree/master/recipes/CNTK-GPU-OpenMPI) which preconfigures GPU drivers on N-series VMs and loads Microsoft Cognitive Toolkit software as a Docker image.


## Example: NVIDIA GPU drivers on Windows NC VM pool

To run CUDA applications on a pool of Windows NC nodes, you need to install NVDIA GPU drivers. The following sample steps use an application package to install the NVIDIA GPU drivers. You might choose this option if your workload depends on a specific GPU driver version.

1. Download a setup package for the GPU drivers on Windows Server 2016 from the [NVIDIA website](https://www.nvidia.com/Download/index.aspx) - for example, [version 411.82](https://us.download.nvidia.com/Windows/Quadro_Certified/411.82/411.82-tesla-desktop-winserver2016-international.exe). Save the file locally using a short name like *GPUDriverSetup.exe*.
2. Create a zip file of the package.
3. Upload the package to your Batch account. For steps, see the [application packages](batch-application-packages.md) guidance. Specify an application id such as *GPUDriver*, and a version such as *411.82*.
1. Using the Batch APIs or Azure portal, create a pool in the virtual machine configuration with the desired number of nodes and scale. The following table shows sample settings to install the NVIDIA GPU drivers silently using a start task:

| Setting | Value |
| ---- | ----- | 
| **Image Type** | Marketplace (Linux/Windows) |
| **Publisher** | MicrosoftWindowsServer |
| **Offer** | WindowsServer |
| **Sku** | 2016-Datacenter |
| **Node size** | NC6 Standard |
| **Application package references** | GPUDriver, version 411.82 |
| **Start task enabled** | True<br>**Command line** - `cmd /c "%AZ_BATCH_APP_PACKAGE_GPUDriver#411.82%\\GPUDriverSetup.exe /s"`<br/>**User identity** - Pool autouser, admin<br/>**Wait for success** - True

## Example: NVIDIA GPU drivers on a Linux NC VM pool

To run CUDA applications on a pool of Linux NC nodes, you need to install necessary NVIDIA Tesla GPU drivers from the CUDA Toolkit. The following sample steps create and deploy a custom Ubuntu 16.04 LTS image with the GPU drivers:

1. Deploy an Azure NC-series VM running Ubuntu 16.04 LTS. For example, create the VM in the US South Central region. 
2. Add the [NVIDIA GPU Drivers extension](../virtual-machines/extensions/hpccompute-gpu-linux.md
) to the VM by using the Azure portal, a client computer that connects to the Azure subscription, or Azure Cloud Shell. Alternatively, follow the steps to connect to the VM and [install CUDA drivers](../virtual-machines/linux/n-series-driver-setup.md) manually.
3. Follow the steps to create a [snapshot and custom Linux VM image](batch-custom-images.md) for Batch.
4. Create a Batch account in a region that supports NC VMs.
5. Using the Batch APIs or Azure portal, create a pool [using the custom image](batch-custom-images.md) and with the desired number of nodes and scale. The following table shows sample pool settings for the image:

| Setting | Value |
| ---- | ---- |
| **Image Type** | Custom Image |
| **Custom Image** | *Name of the image* |
| **Node agent SKU** | batch.node.ubuntu 16.04 |
| **Node size** | NC6 Standard |

## Example: Microsoft MPI on a Windows H16r VM pool

To run Windows MPI applications on a pool of Azure H16r VM nodes, you need to configure the HpcVmDrivers extension and install [Microsoft MPI](https://docs.microsoft.com/message-passing-interface/microsoft-mpi). Here are sample steps to deploy a custom Windows Server 2016 image with the necessary drivers and software:

1. Deploy an Azure H16r VM running Windows Server 2016. For example, create the VM in the US West region. 
2. Add the HpcVmDrivers extension to the VM by [running an Azure PowerShell command](../virtual-machines/windows/sizes-hpc.md#rdma-capable-instances
) from a client computer that connects to your Azure subscription, or using Azure Cloud Shell. 
1. Make a Remote Desktop connection to the VM.
1. Download the [setup package](https://www.microsoft.com/download/details.aspx?id=57467) (MSMpiSetup.exe) for the latest version of Microsoft MPI, and install Microsoft MPI.
1. Follow the steps to create a [snapshot and custom Windows VM image](batch-custom-images.md) for Batch.
1. Using the Batch APIs or Azure portal, create a pool [using the custom image](batch-custom-images.md) and with the desired number of nodes and scale. The following table shows sample pool settings for the image:

| Setting | Value |
| ---- | ---- |
| **Image Type** | Custom Image |
| **Custom Image** | *Name of the image* |
| **Node agent SKU** | batch.node.windows amd64 |
| **Node size** | H16r Standard |
| **Internode communication enabled** | True |
| **Max tasks per node** | 1 |

## Example: Intel MPI on a Linux H16r VM pool

To run MPI applications on a pool of Linux H-series nodes, one option is to use the [CentOS-based 7.4 HPC](https://azuremarketplace.microsoft.com/marketplace/apps/RogueWave.CentOSbased74HPC?tab=Overview) image from the Azure Marketplace. Linux RDMA drivers and Intel MPI are preinstalled. This image also supports Docker container workloads.

Using the Batch APIs or Azure portal, create a pool using this image and with the desired number of nodes and scale. The following table shows sample pool settings:

| Setting | Value |
| ---- | ---- |
| **Image Type** | Marketplace (Linux/Windows) |
| **Publisher** | OpenLogic |
| **Offer** | CentOS-HPC |
| **Sku** | 7.4 |
| **Node size** | H16r Standard |
| **Internode communication enabled** | True |
| **Max tasks per node** | 1 |

## Next steps

* To run MPI jobs on an Azure Batch pool, see the [Windows](batch-mpi.md) or [Linux](https://blogs.technet.microsoft.com/windowshpc/2016/07/20/introducing-mpi-support-for-linux-on-azure-batch/) examples.

* For examples of GPU workloads on Batch, see the [Batch Shipyard](https://github.com/Azure/batch-shipyard/) recipes.