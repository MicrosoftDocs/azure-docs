---
title: Use a Windows troubleshooting VM in the Azure portal | Microsoft Docs
description: Learn how to troubleshoot Windows virtual machine issues in Azure by connecting the OS disk to a recovery VM using the Azure portal
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: gwallace
editor: ''
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/13/2018
ms.author: genli

---

# Troubleshoot a Windows VM by attaching the OS disk to a recovery VM using the Azure portal
If your Windows virtual machine (VM) in Azure encounters a boot or disk error, you may need to perform troubleshooting steps on the virtual hard disk itself. A common example would be a failed application update that prevents the VM from being able to boot successfully. This article details how to use the Azure portal to connect your virtual hard disk to another Windows VM to fix any errors, then re-create your original VM. 

## Recovery process overview
The troubleshooting process is as follows:

1. Delete the VM encountering issues, keeping the virtual hard disks.
2. Attach and mount the virtual hard disk to another Windows VM for troubleshooting purposes.
3. Connect to the troubleshooting VM. Edit files or run any tools to fix issues on the original virtual hard disk.
4. Unmount and detach the virtual hard disk from the troubleshooting VM.
5. Create a VM using the original virtual hard disk.

For the VM that uses managed disk, we can now use Azure PowerShell to change the OS disk for a VM. We no longer need to delete and recreate the VM. For more information, see [Troubleshoot a Windows VM by attaching the OS disk to a recovery VM using Azure PowerShell](troubleshoot-recovery-disks-windows.md).

> [!NOTE]
> This article does not apply to the VM with unmanaged disk.

## Determine boot issues
To determine why your VM is not able to boot correctly, examine the boot diagnostics VM screenshot. A common example would be a failed application update, or an underlying virtual hard disk being deleted or moved.

Select your VM in the portal and then scroll down to the **Support + Troubleshooting** section. Click **Boot diagnostics** to view the screenshot. Note any specific error messages or error codes to help determine why the VM is encountering an issue.

![Viewing VM boot diagnostics console logs](./media/troubleshoot-recovery-disks-portal-windows/screenshot-error.png)

You can also click **Download screenshot** to download a capture of the VM screenshot.

## View existing virtual hard disk details
Before you can attach your virtual hard disk to another VM, you need to identify the name of the virtual hard disk (VHD).

Select the VM that has problem, then select **Disks**. Record the name of the OS disk as in the following example:

![Select storage blobs](./media/troubleshoot-recovery-disks-portal-windows/view-disk.png)

## Delete existing VM
Virtual hard disks and VMs are two distinct resources in Azure. A virtual hard disk is where the operating system itself, applications, and configurations are stored. The VM itself is just metadata that defines the size or location, and references resources such as a virtual hard disk or virtual network interface card (NIC). Each virtual hard disk has a lease assigned when attached to a VM. Although data disks can be attached and detached even while the VM is running, the OS disk cannot be detached unless the VM resource is deleted. The lease continues to associate the OS disk with a VM even when that VM is in a stopped and deallocated state.

The first step to recover your VM is to delete the VM resource itself. Deleting the VM leaves the virtual hard disks in your storage account. After the VM is deleted, you attach the virtual hard disk to another VM to troubleshoot and resolve the errors.

Select your VM in the portal, then click **Delete**:

![VM boot diagnostics screenshot showing boot error](./media/troubleshoot-recovery-disks-portal-windows/stop-delete-vm.png)

Wait until the VM has finished deleting before you attach the virtual hard disk to another VM. The lease on the virtual hard disk that associates it with the VM needs to be released before you can attach the virtual hard disk to another VM.

## Attach existing virtual hard disk to another VM
For the next few steps, you use another VM for troubleshooting purposes. You attach the existing virtual hard disk to this troubleshooting VM to be able to browse and edit the disk's content. This process allows you to correct any configuration errors or review additional application or system log files, for example. Choose or create another VM to use for troubleshooting purposes.

1. Select your resource group from the portal, then select your troubleshooting VM. Select **Disks**, select **Edit**, and then click **Add data disk**:

    ![Attach existing disk in the portal](./media/troubleshoot-recovery-disks-portal-windows/attach-existing-disk.png)

