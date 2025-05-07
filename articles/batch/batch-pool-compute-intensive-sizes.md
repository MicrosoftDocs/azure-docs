---
title: Use compute-intensive Azure VMs with Batch
description: How to take advantage of HPC and GPU virtual machine sizes in Azure Batch pools. Learn about OS dependencies and see several scenario examples.
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 02/04/2025
---
# Use RDMA or GPU instances in Batch pools


To run certain Batch jobs, you can take advantage of Azure VM sizes designed for large-scale computation. For example:

* To run multi-instance [MPI workloads](batch-mpi.md), choose HB, HC, NC, or ND series or other sizes that have a network interface for Remote Direct Memory Access (RDMA). These sizes connect to an InfiniBand network for inter-node communication, which can accelerate MPI applications.

* For CUDA applications, choose N-series sizes that include NVIDIA Tesla graphics processing unit (GPU) cards.

This article provides guidance and examples to use some of Azure's specialized sizes in Batch pools. For specs and background, see:

* High performance compute VM sizes ([Linux](/azure/virtual-machines/sizes-hpc), [Windows](/azure/virtual-machines/sizes-hpc))

* GPU-enabled VM sizes ([Linux](/azure/virtual-machines/sizes-gpu), [Windows](/azure/virtual-machines/sizes-gpu))

