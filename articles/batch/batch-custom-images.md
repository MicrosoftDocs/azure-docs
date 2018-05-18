---
title: Provision Azure Batch pools from custom images | Microsoft Docs
description: You can create a Batch pool from a custom image to provision compute nodes that contain the software and data that you need for your application. Custom images are an efficient way to configure compute nodes to run your Batch workloads.
services: batch
author: dlepow
manager: jeconnoc

ms.service: batch
ms.topic: article
ms.date: 04/23/2018
ms.author: danlep
---

# Use a managed custom image to create a pool of virtual machines 

When you create an Azure Batch pool using the Virtual Machine Configuration, you specify a VM image that provides the operating system for each compute node in the pool. You can create a pool of virtual machines either with an Azure Marketplace image, or with a custom image (a VM image you have created and configured yourself). The custom image must be a *managed image* resource in the same Azure subscription and region as the Batch account.

## Why use a custom image?
When you provide a custom image, you have control over the operating system configuration and the type of operating system and data disks to be used. Your custom image can include applications and reference data that become available on all the Batch pool nodes as soon as they are provisioned.

Using a custom image saves time in preparing your pool's compute nodes to run your Batch workload. While you can use an Azure Marketplace image and install software on each compute node after provisioning, using a custom image might be more efficient.

Using a custom image configured for your scenario can provide several advantages:

- **Configure the operating system (OS)**. You can perform special configuration of the operating system on the custom image's operating system disk. 
- **Pre-install applications.** You can create a custom image with pre-installed applications on the OS disk, which is more efficient and less error-prone than installing applications after provisioning the compute nodes using StartTask.
- **Save reboot time on VMs.** Application installation typically requires rebooting the VM, which is time-consuming. You can save reboot time by pre-installing applications. 
- **Copy very large amounts of data once.** You can make static data part of the managed custom image by copying it to a managed image's data disks. This only needs to be done once and makes data available to each node of the pool.
- **Choice of disk types.** You can create a managed custom image from a VHD, from a managed disk of an Azure VM, a snapshot of these disks, or your own Linux or Windows installation that you have configured. You have the choice of using premium storage for the OS disk and the data disk.
- **Grow pools to any size.** When you use a managed custom image to create a pool, the pool can grow to any size you request. You do not need to make copies of image blob VHDs to accommodate the number of VMs. 


## Prerequisites

- **A managed image resource**. To create a pool of virtual machines using a custom image, you need to create a managed image resource in the same Azure subscription and region as the Batch account. For options to prepare a managed image, see the following section.
- **Azure Active Directory (AAD) authentication**. The Batch client API must use AAD authentication. Azure Batch support for AAD is documented in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).

    
## Prepare a custom image
You can prepare a managed image from a VHD, from an Azure VM with managed disks, or from a VM snapshot. For Batch, we recommend creating a managed image from a VM with managed disks or a VM snapshot. The managed image and the underlying resource should exist for the pools to scale up and can be removed after the pool is deleted. 

When preparing your image, keep in mind the following points:

* Ensure that the base OS image you use to provision your Batch pools does not have any pre-installed Azure extensions, such as the Custom Script extension. If the image contains a pre-installed extension, Azure may encounter problems deploying the VM.
* Ensure that the base OS image you provide uses the default temp drive. The Batch node agent currently expects the default temp drive.
* The managed image resource referenced by a Batch Pool cannot be deleted for the lifetime of the pool. If the managed image resource is deleted, then the pool cannot grow any further. 

### To create a managed image
You can use any existing prepared Windows or Linux operating system disk to create a managed image. For example, if you wish to use a local image, then upload the local disk to an Azure Storage account that is in the same subscription and region as your Batch account using AzCopy or another upload tool. For detailed steps to upload a VHD and create a managed image, see the guidance for [Windows](../virtual-machines/windows/upload-generalized-managed.md) or [Linux](../virtual-machines/linux/upload-vhd.md) VMs.

You can also prepare a managed image from a new or existing Azure VM, or VM snapshot. 

* If you are creating a new VM, you can use an Azure Marketplace image as the base image for your managed image and then customize it. 

* If you plan to capture the image using the portal, ensure that the VM is created with a managed disk. This is the default storage setting when you create a VM.

* Once the VM is running, connect to it via RDP (for Windows) or SSH (for Linux). Install any necessary software or copy desired data, and then generalize the VM.  

For steps to generalize an Azure VM and create a managed image, see the guidance for [Windows](../virtual-machines/windows/capture-image-resource.md) or [Linux](../virtual-machines/linux/capture-image.md) VMs.

Depending on how you plan to create a Batch pool with the image, you need the following identifier for the image:

* If you plan to create a pool with the image using the Batch APIs, the **resource ID** of the image, which is of the form `/subscriptions/xxxx-xxxxxx-xxxxx-xxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myImage`. 
* If you plan to use the portal, the **name** of the image. 





## Create a pool from a custom image in the portal

Once you have saved your custom image and you know its resource ID or name, you can create a Batch pool from that image. The following steps show you how to create a pool from the Azure portal.

> [!NOTE]
> If you are creating the pool using one of the Batch APIs, make sure that the identity you use for AAD authentication has permissions to the image resource. See [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).
>

1. Navigate to your Batch account in the Azure portal. This account must be in the same subscription and region as the resource group containing the custom image. 
2. In the **Settings** window on the left, select the **Pools** menu item.
3. In the **Pools** window, select the **Add** command.
4. On the **Add Pool** window, select **Custom Image (Linux/Windows)** from the **Image Type** dropdown. From the **Custom VM image** dropdown, select the image name (short form of the resource ID).
5. Select the correct **Publisher/Offer/Sku** for your custom image.
6. Specify the remaining required settings, including the **Node size**, **Target dedicated nodes**, and **Low priority nodes**, as well as any desired optional settings.

    For example, for a Microsoft Windows Server Datacenter 2016 custom image, the **Add Pool** window appears as shown below:

    ![Add pool from custom Windows image](media/batch-custom-images/add-pool-custom-image.png)
  
To check whether an existing pool is based on a custom image, see the **Operating System** property in the resource summary section of the **Pool** window. If the pool was created from a custom image, it is set to **Custom VM Image**.

All custom images associated with a pool are displayed on the pool's **Properties** window.
 
## Next steps

- For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
