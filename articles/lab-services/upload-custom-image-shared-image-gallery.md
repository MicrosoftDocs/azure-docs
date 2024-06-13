---
title: Import a Windows image from a physical lab
titleSuffix: Azure Lab Services
description: Learn how to import a Windows custom image from your physical lab environment into Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.date: 04/24/2023
ms.topic: how-to
---

# Bring a Windows custom image from a physical lab environment to Azure Lab Services

This article describes how to import a Windows-based custom image from a physical lab environment for creating a lab in Azure Lab Services.

The import process consists of the following steps:

1. Create a virtual hard drive (VHD) from your physical environment
1. Import the VHD into an Azure compute gallery
1. [Attach the compute gallery to your lab plan](/azure/lab-services/how-to-attach-detach-shared-image-gallery)
1. Create a lab based by using the image in the compute gallery

Before you import an image from a physical lab, learn more about [recommended approaches for creating custom images](approaches-for-custom-image-creation.md).

## Prerequisites

- Your Azure account has permission to create an [Azure managed disk](/azure/virtual-machines/managed-disks-overview). Learn about the [Azure RBAC roles you need to create a managed disk](/azure/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell#assign-rbac-role).

- Restructure each virtual machine image so that it only includes the software that is needed for a lab's class. Learn more about [moving from a Physical Lab to Azure Lab Services](./concept-migrating-physical-labs.md).

## Prepare a custom image using Hyper-V Manager

First, create a virtual hard disk (VHD) for the physical environment. The following steps describe how to create a VHD from a Windows Hyper-V virtual machine (VM) by using Hyper-V Manager:

1. Create a Hyper-V virtual machine in your physical lab environment based on your custom image.

    - The VM must be created as a **Generation 1** VM.
    - Use the **Default Switch** network configuration option to allow the VM to connect to the internet.
    - The VM's virtual disk must be a fixed size VHD. The disk size must *not* be greater than 128 GB. When you create the VM, enter the size of the disk as shown in the below image.

        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/connect-virtual-hard-disk.png" alt-text="Screenshot of the Connect virtual hard disk screen in Hyper-V Manager, highlighting the option for fixed disk size.":::

    Azure Lab Services does *not* support images with disk size greater than 128 GB.

    Learn more about [how to create a virtual machine in Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v).

1. Connect to the Hyper-V VM and [prepare it for Azure](/azure/virtual-machines/windows/prepare-for-upload-vhd-image) by following these steps:

    1. [Set Windows configurations for Azure](/azure/virtual-machines/windows/prepare-for-upload-vhd-image#set-windows-configurations-for-azure).
    1. [Check the Windows services that are needed to ensure VM connectivity](/azure/virtual-machines/windows/prepare-for-upload-vhd-image#check-the-windows-services).
    1. [Update remote desktop registry settings](/azure/virtual-machines/windows/prepare-for-upload-vhd-image#update-remote-desktop-registry-settings).
    1. [Configure Windows Firewall rules](/azure/virtual-machines/windows/prepare-for-upload-vhd-image#configure-windows-firewall-rules).
    1. [Install Windows updates](/azure/virtual-machines/windows/prepare-for-upload-vhd-image).
    1. [Install Azure VM Agent and extra configuration](/azure/virtual-machines/windows/prepare-for-upload-vhd-image#complete-the-recommended-configurations)

    You can upload either specialized or generalized images to a compute gallery and use them to create labs. The previous steps create a specialized image. If you need a generalized image, you also have to [run SysPrep](/azure/virtual-machines/windows/prepare-for-upload-vhd-image#determine-when-to-use-sysprep). 

    You should create a specialized image if you want to maintain machine-specific information and user profiles.  For more information about the differences between generalized and specialized images, see [Generalized and specialized images](/azure/virtual-machines/shared-image-galleries#generalized-and-specialized-images).

1. Convert the default Hyper-V `VHDX` hard disk file format to `VHD`:

    1. In Hyper-V Manager, select the virtual machine, and then select **Action** > **Edit Disk**.

    1. Next, select **Convert** to convert the disk from a VHDX to a VHD.

		:::image type="content" source="./media/upload-custom-image-shared-image-gallery/choose-action.png" alt-text="Screenshot that shows the Choose Action screen when editing a virtual machine in Hyper-V Manager.":::

        If you expand the disk size, make sure that you do *not* exceed 128 GB.

    Learn more about how to [convert a virtual disk to a fixed size VHD](/azure/virtual-machines/windows/prepare-for-upload-vhd-image#convert-the-virtual-disk-to-a-fixed-size-vhd).

Alternately, you can resize and convert a VHDX by using PowerShell:

- [Resize-VHD](/powershell/module/hyper-v/resize-vhd)
- [Convert-VHD](/powershell/module/hyper-v/convert-vhd)

## Upload the custom image to a compute gallery

Next, you upload the VHD file from your physical environment to an Azure compute gallery.

1. Upload the VHD to Azure to create a managed disk.

    You can use either Storage Explorer or AzCopy from the command line, as shown in [Upload a VHD to Azure or copy a managed disk to another region](/azure/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell).

    If your machine goes to sleep or locks, the upload process may get interrupted and fail.  Also, make sure after AzCopy completes, that you revoke the SAS access to the disk.  Otherwise, when you attempt to create an image from the disk, you encounter an error: **Operation 'Create Image' is not supported with disk 'your disk name' in state 'Active Upload'.  Error Code: OperationNotAllowed**.

    After you've uploaded the VHD, you should now have a managed disk that you can see in the Azure portal.

    The Azure portal's **Size+Performance** tab for the managed disk allows you to change your disk size. As mentioned before, the size must *not* be greater than 128 GB.

1. In a compute gallery, follow these steps to [create an image definition and version](/azure/virtual-machines/image-version).

     - Choose **Gen 1** for the **VM generation**.

     - Choose whether you're creating a **specialized** or **generalized** image for the **Operating system state**

    For more information about the values you can specify for an image definition, see [Image definitions](/azure/virtual-machines/shared-image-galleries#image-definitions).

    You can also choose to use an existing image definition and create a new version for your custom image.

1. Follow these steps to [create an image version](/azure/virtual-machines/image-version).

    - The **Version number** property uses the following format: *MajorVersion.MinorVersion.Patch*.  When you use Azure Lab Services to create a lab and choose a custom image, the most recent version of the image is automatically used.  The most recent version is chosen based on the highest value of MajorVersion, then MinorVersion, then Patch.

    - For the **Source**, choose **Disks and/or snapshots** from the drop-down list.

    - For the **OS disk** property, choose the disk that you created in previous steps.

    For more information about the values you can specify for an image definition, see [Image versions](/azure/virtual-machines/shared-image-galleries#image-versions).

## Create a lab

Now that the custom image is available in an Azure compute gallery, you can create a lab by using the image.

1. [Attach the compute gallery to your lab plan](./how-to-attach-detach-shared-image-gallery.md)

1. [Create the lab](tutorial-setup-lab.md) and select the custom image from the compute gallery.

    If you expanded the disk *after* the OS was installed on the original Hyper-V VM, you may also need to extend the C drive in Windows to use the unallocated disk space. Log into the lab's template VM and follow these steps to [extend a basic volume](/windows-server/storage/disk-management/extend-a-basic-volume).

## Next steps

- [Attach or detach a compute gallery](how-to-attach-detach-shared-image-gallery.md)
- [Use a compute gallery](how-to-use-shared-image-gallery.md)
- [Azure Compute Gallery overview](/azure/virtual-machines/shared-image-galleries)
