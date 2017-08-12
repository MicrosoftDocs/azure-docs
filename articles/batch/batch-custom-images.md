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

# Use a custom image to create a pool of virtual machines

When you create a pool in Azure Batch, you specify a virtual machine (VM) image that provides the operating system configuration for each compute node in the pool. You can create a pool with the Virtual Machine Configuration either by using an Azure Marketplace image, or by providing a custom VHD image that you have prepared. When you provide a custom image, you have control over how the operating system is configured at the time that each compute node is provisioned. Your custom image can also include applications and reference data that are available on the compute node as soon as it is provisioned.

Using a custom image can save you time in getting your pool's compute nodes ready to run your Batch workload. While you can always use an Azure Marketplace image and install software on each compute node after it has been provisioned, this approach may be less efficient than using a custom image. If you need to install large applications, copy significant amounts of data, or reboot the VM during the setup process, then consider using a custom image that is configured for your needs.  

## Prerequisites

- **A Batch account created with the User Subscription pool allocation mode.** To use a custom image to provision Virtual Machine pools, create your Batch account with the User Subscription [pool allocation mode](batch-api-basics.md#pool-allocation-mode). With this mode, Batch pools are allocated into the subscription where the account resides. See the [Account](batch-api-basics.md#account) section in [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md) for information on setting the pool allocation mode when you create a Batch account.

- **An Azure Storage account.** To create a Virtual Machine Configuration pool using a custom image, you need a standard, general-purpose Azure Storage account to store your custom VHD images. Custom images are stored as blobs. If you 
- 
- 
- 
- 
- To reference your custom images when you create a pool, specify the URIs of the custom image VHD blobs for the [osDisk](https://docs.microsoft.com/rest/api/batchservice/add-a-pool-to-an-account#bk_osdisk) property of the [virtualMachineConfiguration](https://docs.microsoft.com/rest/api/batchservice/add-a-pool-to-an-account#bk_vmconf) property.

    Make sure that your storage accounts meet the following criteria:   
    
    - The storage account containing the custom image needs to be in the same subscription (the user subscription).
    - The storage account containing the custom image needs to be in the same region as the Batch account. For example, if the Batch account is in region West US, the storage account must also be in region West US.
    - Only standard general-purpose storage accounts are currently supported.
    - You can specify one storage account with multiple custom VHD blobs or multiple storage accounts each having a single blob. We recommend that you use multiple storage accounts to get a better performance.
    - One unique custom image VHD blob can support up to 40 Linux VM instances or 20 Windows VM instances. You can to create copies of the VHD blob to create pools with more VMs. For example, a pool with 200 Windows VMs needs 10 unique VHD blobs specified for the **osDisk** property.
    
## Prepare a custom image

To prepare a custom image for use with Batch, you must generalize an existing installation of Linux or Windows. Generalizing an operating system installation removes machine-specific information. The result is an image that can be installed on other computers or VMs.  

> [!IMPORTANT]
> When preparing your custom image, keep in mind the following:
> - Ensure that the base OS image you use to provision your Batch pools does not have any pre-installed Azure extensions, such as the Custom Script extension. If the image contains a pre-installed extension, Azure may encounter problems deploying the VM.
> - Ensure that the base OS image you provide uses the default temp drive, as the Batch node agent currently expects the default temp drive.
>
>

- You can use any existing prepared Windows or Linux image as a custom image. Upload the image to an Azure Storage account that is in the same subscription and region as your Batch account using [AzCopy](../storage/storage-use-azcopy) or another upload tool. Keep in mind that the Batch account must have been created with its pool allocation mode set to User Subscription.

- If you are preparing a new image from scratch, you can also an Azure Marketplace image as the base image for your custom image. To customize the base image, create an Azure VM and add your applications or data to it. Then generalize the VM to serve as your custom image and save it to Azure Storage. 

    > [!IMPORTANT]
    > When you generalize an Azure VM and save your custom image to Azure Storage, Azure automatically uploads the image to a storage account that is created at the same time that the VM is created. Since that storage account needs to be in the same subscription and region as your Batch account, make sure that you also create the VM in the same subscription and region as your Azure Batch account.
    >
    > Note that Batch does not currently support using Azure managed images to provision a pool. The custom image you use to provision a pool must be stored in Azure Storage.  
    >
    >
    
This article describes how to prepare a custom image from an Azure VM and use it to create a Batch pool. 

To prepare a custom image from an Azure VM, follow these steps:

1. Create an **unmanaged** Azure VM from an Azure Marketplace image. Azure Marketplace includes images for both [Windows](../virtual-machines/windows/quick-create-portal) and [Linux](../virtual-machines/linux/quick-create-portal).
    
    On step 3 of the VM creation process, make sure that you select **No** for **Storage: Use Managed Disks** option. Also take note of the storage account name for the VM's OS disk, as this storage account is also where Azure will save your custom image:

    ![Create an unmanaged VM and note the storage account name](media/batch-custom-images/vm-create-storage.png)
 
2. Complete the process of creating your VM, and wait for it to be allocated by Azure. Here's an image that shows a VM in the Azure portal in the running state:

    ![Create a VM from a marketplace image](media/batch-custom-images/vm-status-running.png)

3. Once the VM is running, connect to it via RDP (for Windows) or SSH (for Linux). Install any necessary software or copy desired data, and then generalize the VM. Follow the steps described in [Generalize the VM](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sa-copy-generalized.md#generalize-the-vm). 

    > [!IMPORTANT]
    > When preparing your custom image, keep in mind the following:
    > - Ensure that the base OS image you use to provision your Batch pools does not have any pre-installed Azure extensions, such as the Custom Script extension. If the image contains a pre-installed extension, Azure may encounter problems deploying the VM.
    > - Ensure that the base OS image you provide uses the default temp drive, as the Batch node agent currently expects the default temp drive.
    >
    >
    
4. Follow the steps to [Log in to Azure PowerShell](../virtual-machines/windows/sa-copy-generalized.md#log-in-to-azure-powershell). To install Azure PowerShell, see [Overview of Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-4.2.0). 

5. Next, follow the steps to [Deallocate the VM and set the state to generalized](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sa-copy-generalized#deallocate-the-vm-and-set-the-state-to-generalized). 

    In the Azure portal, you'll see that the VM is deallocated:

    ![Ensure that the VM is deallocated](media/batch-custom-images/vm-status-deallocated.png)

6.  Create and save the VM image to Azure Storage using the [Save-AzureRmVMImage](https://docs.microsoft.com/powershell/module/azurerm.compute/save-azurermvmimage) PowerShell cmdlet. Follow the instructions described in [Create the image](../virtual-machines/windows/sa-copy-generalized.md#create-the-image).
    
    The VM image is saved to the Azure Storage account created in step 1 of this procedure. The image is saved to the **system** container. The `-DestinationContainername` parameter names a virtual directory within the **system** container. The `-VHDNamePrefix` parameter specifies a prefix for the blob name. This prefix is prepended to the blob name with a hyphen. 

    For example, suppose you call Save-AzureRmVMImage with the following parameters:  

    ```PowerShell
    Save-AzureRmVMImage -ResourceGroupName sample-resource-group -Name vm-custom-image -DestinationContainerName batchimages -VHDNamePrefix custom -Path C:\Temp\Images\vm-custom-image.json
    ```

    The resulting image is saved to the location and blob name shown here:

    ![Location of saved VHD in system container](media/batch-custom-images/vhd-in-vm-storage-account.png)

    > [!NOTE]
    > An Azure unmanaged VM creates several storage accounts for different purposes. If you did not note the name of the storage container for the OS disk when the VM was created, then find the storage account that contains the **system** container. Navigate through the **system** container to find the custom image using the values you specified for the **Save-AzureRmVMImage** command.

## Create a pool from a custom image in the portal

Once you have saved your custom image and you know its location, you can create a Batch pool from that image. Follow these steps to create a pool from the Azure portal:

1. Navigate to your Batch account in the Azure portal. This account must be in the same subscription and region as the storage account containing the custom image. 
2. On the **Settings** blade, select the **Pools** menu item.
3. On the **Pools** blade, select the **Add** command.
4. On the **Add Pool** blade, select **Custom Image (Linux/Windows)** from the **Image Type** dropdown. The portal displays the **Custom Image** picker. Navigate to the storage account where your custom image is located, and select the desired VHD from the container. 
5. Select the correct **Publisher/Offer/Sku** for your custom VHD.
6. Specify the remaining required settings, including the **Node size**, **Target dedicated nodes**, and **Low priority nodes**, as well as any desired optional settings.

    For example, for a Microsoft Windows Server Datacenter 2016 custom image, the **Add Pool** blade appears as shown here:

    ![Add pool from custom Windows image](media/batch-custom-images/add-pool-custom-image.png)
  
To check whether an existing pool is based on a custom image, see the **Operating System** property in the resource summary section of the **Pool** blade. If the pool was created from a custom image, it is set to **Custom VM Image**.

All custom VHDs associated with a pool are displayed on the pool's **Properties** blade:
 
## Next steps

- For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
- For information about creating a Batch account, see [Create a Batch account with the Azure portal](batch-account-create-portal.md).