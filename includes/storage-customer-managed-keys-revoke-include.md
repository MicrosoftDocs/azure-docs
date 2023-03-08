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

## Revoke access with customer-managed keys

To temporarily revoke access to a storage account that is using customer-managed keys, disable the key currently being used in the key vault. Disabling the key will cause attempts to access data in the storage account to fail with error code 403 (Forbidden). For a list of storage account operations that will be affected, see [Revoke access with customer-managed keys](../articles/storage/common/customer-managed-keys-overview.md#revoke-access-with-customer-managed-keys).

# [Azure portal](#tab/azure-portal)

To disable a customer-managed key with the Azure portal, follow these steps:

1. Navigate to the key vault that contains the CMK.
1. Under **Objects** select **Keys**.
1. Right-click the key and select **Disable**.

    :::image type="content" source="../articles/storage/common/media/customer-managed-keys-configure-common/portal-disable-CMK.png" alt-text="Screenshot showing how to disable a customer-managed key in the key vault.":::

# [PowerShell](#tab/azure-powershell)

To revoke a customer-managed key with PowerShell, call the [Update-AzKeyVaultKey](/powershell/module/az.keyvault/update-azkeyvaultkey) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values to define the variables, or use the variables defined in the previous examples.

```azurepowershell
$kvName  = "<key-vault-name>"
$keyName = "<key-name>"
$enabled = $false
# $false to disable the key / $true to enable it

# Check the current state of the key (before and after enabling/disabling it)
Get-AzKeyVaultKey -Name $keyName -VaultName $kvName

# Disable (or enable) the key
Update-AzKeyVaultKey -VaultName $kvName -Name $keyName -Enable $enabled
```

# [Azure CLI](#tab/azure-cli)

To revoke a customer-managed key with Azure CLI, call the [az keyvault key set-attributes](/cli/azure/keyvault/key#az-keyvault-key-set-attributes) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values to define the variables, or use the variables defined in the previous examples.

```azurecli
kvName="<key-vault-name>"
keyName="<key-name>"
enabled="false"
# "false" to disable the key / "true" to enable it:

# Check the current state of the key (before and after enabling/disabling it)
az keyvault key show \
    --vault-name $kvName \
    --name $keyName

# Disable (or enable) the key
az keyvault key set-attributes \
    --vault-name $kvName \
    --name $keyName \
    --enabled $enabled
```

---
