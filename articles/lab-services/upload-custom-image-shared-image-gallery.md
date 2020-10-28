---
title: Azure Lab Services - upload a custom image to Shared Image Gallery
description: Describes how to upload a custom image to Shared Image Gallery. University IT departments will find importing images especially beneficial.
ms.date: 09/30/2020
ms.topic: how-to
---

# Upload a custom image to Shared Image Gallery

Shared Image Gallery is available to you for importing your own custom images for creating labs in Azure Lab Services. University IT departments will find importing images especially beneficial for the following reasons: 

* You don’t have to manually create images using a lab’s template VM.
* You can upload images created using other tools, such as SCCM, Endpoint Manager, etc.

This article describes steps that can be taken to bring a custom image and use it in Azure Lab Services. 

> [!IMPORTANT]
> When you move your images from a physical lab environment to Az Labs, you need to restructure them appropriatly. Don't simply reuse your existing images from physical labs. <br/>For details, see the [Moving from a Physical Lab to Azure Lab Services](https://techcommunity.microsoft.com/t5/azure-lab-services/moving-from-a-physical-lab-to-azure-lab-services/ba-p/1654931) blog post.

## Bring custom image from a physical lab environment

The following steps show how to import a custom image that starts from a physical lab environment. A VHD is then created from this environment and imported into Shared Image Gallery in Azure so that it can be used within Azure Lab Services.

Many options exist for creating a VHD from a physical lab environment. The following steps show how to create a VHD from a Windows Hyper-V VM:

1. Start with a Hyper-V VM in your physical lab environment that has been created from your image.
    1. The VM must be created as a Generation 1 VM.
    1. The VM must use a fixed disk size. You also can specify the size of the disk in this window. The disk size must be no greater than 128 GB.<br/>    
	Images with disk size  > 128 GB are not supported by Azure Lab Services. 
       
        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/connect-virtual-hard-disk.png" alt-text="Connect virtual hard disk":::   
    1. Image the VM as you normally would.
1. [Connect to the VM and prepare it for Azure](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image).
    1. [Set Windows configurations for Azure](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#set-windows-configurations-for-azure)
    1. [Check the Windows Services that are the minimum needed to ensure VM connectivity](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#check-the-windows-services)
    1. [Update remote desktop registry settings](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#update-remote-desktop-registry-settings)
    1. [Configure Windows Firewall rules](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#configure-windows-firewall-rules)
    1. Install Windows Updates
    1. [Install Azure VM Agent and additional configuration as shown here](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#complete-the-recommended-configurations) 
    
	Above steps will create a specialized image. If creating a generalized image, you also will need to run [SysPrep](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image#determine-when-to-use-sysprep). <br/>
        You should create a specialized image if you want to maintain the User directory (which may contain files, user account info, etc.) that is needed by software included in the image.
1. Since **Hyper-V** creates a **VHDX** file by default, you need to convert this to a VHD file.
    1. Navigate to **Hyper-V Manager** -> **Action** -> **Edit Disk**.
    1. Here, you'll have the option to **Convert** the disk from a VHDX to a VHD
    1. When trying to expand the disk size, make sure to not exceed 128 GB.        
        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/choose-action.png" alt-text="Choose action":::   
1. Upload VHD to Azure to create a managed disk.
    1. You can use either Storage Explorer or AzCopy from the command line, as described in [Upload a VHD to Azure or copy a managed disk to another region](https://docs.microsoft.com/azure/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell).        
	If your machine goes to sleep or locks, the upload process may get interrupted and fail.
    1. The result of this step is that you now have a managed disk that you can see in the Azure portal. 
        You can use the Azure portal's "Size\Performance” tab to choose your disk size. As mentioned before, the size has to be no > 128 GB.
1. Take a snapshot of the managed disk.
	This can be done either from PowerShell, using the Azure portal, or from within Storage Explorer, as described in [Create a snapshot using the portal or PowerShell](https://docs.microsoft.com/azure/virtual-machines/windows/snapshot-copy-managed-disk).
1. In Shared Image Gallery, create an image definition and version:
    1. [Create an image definition](https://docs.microsoft.com/azure/virtual-machines/windows/shared-images-portal#create-an-image-definition).
    1. You need to also specify here whether you are creating a specialized/generalized image.
1. Create the lab in Azure Lab Services and select the custom image from the Shared Image Gallery.

    If you expanded disk after the OS was installed on the original Hyper-V VM, you also will need to extend the C drive in Windows to use the unallocated disk space. To do this, log into the template VM after the lab is created, then follow steps similar to what is shown in [Extend a basic volume](https://docs.microsoft.com/windows-server/storage/disk-management/extend-a-basic-volume). There are options to do this through the UI as well as using PowerShell.

## Next steps

* [Shared Image Gallery overview](https://docs.microsoft.com/azure/virtual-machines/windows/shared-image-galleries)
* [How to use shared image gallery](how-to-use-shared-image-gallery.md)
