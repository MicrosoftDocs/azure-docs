---
title: Capture an image of an Azure Windows VM | Microsoft Docs
description: Capture an image of an Azure Windows virtual machine created with the classic deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: a5986eac-4cf3-40bd-9b79-7c811806b880
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 03/13/2017
ms.author: cynthn

---
# Capture an image of an Azure Windows virtual machine created with the classic deployment model.
> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../azure-resource-manager/resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. For Resource Manager model information, see [Create a copy Windows VM running in Azure](virtual-machines-windows-vhd-copy.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

This article shows you how to capture an Azure virtual machine running Windows so you can use it as an image to create other virtual machines. This image includes the operating system disk and any data disks that are attached to the virtual machine. It doesn't include networking configurations, so you'll need to set up network configurations when you create the other virtual machines that use the image.

Azure stores the image under **VM images (classic)**, a **Compute** service that is listed when you view all the Azure services. This is the same place where any images you've uploaded are stored. For details about images, see [About images for virtual machines](virtual-machines-windows-classic-about-images.md?toc=%2fazure%2fvirtual-machines%2fWindows%2fclassic%2ftoc.json).

<!-- deleted 3/15/2017. Links to linux article.
[About images for virtual machines](virtual-machines-linux-classic-about-images.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).
-->


## Before you begin
These steps assume that you've already created an Azure virtual machine and configured the operating system, including attaching any data disks. If you need to haven't done this yet, see these instructions:

* [Create a virtual machine from an image](virtual-machines-windows-classic-createportal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* [How to attach a data disk to a virtual machine](virtual-machines-windows-classic-attach-disk.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* Make sure the server roles are supported with Sysprep. For more information, see [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles).

> [!WARNING]
> This process deletes the original virtual machine after it's captured.
>
>

Prior to capturing an image of an Azure virtual machine, it is recommended the target virtual machine be backed up. Azure virtual machines can be backed up using Azure Backup. For details, see [Back up Azure virtual machines](../backup/backup-azure-vms.md). Other solutions are available from certified partners. To find out what’s currently available, search the Azure Marketplace.

## Capture the virtual machine
1. In the [Azure portal](http://portal.azure.com), **Connect** to the virtual machine. For instructions, see [How to sign in to a virtual machine running Windows Server][How to sign in to a virtual machine running Windows Server].
2. Open a Command Prompt window as an administrator.
3. Change the directory to `%windir%\system32\sysprep`, and then run sysprep.exe.
4. The **System Preparation Tool** dialog box appears. Do the following:

   * In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked. For more information about using Sysprep, see [How to Use Sysprep: An Introduction][How to Use Sysprep: An Introduction].
   * In **Shutdown Options**, select **Shutdown**.
   * Click **OK**.

   ![Run Sysprep](./media/virtual-machines-windows-classic-capture-image/SysprepGeneral.png)
5. Sysprep shuts down the virtual machine, which changes the status of the virtual machine in the Azure classic portal to **Stopped**.
6. In the Azure portal, click **Virtual Machines (classic)** and select the virtual machine you want to capture. The **VM images (classic)** group is listed under **Compute** when you view **More services**.

7. On the command bar, click **Capture**.

   ![Capture virtual machine](./media/virtual-machines-windows-classic-capture-image/CaptureVM.png)

   The **Capture the Virtual Machine** dialog box appears.

8. In **Image name**, type a name for the new image. In **Image label**, type a label for the new image.

9. Click **I've run Sysprep on the virtual machine**. This checkbox refers to the actions with Sysprep in steps 3-5. An image _must_ be generalized by running Sysprep before you add a Windows Server image to your set of custom images.

10. Once the capture completes, the new image becomes available in the **Marketplace**, in the **Compute**, **VM images (classic)** container.

    ![Image capture successful](./media/virtual-machines-windows-classic-capture-image/VMCapturedImageAvailable.png)

## Next steps
The image is ready to be used to create virtual machines. To do this, you'll create a virtual machine by selecting the **More services** menu item at the bottom of the services menu, then **VM images (classic)** in the **Compute** group. For instructions, see [Create a virtual machine from an image](virtual-machines-windows-classic-createportal.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

[How to sign in to a virtual machine running Windows Server]: virtual-machines-windows-classic-connect-logon.md
[How to Use Sysprep: An Introduction]: http://technet.microsoft.com/library/bb457073.aspx
[Run Sysprep.exe]: ./media/virtual-machines-capture-image-windows-server/SysprepCommand.png
[Enter Sysprep.exe options]: ./media/virtual-machines-windows-classic-capture-image/SysprepGeneral.png
[The virtual machine is stopped]: ./media/virtual-machines-capture-image-windows-server/SysprepStopped.png
[Capture an image of the virtual machine]: ./media/virtual-machines-windows-classic-capture-image/CaptureVM.png
[Enter the image name]: ./media/virtual-machines-capture-image-windows-server/Capture.png
[Image capture successful]: ./media/virtual-machines-capture-image-windows-server/CaptureSuccess.png
[Use the captured image]: ./media/virtual-machines-capture-image-windows-server/MyImagesWindows.png
