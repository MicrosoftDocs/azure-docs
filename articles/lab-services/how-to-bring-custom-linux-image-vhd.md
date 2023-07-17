---
title: Import a Linux image from a physical lab
description: Learn how to import a Linux custom image from your physical lab environment into Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.date: 05/22/2023
ms.topic: how-to
---

# Bring a Linux custom image from a physical lab environment to Azure Lab Services

This article describes how to import a Linux-based custom image from a physical lab environment for creating a lab in Azure Lab Services. 

Azure supports various [distributions and versions](/azure/virtual-machines/linux/create-upload-generic). The steps to bring a custom Linux image from a VHD varies for each distribution. Every distribution is different because each one has unique prerequisites for running on Azure.

In this article, you bring a custom Ubuntu 18.04\20.04 image from a VHD. For information on using a VHD to create custom images for other distributions, see [Generic steps for Linux distributions](/azure/virtual-machines/linux/create-upload-generic).

The import process consists of the following steps:

1. Create a virtual hard drive (VHD) from your physical environment
1. Import the VHD into an Azure compute gallery
1. [Attach the compute gallery to your lab plan](/azure/lab-services/how-to-attach-detach-shared-image-gallery)
1. Create a lab based by using the image in the compute gallery

Before you import an image from a physical lab, learn more about [recommended approaches for creating custom images](approaches-for-custom-image-creation.md).

## Prerequisites

