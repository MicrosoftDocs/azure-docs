---
title: Configure customer-managed keys in the same tenant for an existing storage account
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys for an existing storage account by using the Azure portal, PowerShell, or Azure CLI. Customer-managed keys are stored in an Azure key vault.
services: storage
author: normesta

ms.service: azure-storage
ms.topic: how-to
ms.date: 11/07/2023
ms.author: normesta
ms.reviewer: ozgun
ms.subservice: storage-common-concepts
ms.custom: devx-track-azurepowershell, devx-track-azurecli, engagement-fy23
---

# Configure customer-managed keys in the same tenant for an existing storage account

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For more control over encryption keys, you can manage your own keys. Customer-managed keys must be stored in Azure Key Vault or Key Vault Managed Hardware Security Model (HSM).

This article shows how to configure encryption with customer-managed keys for an existing storage account when the storage account and key vault are in the same tenant. The customer-managed keys are stored in a key vault.

To learn how to configure customer-managed keys for a new storage account, see [Configure customer-managed keys in an Azure key vault for an new storage account](customer-managed-keys-configure-new-account.md).

To learn how to configure encryption with customer-managed keys stored in a managed HSM, see [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md).

> [!NOTE]
> Azure Key Vault and Azure Key Vault Managed HSM support the same APIs and management interfaces for configuration of customer-managed keys. Any action that is supported for Azure Key Vault is also supported for Azure Key Vault Managed HSM.

[!INCLUDE [storage-customer-managed-keys-key-vault-configure-include](../../../includes/storage-customer-managed-keys-key-vault-configure-include.md)]

[!INCLUDE [storage-customer-managed-keys-key-vault-add-key-include](../../../includes/storage-customer-managed-keys-key-vault-add-key-include.md)]

## Choose a managed identity to authorize access to the key vault

When you enable customer-managed keys for an existing storage account, you must specify a managed identity to be used to authorize access to the key vault that contains the key. The managed identity must have permissions to access the key in the key vault.

The managed identity that authorizes access to the key vault can be either a user-assigned or system-assigned managed identity. To learn more about system-assigned versus user-assigned managed identities, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

### Use a user-assigned managed identity to authorize access

[!INCLUDE [storage-customer-managed-keys-key-vault-user-assigned-identity-include](../../../includes/storage-customer-managed-keys-key-vault-user-assigned-identity-include.md)]

### Use a system-assigned managed identity to authorize access

A system-assigned managed identity is associated with an instance of an Azure service, in this case an Azure Storage account. You must explicitly assign a system-assigned managed identity to a storage account before you can use the system-assigned managed identity to authorize access to the key vault that contains your customer-managed key.

Only existing storage accounts can use a system-assigned identity to authorize access to the key vault. New storage accounts must use a user-assigned identity, if customer-managed keys are configured on account creation.

The system-assigned managed identity must have permissions to access the key in the key vault. Assign the **Key Vault Crypto Service Encryption User** role to the system-assigned managed identity with key vault scope to grant these permissions.

#### [Azure portal](#tab/azure-portal)

Before you can configure customer-managed keys with a system-assigned managed identity, you must assign the **Key Vault Crypto Service Encryption User** role to the system-assigned managed identity, scoped to the key vault. This role grants the system-assigned managed identity permissions to access the key in the key vault. For more information on assigning Azure RBAC roles with the Azure portal, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

When you configure customer-managed keys with the Azure portal with a system-assigned managed identity, the system-assigned managed identity is assigned to the storage account for you under the covers.

#### [PowerShell](#tab/azure-powershell)

To assign a system-assigned managed identity to your storage account, first call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount):

```azurepowershell
$accountName = "<storage-account>"

$storageAccount = Set-AzStorageAccount -ResourceGroupName $rgName `
    -Name $accountName `
    -AssignIdentity
```

Next, assign to the system-assigned managed identity the required RBAC role, scoped to the key vault. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples:

```azurepowershell
$principalId = $storageAccount.Identity.PrincipalId

New-AzRoleAssignment -ObjectId $storageAccount.Identity.PrincipalId `
    -RoleDefinitionName "Key Vault Crypto Service Encryption User" `
    -Scope $keyVault.ResourceId
```

