---
title: Check the encryption status of a blob - Azure Storage
description: Use Azure portal, PowerShell, or Azure CLI to check whether a given blob is encrypted.
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

Every block blob, append blob, or page blob that was written to Azure Storage after October 20, 2017 is encrypted with Azure Storage encryption. Blobs created prior to this date continue to be encrypted by a background process. To determine whether a given blob has been encrypted, use one of the approaches described in this article.

## Check whether a blob is encrypted

### [Azure portal](#tab/portal)

To use the Azure portal to check whether a blob has been encrypted, follow these steps:

1. In the Azure portal, navigate to your storage account.
1. Select **Containers** to navigate to a list of containers in the account.
1. Locate the blob and display its **Overview** tab.
1. View the **Server Encrypted** property. If **True**, as shown in the following image, then the blob is encrypted.

    ![Screenshot showing how to check Server Encrypted property in Azure portal](media/storage-blob-encryption-status/blob-encryption-property-portal.png)

### [PowerShell](#tab/powershell)

To use PowerShell to check whether a blob has been encrypted, check the blob's **IsServerEncrypted** property:

```powershell
$account = Get-AzStorageAccount -ResourceGroupName <resource-group> `
    -Name <storage-account>
(Get-AzStorageBlob -Context $account.Context -Container sample-container -Blob blob1.txt).ICloudBlob.Properties.IsServerEncrypted
```

### [Azure CLI](#tab/cli)

To use Azure CLI to check whether a blob has been encrypted, check the blob's **IsServerEncrypted** property:

az storage blob show --account-name storagesamples --container-name sample-container --name blob1.txt --query "properties.serverEncrypted"

---

## Next steps

[Azure Storage encryption for data at rest](storage-service-encryption.md)
