---
title: Provision Azure Batch pools from custom images | Microsoft Docs
description: You can create a Batch pool from a custom image to provision compute nodes that contain the software and data that you need for your application. Custom images are an efficient way to configure compute nodes to run your Batch workloads.
services: batch
author: tamram
manager: timlt

ms.service: batch
ms.topic: article
ms.date: 08/07/2017
ms.author: tamram
---

# Use a custom image to create a pool

When you create a pool in Azure Batch, you specify a virtual machine (VM) image that provides the operating system configuration for each compute node in the pool. You can create a pool either by using an Azure Marketplace image, or by providing a custom image that you have prepared. When you provide a custom image, you have control over how the operating system is configured at the time that each compute node is provisioned. Your custom image can also include applications and reference data that are available on the compute node as soon as it is provisioned.

Using a custom image can save you time in getting your pool's compute nodes ready to run your Batch workload. While you can always use an Azure Marketplace image and install software on each compute node after it has been provisioned, this approach may be less efficient than using a custom image. If you need to install large applications, copy significant amounts of data, or reboot the VM during the setup process, then consider using a custom image that is configured for your needs.  

## Prerequisites

- **A Batch account created with the User Subscription pool allocation mode.** To use a custom image to provision Virtual Machine pools, create your Batch account with the User Subscription [pool allocation mode](batch-api-basics.md#pool-allocation-mode). With this mode, Batch pools are allocated into the subscription where the account resides. See the [Account](batch-api-basics.md#account) section in [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md) for information on setting the pool allocation mode when you create a Batch account.

- **An Azure Storage account.** To create a Virtual Machine Configuration pool using a custom image, you need one or more standard Azure Storage accounts to store your custom VHD images. Custom images are stored as blobs. To reference your custom images when you create a pool, specify the URIs of the custom image VHD blobs for the [osDisk](https://docs.microsoft.com/rest/api/batchservice/add-a-pool-to-an-account#bk_osdisk) property of the [virtualMachineConfiguration](https://docs.microsoft.com/rest/api/batchservice/add-a-pool-to-an-account#bk_vmconf) property.

    Make sure that your storage accounts meet the following criteria:   
    
    - The storage accounts containing the custom image VHD blobs need to be in the same subscription as the Batch account (the user subscription).
    - The specified storage accounts need to be in the same region as the Batch account.
    - Only standard general-purpose storage accounts are currently supported. Azure Premium storage will be supported in the future.
    - You can specify one storage account with multiple custom VHD blobs or multiple storage accounts each having a single blob. We recommend you to use multiple storage accounts to get a better performance.
    - One unique custom image VHD blob can support up to 40 Linux VM instances or 20 Windows VM instances. You can to create copies of the VHD blob to create pools with more VMs. For example, a pool with 200 Windows VMs needs 10 unique VHD blobs specified for the **osDisk** property.
    
## Prepare a custom image

To prepare a custom image for use with Batch, you must generalize an existing installation of Linux or Windows. Generalizing an operating system installation removes machine-specific information. The result is an image that can be installed on other computers or VMs.  

You can use an Azure Marketplace image as the base image for your custom image. To customize the base image, create an Azure VM and add your applications or data to it. Then generalize the VM to serve as your custom image.   

For information about preparing custom Linux images from Azure VMs, see [How to create an image of a virtual machine or VHD](../virtual-machines/linux/capture-image.md). 

For information about preparing custom Windows images from Azure VMs, see [Create custom VM images with Azure PowerShell](../virtual-machines/windows/tutorial-custom-images.md) and [Sysprep (System Preparation) Overview](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview). 

> [!IMPORTANT]
> When preparing your custom image, keep in mind the following:
> - Ensure that the base OS image you use to provision your Batch pools does not have any pre-installed Azure extensions, such as the Custom Script extension. If the image contains a pre-installed extension, Azure may encounter problems deploying the VM.
> - Ensure that the base OS image you provide uses the default temp drive, as the Batch node agent currently expects the default temp drive.
>
>
    
## Create a pool from a custom image in the portal

To create a pool from a custom image using the Azure portal:

1. Navigate to your Batch account in the Azure portal.
2. On the **Settings** blade, select the **Pools** menu item.
3. On the **Pools** blade, select the **Add** command; the **Add pool** blade is displayed.
4. Select **Custom Image (Linux/Windows)** from the **Image Type** dropdown. The portal displays the **Custom Image** picker. Choose one or more VHDs from the same container and click the **Select** button. 
   Support for selecting VHDs from different storage accounts and different containers will be available in a future release.
5. Select the correct **Publisher/Offer/Sku** for your custom VHDs, select the desired **Caching** mode, then fill in all the other parameters for the pool.
6. To check if a pool is based on a custom image, see the **Operating System** property in the resource summary section of the **Pool** blade. The value of this property should be **Custom VM image**.
7. All custom VHDs associated with a pool are displayed on the pool's **Properties** blade.
 
## Next steps

- For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
- For information about creating a Batch account, see [Create a Batch account with the Azure portal](batch-account-create-portal.md).