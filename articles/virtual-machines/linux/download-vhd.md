---
title: Download a Linux VHD from Azure 
description: Download a Linux VHD using the Azure CLI and the Azure portal.
author: cynthn
ms.service: virtual-machines
ms.subservice: disks
ms.collection: linux
ms.topic: how-to
ms.date: 08/03/2020
ms.author: cynthn
---

# Download a Linux VHD from Azure

In this article, you learn how to download a Linux virtual hard disk (VHD) file from Azure using the Azure portal. 

## Stop the VM

A VHD can’t be downloaded from Azure if it's attached to a running VM. You need to stop the VM to download a VHD (or make a snapshot and download the snapshot). 

1.	Sign in to the [Azure portal](https://portal.azure.com/).
2.	On the left menu, select **Virtual Machines**.
3.	Select the VM from the list.
4.	On the page for the VM, select **Stop**.

    :::image type="content" source="./media/download-vhd/export-stop.PNG" alt-text="Shows the menu button to stop the VM.":::

### Alternative: Snapshot the VM disk

Bring up the VM with the disk to download in the Azure portal, click on "Disks" to see the list of disks, then click on the disk name you wish to snapshot.  The details of the disk will be displayed.  Click on "Create Snapshot" and then enter a name and type (full or incremental) for the disk snapshot.  Your snapshot will be created shortly, and may then be used to download or create another VM from.

Note that if you don't stop the VM first, your snapshot will not be clean, but rather in the same state as if the VM had been powercycled or crashed at the point in time when the snapshot was made.  While usually safe, it could cause problems if the applications running at the time were not crash resistent.

## Generate SAS URL

To download the VHD file, you need to generate a [shared access signature (SAS)](../../storage/common/storage-sas-overview.md?toc=/azure/virtual-machines/windows/toc.json) URL. When the URL is generated, an expiration time is assigned to the URL.

1. On the menu of the page for the VM, select **Disks**.
2. Select the operating system disk for the VM, and then select **Disk Export**.
1. If the needed, update the value of **URL expires in (seconds)** to give you enough time to complete the download. The default is 3600 seconds (one hour).
3. Select **Generate URL**.
 
      
## Download VHD

1.	Under the URL that was generated, select **Download the VHD file**.

    :::image type="content" source="./media/download-vhd/export-download.PNG" alt-text="Shows the button to download the VHD.":::

2.	You may need to select **Save** in the browser to start the download. The default name for the VHD file is *abcd*.

## Next steps

- Learn how to [upload and create a Linux VM from custom disk with the Azure CLI](upload-vhd.md). 
- [Manage Azure disks the Azure CLI](tutorial-manage-disks.md).
