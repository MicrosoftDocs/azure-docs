---
title: Download a Windows VHD from Azure 
description: Download a Windows VHD using the Azure portal.
author: cynthn
manager: gwallace
ms.service: virtual-machines
ms.subservice: disks
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 01/13/2019
ms.author: cynthn
---

# Download a Windows VHD from Azure

In this article, you learn how to download a Windows virtual hard disk (VHD) file from Azure using the Azure portal.

## Optional: Generalize the VM

If you want to use the VHD as an [image](tutorial-custom-images.md) to create other VMs, you should use [Sysprep](/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation) to generalize the operating system. (Otherwise you will have to make a copy the disk for each VM you want to create.)

To use the VHD as an image to create other VMs, generalize the VM.

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com/).
2. [Connect to the VM](connect-logon.md). 
3. On the VM, open the Command Prompt window as an administrator.
4. Change the directory to *%windir%\system32\sysprep* and run sysprep.exe.
5. In the System Preparation Tool dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that **Generalize** is selected.
6. In Shutdown Options, select **Shutdown**, and then click **OK**. 

If you don't want to generalize your current VM, you can still create a generalized image by first making a snapshot of the OS disk, creating a new VM from the snapshot, and then generalizing the copy.

## Stop the VM

A VHD can’t be downloaded from Azure if it's attached to a running VM. You need to stop the VM to download a VHD (or make a snapshot and download the snapshot). 

1. On the Hub menu in the Azure portal, click **Virtual Machines**.
1. Select the VM from the list.
1. On the blade for the VM, click **Stop**.

### Alternative: Snapshot the VM disk

Bring up the VM with the disk to download in the Azure portal, click on "Disks" to see the list of disks, then click on the disk name you wish to snapshot.  The details of the disk will be displayed.  Click on "Create Snapshot" and then enter a name and type (full or incremental) for the disk snapshot.  Your snapshot will be created shortly, and may then be used to download or create another VM from.

Note that if you don't stop the VM first, your snapshot will not be clean, but rather in the same state as if the VM had been powercycled or crashed at the point in time when the snapshot was made.  While usually safe, it could cause problems if the applications running at the time were not crash resistent.

## Generate download URL

To download the VHD file, you need to generate a [shared access signature (SAS)](../../storage/common/storage-sas-overview.md?toc=/azure/virtual-machines/windows/toc.json) URL. When the URL is generated, an expiration time is assigned to the URL.

1. On the page for the VM, click **Disks** in the left menu.
1. Select the operating system disk for the VM.
1. On the page for the disk, select **Disk Export** from the left menu.
1. The default expiration time of the URL is *3600* seconds (one hour). You may need to increase this for Windows OS disks or large data disks. **36000** seconds (10 hours) is usually sufficient.
1. Click **Generate URL**.

> [!NOTE]
> The expiration time is increased from the default to provide enough time to download the large VHD file for a Windows Server operating system. Large VHDs can take up to several hours to download depending on your connection and the size of the VM. 
> 
> 

## Download VHD

1. Under the URL that was generated, click Download the VHD file.
1. You may need to click **Save** in your browser to start the download. The default name for the VHD file is *abcd*.

## Next steps

- Learn how to [upload a VHD file to Azure](upload-generalized-managed.md). 
- [Create managed disks from unmanaged disks in a storage account](attach-disk-ps.md).
- [Manage Azure disks with PowerShell](tutorial-manage-data-disk.md).