> [!NOTE]
> Certain VM sizes might not be available in the regions where you create your Batch accounts. To check that a size is available, see [Products available by region](https://azure.microsoft.com/regions/services/) and [Choose a VM size for a Batch pool](batch-pool-vm-sizes.md).

## Dependencies

The RDMA or GPU capabilities of compute-intensive sizes in Batch are supported only in certain operating systems. The supported operating systems for these VM sizes include only a subset of those available for virtual machine creation. Depending on how you create your Batch pool, you might need to install or configure extra driver or other software on the nodes. The following tables summarize these dependencies. See linked articles for details. For options to configure Batch pools, see later in this article.

### Linux pools - Virtual machine configuration

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | -------- | ----- |  -------- | ----- |
| [H16r, H16mr](/azure/virtual-machines/sizes-hpc)<br/>[NC24r, NC24rs_v2, NC24rs_v3, ND24rs<sup>*</sup>](/azure/virtual-machines/linux/n-series-driver-setup#rdma-network-connectivity) | RDMA | Ubuntu 22.04 LTS <br/> (Azure Marketplace) | Intel MPI 5<br/><br/>Linux RDMA drivers | Enable inter-node communication, disable concurrent task execution |
| [NCv3, NDv2, NDv4, NDv5 series](/azure/virtual-machines/linux/n-series-driver-setup) | NVIDIA Tesla GPU (varies by series) | Ubuntu 22.04 LTS  <br/> (Azure Marketplace) | NVIDIA CUDA or CUDA Toolkit drivers | N/A |
| [NVv3, NVv4, NVv5 series](/azure/virtual-machines/linux/n-series-driver-setup) | Accelerated Visualization GPU | Ubuntu 22.04 LTS <br/> (Azure Marketplace) | NVIDIA GRID drivers or AMD GPU drivers | N/A |

<sup>*</sup>RDMA-capable N-series sizes also include NVIDIA Tesla GPUs

> [!Important]
> This document references a release version of Linux that is nearing or at, End of Life(EOL). Please consider updating to a more current version.


### Windows pools - Virtual Machine Configuration

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | ------ | -------- | -------- | ----- |
| [H16r, H16mr](/azure/virtual-machines/sizes-hpc)<br/>[NC24r, NC24rs_v2, NC24rs_v3, ND24rs<sup>*</sup>](/azure/virtual-machines/windows/n-series-driver-setup#rdma-network-connectivity) | RDMA | Windows Server 2016, 2012 R2, or<br/>2012 (Azure Marketplace) | Microsoft MPI 2012 R2 or later, or<br/> Intel MPI 5<br/><br/>Windows RDMA drivers | Enable inter-node communication, disable concurrent task execution |
| [NC, NCv2, NCv3, ND, NDv2 series](/azure/virtual-machines/windows/n-series-driver-setup) | NVIDIA Tesla GPU (varies by series) | Windows Server 2016 or <br/>2012 R2 (Azure Marketplace) | NVIDIA CUDA or CUDA Toolkit drivers| N/A |
| [NV, NVv2, NVv4 series](/azure/virtual-machines/windows/n-series-driver-setup) | NVIDIA Tesla M60 GPU | Windows Server 2016 or<br/>2012 R2 (Azure Marketplace) | NVIDIA GRID drivers | N/A |

<sup>*</sup>RDMA-capable N-series sizes also include NVIDIA Tesla GPUs

### Windows pools - Cloud Services Configuration

> [!WARNING]
> Cloud Services Configuration pools are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/). Please use Virtual Machine Configuration pools instead.

| Size | Capability | Operating systems | Required software | Pool settings |
| -------- | ------- | -------- | -------- | ----- |
| [H16r, H16mr](/azure/virtual-machines/sizes-hpc) | RDMA | Windows Server 2016, 2012 R2, 2012, or<br/>2008 R2 (Guest OS family) | Microsoft MPI 2012 R2 or later, or<br/>Intel MPI 5<br/><br/>Windows RDMA drivers | Enable inter-node communication,<br/> disable concurrent task execution |

> [!NOTE]
> N-series sizes are not supported in  Cloud Services Configuration pools.

## Pool configuration options

To configure a specialized VM size for your Batch pool, you have several options to install required software or drivers:

* For pools in the virtual machine configuration, choose a preconfigured [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/) VM image that has drivers and software preinstalled. Examples:

    * [Data Science Virtual Machine](/azure/machine-learning/data-science-virtual-machine/overview) for Linux or Windows - includes NVIDIA CUDA drivers

    * Linux images for Batch container workloads that also include GPU and RDMA drivers:

    * [Ubuntu Server (with GPU and RDMA drivers) for Azure Batch container pools](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-azure-batch.ubuntu-server-container-rdma?tab=Overview)

* Create a [custom Windows or Linux VM image](batch-sig-images.md) with installed drivers, software, or other settings required for the VM size.

* [Install GPU and RDMA drivers by VM extension](create-pool-extensions.md).

* Create a Batch [application package](batch-application-packages.md) from a zipped driver or application installer. Then, configure Batch to deploy this package to pool nodes and install once when each node is created. For example, if the application package is an installer, create a [start task](jobs-and-tasks.md#start-task) command line to silently install the app on all pool nodes. Consider using an application package and a pool start task if your workload depends on a particular driver version.

  > [!NOTE]
  > The start task must run with elevated (admin) permissions, and it must wait for success. Long-running tasks will increase the time to provision a Batch pool.
  >

## Example: NVIDIA GPU drivers on Windows NC VM pool

To run CUDA applications on a pool of Windows NC nodes, you need to install NVIDIA GPU drivers. The following sample steps use an application package to install the NVIDIA GPU drivers. You might choose this option if your workload depends on a specific GPU driver version.

1. Download a setup package for the GPU drivers on Windows Server 2016 from the [NVIDIA website](https://www.nvidia.com/Download/index.aspx) - for example, [version 411.82](https://us.download.nvidia.com/Windows/Quadro_Certified/411.82/411.82-tesla-desktop-winserver2016-international.exe). Save the file locally using a short name like *GPUDriverSetup.exe*.
2. Create a zip file of the package.
3. Upload the package to your Batch account. For steps, see the [application packages](batch-application-packages.md) guidance. Specify an application ID such as *GPUDriver*, and a version such as *411.82*.
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

To run CUDA applications on a pool of Linux NC nodes, you need to install necessary NVIDIA Tesla GPU drivers from the CUDA Toolkit. The following sample steps create and deploy a custom Ubuntu 22.04 LTS image with the GPU drivers:

1. Deploy an Azure NC-series VM running Ubuntu 22.04 LTS. For example, create the VM in the US South Central region.
2. Add the [NVIDIA GPU Drivers extension](/azure/virtual-machines/extensions/hpccompute-gpu-linux) to the VM by using the Azure portal, a client computer that connects to the Azure subscription, or Azure Cloud Shell. Alternatively, follow the steps to connect to the VM and [install CUDA drivers](/azure/virtual-machines/linux/n-series-driver-setup) manually.
3. Follow the steps to create an [Azure Compute Gallery image](batch-sig-images.md) for Batch.
4. Create a Batch account in a region that supports NC VMs.
5. Using the Batch APIs or Azure portal, create a pool [using the custom image](batch-sig-images.md) and with the desired number of nodes and scale. The following table shows sample pool settings for the image:

| Setting | Value |
| ---- | ---- |
| **Image Type** | Custom Image |
| **Custom Image** | *Name of the image* |
| **Node agent SKU** | batch.node.ubuntu 22.04 |
| **Node size** | NC6 Standard |

## Example: Microsoft MPI on a Windows H16r VM pool

To run Windows MPI applications on a pool of Azure H16r VM nodes, you need to configure the HpcVmDrivers extension and install [Microsoft MPI](/message-passing-interface/microsoft-mpi). Here are sample steps to deploy a custom Windows Server 2016 image with the necessary drivers and software:

1. Deploy an Azure H16r VM running Windows Server 2016. For example, create the VM in the US West region.
2. Add the HpcVmDrivers extension to the VM by [running an Azure PowerShell command](/azure/virtual-machines/sizes-hpc) from a client computer that connects to your Azure subscription, or using Azure Cloud Shell.
1. Make a Remote Desktop connection to the VM.
1. Download the [setup package](https://www.microsoft.com/download/details.aspx?id=57467) (MSMpiSetup.exe) for the latest version of Microsoft MPI, and install Microsoft MPI.
1. Follow the steps to create an [Azure Compute Gallery image](batch-sig-images.md) for Batch.
1. Using the Batch APIs or Azure portal, create a pool [using the Azure Compute Gallery](batch-sig-images.md) and with the desired number of nodes and scale. The following table shows sample pool settings for the image:

| Setting | Value |
| ---- | ---- |
| **Image Type** | Custom Image |
| **Custom Image** | *Name of the image* |
| **Node agent SKU** | batch.node.windows amd64 |
| **Node size** | H16r Standard |
| **Internode communication enabled** | True |
| **Max tasks per node** | 1 |

## Next steps

* To run MPI jobs on an Azure Batch pool, see the [Windows](batch-mpi.md) or [Linux](/archive/blogs/windowshpc/introducing-mpi-support-for-linux-on-azure-batch) examples.