- Your Azure account has permission to create an [Azure managed disk](/azure/virtual-machines/managed-disks-overview). Learn about the [Azure RBAC roles you need to create a managed disk](/azure/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell#assign-rbac-role).

- Restructure each virtual machine image so that it only includes the software that is needed for a lab's class. Learn more about [moving from a Physical Lab to Azure Lab Services](./concept-migrating-physical-labs.md).

## Prepare a custom image by using Hyper-V Manager

First, create a virtual hard disk (VHD) for the physical environment. The following steps show how to create an Ubuntu 18.04\20.04 image from a Hyper-V virtual machine (VM) by using Windows Hyper-V Manager.

1. Download the official [Linux Ubuntu Server](https://ubuntu.com/server/docs) image to the Windows host machine that you use to set up the custom image on a Hyper-V VM.

    If you're using Ubuntu 18.04 LTS, we recommend using an image that does *not* have the [GNOME](https://www.gnome.org/) or [MATE](https://mate-desktop.org/) graphical desktops installed. GNOME and MATE currently have a networking conflict with the Azure Linux Agent, which is needed for the image to work properly in Azure Lab Services. Instead, use an Ubuntu Server image and install a different graphical desktop, such as [XFCE](https://www.xfce.org/).  Another option is to install [GNOME\MATE](https://aka.ms/azlabs/scripts/LinuxDesktop-GnomeMate) using a lab's template VM.
    
    Ubuntu also publishes prebuilt [Azure VHDs for download](https://cloud-images.ubuntu.com/). These VHDs are intended for creating custom images from a Linux host machine and hypervisor, such as KVM. These VHDs require that you first set the default user password, which can only be done by using Linux tooling, such as *qemu*. As a result, when you create a custom image by using Windows Hyper-V, you're not able to connect to these VHDs to make image customizations. For more information about the prebuilt Azure VHDs, read [Ubuntu's documentation](https://help.ubuntu.com/community/UEC/Images?_ga=2.114783623.1858181609.1624392241-1226151842.1623682781#QEMU_invocation).
    
1. Create a Hyper-V virtual machine in your physical lab environment based on your custom image.

    - The VM must be created as a **Generation 1** VM.
    - Use the **Default Switch** network configuration option to allow the VM to connect to the internet.
    - The VM's virtual disk must be a fixed size VHD. The disk size must *not* be greater than 128 GB. When you create the VM, enter the size of the disk as shown in the below image.

        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/connect-virtual-hard-disk.png" alt-text="Screenshot that shows the Connect Virtual Hard Disk screen.":::

    - In the **Installation Options** settings, select the **.iso** file that you previously downloaded from Ubuntu.

    Azure Lab Services does *not* support images with disk size greater than 128 GB.

    Learn more about [how to create a virtual machine in Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v).

1. Connect to the Hyper-V VM and prepare it for Azure by following the steps in [Manual steps to create and upload an Ubuntu VHD](/azure/virtual-machines/linux/create-upload-ubuntu#manual-steps).

    The steps to prepare a Linux image for Azure vary based on the distribution. For more information and specific steps for each distribution, see [distributions and versions](/azure/virtual-machines/linux/create-upload-generic).

    When you follow the preceding steps, there are a few important points to highlight:

    - The steps create a [generalized](/azure/virtual-machines/shared-image-galleries#generalized-and-specialized-images) image when you run the **deprovision+user** command. But it doesn't guarantee that the image is cleared of all sensitive information or that it's suitable for redistribution.

1. Convert the default Hyper-V `VHDX` hard disk file format to `VHD`:

    1. In Hyper-V Manager, select the virtual machine, and then select **Action** > **Edit Disk**.

    1. Locate the VHDX disk to convert.

    1. Next, select **Convert** to convert the disk from a VHDX to a VHD.

    1. For the **Disk Type**, select **Fixed size**.

        If you also choose to expand the disk size at this point, make sure that you do *not* exceed 128 GB.

        :::image type="content" source="./media/upload-custom-image-shared-image-gallery/choose-action.png" alt-text="Screenshot that shows the Choose Action screen.":::

Alternately, you can resize and convert a VHDX by using PowerShell:

- [Resize-VHD](/powershell/module/hyper-v/resize-vhd)
- [Convert-VHD](/powershell/module/hyper-v/convert-vhd)

## Upload the custom image to a compute gallery

Next, you upload the VHD file from your physical environment to an Azure compute gallery.

1. Upload the VHD to Azure to create a managed disk.

    1. You can use either Azure Storage Explorer or AzCopy from the command line, as shown in [Upload a VHD to Azure or copy a managed disk to another region](/azure/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell).

        > [!WARNING]
        > If your machine goes to sleep or locks, the upload process might get interrupted and fail. Also, make sure that when AzCopy completes, that you revoke SAS access to the disk. Otherwise, when you attempt to create an image from the disk, you'll see the error "Operation 'Create Image' is not supported with disk 'your disk name' in state 'Active Upload'. Error Code: OperationNotAllowed*."

    1. After you've uploaded the VHD, you should now have a managed disk that you can see in the Azure portal.

        You can use the Azure portal's **Size+Performance** tab for the managed disk to change your disk size. As mentioned before, the size must *not* be greater than 128 GB.

1. In a compute gallery, create an image definition and version:

    1. [Create an image definition](/azure/virtual-machines/image-version):

        - Choose **Gen 1** for the **VM generation**.

        - Choose **Linux** for the **Operating system**.

        - Choose **generalized** for the **Operating system state**.

        For more information about the values you can specify for an image definition, see [Image definitions](/azure/virtual-machines/shared-image-galleries#image-definitions).

        You can also choose to use an existing image definition and create a new version for your custom image.

    1. [Create an image version](/azure/virtual-machines/image-version):

        - The **Version number** property uses the following format: *MajorVersion.MinorVersion.Patch*. When you use Lab Services to create a lab and choose a custom image, the most recent version of the image is automatically used. The most recent version is chosen based on the highest value of MajorVersion, then MinorVersion, and then Patch.

        - For the **Source**, select **Disks and/or snapshots** from the dropdown list.

        - For the **OS disk** property, choose the disk that you created in previous steps.

        For more information about the values you can specify for an image version, see [Image versions](/azure/virtual-machines/shared-image-galleries#image-versions).

## Create a lab

Now that the custom image is available in an Azure compute gallery, you can create a lab by using the image.

1. [Attach the compute gallery to your lab plan](./how-to-attach-detach-shared-image-gallery.md)

1. [Create the lab](tutorial-setup-lab.md) and select the custom image from the compute gallery.

    If you expanded the disk *after* the OS was installed on the original Hyper-V VM, you might also need to extend the partition in Linux's filesystem to use the unallocated disk space.  Sign in to the lab's template VM and follow steps similar to what is shown in [Expand a disk partition and filesystem](/azure/virtual-machines/linux/expand-disks#expand-a-disk-partition-and-filesystem).

The OS disk typically exists on the **/dev/sad2** partition. To view the current size of the OS disk's partition, use the command **df -h**.

## Next steps

- [Azure Compute Gallery overview](/azure/virtual-machines/shared-image-galleries)
- [Attach or detach a compute gallery](how-to-attach-detach-shared-image-gallery.md)
- [Use a compute gallery in Azure Lab Services](how-to-use-shared-image-gallery.md)
