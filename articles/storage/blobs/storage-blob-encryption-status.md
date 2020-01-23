---
title: Check the encryption status of a blob - Azure Storage
description: Learn how to use Azure portal, PowerShell, or Azure CLI to check whether a given blob is encrypted. If a blob is not encrypted, learn how to use AzCopy to force encryption by downloading and re-uploading the blob.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 11/26/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Check the encryption status of a blob

Every block blob, append blob, or page blob that was written to Azure Storage after October 20, 2017 is encrypted with Azure Storage encryption. Blobs created prior to this date continue to be encrypted by a background process.

This article shows how to determine whether a given blob has been encrypted.

## Check a blob's encryption status

Use the Azure portal, PowerShell, or Azure CLI to determine whether a blob is encrypted without code.

### [Azure portal](#tab/portal)

To use the Azure portal to check whether a blob has been encrypted, follow these steps:

1. In the Azure portal, navigate to your storage account.
1. Select **Containers** to navigate to a list of containers in the account.
1. Locate the blob and display its **Overview** tab.
1. View the **Server Encrypted** property. If **True**, as shown in the following image, then the blob is encrypted. Notice that the blob's properties also include the date and time that the blob was created.

    ![Screenshot showing how to check Server Encrypted property in Azure portal](media/storage-blob-encryption-status/blob-encryption-property-portal.png)

### [PowerShell](#tab/powershell)

To use PowerShell to check whether a blob has been encrypted, check the blob's **IsServerEncrypted** property. Remember to replace placeholder values in angle brackets with your own values:

```powershell
$account = Get-AzStorageAccount -ResourceGroupName <resource-group> `
    -Name <storage-account>
$blob = Get-AzStorageBlob -Context $account.Context `
    -Container <container> `
    -Blob <blob>
$blob.ICloudBlob.Properties.IsServerEncrypted
```

To determine when the blob was created, check the value of the **Created** property:

```powershell
$blob.ICloudBlob.Properties.IsServerEncrypted
```

### [Azure CLI](#tab/cli)

To use Azure CLI to check whether a blob has been encrypted, check the blob's **IsServerEncrypted** property. Remember to replace placeholder values in angle brackets with your own values:

```azurecli-interactive
az storage blob show \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --query "properties.serverEncrypted"
```

To determine when the blob was created, check the value of the **created** property.

---

## Force encryption of a blob

If a blob that was created prior to October 20, 2017 has not yet been encrypted by the background process, you can force encryption to occur immediately by downloading and re-uploading the blob. A simple way to do this is with AzCopy.

To download a blob to your local file system with AzCopy, use the following syntax:

```
azcopy copy 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-path>' '<local-file-path>'

Example:
azcopy copy 'https://storagesamples.blob.core.windows.net/sample-container/blob1.txt' 'C:\temp\blob1.txt'
```

To re-upload the blob to Azure Storage with AzCopy, use the following syntax:

```
azcopy copy '<local-file-path>' 'https://<storage-account-name>.<blob or dfs>.core.windows.net/<container-name>/<blob-name>'

Example:
azcopy copy 'C:\temp\blob1.txt' 'https://storagesamples.blob.core.windows.net/sample-container/blob1.txt'
```

For more information about using AzCopy to copy blob data, see [Transfer data with AzCopy and Blob storage](../common/storage-use-azcopy-blobs.md).

## Next steps

[Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
