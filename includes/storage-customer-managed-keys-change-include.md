---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 08/22/2022
ms.author: tamram
ms.custom: "include file"
---

## Change the key

You can change the key that you are using for Azure Storage encryption at any time.

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
