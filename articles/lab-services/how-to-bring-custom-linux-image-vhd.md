---
title: Azure Lab Services - How to bring a Linux custom image from your physical lab environment
description: Describes how to bring a Linux custom image from your physical lab environment.
ms.date: 07/27/2021
ms.topic: how-to
---

# Bring a Linux custom image from your physical lab environment

The steps in this article show how to import a Linux custom image that starts from your physical lab environment.  With this approach, you create a VHD from your physical environment and import the VHD into a shared image gallery so that it can be used within Lab Services.  Before you use this approach for creating a custom image, read the article [Recommended approaches for creating custom images](approaches-for-custom-image-creation.md) to decide which approach is best for your scenario.

Azure endorses a variety of [distributions and versions](../virtual-machines/linux/endorsed-distros.md#supported-distributions-and-versions).  The steps to bring a custom Linux image from a VHD varies for each distribution.  Every distribution is different because each one has unique prerequisites that must be set up to run on Azure.

In this article, we’ll show the steps to bring a custom Ubuntu 16.04\18.04\20.04 image from a VHD.  For information on using a VHD to create custom images for other distributions, see the article [Generic steps for Linux distributions](../virtual-machines/linux/create-upload-generic.md).

## Prerequisites

You will need permission to create an [Azure managed disk](../virtual-machines/managed-disks-overview.md) in your school's Azure subscription to complete the steps in this article.

When moving images from a physical lab environment to Lab Services, you should restructure each image so that it only includes software needed for a lab's class.  For more information, read the [Moving from a Physical Lab to Azure Lab Services](https://techcommunity.microsoft.com/t5/azure-lab-services/moving-from-a-physical-lab-to-azure-lab-services/ba-p/1654931) blog post.

## Prepare a custom image using Hyper-V Manager

The following steps show how to create an Ubuntu 16.04\18.04\20.04 image from a Hyper-V virtual machine (VM) using Windows Hyper-V Manager.

1.	Download the official [Linux Ubuntu Server](https://ubuntu.com/server/docs) image to your Windows host machine that you will use to set up the custom image on a Hyper-V VM.

    We recommend using an Ubuntu image that does *not* have the [GNOME](https://www.gnome.org/) GUI desktop installed.  GNOME currently has a conflict with the Azure Linux Agent which is needed for the image to work properly in Azure Lab Services.  For example, we recommend that you use the Ubuntu Server image and install a different GUI desktop, such as XFCE or MATE.

    Ubuntu also publishes prebuilt [Azure VHDs for download](https://cloud-images.ubuntu.com/).  However, these VHDs are intended for creating custom images a from Linux host machine and hypervisor, such as KVM.  These VHDs require that you first set the default user password which can only be done using Linux tooling, such as qemu, which aren't available for Windows.  As a result, when you create a custom image using Windows Hyper-V, you won't be able to connect to these VHDs to make image customizations.  For more information about the prebuilt Azure VHDs, read [Ubuntu's documentation](https://help.ubuntu.com/community/UEC/Images?_ga=2.114783623.1858181609.1624392241-1226151842.1623682781#QEMU_invocation).

1.  Start with a Hyper-V VM in your physical lab environment that has been created from your image.  Read the article [on how to create a virtual machine in Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v) for more information as set the settings as shown below:
    -   The VM must be created as a **Generation 1** VM.
    -   Use the **Default Switch** network configuration option to allow the VM to connect to the internet.
    -   In the **Connect Virtual Hard Disk** settings, the disk's **Size** must *not* be greater than 128 GB as shown in the below image.
       
        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/connect-virtual-hard-disk.png" alt-text="Connect virtual hard disk":::

    - In the **Installation Options** settings, select the **.iso** file that you previously downloaded from Ubuntu.

    Images with disk size greater than 128 GB are *not* supported by Lab Services.

1.  Connect to the Hyper-V VM and prepare it for Azure by following the steps in this article:
    -   [Manual steps to create and upload an Ubuntu VHD](../virtual-machines/linux/create-upload-ubuntu.md#manual-steps)

        The steps to prepare a Linux image for Azure vary based on the distribution.  See the article [distributions and versions](../virtual-machines/linux/endorsed-distros.md#supported-distributions-and-versions) for more information and specific steps for each distribution.

    When you follow the above steps, there are a few important points to highlight:
    -   The steps create a [generalized](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) image when when you run the **deprovision+user** command.  However, it does not guarantee that the image is cleared of all sensitive information or that it is suitable for redistribution.
    -   The final step is to convert the **VHDX** file to a **VHD** file.  Here are equivalent steps that show how to do this with **Hyper-V Manager**:
        
        1.  Navigate to **Hyper-V Manager** -> **Action** -> **Edit Disk**.
        1.  Next, **Convert** the disk from a VHDX to a VHD.
        1.  For the **Disk Type**, select **Fixed size**.
            - If you also choose to expand the disk size at this point, make sure that you do *not* exceed 128 GB.        
            :::image type="content" source="./media/upload-custom-image-shared-image-gallery/choose-action.png" alt-text="Choose action":::

To help with resizing the VHD and converting to a VHDX, you can also use the following PowerShell cmdlets:
- [Resize-VHD](/powershell/module/hyper-v/resize-vhd?view=windowsserver2019-ps)
- [Convert-VHD](/powershell/module/hyper-v/convert-vhd?view=windowsserver2019-ps)

## Upload the custom image to a shared image gallery

1. Upload the VHD to Azure to create a managed disk.
    1. You can use either Storage Explorer or AzCopy from the command line, as shown in [Upload a VHD to Azure or copy a managed disk to another region](../virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell.md).        

    1. After you've uploaded the VHD, you should now have a managed disk that you can see in the Azure portal. 
    
    If your machine goes to sleep or locks, the upload process may get interrupted and fail.  Also, make sure that when AzCopy completes, that you revoke SAS access to the disk.  Otherwise, when you attempt to create an image from the disk, you will see an error: **Operation 'Create Image' is not supported with disk 'your disk name' in state 'Active Upload'.  Error Code: OperationNotAllowed**
    
    The Azure portal's **Size+Performance** tab for the managed disk allows you to change your disk size. As mentioned before, the size must *not* be greater than 128 GB.

1. In a shared image gallery, create an image definition and version:
    1. [Create an image definition](../virtual-machines/windows/shared-images-portal.md#create-an-image-definition).  
        - Choose **Gen 1** for the **VM generation**.
        - Choose **Linux** for the **Operating system**.
        - Choose **generalized** for the **Operating system state**.
     
    For more information about the values you can specify for an image definition, see [Image definitions](../virtual-machines/shared-image-galleries.md#image-definitions). 
    
    You can also choose to use an existing image definition and create a new version for your custom image.
    
1. [Create an image version](../virtual-machines/windows/shared-images-portal.md#create-an-image-version).
    - The **Version number** property uses the following format: *MajorVersion.MinorVersion.Patch*.   When you use Lab Services to create a lab and choose a custom image, the most recent version of the image is automatically used.  The most recent version is chosen based on the highest value of MajorVersion, then MinorVersion, then Patch.
    - For the **Source**, choose **Disks and/or snapshots** from the drop-down list.
    - For the **OS disk** property, choose the disk that you created in previous steps.
    
    For more information about the values you can specify for an image definition, see [Image versions](../virtual-machines/shared-image-galleries.md#image-versions).

## Create a lab
   
1. [Create the lab](tutorial-setup-classroom-lab.md) in Lab Services and select the custom image from the shared image gallery.

    If you expanded the disk *after* the OS was installed on the original Hyper-V VM, you may also need to extend the partition in Linux's filesystem to use the unallocated disk space:
    -   Log into the lab's template VM and follow steps similar to what is shown in the article [Expand a disk partition and filesystem](../virtual-machines/linux/expand-disks.md#expand-a-disk-partition-and-filesystem).  
    
    The OS disk typically exists on the **/dev/sad2** partition.  To view the current size of the OS disk's partition, use the following command: **df -h**.
    
## Next steps

* [Shared image gallery overview](../virtual-machines/shared-image-galleries.md)
* [Attach or detach a shard image gallery](how-to-attach-detach-shared-image-gallery.md)
* [How to use a shared image gallery](how-to-use-shared-image-gallery.md)