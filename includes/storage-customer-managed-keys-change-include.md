---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 03/23/2023
ms.author: tamram
ms.custom: "include file", engagement-fy23
---

## Change the key

You can change the key that you are using for Azure Storage encryption at any time.

> [!NOTE]
> When you change the key or key version, the protection of the root encryption key changes, but the data in your Azure Storage account remains encrypted at all times. There is no additional action required on your part to ensure that your data is protected. Changing the key or rotating the key version doesn't impact performance. There is no downtime associated with changing the key or rotating the key version.

# [Azure portal](#tab/azure-portal)

To change the key with the Azure portal, follow these steps:

1. Navigate to your storage account and display the **Encryption** settings.
1. Select the key vault and choose a new key.
1. Save your changes.

# [PowerShell](#tab/azure-powershell)

To change the key with PowerShell, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) and provide the new key name and version. If the new key is in a different key vault, then you must also update the key vault URI.

# [Azure CLI](#tab/azure-cli)

To change the key with Azure CLI, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) and provide the new key name and version. If the new key is in a different key vault, then you must also update the key vault URI.

---
