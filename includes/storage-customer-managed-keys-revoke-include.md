---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: azure-storage
ms.topic: "include"
ms.date: 03/23/2023
ms.author: tamram
ms.custom: "include file"
---

## Revoke access to a storage account that uses customer-managed keys

To temporarily revoke access to a storage account that is using customer-managed keys, disable the key currently being used in the key vault. There is no performance impact or downtime associated with disabling and reenabling the key.

After the key has been disabled, clients can't call operations that read from or write to a blob or its metadata. For information about which operations will fail, see [Revoke access to a storage account that uses customer-managed keys](../articles/storage/common/customer-managed-keys-overview.md).

> [!CAUTION]
> When you disable the key in the key vault, the data in your Azure Storage account remains encrypted, but it becomes inaccessible until you reenable the key.

# [Azure portal](#tab/azure-portal)

To disable a customer-managed key with the Azure portal, follow these steps:

1. Navigate to the key vault that contains the key.
1. Under **Objects**, select **Keys**.
1. Right-click the key and select **Disable**.

    :::image type="content" source="../articles/storage/common/media/customer-managed-keys-configure-common/portal-disable-customer-managed-keys.png" alt-text="Screenshot showing how to disable a customer-managed key in the key vault.":::

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
