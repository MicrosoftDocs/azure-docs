---
title: Download a Windows VHD from Azure 
description: Download a Windows VHD using the Azure portal.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows

ms.topic: article
ms.date: 01/13/2019
ms.author: cynthn
---

# Download a Windows VHD from Azure

In this article, you learn how to download a Windows virtual hard disk (VHD) file from Azure using the Azure portal.

## Optional: Generalize the VM

If you want to use the VHD as an [image](tutorial-custom-images.md) to create other VMs, you should use [Sysprep](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation) to generalize the operating system. 

To use the VHD as an image to create other VMs, generalize the VM.

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com/).
2. [Connect to the VM](connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 
3. On the VM, open the Command Prompt window as an administrator.
4. Change the directory to *%windir%\system32\sysprep* and run sysprep.exe.
5. In the System Preparation Tool dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that **Generalize** is selected.
6. In Shutdown Options, select **Shutdown**, and then click **OK**. 


## Stop the VM

A VHD can’t be downloaded from Azure if it's attached to a running VM. You need to stop the VM to download a VHD. 

1. On the Hub menu in the Azure portal, click **Virtual Machines**.
1. Select the VM from the list.
1. On the blade for the VM, click **Stop**.


## Generate download URL

To download the VHD file, you need to generate a [shared access signature (SAS)](../../storage/common/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) URL. When the URL is generated, an expiration time is assigned to the URL.

1. On the page for the VM, click **Disks** in the left menu.
1. Select the operating system disk for the VM.
1. On the page for the disk, select **Disk Export** from the left menu.
1. The default expiration time of the URL is *3600* seconds. Increase this to **36000** for Windows OS disks.
1. Click **Generate URL**.

> [!NOTE]
> The expiration time is increased from the default to provide enough time to download the large VHD file for a Windows Server operating system. You can expect a VHD file that contains the Windows Server operating system to take several hours to download depending on your connection. If you are downloading a VHD for a data disk, the default time is sufficient. 
> 
> 

## Download VHD

1. Under the URL that was generated, click Download the VHD file.
1. You may need to click **Save** in your browser to start the download. The default name for the VHD file is *abcd*.

## Next steps

- Learn how to [upload a VHD file to Azure](upload-generalized-managed.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 
- [Create managed disks from unmanaged disks in a storage account](attach-disk-ps.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).
- [Manage Azure disks with PowerShell](tutorial-manage-data-disk.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

