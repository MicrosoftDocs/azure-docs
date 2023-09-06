---
title: Attach a managed data disk to a Windows VM - Azure 
description: How to attach a managed data disk to a Windows VM by using the Azure portal.
author: roygara
ms.service: azure-disk-storage
ms.collection: windows
ms.topic: how-to
ms.date: 02/06/2020
ms.author: rogarana

---
# Attach a managed data disk to a Windows VM by using the Azure portal

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 


This article shows you how to attach a new managed data disk to a Windows virtual machine (VM) by using the Azure portal. The size of the VM determines how many data disks you can attach. For more information, see [Sizes for virtual machines](../sizes.md).


## Add a data disk

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Virtual machines**.
1. Select a virtual machine from the list.
1. On the **Virtual machine** pane, select **Disks**.
1. On the **Disks** pane, select **Create and attach a new disk**.
1. In the drop-downs for the new disk, make the selections you want, and name the disk.
1. Select **Save** to create and attach the new data disk to the VM.

## Initialize a new data disk

1. Connect to the VM.
1. Select the Windows **Start** menu inside the running VM and enter **diskmgmt.msc** in the search box. The **Disk Management** console opens.
1. Disk Management recognizes that you have a new, uninitialized disk and the **Initialize Disk** window appears.
1. Verify the new disk is selected and then select **OK** to initialize it.
1. The new disk appears as **unallocated**. Right-click anywhere on the disk and select **New simple volume**. The **New Simple Volume Wizard** window opens.
1. Proceed through the wizard, keeping all of the defaults, and when you're done select **Finish**.
1. Close **Disk Management**.
1. A pop-up window appears notifying you that you need to format the new disk before you can use it. Select **Format disk**.
1. In the **Format new disk** window, check the settings, and then select **Start**.
1. A warning appears notifying you that formatting the disks erases all of the data. Select **OK**.
1. When the formatting is complete, select **OK**.

## Next steps

- You can also [attach a data disk by using PowerShell](attach-disk-ps.md).
- If your application needs to use the *D:* drive to store data, you can [change the drive letter of the Windows temporary disk](change-drive-letter.md).