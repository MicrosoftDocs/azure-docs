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

## Revoke customer-managed keys

Revoking a customer-managed key removes the association between the storage account and the key vault.

# [Azure portal](#tab/azure-portal)

To revoke customer-managed keys with the Azure portal, disable the key as described in [Disable customer-managed keys](#disable-customer-managed-keys).

# [PowerShell](#tab/azure-powershell)

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
