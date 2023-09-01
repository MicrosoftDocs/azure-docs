---
title: Download a Windows VHD from Azure 
description: Download a Windows VHD using the Azure portal.
author: roygara
ms.author: rogarana
ms.service: azure-disk-storage
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 01/03/2023
---

# Download a Windows VHD from Azure

**Applies to:** :heavy_check_mark: Windows VMs 

In this article, you learn how to download a Windows virtual hard disk (VHD) file from Azure using the Azure portal.

## Optional: Generalize the VM

If you want to use the VHD as an [image](tutorial-custom-images.md) to create other VMs, you should use [Sysprep](/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation) to generalize the operating system. Otherwise, you will have to make a copy of the disk for each VM you want to create.

To use the VHD as an image to create other VMs, generalize the VM.

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com/).
2. [Connect to the VM](connect-logon.md). 
3. On the VM, open the Command Prompt window as an administrator.
4. Change the directory to *%windir%\system32\sysprep* and run sysprep.exe.
5. In the System Preparation Tool dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that **Generalize** is selected.
6. In Shutdown Options, select **Shutdown**, and then click **OK**. 

If you don't want to generalize your current VM, you can still create a generalized image by first [making a snapshot of the OS disk](#alternative-snapshot-the-vm-disk), creating a new VM from the snapshot, and then generalizing the copy.

## Stop the VM

A VHD can’t be downloaded from Azure if it's attached to a running VM. If you want to keep the VM running, you can [create a snapshot and then download the snapshot](#alternative-snapshot-the-vm-disk).

1. On the Hub menu in the Azure portal, click **Virtual Machines**.
1. Select the VM from the list.
1. On the blade for the VM, click **Stop**.

### Alternative: Snapshot the VM disk

Take a snapshot of the disk to download.

1. Select the VM in the [portal](https://portal.azure.com).
2. Select **Disks** in the left menu and then select the disk you want to snapshot. The details of the disk will be displayed.  
3. Select **Create Snapshot** from the menu at the top of the page. The **Create snapshot** page will open.
4. In **Name**, type a name for the snapshot. 
5. For **Snapshot type**, select **Full** or **Incremental**.
6. When you are done, select **Review + create**.

Your snapshot will be created shortly, and can then be used to download or create another VM.

> [!NOTE]
> If you don't stop the VM first, the snapshot will not be clean. The snapshot will be in the same state as if the VM had been power cycled or crashed at the point in time when the snapshot was made.  While usually safe, it could cause problems if the running applications running at the time were not crash resistant.
>  
> This method is only recommended for VMs with a single OS disk. VMs with one or more data disks should be stopped before download or before creating a snapshot for the OS disk and each data disk.


## Secure downloads and uploads with Azure AD

[!INCLUDE [disks-azure-ad-upload-download-portal](../../../includes/disks-azure-ad-upload-download-portal.md)]

## Generate download URL

To download the VHD file, you need to generate a [shared access signature (SAS)](../../storage/common/storage-sas-overview.md?toc=/azure/virtual-machines/windows/toc.json) URL. When the URL is generated, an expiration time is assigned to the URL.

# [Portal](#tab/azure-portal)

1. On the page for the VM, click **Disks** in the left menu.
1. Select the operating system disk for the VM.
1. On the page for the disk, select **Disk Export** from the left menu.
1. The default expiration time of the URL is *3600* seconds (one hour). You may need to increase this for Windows OS disks or large data disks. **36000** seconds (10 hours) is usually sufficient.
1. Click **Generate URL**.

# [PowerShell](#tab/azure-powershell)

Replace `yourRGName` and `yourDiskName` with your values, then run the following command to get your SAS.

```azurepowershell
$diskSas = Grant-AzDiskAccess -ResourceGroupName "yourRGName" -DiskName "yourDiskName" -DurationInSecond 86400 -Access 'Read'
```

# [Azure CLI](#tab/azure-cli)

Replace `yourRGName` and `yourDiskName` with your values, then run the following command to get your SAS.

```azurecli
az disk grant-access --duration-in-seconds 86400 --access-level Read --name yourDiskName --resource-group yourRGName
```

---


> [!NOTE]
> The expiration time is increased from the default to provide enough time to download the large VHD file for a Windows Server operating system. Large VHDs can take up to several hours to download depending on your connection and the size of the VM. 

## Download VHD

> [!NOTE]
> If you're using Azure AD to secure managed disk downloads, the user downloading the VHD must have the appropriate [RBAC permissions](#assign-rbac-role).

# [Portal](#tab/azure-portal)

1. Under the URL that was generated, click Download the VHD file.
1. You may need to click **Save** in your browser to start the download. The default name for the VHD file is *abcd*.

# [PowerShell](#tab/azure-powershell)

Use the following script to download your VHD:

```azurepowershell
Connect-AzAccount
#Set localFolder to your desired download location
$localFolder = "c:\tempfiles"
$blob = Get-AzStorageBlobContent -Uri $diskSas.AccessSAS -Destination $localFolder -Force 
```

When the download finishes, revoke access to your disk using `Revoke-AzDiskAccess -ResourceGroupName "yourRGName" -DiskName "yourDiskName"`.

# [Azure CLI](#tab/azure-cli)

Replace `yourPathhere` and `sas-URI` with your values, then use the following script to download your VHD:

> [!NOTE]
> If you're using Azure AD to secure your managed disk uploads and downloads, add `--auth-mode login` to `az storage blob download`.

```azurecli

#set localFolder to your desired download location
localFolder=yourPathHere
#If you're using Azure AD to secure your managed disk uploads and downloads, add --auth-mode login to the following command.
az storage blob download -f $localFolder --blob-url "sas-URI"
```

When the download finishes, revoke access to your disk using `az disk revoke-access --name diskName --resource-group yourRGName`.

---

## Next steps

- Learn how to [upload a VHD file to Azure](upload-generalized-managed.md). 
- [Create managed disks from unmanaged disks in a storage account](attach-disk-ps.md).
- [Manage Azure disks with PowerShell](tutorial-manage-data-disk.md).