#### [Azure CLI](#tab/azure-cli)

To authenticate access to the key vault with a system-assigned managed identity, first assign the system-assigned managed identity to the storage account by calling [az storage account update](/cli/azure/storage/account#az-storage-account-update):

```azurecli
accountName="<storage-account>"

az storage account update \
    --name $accountName \
    --resource-group $rgName \
    --assign-identity
```

Next, assign to the system-assigned managed identity the required RBAC role, scoped to the key vault. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples:

```azurecli
principalId=$(az storage account show --name $accountName \
    --resource-group $rgName \
    --query identity.principalId \
    --output tsv)

az role assignment create --assignee-object-id $principalId \
    --role "Key Vault Crypto Service Encryption User" \
    --scope $kvResourceId
```

---

## Configure customer-managed keys for an existing account

When you configure encryption with customer-managed keys for an existing storage account, you can choose to automatically update the key version used for Azure Storage encryption whenever a new version is available in the associated key vault. Alternately, you can explicitly specify a key version to be used for encryption until the key version is manually updated.

When the key version is changed, whether automatically or manually, the protection of the root encryption key changes, but the data in your Azure Storage account remains encrypted at all times. There's no further action required on your part to ensure that your data is protected. Rotating the key version doesn't impact performance. There's no downtime associated with rotating the key version.

You can use either a system-assigned or user-assigned managed identity to authorize access to the key vault when you configure customer-managed keys for an existing storage account.

> [!NOTE]
> To rotate a key, create a new version of the key in Azure Key Vault. Azure Storage does not handle key rotation, so you will need to manage rotation of the key in the key vault. You can [configure key auto-rotation in Azure Key Vault](../../key-vault/keys/how-to-configure-key-rotation.md) or rotate your key manually.

### Configure encryption for automatic updating of key versions

Azure Storage can automatically update the customer-managed key that is used for encryption to use the latest key version from the key vault. Azure Storage checks the key vault daily for a new version of the key. When a new version becomes available, then Azure Storage automatically begins using the latest version of the key for encryption.

> [!IMPORTANT]
> Azure Storage checks the key vault for a new key version only once daily. When you rotate a key, be sure to wait 24 hours before disabling the older version.

### [Azure portal](#tab/azure-portal)

To configure customer-managed keys for an existing account with automatic updating of the key version in the Azure portal, follow the steps below:

1. Navigate to your storage account.
1. Under **Security + networking**, select **Encryption**. By default, key management is set to **Microsoft-Managed Keys** as shown in the image below:

    :::image type="content" source="media/customer-managed-keys-configure-existing-account/portal-configure-encryption-keys.png" alt-text="Screenshot showing encryption options in Azure portal." lightbox="media/customer-managed-keys-configure-existing-account/portal-configure-encryption-keys.png":::

1. Select the **Customer-Managed Keys** option. If the account was previously configured for **Customer-Managed Keys** with manual updating of the key version, select **Change key** near the bottom of the page.
1. Choose the **Select from Key Vault** option.
1. Select **Select a key vault and key**.
1. Select the key vault containing the key you want to use. You can also create a new key vault.
1. Select the key from the key vault. You can also create a new key.

    :::image type="content" source="media/customer-managed-keys-configure-existing-account/portal-select-key-from-key-vault.png" alt-text="Screenshot showing how to select key vault and key in Azure portal.":::

1. Select the type of identity to use to authenticate access to the key vault. The options include **System-assigned** (the default) or **User-assigned**. To learn more about each type of managed identity, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

    1. If you select **System-assigned**, the system-assigned managed identity for the storage account is created under the covers, if it doesn't already exist.
    1. If you select **User-assigned**, then you must select an existing user-assigned identity that has permissions to access the key vault. To learn how to create a user-assigned identity, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

    :::image type="content" source="media/customer-managed-keys-configure-existing-account/select-user-assigned-managed-identity-portal.png" alt-text="Screenshot showing how to select a user-assigned managed identity for key vault authentication.":::

1. Save your changes.

After you specify the key, the Azure portal indicates that automatic updating of the key version is enabled and displays the key version currently in use for encryption. The portal also displays the type of managed identity used to authorize access to the key vault and the principal ID for the managed identity.

:::image type="content" source="media/customer-managed-keys-configure-existing-account/portal-auto-rotation-enabled.png" alt-text="Screenshot showing automatic updating of the key version enabled.":::

### [PowerShell](#tab/azure-powershell)

To configure customer-managed keys for an existing account with automatic updating of the key version with PowerShell, install the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) module, version 2.0.0 or later.

