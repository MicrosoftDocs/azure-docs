---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: azure-storage
ms.topic: "include"
ms.date: 09/22/2022
ms.author: tamram
ms.custom: "include file"
---

## Add a key

Next, add a key to the key vault. Before you add the key, make sure that you have assigned to yourself the **Key Vault Crypto Officer** role.

Azure Storage encryption supports RSA and RSA-HSM keys of sizes 2048, 3072 and 4096. For more information about supported key types, see [About keys](../articles/key-vault/keys/about-keys.md).

# [Azure portal](#tab/azure-portal)

To learn how to add a key with the Azure portal, see [Quickstart: Set and retrieve a key from Azure Key Vault using the Azure portal](../articles/key-vault/keys/quick-create-portal.md).

# [PowerShell](#tab/azure-powershell)

To add a key with PowerShell, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
$keyName = "<key-name>"

$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName `
    -Name $keyName `
    -Destination 'Software'
```

# [Azure CLI](#tab/azure-cli)

To add a key with Azure CLI, call [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create). Remember to replace the placeholder values in brackets with your own values.

```azurecli
keyName="<key-name>"

az keyvault key create \
    --name $keyName \
    --vault-name $kvName
```

---
