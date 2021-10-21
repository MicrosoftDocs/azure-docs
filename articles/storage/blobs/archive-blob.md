---
title: Archive a blob
titleSuffix: Azure Storage
description: Learn how to ....
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 10/18/2021
ms.author: tamram
ms.reviewer: fryu
ms.subservice: blobs
---

# Archive a blob

tbd

## Archive a blob on upload

To archive a blob on upload, you can create the blob directly in the Archive tier.

### [Azure portal](#tab/portal)



### [PowerShell](#tab/powershell)

```azurepowershell
$rgName = <resource-group>
$storageAccount = <storage-account>
$containerName = <container>

# Get context object
$ctx = New-AzStorageContext -StorageAccountName $storageAccount -UseConnectedAccount

# Create new container.
New-AzStorageContainer -Name $containerName -Context $ctx

# Upload a file named blob1.txt to the Archive tier.
Set-AzStorageBlobContent -Container $containerName `
    -File "blob1.txt" `
    -Blob "blob1.txt" `
    -Context $ctx `
    -StandardBlobTier Archive
```

### [Azure CLI](#tab/azure-cli)

```azurecli
az storage blob upload \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --file <file> \
    --tier archive \
    --auth-mode login
```

---

## Archive an existing blob

tbd

## Bulk archive

tbd

## See also

tbd