Next, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the storage account's encryption settings. Include the `KeyvaultEncryption` parameter to enable customer-managed keys for the storage account, and set `KeyVersion` to an empty string to enable automatic updating of the key version. If the storage account was previously configured for customer-managed keys with a specific key version, then setting the key version to an empty string enables automatic updating of the key version going forward.

```azurepowershell
$accountName = "<storage-account>"

# Use this form of the command with a user-assigned managed identity.
Set-AzStorageAccount -ResourceGroupName $rgName `
    -AccountName $accountName `
    -IdentityType SystemAssignedUserAssigned `
    -UserAssignedIdentityId $userIdentity.Id `
    -KeyvaultEncryption `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVersion "" `
    -KeyVaultUserAssignedIdentityId $userIdentity.Id

# Use this form of the command with a system-assigned managed identity.
Set-AzStorageAccount -ResourceGroupName $rgName `
    -AccountName $accountName `
    -KeyvaultEncryption `
    -KeyName $key.Name `
    -KeyVersion "" `
    -KeyVaultUri $keyVault.VaultUri
```

### [Azure CLI](#tab/azure-cli)

To configure customer-managed keys for an existing account with automatic updating of the key version with Azure CLI, install [Azure CLI version 2.4.0](/cli/azure/release-notes-azure-cli#april-21-2020) or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

Next, call [az storage account update](/cli/azure/storage/account#az-storage-account-update) to update the storage account's encryption settings. Include the `--encryption-key-source` parameter and set it to `Microsoft.Keyvault` to enable customer-managed keys for the account, and set `encryption-key-version` to an empty string to enable automatic updating of the key version. If the storage account was previously configured for customer-managed keys with a specific key version, then setting the key version to an empty string enables automatic updating of the key version going forward.

```azurecli
accountName="<storage-account>"

keyVaultUri=$(az keyvault show \
    --name $kvName \
    --resource-group $rgName \
    --query properties.vaultUri \
    --output tsv)

# Use this form of the command with a user-assigned managed identity.
az storage account update \
    --name $accountName \
    --resource-group $rgName \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id $identityResourceId \
    --encryption-key-name $keyName \
    --encryption-key-version "" \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $keyVaultUri \
    --key-vault-user-identity-id $identityResourceId

# Use this form of the command with a system-assigned managed identity.
az storage account update \
    --name $accountName \
    --resource-group $rgName \
    --encryption-key-name $keyName \
    --encryption-key-version "" \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $keyVaultUri
