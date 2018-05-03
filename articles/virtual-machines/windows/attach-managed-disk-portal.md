---
title: Attach a managed data disk to a Windows VM - Azure | Microsoft Docs
description: How to attach new managed data disk to a Windows VM in the Azure portal using the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 12/13/2017
ms.author: cynthn

---
# How to attach a managed data disk to a Windows VM in the Azure portal

This article shows you how to attach a new managed data disk to Windows virtual machines in the Azure portal. Before you do this, review these tips:

* The size of the virtual machine controls how many data disks you can attach. For details, see [Sizes for virtual machines](sizes.md).
* For a new disk, you don't need to create it first because Azure creates it when you attach it.

You can also [attach a data disk using Powershell](attach-disk-ps.md).



## Add a data disk
1. In the menu on the left, click **Virtual Machines**.
2. Select the virtual machine from the list.
3. On the virtual machine page, click **Disks**.
4. On the **Disks** page, click **+ Add data disk**.
5. In the drop-down for the new disk, select **Create disk**.
6. In the **Create managed disk** page, type in a name for the disk and adjust the other settings as necessary. When you are done, click **Create**.
7. In the **Disks** page, click **Save** to save the new disk configuration for the VM.
6. After Azure creates the disk and attaches it to the virtual machine, the new disk is listed in the virtual machine's disk settings under **Data disks**.


## Initialize a new data disk

1. Connect to the VM.
1. Click the start menu inside the VM and type **diskmgmt.msc** and hit **Enter**. Disk Management snap-in opens.
2. Disk Management recognizes that you have a new, un-initialized disk and the **Initialize Disk** window pops up.
3. Make sure the new disk is selected and click **OK** to initialize it.
4. The new disk appears as **unallocated**. Right-click anywhere on the disk and select **New simple volume**. The **New Simple Volume Wizard** opens.
5. Go through the wizard, keeping all of the defaults, when you are done select **Finish**.
6. Close Disk Management.
7. You get a pop-up that you need to format the new disk before you can use it. Click **Format disk**.
8. In the **Format new disk** dialog, check the settings and then click **Start**.
9. You get a warning that formatting the disks erases all of the data, click **OK**.
10. When the format is complete, click **OK**.

## Use TRIM with standard storage

If you use standard storage (HDD), you should enable TRIM. TRIM discards unused blocks on the disk so you are only billed for storage that you are actually using. This can save on costs if you create large files and then delete them. 

You can run this command to check the TRIM setting. Open a command prompt on your Windows VM and type:

```
fsutil behavior query DisableDeleteNotify
```

If the command returns 0, TRIM is enabled correctly. If it returns 1, run the following command to enable TRIM:
```
fsutil behavior set DisableDeleteNotify 0
```

After deleting data from your disk, you can ensure the TRIM operations flush properly by running defrag with TRIM:

```
defrag.exe <volume:> -l
```

You can also ensure the entire volume is trimmed by formatting the volume.

## Next steps
If your application needs to use the D: drive to store data, you can [change the drive letter of the Windows temporary disk](change-drive-letter.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).
