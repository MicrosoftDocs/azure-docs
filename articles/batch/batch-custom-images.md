---
title: Provision Azure Batch pools from custom images | Microsoft Docs
description: You can create a Batch pool from a custom image to provision compute nodes that contain the software and data that you need for your application. Custom images are an efficient way to configure compute nodes to run your Batch workloads.
services: batch
author: v-dotren
manager: timlt

ms.service: batch
ms.topic: article
ms.date: 10/11/2017
ms.author: v-dotren
---

# Use a custom managed image to create a pool of virtual machines

When you create an Azure Batch pool using the [Virtual Machine Configuration](/rest/api/batchservice/Pool/Add#definitions_virtualmachineconfiguration), you can specify either an Azure Marketplace image, or provide a custom image (a custom *managed image resource*). This article talks about how to use a custom image in an Azure Batch pool.

## Why use a custom image?
With a custom image, you have control over operating system, type of disks for operating system, and data disks. Your image can include pre-installed applications and data that are available on all the Batch pool nodes as soon as they are provisioned. 

Using a custom image can save you time in getting your pool's compute nodes ready to run your Batch workload. While you can always use an Azure Marketplace image and install software on each compute node after it has been provisioned, this approach may be less efficient than using a custom image. 

Some reasons to use a custom image that is configured for your scenario include needing to:

- **Configure the operating system (OS)**. Any special configuration of the operating system can be performed on the custom image operating system disk. 
- **Pre-install applications.** You can create a managed image with pre-installed applications on the operating system disk, which is more efficient and less error-prone than installing applications using StartTask.
- **Save VM reboot time due to application installation.** Application installation generally requires rebooting the VM, which is time-consuming. This time can be saved with pre-installed applications. 
- **Copy static data to all nodes.** Static data can be made a part of a custom image by copying it to managed image data disks. Thus, making data available to each node of the pool
- **Choice of disk types.** A custom image can be created from VHD, a managed disk, or snapshot. You can choose premium storage for the OS disk as well as the data disk.


## Prerequisites



- **AAD authentication**. The Batch client API must use Azure Active Directory authentication. Azure Batch support for Azure Active Directory is documented [here](batch-aad-auth.md).
- **A managed image resource**. To create a pool of virtual machines using a custom image, you need a managed image resource. This resource must be in the same subscription and region as the Batch account. See the following section for options to create a managed image.


    
## Prepare a managed image

When preparing your custom image, keep in mind the following points:

* Ensure that the base OS image you use to provision your Batch pools does not have any pre-installed Azure extensions, such as the Custom Script extension. If the image contains a pre-installed extension, Azure may encounter problems deploying the VM.
* Ensure that the base OS image you provide uses the default temp drive. The Batch node agent currently expects the default temp drive.

The managed imaged can be created from VHD, managed disk, or snapshot. 

### To create a managed image
You can use any existing prepared Windows or Linux operating system disk to create a managed image. For example, if you wish to use a local image, then upload the local disk to an Azure Storage account that is in the same subscription and region as your Batch account using AzCopy or another upload tool.

You can also prepare a managed image from a new or existing Azure VM. 

* If you are creating a new VM, you can use an Azure Marketplace image as the base image for your managed image and then customize it. 

* Ensure that the VM is created with a managed disk. This is the default storage setting when you create a VM.

* To customize the base image, add your applications, and optionally add data disks and data to it. 

* Then generalize the VM to serve as your managed image. 

For steps to generalize an Azure VM and create a managed image, see the guidance for [Windows](../virtual-machines/windows/capture-image-resource.md) or [Linux](../virtual-machines/linux/capture-image.md) VMs.

When you capture the image, take note of the resource ID of the image, which is of the form `/subscriptions/xxxx-xxxxxx-xxxxx-xxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myImage`.  





## Create a pool from a custom image in the portal

Once you have saved your custom image and you know its resource ID, you can create a Batch pool from that image. Follow these steps to create a pool from the Azure portal:

1. Navigate to your Batch account in the Azure portal. This account must be in the same subscription and region as the resource group containing the custom image. 
2. In the **Settings** window on the left, select the **Pools** menu item.
3. In the **Pools** window, select the **Add** command.
4. On the **Add Pool** window, select **Custom Image (Linux/Windows)** from the **Image Type** dropdown. From the dropdown, specify the managed image name (short form of the resource ID) in the box.
5. Select the correct **Publisher/Offer/Sku** for your custom VHD.
6. Specify the remaining required settings, including the **Node size**, **Target dedicated nodes**, and **Low priority nodes**, as well as any desired optional settings.

    For example, for a Microsoft Windows Server Datacenter 2016 custom image, the **Add Pool** window appears as shown below:

    ![Add pool from custom Windows image](media/batch-custom-images/add-pool-custom-image.png)
  
To check whether an existing pool is based on a custom image, see the **Operating System** property in the resource summary section of the **Pool** window. If the pool was created from a custom image, it is set to **Custom VM Image**.

All custom images associated with a pool are displayed on the pool's **Properties** window.
 
## Next steps

- For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