2. In the **Data disks** list, select the OS disk of the VM that you identified. If you do not see the OS disk, make sure that troubleshooting VM and the OS disk is in the same region (location).
3. Select **Save** to apply the changes.

## Mount the attached data disk

1. Open a Remote Desktop connection to your VM. Select your VM in the portal and click **Connect**. Download and open the RDP connection file. Enter your credentials to sign in to your VM as follows:

    ![Sign in to your VM using Remote Desktop](./media/troubleshoot-recovery-disks-portal-windows/open-remote-desktop.png)

2. Open **Server Manager**, then select **File and Storage Services**. 

    ![Select File and Storage Services within Server Manager](./media/troubleshoot-recovery-disks-portal-windows/server-manager-select-storage.png)

3. The data disk is automatically detected and attached. To see a list of the connected disks, select **Disks**. You can select your data disk to view volume information, including the drive letter. The following example shows the data disk attached and using **F:**:

    ![Disk attached and volume information in Server Manager](./media/troubleshoot-recovery-disks-portal-windows/server-manager-disk-attached.png)


## Fix issues on original virtual hard disk
With the existing virtual hard disk mounted, you can now perform any maintenance and troubleshooting steps as needed. Once you have addressed the issues, continue with the following steps.


## Unmount and detach original virtual hard disk
Once your errors are resolved, detach the existing virtual hard disk from your troubleshooting VM. You cannot use your virtual hard disk with any other VM until the lease attaching the virtual hard disk to the troubleshooting VM is released.

1. From the RDP session to your VM, open **Server Manager**, then select **File and Storage Services**:

    ![Select File and Storage Services in Server Manager](./media/troubleshoot-recovery-disks-portal-windows/server-manager-select-storage.png)

2. Select **Disks** and then select your data disk. Right-click on your data disk and select **Take Offline**:

    ![Set the data disk as offline in Server Manager](./media/troubleshoot-recovery-disks-portal-windows/server-manager-set-disk-offline.png)

3. Now detach the virtual hard disk from the VM. Select your VM in the Azure portal and click **Disks**. 
4. Select **Edit**, select the OS disk you attached and then click **Detach**:

    ![Detach existing virtual hard disk](./media/troubleshoot-recovery-disks-portal-windows/detach-disk.png)

    Wait until the VM has successfully detached the data disk before continuing.

## Create VM from original hard disk

### Method 1 Use Azure Resource Manager template
To create a VM from your original virtual hard disk, use [this Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-specialized-vhd-new-or-existing-vnet). The template deploys a VM into an existing or new virtual network, using the VHD URL from the earlier command. Click the **Deploy to Azure** button as follows:

![Deploy VM from template from GitHub](./media/troubleshoot-recovery-disks-portal-windows/deploy-template-from-github.png)

The template is loaded into the Azure portal for deployment. Enter the names for your new VM and existing Azure resources, and paste the URL to your existing virtual hard disk. To begin the deployment, click **Purchase**:

![Deploy VM from template](./media/troubleshoot-recovery-disks-portal-windows/deploy-from-image.png)

### Method 2 Create a VM from the disk

1. In the Azure portal, select your resource group from the portal, then locate the OS disk. You can also search for the disk by using the disk name:

    ![Search disk from Azure portal](./media/troubleshoot-recovery-disks-portal-windows/search-disk.png)
1. Select **Overview**, and then select **Create VM**.
    ![Create VM from a disk from Azure portal](./media/troubleshoot-recovery-disks-portal-windows/create-vm-from-disk.png)
1. Follow the wizard to create the VM.

## Re-enable boot diagnostics
When you create your VM from the existing virtual hard disk, boot diagnostics may not automatically be enabled. To check the status of boot diagnostics and turn on if needed, select your VM in the portal. Under **Monitoring**, click **Diagnostics settings**. Ensure the status is **On**, and the check mark next to **Boot diagnostics** is selected. If you make any changes, click **Save**:

![Update boot diagnostics settings](./media/troubleshoot-recovery-disks-portal-windows/reenable-boot-diagnostics.png)

## Next steps
If you are having issues connecting to your VM, see [Troubleshoot RDP connections to an Azure VM](troubleshoot-rdp-connection.md). For issues with accessing applications running on your VM, see [Troubleshoot application connectivity issues on a Windows VM](troubleshoot-app-connection.md).

For more information about using Resource Manager, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md).

