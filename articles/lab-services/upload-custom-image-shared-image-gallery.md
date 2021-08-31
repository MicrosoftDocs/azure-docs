---
title: Azure Lab Services - How to bring a Windows custom image from your physical lab environment
description: Describes how to bring a Windows custom image from your physical lab environment.
ms.date: 07/27/2021
ms.topic: how-to
---

# Bring a Windows custom image from a physical lab environment

The steps in this article show how to import a custom image that starts from your physical lab environment.  With this approach, you create a VHD from your physical environment and import the VHD into a shared image gallery so that it can be used within Lab Services.  Before you use this approach for creating a custom image, read the article [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md) to decide the best approach for your scenario.

## Prerequisites

You will need permission to create an [Azure managed disk](../virtual-machines/managed-disks-overview.md) in your school's Azure subscription to complete the steps in this article.

When moving images from a physical lab environment to Lab Services, you should restructure each image so that it only includes software needed for a lab's class.  For more information, read the [Moving from a Physical Lab to Azure Lab Services](https://techcommunity.microsoft.com/t5/azure-lab-services/moving-from-a-physical-lab-to-azure-lab-services/ba-p/1654931) blog post.

## Prepare a custom image using Hyper-V Manager

The following steps show how to create a Windows image from a Windows Hyper-V virtual machine (VM) using Hyper-V Manager:

1. Start with a Hyper-V VM in your physical lab environment that has been created from your image.  Read the article on [how to create a virtual machine in Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v) for more information.
    -   The VM must be created as a **Generation 1** VM.
    -   Use the **Default Switch** network configuration option to allow the VM to connect to the internet.
    -   The VM's virtual disk must be a fixed size VHD.  The disk size must *not* be greater than 128 GB. When you create the VM, enter the size of the disk as shown in the below image.
       
        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/connect-virtual-hard-disk.png" alt-text="Connect virtual hard disk":::

    Images with disk size greater than 128 GB are *not* supported by Lab Services. 
   
1. Connect to the Hyper-V VM and [prepare it for Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md) by following these steps:
    1. [Set Windows configurations for Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md#set-windows-configurations-for-azure).
    1. [Check the Windows Services that are needed to ensure VM connectivity](../virtual-machines/windows/prepare-for-upload-vhd-image.md#check-the-windows-services).
    1. [Update remote desktop registry settings](../virtual-machines/windows/prepare-for-upload-vhd-image.md#update-remote-desktop-registry-settings).
    1. [Configure Windows Firewall rules](../virtual-machines/windows/prepare-for-upload-vhd-image.md#configure-windows-firewall-rules).
    1. [Install Windows Updates](../virtual-machines/windows/prepare-for-upload-vhd-image.md).
    1. [Install Azure VM Agent and additional configuration as shown here](../virtual-machines/windows/prepare-for-upload-vhd-image.md#complete-the-recommended-configurations) 
    	
    You can upload either specialized or generalized images to a shared image gallery and use them to create labs.  The steps above will create a specialized image. If you need to instead create a generalized image, you also will need to [run SysPrep](../virtual-machines/windows/prepare-for-upload-vhd-image.md#determine-when-to-use-sysprep).  

    You should create a specialized image if you want to maintain machine-specific information and user profiles.  For more information about the differences between generalized and specialized images, see [Generalized and specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images).

1. Since **Hyper-V** creates a **VHDX** file by default, you need to convert this to a VHD file.
    1. Navigate to **Hyper-V Manager** -> **Action** -> **Edit Disk**.
    1. Next, **Convert** the disk from a VHDX to a VHD.  
     - If you expand the disk size, make sure that you do *not* exceed 128 GB.        
        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/choose-action.png" alt-text="Choose action":::   

    For more information, read the article that shows how to [convert the virtual disk to a fixed size VHD](../virtual-machines/windows/prepare-for-upload-vhd-image.md#convert-the-virtual-disk-to-a-fixed-size-vhd).

To help with resizing the VHD and converting to a VHDX, you can also use the following PowerShell cmdlets:
- [Resize-VHD](/powershell/module/hyper-v/resize-vhd?view=windowsserver2019-ps)
- [Convert-VHD](/powershell/module/hyper-v/convert-vhd?view=windowsserver2019-ps)

## Upload the custom image to a shared image gallery

1. Upload the VHD to Azure to create a managed disk.
    1. You can use either Storage Explorer or AzCopy from the command line, as shown in [Upload a VHD to Azure or copy a managed disk to another region](../virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell.md).        

    1. After you've uploaded the VHD, you should now have a managed disk that you can see in the Azure portal. 
    
    If your machine goes to sleep or locks, the upload process may get interrupted and fail.  Also, make sure after AzCopy completes, that you revoke the SAS access to the disk.  Otherwise, when you attempt to create an image from the disk, you will see an error: **Operation 'Create Image' is not supported with disk 'your disk name' in state 'Active Upload'.  Error Code: OperationNotAllowed**
    
    The Azure portal's **Size+Performance** tab for the managed disk allows you to change your disk size. As mentioned before, the size must *not* be greater than 128 GB.

1. In a shared image gallery, create an image definition and version:
    1. [Create an image definition](../virtual-machines/windows/shared-images-portal.md#create-an-image-definition).  
     - Choose **Gen 1** for the **VM generation**.
     - Choose whether you are creating a **specialized** or **generalized** image for the **Operating system state**.
     
    For more information about the values you can specify for an image definition, see [Image definitions](../virtual-machines/shared-image-galleries.md#image-definitions). 
    
    You can also choose to use an existing image definition and create a new version for your custom image.
    
1. [Create an image version](../virtual-machines/windows/shared-images-portal.md#create-an-image-version).
    - The **Version number** property uses the following format: *MajorVersion.MinorVersion.Patch*.   When you use Lab Services to create a lab and choose a custom image, the most recent version of the image is automatically used.  The most recent version is chosen based on the highest value of MajorVersion, then MinorVersion, then Patch.
    - For the **Source**, choose **Disks and/or snapshots** from the drop-down list.
    - For the **OS disk** property, choose the disk that you created in previous steps.
    
    For more information about the values you can specify for an image definition, see [Image versions](../virtual-machines/shared-image-galleries.md#image-versions). 

## Create a lab

1. [Create the lab](tutorial-setup-classroom-lab.md) in Lab Services and select the custom image from the shared image gallery.

    If you expanded the disk *after* the OS was installed on the original Hyper-V VM, you may also need to extend the C drive in Windows to use the unallocated disk space:      
    - Log into the lab's template VM and follow steps similar to what is shown in [Extend a basic volume](/windows-server/storage/disk-management/extend-a-basic-volume).

## Next steps

* [Shared image gallery overview](../virtual-machines/shared-image-galleries.md)
* [Attach or detach a shared image gallery](how-to-attach-detach-shared-image-gallery.md)
* [How to use a shared image gallery](how-to-use-shared-image-gallery.md)