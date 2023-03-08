---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 03/08/2023
ms.author: tamram
ms.custom: "include file"
---

## Switch between customer-managed keys and Microsoft-managed keys

You can switch from customer-managed keys back to Microsoft-managed keys at any time, using the Azure portal, PowerShell, or the Azure CLI.

# [Azure portal](#tab/azure-portal)

To switch from customer-managed keys back to Microsoft-managed keys in the Azure portal, follow these steps:

1. Navigate to your storage account.
1. Under **Security + networking**, select **Encryption**.
1. Deselect the checkbox next to the **Use your own key** setting.

    :::image type="content" source="../articles/storage/common/media/customer-managed-keys-configure-common/portal-enable-MMK.png" alt-text="Screenshot showing how to switch to Microsoft-managed keys for a storage account.":::

# [PowerShell](#tab/azure-powershell)

To disable customer-managed keys with PowerShell, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) with the `-StorageEncryption` option, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName $storageAccount.ResourceGroupName `
    -AccountName $storageAccount.StorageAccountName `
    -StorageEncryption  
```

# [Azure CLI](#tab/azure-cli)

To disable customer-managed keys with Azure CLI, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) and set the `--encryption-key-source parameter` to `Microsoft.Storage`, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurecli
az storage account update
    --name <storage-account> \
    --resource-group <resource_group> \
    --encryption-key-source Microsoft.Storage
```

---
