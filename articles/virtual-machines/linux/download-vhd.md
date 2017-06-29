---
title: Download a Linux VHD from Azure | Microsoft Docs
description: Download a Linux VHD using the Azure CLI and the Azure portal.
services: virtual-machines-windows
documentationcenter: ''
author: davidmu1
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 06/26/2017
ms.author: davidmu
---

# Download a Linux VHD from Azure

In this article, you learn how to download a [Linux virtual hard disk (VHD)](../../storage/storage-about-disks-and-vhds-windows.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) file from Azure using the Azure CLI and Azure portal. 

Virtual machines (VMs) in Azure use [disks](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) as a place to store an operating system, applications, and data. All Azure VMs have at least two disks – a Windows operating system disk and a temporary disk. The operating system disk is initially created from an image, and both the operating system disk and the image are VHDs stored in an Azure storage account. Virtual machines also can have one or more data disks, that are also stored as VHDs.

If you haven't already done so, install [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2).

## Stop the VM

A VHD can’t be downloaded from Azure if it's attached to a running VM. You need to stop the VM to download a VHD. If you want to use a VHD as an [image](tutorial-custom-images.md) to create other VMs with new disks, you use [Sysprep](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation) to generalize the operating system contained in the file and then stop the VM. To use the VHD as a disk for a new instance of an existing VM or data disk, you only need to stop and deallocate the VM.

To use the VHD as an image to create other VMs, complete these steps:

1. Use SSH, the account name, and the public IP address of the VM to connect to the VM and deprovision it. The +user parameter also removes the last provisioned user account. If you are baking account credentials in to the VM, leave out this +user parameter. The following example removes the last provisioned user account:

    ```bash
    ssh azureuser@40.118.249.235
    sudo waagent -deprovision+user -force
    exit 
    ```

2. Sign in to your Azure account with [az login](https://docs.microsoft.com/cli/azure/#login).
3. Stop and deallocate the VM.

    ```azurecli
    az vm deallocate --resource-group myResourceGroup --name myVM
    ```

4. Generalize the VM. 

    ```azurecli
    az vm generalize --resource-group myResourceGroup --name myVM
    ``` 

To use the VHD as a disk for a new instance of an existing VM or data disk, complete these steps:

1.	Sign in to the [Azure portal](https://portal.azure.com/).
2.	On the Hub menu, click **Virtual Machines**.
3.	Select the VM from the list.
4.	On the blade for the VM, click **Stop**.

    ![Stop VM](./media/download-vhd/export-stop.png)

## Generate SAS URL

To download the VHD file, you need to generate a [shared access signature (SAS)](../../storage/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) URL. When the URL is generated, an expiration time is assigned to the URL.

1.	On the menu of the blade for the VM, click **Disks**.
2.	Select the operating system disk for the VM, and then click **Export**.
3.	Click **Generate URL**.

    ![Generate URL](./media/download-vhd/export-generate.png)

## Download VHD

1.	Under the URL that was generated, click Download the VHD file.

    ![Download VHD](./media/download-vhd/export-download.png)

2.	You may need to click **Save** in the browser to start the download. The default name for the VHD file is *abcd*.

    ![Click Save in the browser](./media/download-vhd/export-save.png)

## Next steps

- Learn how to [upload and create a Linux VM from custom disk with the Azure CLI 2.0](upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 
- [Manage Azure disks with PowerShell](tutorial-manage-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