```

---

### Configure encryption for manual updating of key versions

If you prefer to manually update the key version, then explicitly specify the version at the time that you configure encryption with customer-managed keys. In this case, Azure Storage won't automatically update the key version when a new version is created in the key vault. To use a new key version, you must manually update the version used for Azure Storage encryption.

# [Azure portal](#tab/azure-portal)

To configure customer-managed keys with manual updating of the key version in the Azure portal, specify the key URI, including the version. To specify a key as a URI, follow these steps:

1. To locate the key URI in the Azure portal, navigate to your key vault, and select the **Keys** setting. Select the desired key, then select the key to view its versions. Select a key version to view the settings for that version.
1. Copy the value of the **Key Identifier** field, which provides the URI.

    :::image type="content" source="media/customer-managed-keys-configure-existing-account/portal-copy-key-identifier.png" alt-text="Screenshot showing key vault key URI in Azure portal.":::

1. In the **Encryption key** settings for your storage account, choose the **Enter key URI** option.
1. Paste the URI that you copied into the **Key URI** field. Omit the key version from the URI to enable automatic updating of the key version.

    :::image type="content" source="media/customer-managed-keys-configure-existing-account/portal-specify-key-uri.png" alt-text="Screenshot showing how to enter key URI in Azure portal.":::

1. Specify the subscription that contains the key vault.
1. Specify either a system-assigned or user-assigned managed identity.
1. Save your changes.

# [PowerShell](#tab/azure-powershell)

To configure customer-managed keys with manual updating of the key version, explicitly provide the key version when you configure encryption for the storage account. Call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the storage account's encryption settings, as shown in the following example, and include the **-KeyvaultEncryption** option to enable customer-managed keys for the storage account.

Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
$accountName = "<storage-account>"

# Use this form of the command with a user-assigned managed identity.
Set-AzStorageAccount -ResourceGroupName $rgName `
    -AccountName $accountName `
    -IdentityType SystemAssignedUserAssigned `
    -UserAssignedIdentityId $userIdentity.Id `
    -KeyvaultEncryption `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVersion $key.Version `
    -KeyVaultUserAssignedIdentityId $userIdentity.Id

# Use this form of the command with a system-assigned managed identity.
Set-AzStorageAccount -ResourceGroupName $rgName `
    -AccountName $accountName `
    -KeyvaultEncryption `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVersion $key.Version
```

When you manually update the key version, you then need to update the storage account's encryption settings to use the new version. First, call [Get-AzKeyVaultKey](/powershell/module/az.keyvault/get-azkeyvaultkey) to get the latest version of the key. Then call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the storage account's encryption settings to use the new version of the key, as shown in the previous example.

# [Azure CLI](#tab/azure-cli)

To configure customer-managed keys with manual updating of the key version, explicitly provide the key version when you configure encryption for the storage account. Call [az storage account update](/cli/azure/storage/account#az-storage-account-update) to update the storage account's encryption settings, as shown in the following example. Include the `--encryption-key-source` parameter and set it to `Microsoft.Keyvault` to enable customer-managed keys for the account.

Remember to replace the placeholder values in brackets with your own values.

```azurecli
accountName="<storage-account>"

keyVaultUri=$(az keyvault show \
    --name $kvName \
    --resource-group $rgName \
    --query properties.vaultUri \
    --output tsv)

keyVersion=$(az keyvault key list-versions \
    --name $keyName \
    --vault-name $kvName \
    --query [-1].kid \
    --output tsv | cut -d '/' -f 6)

# Use this form of the command with a user-assigned managed identity
az storage account update \
    --name $accountName \
    --resource-group $rgName \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id $identityResourceId \
    --encryption-key-name $keyName \
    --encryption-key-version $keyVersion \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $keyVaultUri \
    --key-vault-user-identity-id $identityResourceId

# Use this form of the command with a system-assigned managed identity
az storage account update \
    --name $accountName \
    --resource-group $rgName \
    --encryption-key-name $keyName \
    --encryption-key-version $keyVersion \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $keyVaultUri
```

When you manually update the key version, you then need to update the storage account's encryption settings to use the new version. First, query for the key vault URI by calling [az keyvault show](/cli/azure/keyvault#az-keyvault-show), and for the key version by calling [az keyvault key list-versions](/cli/azure/keyvault/key#az-keyvault-key-list-versions). Then call [az storage account update](/cli/azure/storage/account#az-storage-account-update) to update the storage account's encryption settings to use the new version of the key, as shown in the previous example.

---

[!INCLUDE [storage-customer-managed-keys-change-include](../../../includes/storage-customer-managed-keys-change-include.md)]

If the new key is in a different key vault, you must [grant the managed identity access to the key in the new vault](#choose-a-managed-identity-to-authorize-access-to-the-key-vault). If you opt for manual updating of the key version, you also need to [update the key vault URI](#configure-encryption-for-manual-updating-of-key-versions).

[!INCLUDE [storage-customer-managed-keys-revoke-include](../../../includes/storage-customer-managed-keys-revoke-include.md)]

[!INCLUDE [storage-customer-managed-keys-disable-include](../../../includes/storage-customer-managed-keys-disable-include.md)]

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Configure customer-managed keys in an Azure key vault for a new storage account](customer-managed-keys-configure-new-account.md)
