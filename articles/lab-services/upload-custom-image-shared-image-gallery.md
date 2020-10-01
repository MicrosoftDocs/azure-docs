---
title: Azure Lab Services - upload a custom image to Shared Image Gallery
description: Describes how to upload a custom image to Shared Image Gallery. University IT departments will find importing images especially beneficial.
ms.date: 09/30/2020
ms.topic: how-to
---

# Upload a custom image to Shared Image Gallery

Shared Image Gallery is available to you for importing your own custom images for creating labs in Azure Lab Services. University IT departments will find importing images especially beneficial for the following reasons: 

* No need to create images manually using a lab's template VM.

    Using the template VM for creating images doesn't scale when an IT department is setting up labs for a large number of classes.
* Ability to use familiar automated tools for building images helps to ensure consistency/accuracy across a large number of images (such as SCCM, Endpoint Mgr, or another tool).

This article describes steps that can be taken to bring a custom image and use in Azure Lab Services. 

## Bring custom image from a physical lab environment

The following steps show how to import a custom image that starts from a physical lab environment. A VHD is then created from this environment and imported into Shared Image Gallery in Azure so that it can be used within Azure Lab Services.

Many options exist for creating a VHD from a physical lab environment. The following steps show how to create a VHD from a HyperV VM:

1. Start with a **HyperV VM** that can be imaged using SCCM, Endpoint Mgr, or another tool.

    1. The VM must be created as a Generation 1 VM.
    1. The VM must use a fixed disk size; here, you also can specify the size of the disk (NOTE: Azure Lab Services doesn’t support images with > 128 GB of disk size, please make sure to select the disk size appropriately).
    
    :::image type="content" source="./media/upload-custom-image-shared-image-gallery/connect-virtual-hard-disk.png" alt-text="Connect virtual hard disk":::   
    1. Image the VM as you typically would using SCCM, Endpoint Mgr, or any other tool.
1. [Connect to the VM and prepare it for Azure](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image).

    1. [Set Windows configurations for Azure](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#set-windows-configurations-for-azure)
    1. [Check the Windows Services that are the minimum needed to ensure VM connectivity](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#check-the-windows-services)
    1. [Update remote desktop registry settings](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#update-remote-desktop-registry-settings)
    1. [Configure Windows Firewall rules](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#configure-windows-firewall-rules)
    1. Install Windows Updates
    1. [Install Azure VM Agent and additional configuration as shown here](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#complete-the-recommended-configurations)
    
> [!NOTE]
> Above steps will create a specialized image. If creating a generalized image, you also will need to run [SysPrep])https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#determine-when-to-use-sysprep). Overall, we recommend you to create a specialized image since it maintains the User directory which often contains files, user account info, etc. that are needed by software included in the image.
1. Since **HyperV** creates a **VHDX** file by default, you need to convert this to a VHD file.

    1. Navigate to **HyperV Manager** -> **Action** -> **Edit Disk**.
    1. Here, you'll have the option to **Convert** the disk from a VHDX to a VHD
    1. Since Azure Lab Services doesn't support images with > 128 GB of disk size, make sure to not exceed 128 GB when trying to expand the disk size.
            
    :::image type="content" source="./media/upload-custom-image-shared-image-gallery/choose-action.png" alt-text="Choose action":::   
1. Upload VHD to Azure to create a managed disk.

    1. You can use either Storage Explorer or AzCopy from the command line, as described in [Upload a VHD to Azure or copy a managed disk to another region](https://docs.microsoft.com/azure/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell).

        * Upload in general can be flaky – for example, if your machine goes to sleep or locks, the upload process will get interrupted and fail.
    1. The result of this step is that you now have a managed disk that you can see in the Azure Portal. 

        * Using the Azure Portal, in configuration, you have the ability to select the disk size but Azure Lab Services doesn’t support images with > 128 GB of disk size, please make sure to select the size appropriately.

1. Take a snapshot of the managed disk.

	This can be done either from PowerShell, using the Azure Portal, or from within Storage Explorer, as described in [Create a snapshot using the portal or PowerShell](https://docs.microsoft.com/azure/virtual-machines/windows/snapshot-copy-managed-disk).
1. In Shared Image Gallery, create an image definition and version:

    1. [Create an image definition](https://docs.microsoft.com/azure/virtual-machines/windows/shared-images-portal#create-an-image-definition).
    1. You need to also specify here whether you are creating a specialized\generalized image.
1. Create the lab in Azure Lab Services and select the custom image from the Shared Image Gallery.

    If you expanded disk after the OS was installed on the original HyperV VM, you also will need to extend the C drive in Windows to use the unallocated disk space. To do this, log into the template VM after the lab is created, then follow steps similar to what is shown in [Extend a basic volume](https://docs.microsoft.com/windows-server/storage/disk-management/extend-a-basic-volume). There are options to do this through the UI as well as using PowerShell.
