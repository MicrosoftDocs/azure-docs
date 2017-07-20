---

title: Troubleshoot an Azure Windows classic VM by attaching the OS disk to a recovery VM| Microsoft Docs
description: Learn how to troubleshoot an Azure Windows classic VM by attaching the OS disk to a recovery VM
services: virtual-machines-windows
documentationCenter: ''
authors: genlin
manager: timlt
editor: ''

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 05/26/2017
ms.author: genli

---

# Troubleshoot a Windows classic VM by attaching the OS disk to a recovery VM

If your Windows virtual machine (VM) in Azure encounters a boot or disk error, you may need to perform troubleshooting steps on the virtual hard disk () itself. A common example would be a failed application update that prevents the VM from being able to boot successfully. This article details how to use Azure PowerShell to connect your virtual hard disk to another Windows VM to fix any errors, then re-create your original VM.

## Recovery process overview
The troubleshooting process is as follows:

1. Delete the VM encountering issues, keeping the virtual hard disks.
2. Attach and mount the virtual hard disk to another Windows VM for troubleshooting purposes.
3. Connect to the troubleshooting VM. Edit files or run any tools to fix issues on the original virtual hard disk.
4. Unmount and detach the virtual hard disk from the troubleshooting VM.
5. Create a VM using the original virtual hard disk.

## Delete existing VM
Virtual hard disks and VMs are two distinct resources in Azure. A virtual hard disk is where the operating system itself, applications, and configurations are stored. The VM itself is just metadata that defines the size or location, and references resources such as a virtual hard disk or virtual network interface card (NIC). Each virtual hard disk has a lease assigned when attached to a VM. Although data disks can be attached and detached even while the VM is running, the OS disk cannot be detached unless the VM resource is deleted. The lease continues to associate the OS disk with a VM even when that VM is in a stopped and deallocated state.

The first step to recover your VM is to delete the VM resource itself. Deleting the VM leaves the virtual hard disks in your storage account. After the VM is deleted, you attach the virtual hard disk to another VM to troubleshoot and resolve the errors. 

1. Sign in to the [Azure portal](https://portal.azure.com). 
2. In the menu on the left, click **Virtual Machines (classic)**.
3. Select the VM that has problem, select **Disks**, and then identify the name of the virtual hard disk. Click the virtual hard disk, check the **Location** of the virtual hard disk to identify the storage account that contains this virtual hard disk. In the following example, the string before “.blob.core.windows.net “ is the storage account name.

    **https://portalvhds73fmhrw5xkp43.blob.core.windows.net/vhds/SCCM2012-2015-08-28.vhd**

    ![The image about VM's location](./media/troubleshoot-recovery-disks-portal/vm-location.png)

3. Right-click the VM and then select Delete. Make sure that you Keep the disks when you do this.
4. Create a new recovery VM. This VM must be in the same region and resource group (Cloud Service) as the problem VM.
5. Select the recovery VM, select **Disks** > **Attach Existing**.
6. To select your existing virtual hard disk, click **VHD File**:

    ![Browse for existing VHD](./media/troubleshoot-recovery-disks-portal/select-vhd-location.png)

7. Select the storage account > VHD container > the virtual hard disk,  click the **Select** button to confirm your choice.

    ![Select your existing VHD](./media/troubleshoot-recovery-disks-portal/select-vhd.png)

8. With your VHD now selected, click **OK** to attach the existing virtual hard disk.

9. After a few seconds, the **Disks** pane for your VM lists your existing virtual hard disk connected as a data disk:

    ![Existing virtual hard disk attached as a data disk](./media/troubleshoot-recovery-disks-portal/attached-disk.png)

## Fix issues on original virtual hard disk
With the existing virtual hard disk mounted, you can now perform any maintenance and troubleshooting steps as needed. Once you have addressed the issues, continue with the following steps.

## Unmount and detach original virtual hard disk
Once your errors are resolved, you unmount and detach the existing virtual hard disk from your troubleshooting VM. You cannot use your virtual hard disk with any other VM until the lease attaching the virtual hard disk to the troubleshooting VM is released.  

1. Sign in to the [Azure portal](https://portal.azure.com). 
2. In the menu on the left, click **Virtual Machines (classic)**.
3. Locate the recovery VM. Select Disks, right-click the disk, and then select **Detach**.

## Create VM from original hard disk

To create a VM from your original virtual hard disk, use [Azure classic portal](https://manage.windowsazure.com).

1. Sign into [Azure classic portal](https://manage.windowsazure.com).
2. On the bottom of the portal, select **New** > **Compute** > **Virtual Machine** > **From Gallery**.

3. In Choose an Image section, select **My disks**, and then select the original virtual hard disk. Check the location information. This is the region the VM will need to be deployed.  Select the next button.
4. In the Virtual machine configuration section, type the VM name and select a size for the VM.


## Next steps
If you are having issues connecting to your VM, see [Troubleshoot RDP connections to an Azure VM](../troubleshoot-rdp-connection.md). 

For issues with accessing applications running on your VM, see [Troubleshoot application connectivity issues on a Windows VM](../troubleshoot-app-connection.md).
