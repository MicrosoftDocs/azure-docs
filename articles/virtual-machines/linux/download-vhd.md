---
title: Download a Linux VHD from Azure 
description: Download a Linux VHD using the Azure CLI and the Azure portal.
author: roygara
ms.author: rogarana
ms.service: azure-disk-storage
ms.custom: devx-track-azurecli
ms.collection: linux
ms.topic: how-to
ms.date: 01/03/2023
---

# Download a Linux VHD from Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

In this article, you learn how to download a Linux virtual hard disk (VHD) file from Azure using the Azure portal. 

## Stop the VM

A VHD can’t be downloaded from Azure if it's attached to a running VM. If you want to keep the VM running, you can [create a snapshot and then download the snapshot](#alternative-snapshot-the-vm-disk).

To stop the VM:

1.	Sign in to the [Azure portal](https://portal.azure.com/).
2.	On the left menu, select **Virtual Machines**.
3.	Select the VM from the list.
4.	On the page for the VM, select **Stop**.

    :::image type="content" source="./media/download-vhd/export-stop.PNG" alt-text="Shows the menu button to stop the VM.":::

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
> If you don't stop the VM first, the snapshot will not be clean. The snapshot will be in the same state as if the VM had been power cycled or crashed at the point in time when the snapshot was made. While usually safe, it could cause problems if the running applications running at the time were not crash resistant.
>  
> This method is only recommended for VMs with a single OS disk. VMs with one or more data disks should be stopped before download or before creating a snapshot for the OS disk and each data disk.

<a name='secure-downloads-and-uploads-with-azure-ad'></a>

## Secure downloads and uploads with Microsoft Entra ID

[!INCLUDE [disks-azure-ad-upload-download-portal](../../../includes/disks-azure-ad-upload-download-portal.md)]

## Generate SAS URL

To download the VHD file, you need to generate a [shared access signature (SAS)](../../storage/common/storage-sas-overview.md?toc=/azure/virtual-machines/windows/toc.json) URL. When the URL is generated, an expiration time is assigned to the URL.

# [Portal](#tab/azure-portal)

1. On the menu of the page for the VM, select **Disks**.
2. Select the operating system disk for the VM, and then select **Disk Export**.
1. If required, update the value of **URL expires in (seconds)** to give you enough time to complete the download. The default is 3600 seconds (one hour).
3. Select **Generate URL**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$diskSas = Grant-AzDiskAccess -ResourceGroupName "yourRGName" -DiskName "yourDiskName" -DurationInSecond 86400 -Access 'Read'
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az disk grant-access --duration-in-seconds 86400 --access-level Read --name yourDiskName --resource-group yourRGName
```

---
      
## Download VHD

> [!NOTE]
> If you're using Microsoft Entra ID to secure managed disk downloads, the user downloading the VHD must have the appropriate [RBAC permissions](#assign-rbac-role).

# [Portal](#tab/azure-portal)

1.	Under the URL that was generated, select **Download the VHD file**.

    :::image type="content" source="./media/download-vhd/export-download.PNG" alt-text="Shows the button to download the VHD.":::

2.	You may need to select **Save** in the browser to start the download. The default name for the VHD file is *abcd*.

# [PowerShell](#tab/azure-powershell)

Use the following script to download your VHD:

```azurepowershell
Connect-AzAccount
#Set localFolder to your desired download location
$localFolder = "yourPathHere"
$blob = Get-AzStorageBlobContent -Uri $diskSas.AccessSAS -Destination $localFolder -Force 
```

When the download finishes, revoke access to your disk using `Revoke-AzDiskAccess -ResourceGroupName "yourRGName" -DiskName "yourDiskName"`.

# [Azure CLI](#tab/azure-cli)

Replace `yourPathhere` and `sas-URI` with your values, then use the following script to download your VHD:

> [!NOTE]
> If you're using Microsoft Entra ID to secure your managed disk uploads and downloads, add `--auth-mode login` to `az storage blob download`.

```azurecli

#set localFolder to your desired download location
localFolder=yourPathHere
#If you're using Azure AD to secure your managed disk uploads and downloads, add --auth-mode login to the following command.
az storage blob download -f $localFolder --blob-url "sas-URI"
```

When the download finishes, revoke access to your disk using `az disk revoke-access --name diskName --resource-group yourRGName`.

---

## Next steps

- Learn how to [upload and create a Linux VM from custom disk with the Azure CLI](upload-vhd.md). 
- [Manage Azure disks the Azure CLI](tutorial-manage-disks.md).
