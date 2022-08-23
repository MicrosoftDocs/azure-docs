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

# [Azure portal](#tab/portal)

To change the key with the Azure portal, follow these steps:

1. Navigate to your storage account and display the **Encryption** settings.
1. Select the key vault and choose a new key.
1. Save your changes.

# [PowerShell](#tab/powershell)

To change the key with PowerShell, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) as shown in [Configure customer-managed keys for a new storage account](#configure-customer-managed-keys-for-a-new-storage-account) and provide the new key name and version. If the new key is in a different key vault, then you must also update the key vault URI.

# [Azure CLI](#tab/azure-cli)

To change the key with Azure CLI, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) as shown in [Configure customer-managed keys for a new storage account](#configure-customer-managed-keys-for-a-new-storage-account) and provide the new key name and version. If the new key is in a different key vault, then you must also update the key vault URI.

---

## Revoke customer-managed keys

Revoking a customer-managed key removes the association between the storage account and the key vault.

# [Azure portal](#tab/portal)

To revoke customer-managed keys with the Azure portal, disable the key as described in [Disable customer-managed keys](#disable-customer-managed-keys).

# [PowerShell](#tab/powershell)

You can revoke customer-managed keys by removing the key vault access policy. To revoke a customer-managed key with PowerShell, call the [Remove-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/remove-azkeyvaultaccesspolicy) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
Remove-AzKeyVaultAccessPolicy -VaultName $keyVault.VaultName `
    -ObjectId $storageAccount.Identity.PrincipalId `
```

# [Azure CLI](#tab/azure-cli)

You can revoke customer-managed keys by removing the key vault access policy. To revoke a customer-managed key with Azure CLI, call the [az keyvault delete-policy](/cli/azure/keyvault#az-keyvault-delete-policy) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurecli
az keyvault delete-policy \
    --name <key-vault> \
    --object-id $storage_account_principal
```

---

## Disable customer-managed keys

When you disable customer-managed keys, your storage account is once again encrypted with Microsoft-managed keys.

# [Azure portal](#tab/portal)

To disable customer-managed keys in the Azure portal, follow these steps:

1. Navigate to your storage account and display the **Encryption** settings.
1. Deselect the checkbox next to the **Use your own key** setting.

# [PowerShell](#tab/powershell)

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
