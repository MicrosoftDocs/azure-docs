---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 08/19/2022
ms.author: tamram
ms.custom: "include file"
---

## Configure the key vault

You can use a new or existing key vault to store customer-managed keys. The storage account and key vault may be in different regions or subscriptions in the same tenant. To learn more about Azure Key Vault, see [Azure Key Vault Overview](../articles/key-vault/general/overview.md) and [What is Azure Key Vault?](../articles/key-vault/general/basic-concepts.md).

Using customer-managed keys with Azure Storage encryption requires that both soft delete and purge protection be enabled for the key vault. Soft delete is enabled by default when you create a new key vault and cannot be disabled. You can enable purge protection either when you create the key vault or after it is created.

# [Azure portal](#tab/azure-portal)

To learn how to create a key vault with the Azure portal, see [Quickstart: Create a key vault using the Azure portal](../articles/key-vault/general/quick-create-portal.md). When you create the key vault, select **Enable purge protection**, as shown in the following image.

:::image type="content" source="media/storage-customer-managed-keys-key-vault-include/configure-key-vault-portal.png" alt-text="Screenshot showing how to enable purge protection when creating a key vault.":::

To enable purge protection on an existing key vault, follow these steps:

1. Navigate to your key vault in the Azure portal.
1. Under **Settings**, choose **Properties**.
1. In the **Purge protection** section, choose **Enable purge protection**.

# [PowerShell](#tab/azure-powershell)

To create a new key vault with PowerShell, install version 2.0.0 or later of the [Az.KeyVault](https://www.powershellgallery.com/packages/Az.KeyVault/2.0.0) PowerShell module. Then call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault) to create a new key vault. With version 2.0.0 and later of the Az.KeyVault module, soft delete is enabled by default when you create a new key vault.

The following example creates a new key vault with both soft delete and purge protection enabled. Remember to replace the placeholder values in brackets with your own values.

```azurepowershell
$keyVault = New-AzKeyVault -Name <key-vault> `
    -ResourceGroupName <resource_group> `
    -Location <location> `
    -EnablePurgeProtection
```

To learn how to enable purge protection on an existing key vault with PowerShell, see [Azure Key Vault recovery overview](../articles/key-vault/general/key-vault-recovery.md?tabs=azure-powershell).

# [Azure CLI](#tab/azure-cli)

To create a new key vault using Azure CLI, call [az keyvault create](/cli/azure/keyvault#az-keyvault-create). Remember to replace the placeholder values in brackets with your own values:

```azurecli
az keyvault create \
    --name <key-vault> \
    --resource-group <resource_group> \
    --location <region> \
    --enable-purge-protection
```

To learn how to enable purge protection on an existing key vault with Azure CLI, see [Azure Key Vault recovery overview](../articles/key-vault/general/key-vault-recovery.md?tabs=azure-cli).

---
