---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: azure-storage
ms.topic: "include"
ms.date: 06/07/2023
ms.author: tamram
ms.custom: "include file"
---

## Configure the key vault

You can use a new or existing key vault to store customer-managed keys. The storage account and key vault may be in different regions or subscriptions in the same tenant. To learn more about Azure Key Vault, see [Azure Key Vault Overview](../articles/key-vault/general/overview.md) and [What is Azure Key Vault?](../articles/key-vault/general/basic-concepts.md).

Using customer-managed keys with Azure Storage encryption requires that both soft delete and purge protection be enabled for the key vault. Soft delete is enabled by default when you create a new key vault and cannot be disabled. You can enable purge protection either when you create the key vault or after it is created.

Azure Key Vault supports authorization with Azure RBAC via an Azure RBAC permission model. Microsoft recommends using the Azure RBAC permission model over key vault access policies. For more information, see [Grant permission to applications to access an Azure key vault using Azure RBAC](../articles/key-vault/general/rbac-guide.md).

# [Azure portal](#tab/azure-portal)

To learn how to create a key vault with the Azure portal, see [Quickstart: Create a key vault using the Azure portal](../articles/key-vault/general/quick-create-portal.md). When you create the key vault, select **Enable purge protection**, as shown in the following image.

:::image type="content" source="media/storage-customer-managed-keys-key-vault-include/configure-key-vault-portal.png" alt-text="Screenshot showing how to enable purge protection when creating a key vault.":::

To enable purge protection on an existing key vault, follow these steps:

1. Navigate to your key vault in the Azure portal.
1. Under **Settings**, choose **Properties**.
1. In the **Purge protection** section, choose **Enable purge protection**.

# [PowerShell](#tab/azure-powershell)

To create a new key vault with PowerShell, install version 2.0.0 or later of the [Az.KeyVault](https://www.powershellgallery.com/packages/Az.KeyVault/2.0.0) PowerShell module. Then call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault) to create a new key vault. With version 2.0.0 and later of the Az.KeyVault module, soft delete is enabled by default when you create a new key vault.

The following example creates a new key vault with soft delete and purge protection enabled. The key vault's permission model is set to use Azure RBAC. Remember to replace the placeholder values in brackets with your own values.

```azurepowershell
$rgName = "<resource_group>"
$location = "<location>"
$kvName = "<key-vault>"

$keyVault = New-AzKeyVault -Name $kvName `
    -ResourceGroupName $rgName `
    -Location $location `
    -EnablePurgeProtection `
    -EnableRbacAuthorization
```

To learn how to enable purge protection on an existing key vault with PowerShell, see [Azure Key Vault recovery overview](../articles/key-vault/general/key-vault-recovery.md?tabs=azure-powershell).

After you have created the key vault, you'll need to assign the **Key Vault Crypto Officer** role to yourself. This role enables you to create a key in the key vault. The following example assigns this role to a user, scoped to the key vault:

```azurepowershell
New-AzRoleAssignment -SignInName "<user-email>" `
    -RoleDefinitionName "Key Vault Crypto Officer" `
    -Scope $keyVault.ResourceId
```

For more information on how to assign an RBAC role with PowerShell, see [Assign Azure roles using Azure PowerShell](../articles/role-based-access-control/role-assignments-powershell.md).

# [Azure CLI](#tab/azure-cli)

To create a new key vault using Azure CLI, call [az keyvault create](/cli/azure/keyvault#az-keyvault-create). The following example creates a new key vault with soft delete and purge protection enabled. The key vault's permission model is set to use Azure RBAC. Remember to replace the placeholder values in brackets with your own values.

```azurecli
rgName="<resource_group>"
location="<location>"
kvName="<key-vault>"

az keyvault create \
    --name $kvName \
    --resource-group $rgName \
    --location $location \
    --enable-purge-protection \
    --enable-rbac-authorization
```

To learn how to enable purge protection on an existing key vault with Azure CLI, see [Azure Key Vault recovery overview](../articles/key-vault/general/key-vault-recovery.md?tabs=azure-cli).

After you have created the key vault, you'll need to assign the **Key Vault Crypto Officer** role to yourself. This role enables you to create a key in the key vault. The following example assigns this role to a user, scoped to the key vault:

```azurecli
kvResourceId=$(az keyvault show --resource-group $rgName \
    --name $kvName \
    --query id \
    --output tsv)

useroId=$(az ad user show --id "<user-email>" --query id --output tsv)

az role assignment create \
    --role "Key Vault Crypto Officer" \
    --scope $kvResourceId \
    --assignee-principal-type User \
    -assignee-object-id $useroId
```

For more information on how to assign an RBAC role with Azure CLI, see [Assign Azure roles using Azure CLI](../articles/role-based-access-control/role-assignments-cli.md).

---
