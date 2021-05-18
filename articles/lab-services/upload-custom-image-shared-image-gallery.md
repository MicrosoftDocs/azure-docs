---
title: Azure Lab Services - Bring a Windows custom image to shared image gallery
description: Describes how to bring a Windows custom image to shared image gallery.
ms.date: 09/30/2020
ms.topic: how-to
---

# Bring a Windows custom image to shared image gallery

You can use shared image gallery to bring your own Windows custom images and use these images to create labs in Azure Lab Services.  This article shows how to bring a custom image from:

* Your [physical lab environment](upload-custom-image-shared-image-gallery.md#bring-a-windows-custom-image-from-a-physical-lab-environment).
* An [Azure virtual machine](upload-custom-image-shared-image-gallery.md#bring-a-windows-custom-image-from-an-azure-virtual-machine).

This task is typically performed by a school's IT department.

## Bring a Windows custom image from a physical lab environment

The steps in this section show how to import a custom image that starts from your physical lab environment.  With this approach, you create a VHD from your physical environment and import the VHD into shared image gallery so that it can be used within Lab Services.  Here are some key benefits with this approach:

* You have flexibility to create either [generalized or specialized](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) images to use in your labs.  Otherwise, if you use a [lab's template VM to export an image](how-to-use-shared-image-gallery.md), the image is always specialized.
* You can upload images created using other tools, such as [Microsoft Endpoint Configuration Manager](https://docs.microsoft.com/mem/configmgr/core/understand/introduction), so that you don't have to manually set up an image using a lab's template VM.

The steps in this section require that you have permission to create a [managed disk](../virtual-machines/managed-disks-overview.md) in your school's Azure subscription.

> [!IMPORTANT]
> When moving images from a physical lab environment to Lab Services, you should restructure each image so that it only includes software needed for a lab's class.  For more information, read the [Moving from a Physical Lab to Azure Lab Services](https://techcommunity.microsoft.com/t5/azure-lab-services/moving-from-a-physical-lab-to-azure-lab-services/ba-p/1654931) blog post.

Many options exist for creating a VHD from a physical lab environment. The below steps show how to create a VHD from a Windows Hyper-V virtual machine (VM) using Hyper-V Manager.

1. Start with a Hyper-V VM in your physical lab environment that has been created from your image.  Read the article on [how to create a virtual machine in Hyper-V](https://docs.microsoft.com/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v) for more information.
    1. The VM must be created as a **Generation 1** VM.
    1. The VM's virtual disk must be a fixed size VHD.  The disk size must *not* be greater than 128 GB. When you create the VM, enter the size of the disk as shown in the below image.
       
        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/connect-virtual-hard-disk.png" alt-text="Connect virtual hard disk":::

    > [!IMPORTANT]
    > Images with disk size greater than 128 GB are *not* supported by Lab Services. 
   
1. Connect to the Hyper-V VM and [prepare it for Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md) by following these steps:
    1. [Set Windows configurations for Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md#set-windows-configurations-for-azure).
    1. [Check the Windows Services that are needed to ensure VM connectivity](../virtual-machines/windows/prepare-for-upload-vhd-image.md#check-the-windows-services).
    1. [Update remote desktop registry settings](../virtual-machines/windows/prepare-for-upload-vhd-image.md#update-remote-desktop-registry-settings).
    1. [Configure Windows Firewall rules](../virtual-machines/windows/prepare-for-upload-vhd-image.md#configure-windows-firewall-rules).
    1. [Install Windows Updates](../virtual-machines/windows/prepare-for-upload-vhd-image.md).
    1. [Install Azure VM Agent and additional configuration as shown here](../virtual-machines/windows/prepare-for-upload-vhd-image.md#complete-the-recommended-configurations) 
    	
    You can upload either specialized or generalized images to shared image gallery and use them to create labs.  The steps above will create a specialized image. If you need to instead create a generalized image, you also will need to [run SysPrep](../virtual-machines/windows/prepare-for-upload-vhd-image.md#determine-when-to-use-sysprep).  

    > [!IMPORTANT]
    > You should create a specialized image if you want to maintain machine-specific information and user profiles.  For more information about the differences between generalized and specialized images, see [Generalized and specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images).

1. Since **Hyper-V** creates a **VHDX** file by default, you need to convert this to a VHD file.
    1. Navigate to **Hyper-V Manager** -> **Action** -> **Edit Disk**.
    1. Next, **Convert** the disk from a VHDX to a VHD.  
     - If you expand the disk size, make sure that you do *not* exceed 128 GB.        
        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/choose-action.png" alt-text="Choose action":::   

    For more information, read the article that shows how to [convert the virtual disk to a fixed size VHD](../virtual-machines/windows/prepare-for-upload-vhd-image.md#convert-the-virtual-disk-to-a-fixed-size-vhd).

1. Upload the VHD to Azure to create a managed disk.
    1. You can use either Storage Explorer or AzCopy from the command line, as shown in [Upload a VHD to Azure or copy a managed disk to another region](../virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell.md).        

    1. After you've uploaded the VHD, you should now have a managed disk that you can see in the Azure portal. 
    
    > [!WARNING]
    > If your machine goes to sleep or locks, the upload process may get interrupted and fail. 
    
    > [!IMPORTANT] 
    > The Azure portal's **Size+Performance** tab for the managed disk allows you to change your disk size. As mentioned before, the size must *not* be greater than 128 GB.

1. Take a snapshot of the managed disk.
	This can be done either from PowerShell, using the Azure portal, or from within Storage Explorer, as shown in [Create a snapshot using the portal or PowerShell](../virtual-machines/windows/snapshot-copy-managed-disk.md).

1. In shared image gallery, create an image definition and version:
    1. [Create an image definition](../virtual-machines/windows/shared-images-portal.md#create-an-image-definition).  
     - Choose **Gen 1** for the **VM generation**.
     - Choose whether you are creating a **specialized** or **generalized** image for the **Operating system state**.
     
    For more information about the values you can specify for an image definition, see [Image definitions](../virtual-machines/shared-image-galleries.md#image-definitions). 
    
    > [!NOTE] 
    > You can also choose to use an existing image definition and create a new version for your custom image.
    
1. [Create an image version](../virtual-machines/windows/shared-images-portal.md#create-an-image-version).
    - The **Version number** property uses the following format: *MajorVersion.MinorVersion.Patch*.   When you use Lab Services to create a lab and choose a custom image, the most recent version of the image is automatically used.  The most recent version is chosen based on the highest value of MajorVersion, then MinorVersion, then Patch.
    - For the **Source**, choose **Disks and/or snapshots** from the drop-down list.
    - For the **OS disk** property, choose the snapshot that you created in previous steps.
    
    For more information about the values you can specify for an image definition, see [Image versions](../virtual-machines/shared-image-galleries.md#image-versions). 
   
1. [Create the lab](tutorial-setup-classroom-lab.md) in Lab Services and select the custom image from the shared image gallery.

    If you expanded the disk *after* the OS was installed on the original Hyper-V VM, you also will need to extend the C drive in Windows to use the unallocated disk space:      
    - Log into the lab's template VM and follow steps similar to what is shown in [Extend a basic volume](https://docs.microsoft.com/windows-server/storage/disk-management/extend-a-basic-volume). 

## Bring a Windows custom image from an Azure virtual machine
Another approach is to set up your Windows image using an [Azure virtual machine](../virtual-machines/windows/overview.md).  Using an Azure virtual machine (VM) gives you flexibility to create either a specialized or generalized image to use with your labs.  The process to prepare an image from an Azure VM are simpler compared to [creating an image from a VHD](upload-custom-image-shared-image-gallery.md#bring-a-windows-custom-image-from-a-physical-lab-environment) because the image is already prepared to run in Azure.

You will need permission to create an Azure VM in your school's Azure subscription to complete the below steps:

1. Create an Azure VM using the [Azure portal](../virtual-machines/windows/quick-create-portal.md), [PowerShell](../virtual-machines/windows/quick-create-powershell.md), the [Azure CLI](../virtual-machines/windows/quick-create-cli.md), or from an [ARM template](../virtual-machines/windows/quick-create-template.md).
    
    - When you specify the disk settings, ensure the disk's size is *not* greater than 128 GB.
    
1. Install software and make any necessary configuration changes to the Azure VM's image.

1. Run [SysPrep](../virtual-machines/windows/capture-image-resource.md#generalize-the-windows-vm-using-sysprep) if you need to create a generalized image.  For more information, see [Generalized and specialized images](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images).

1. In shared image gallery, [create an image definition](../virtual-machines/windows/shared-images-portal.md#create-an-image-definition) or choose an existing image definition.
     - Choose **Gen 1** for the **VM generation**.
     - Choose whether you are creating a **specialized** or **generalized** image for the **Operating system state**.
    
1. [Create an image version](../virtual-machines/windows/shared-images-portal.md#create-an-image-version).
    - The **Version number** property uses the following format: *MajorVersion.MinorVersion.Patch*.   
    - For the **Source**, choose **Disks and/or snapshots** from the drop-down list.
    - For the **OS disk** property, choose your Azure VM's disk that you created in previous steps.

1. [Create the lab](tutorial-setup-classroom-lab.md) in Lab Services and select the custom image from the shared image gallery.

You can also import your custom image from an Azure VM to shared image gallery using PowerShell.  See the following script and accompanying ReadMe for more information:
    
- [Bring image to shared image gallery script](https://github.com/Azure/azure-devtestlab/tree/master/samples/ClassroomLabs/Scripts/BringImageToSharedImageGallery/)

## Next steps

* [Shared image gallery overview](../virtual-machines/shared-image-galleries.md)
* [Attach or detach a shard image gallery](how-to-attach-detach-shared-image-gallery.md)
* [How to use shared image gallery](how-to-use-shared-image-gallery.md)