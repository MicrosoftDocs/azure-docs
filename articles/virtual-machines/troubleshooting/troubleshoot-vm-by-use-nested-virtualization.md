---
title: Troubleshoot a problem Azure VM by using nested virtualization in Azure | Microsoft Docs
description: How to troubleshoot a problem Azure VM by using nested virtualization in Azure
services: virtual-machines-windows
documentationcenter: ''
author: glimoli
manager: dcscontentpm
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows

ms.topic: article
ms.date: 11/19/2019
ms.author: genli
---
# Troubleshoot a problem Azure VM by using nested virtualization in Azure

This article shows how to create a nested virtualization environment in Microsoft Azure, so you can mount the disk of the problem VM on the Hyper-V host (Rescue VM) for troubleshooting purposes.

## Prerequisites

To mount the problem VM, the Rescue VM must use the same type of Storage Account (Standard or Premium) as the problem VM.

## Step 1: Create a Rescue VM and install Hyper-V role

1.  Create a new Rescue VM:

    -  Operating system: Windows Server 2016 Datacenter

    -  Size: Any V3 series with at least two cores that support nested virtualization. For more information, see [Introducing the new Dv3 and Ev3 VM sizes](https://azure.microsoft.com/blog/introducing-the-new-dv3-and-ev3-vm-sizes/).

    -  Same location, Storage Account, and Resource Group as the problem VM.

    -  Select the same storage type as the problem VM (Standard or Premium).

2.  After the Rescue VM is created, remote desktop to the Rescue VM.

3.  In Server Manager, select **Manage** > **Add Roles and Features**.

4.  In the **Installation Type** section, select **Role-based or feature-based installation**.

5.  In the **Select destination server** section, make sure that the Rescue VM is selected.

6.  Select the **Hyper-V role** > **Add Features**.

7.  Select **Next** on the **Features** section.

8.  If a virtual switch is available, select it. Otherwise select **Next**.

9.  On the **Migration** section, select **Next**

10. On the **Default Stores** section, select **Next**.

11. Check the box to restart the server automatically if required.

12. Select **Install**.

13. Allow the server to install the Hyper-V role. This takes a few minutes and the server will reboot automatically.

## Step 2: Create the problem VM on the Rescue VM’s Hyper-V server

1.  [Create a snapshot disk](troubleshoot-recovery-disks-portal-windows.md#take-a-snapshot-of-the-os-disk) for the OS disk of the VM that has problem, and then attach the snapshot disk to the recuse VM.

2.  Remote desktop to the Rescue VM.

3.  Open Disk Management (diskmgmt.msc). Make sure that the disk of the problem VM is set to **Offline**.

4.  Open Hyper-V Manager: In **Server Manager**, select the **Hyper-V role**. Right-click the server, and then select the **Hyper-V Manager**.

5.  In the Hyper-V Manager, right-click the Rescue VM, and then select **New** > **Virtual Machine** > **Next**.

6.  Type a name for the VM, and then select **Next**.

7.  Select **Generation 1**.

8.  Set the startup memory at 1024 MB or more.

9. If applicable select the Hyper-V Network Switch that was created. Else move to the next page.

10. Select **Attach a virtual hard disk later**.

    ![the image about the Attach a Virtual Hard Disk Later option](media/troubleshoot-vm-by-use-nested-virtualization/attach-disk-later.png)

11. Select **Finish** when the VM is created.

12. Right-click the VM that you created, and then select **Settings**.

13. Select **IDE Controller 0**, select **Hard Drive**, and then click **Add**.

    ![the image about adds new hard drive](media/troubleshoot-vm-by-use-nested-virtualization/create-new-drive.png)    

14. In **Physical Hard Disk**, select the disk of the problem VM that you attached to the Azure VM. If you do not see any disks listed, check if the disk is set to offline by using Disk management.

    ![the image about mounts the disk](media/troubleshoot-vm-by-use-nested-virtualization/mount-disk.png)  


15. Select **Apply**, and then select **OK**.

16. Double-click on the VM, and then start it.

17. Now you can work on the VM as the on-premises VM. You could follow any troubleshooting steps you need.

## Step 3: Replace the OS disk used by the problem VM

1.  After you get the VM back online, shut down the VM in the Hyper-V manager.

2.  [Unmount and detach the repaired OS disk](troubleshoot-recovery-disks-portal-windows.md#unmount-and-detach-original-virtual-hard-disk
).
3.  [Replace the OS disk used by the VM with the repaired OS disk](troubleshoot-recovery-disks-portal-windows.md#swap-the-os-disk-for-the-vm
).

## Next steps

If you are having issues connecting to your VM, see [Troubleshoot RDP connections to an Azure VM](troubleshoot-rdp-connection.md). For issues with accessing applications running on your VM, see [Troubleshoot application connectivity issues on a Windows VM](troubleshoot-app-connection.md).
