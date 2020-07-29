---
title: Attach a managed data disk to a Windows VM - Azure 
description: How to attach a managed data disk to a Windows VM by using the Azure portal.
author: roygara
ms.service: virtual-machines-windows
ms.topic: how-to
ms.date: 02/06/2020
ms.author: rogarana
ms.subservice: disks

---
# Attach a managed data disk to a Windows VM by using the Azure portal

This article shows you how to attach a new managed data disk to a Windows virtual machine (VM) by using the Azure portal. The size of the VM determines how many data disks you can attach. For more information, see [Sizes for virtual machines](sizes.md).


## Add a data disk

1. Go to the [Azure portal](https://portal.azure.com) to add a data disk. Search for and select **Virtual machines**.
2. Select a virtual machine from the list.
3. On the **Virtual machine** page, select **Disks**.
4. On the **Disks** page, select **Add data disk**.
5. In the drop-down for the new disk, select **Create disk**.
6. In the **Create managed disk** page, type in a name for the disk and adjust the other settings as necessary. When you're done, select **Create**.
7. In the **Disks** page, select **Save** to save the new disk configuration for the VM.
8. After Azure creates the disk and attaches it to the virtual machine, the new disk is listed in the virtual machine's disk settings under **Data disks**.


## Initialize a new data disk

1. Connect to the VM.
1. Select the Windows **Start** menu inside the running VM and enter **diskmgmt.msc** in the search box. The **Disk Management** console opens.
2. Disk Management recognizes that you have a new, uninitialized disk and the **Initialize Disk** window appears.
3. Verify the new disk is selected and then select **OK** to initialize it.
4. The new disk appears as **unallocated**. Right-click anywhere on the disk and select **New simple volume**. The **New Simple Volume Wizard** window opens.
5. Proceed through the wizard, keeping all of the defaults, and when you're done select **Finish**.
6. Close **Disk Management**.
7. A pop-up window appears notifying you that you need to format the new disk before you can use it. Select **Format disk**.
8. In the **Format new disk** window, check the settings, and then select **Start**.
9. A warning appears notifying you that formatting the disks erases all of the data. Select **OK**.
10. When the formatting is complete, select **OK**.

## Next steps

- You can also [attach a data disk by using PowerShell](attach-disk-ps.md).
- If your application needs to use the *D:* drive to store data, you can [change the drive letter of the Windows temporary disk](change-drive-letter.md).
