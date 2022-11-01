---
title: Configure customer-managed keys for a new storage account
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys for a new storage account by using the Azure portal, PowerShell, or Azure CLI. Customer-managed keys are stored in an Azure key vault.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/31/2022
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure customer-managed keys in an Azure key vault for a new storage account

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can manage your own keys. Customer-managed keys must be stored in an Azure Key Vault or in an Azure Key Vault Managed Hardware Security Model (HSM).

This article shows how to configure encryption with customer-managed keys at the time that you create a new storage account. The customer-managed keys are stored in a key vault.

To learn how to configure customer-managed keys for an existing storage account, see [Configure customer-managed keys in an Azure key vault for an existing storage account](customer-managed-keys-configure-existing-account.md).

[!INCLUDE [storage-customer-managed-keys-key-vault-configure-include](../../../includes/storage-customer-managed-keys-key-vault-configure-include.md)]

[!INCLUDE [storage-customer-managed-keys-key-vault-add-key-include](../../../includes/storage-customer-managed-keys-key-vault-add-key-include.md)]

## Use a user-assigned managed identity to authorize access to the key vault

When you enable customer-managed keys for a new storage account, you must specify a user-assigned managed identity. The user-assigned managed identity will be used to authorize access to the key vault that contains the key. The user-assigned managed identity must have permissions to access the key in the key vault.

A user-assigned is a standalone Azure resource. To learn more about user-assigned managed identities, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

Both new and existing storage accounts can use a user-assigned identity to authorize access to the key vault. You must create the user-assigned identity before you configure customer-managed keys.

### [Azure portal](#tab/portal)

When you configure customer-managed keys with the Azure portal, you can select an existing user-assigned identity through the portal user interface. For details, see [Configure customer-managed keys for a new storage account](#configure-customer-managed-keys-for-a-new-storage-account).

### [PowerShell](#tab/powershell)

To authorize access to the key vault with a user-assigned managed identity, you'll need the resource ID and principal ID of the user-assigned managed identity. Call [Get-AzUserAssignedIdentity](/powershell/module/az.managedserviceidentity/get-azuserassignedidentity) to get the user-assigned managed identity and assign it to a variable that you'll reference in subsequent steps:

```azurepowershell
$userIdentity = Get-AzUserAssignedIdentity -Name <user-assigned-identity> -ResourceGroupName <resource-group>
```

### [Azure CLI](#tab/azure-cli)

To authorize access to the key vault with a user-assigned managed identity, you'll need the resource ID and principal ID of the user-assigned managed identity. Call [az identity show](/cli/azure/identity#az-identity-show) command to get the user-assigned managed identity, then save the resource ID and principal ID to variables. You'll need these values in subsequent steps:

```azurecli
userIdentityId=$(az identity show --name sample-user-assigned-identity --resource-group storagesamples-rg --query id)
principalId=$(az identity show --name sample-user-assigned-identity --resource-group storagesamples-rg --query principalId)
```

---

## Configure the key vault access policy

The next step is to configure the key vault access policy. The key vault access policy grants permissions to the user-assigned managed identity that will be used to authorize access to the key vault. To learn more about key vault access policies, see [Azure Key Vault Overview](../../key-vault/general/overview.md#securely-store-secrets-and-keys) and [Azure Key Vault security overview](../../key-vault/general/security-features.md#key-vault-authentication-options).

### [Azure portal](#tab/portal)

To learn how to configure the key vault access policy with the Azure portal, see [Assign an Azure Key Vault access policy](../../key-vault/general/assign-access-policy.md).

### [PowerShell](#tab/powershell)

To configure the key vault access policy with PowerShell, call [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy), providing the variable for the principal ID that you previously retrieved for the user-assigned managed identity.

```azurepowershell
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $userIdentity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get
```

To learn more about assigning the key vault access policy with PowerShell, see [Assign an Azure Key Vault access policy](../../key-vault/general/assign-access-policy.md).

### [Azure CLI](#tab/azure-cli)

To configure the key vault access policy with PowerShell, call [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy), providing the variable for the principal ID that you previously retrieved for the user-assigned managed identity.

```azurecli
az keyvault set-policy \
    --name <key-vault> \
    --resource-group <resource_group>
    --object-id $principalId \
    --key-permissions get unwrapKey wrapKey
```

To learn more about assigning the key vault access policy with Azure CLI, see [Assign an Azure Key Vault access policy](../../key-vault/general/assign-access-policy.md).

---

## Configure customer-managed keys for a new storage account

When you configure encryption with customer-managed keys for a new storage account, you can choose to automatically update the key version used for Azure Storage encryption whenever a new version is available in the associated key vault. Alternately, you can explicitly specify a key version to be used for encryption until the key version is manually updated.

You must use an existing user-assigned managed identity to authorize access to the key vault when you configure customer-managed keys while creating the storage account. The user-assigned managed identity must have appropriate permissions to access the key vault. For more information, see [Authenticate to Azure Key Vault](../../key-vault/general/authentication.md).

### Configure encryption for automatic updating of key versions

Azure Storage can automatically update the customer-managed key that is used for encryption to use the latest key version from the key vault. Azure Storage checks the key vault daily for a new version of the key. When a new version becomes available, then Azure Storage automatically begins using the latest version of the key for encryption.

> [!IMPORTANT]
> Azure Storage checks the key vault for a new key version only once daily. When you rotate a key, be sure to wait 24 hours before disabling the older version.

### [Azure portal](#tab/portal)

To configure customer-managed keys for a new storage account with automatic updating of the key version, follow these steps:

1. In the Azure portal, navigate to the **Storage accounts** page, and select the **Create** button to create a new account.
1. Follow the steps outlined in [Create a storage account](storage-account-create.md) to fill out the fields on the **Basics**, **Advanced**, **Networking**, and **Data Protection** tabs.
1. On the **Encryption** tab, indicate for which services you want to enable support for customer-managed keys in the **Enable support for customer-managed keys** field.
1. In the **Encryption type** field, select **Customer-managed keys (CMK)**.
1. In the **Encryption key** field, choose **Select a key vault and key**, and specify the key vault and key.
1. For the **User-assigned identity** field, select an existing user-assigned managed identity.

    :::image type="content" source="media/customer-managed-keys-configure-new-account/portal-new-account-configure-cmk.png" alt-text="Screenshot showing how to configure customer-managed keys for a new storage account in Azure portal.":::

1. Select the **Review** button to validate and create the account.

You can also configure customer-managed keys with manual updating of the key version when you create a new storage account. Follow the steps described in [Configure encryption for manual updating of key versions](#configure-encryption-for-manual-updating-of-key-versions).

### [PowerShell](#tab/powershell)

To configure customer-managed keys for a new storage account with automatic updating of the key version, call [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount), as shown in the following example. Use the variable you created previously for the resource ID for the user-assigned managed identity. You'll also need the key vault URI and key name:

```azurepowershell
New-AzStorageAccount -ResourceGroupName <resource-group> `
    -Name <storage-account> `
    -Kind StorageV2 `
    -SkuName Standard_LRS `
    -Location $location `
    -IdentityType SystemAssignedUserAssigned `
    -UserAssignedIdentityId $userIdentity.Id `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVaultUserAssignedIdentityId $userIdentity.Id
```

### [Azure CLI](#tab/azure-cli)

To configure customer-managed keys for a new storage account with automatic updating of the key version, call [az storage account create](/cli/azure/storage/account#az-storage-account-create), as shown in the following example. Use the variable you created previously for the resource ID for the user-assigned managed identity. You'll also need the key vault URI and key name:

```azurecli
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --location <location> \
    --sku Standard_LRS \
    --kind StorageV2 \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id <user-assigned-managed-identity> \
    --encryption-key-vault <key-vault-uri> \
    --encryption-key-name <key-name> \
    --encryption-key-source Microsoft.Keyvault \
    --key-vault-user-identity-id <user-assigned-managed-identity>
```

---

### Configure encryption for manual updating of key versions

If you prefer to manually update the key version, then explicitly specify the version when you configure encryption with customer-managed keys while creating the storage account. In this case, Azure Storage won't automatically update the key version when a new version is created in the key vault. To use a new key version, you must manually update the version used for Azure Storage encryption.

You must use an existing user-assigned managed identity to authorize access to the key vault when you configure customer-managed keys while creating the storage account. The user-assigned managed identity must have appropriate permissions to access the key vault. For more information, see [Authenticate to Azure Key Vault](../../key-vault/general/authentication.md).

# [Azure portal](#tab/portal)

To configure customer-managed keys with manual updating of the key version in the Azure portal, specify the key URI, including the version, while creating the storage account. To specify a key as a URI, follow these steps:

1. In the Azure portal, navigate to the **Storage accounts** page, and select the **Create** button to create a new account.
1. Follow the steps outlined in [Create a storage account](storage-account-create.md) to fill out the fields on the **Basics**, **Advanced**, **Networking**, and **Data Protection** tabs.
1. On the **Encryption** tab, indicate for which services you want to enable support for customer-managed keys in the **Enable support for customer-managed keys** field.
1. In the **Encryption type** field, select **Customer-managed keys (CMK)**.
1. To locate the key URI in the Azure portal, navigate to your key vault, and select the **Keys** setting. Select the desired key, then select the key to view its versions. Select a key version to view the settings for that version.
1. Copy the value of the **Key Identifier** field, which provides the URI.

    :::image type="content" source="media/customer-managed-keys-configure-new-account/portal-copy-key-identifier.png" alt-text="Screenshot showing key vault key URI in Azure portal.":::

1. In the **Encryption key** settings for your storage account, choose the **Enter key URI** option.
1. Paste the URI that you copied into the **Key URI** field. Include the key version on the URI to configure manual updating of the key version.
1. Specify a user-assigned managed identity by choosing the **Select an identity** link.

    :::image type="content" source="media/customer-managed-keys-configure-new-account/portal-specify-key-uri.png" alt-text="Screenshot showing how to enter key URI in Azure portal.":::

1. Select the **Review** button to validate and create the account.

# [PowerShell](#tab/powershell)

To configure customer-managed keys with manual updating of the key version, explicitly provide the key version when you configure encryption while creating the storage account. Call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the storage account's encryption settings, as shown in the following example, and include the **-KeyvaultEncryption** option to enable customer-managed keys for the storage account.

Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
New-AzStorageAccount -ResourceGroupName <resource-group> `
    -Name <storage-account> `
    -Kind StorageV2 `
    -SkuName Standard_LRS `
    -Location $location `
    -IdentityType SystemAssignedUserAssigned `
    -UserAssignedIdentityId $userIdentity.Id `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVersion $key.Version `
    -KeyVaultUserAssignedIdentityId $userIdentity.Id
```


When you manually update the key version, you'll need to update the storage account's encryption settings to use the new version. First, call [Get-AzKeyVaultKey](/powershell/module/az.keyvault/get-azkeyvaultkey) to get the latest version of the key. Then call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) to update the storage account's encryption settings to use the new version of the key, as shown in the previous example.

# [Azure CLI](#tab/azure-cli)

To configure customer-managed keys with manual updating of the key version, explicitly provide the key version when you configure encryption while creating the storage account. Call [az storage account update](/cli/azure/storage/account#az-storage-account-update) to update the storage account's encryption settings, as shown in the following example. Include the `--encryption-key-source` parameter and set it to `Microsoft.Keyvault` to enable customer-managed keys for the account.

Remember to replace the placeholder values in brackets with your own values.

```azurecli
key_vault_uri=$(az keyvault show \
    --name <key-vault> \
    --resource-group <resource_group> \
    --query properties.vaultUri \
    --output tsv)
key_version=$(az keyvault key list-versions \
    --name <key> \
    --vault-name <key-vault> \
    --query [-1].kid \
    --output tsv | cut -d '/' -f 6)
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --location <location> \
    --sku Standard_LRS \
    --kind StorageV2 \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id <user-assigned-managed-identity> \
    --encryption-key-vault $key_vault_uri \
    --encryption-key-name <key-name> \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-version $key_version \
    --key-vault-user-identity-id <user-assigned-managed-identity>
```

When you manually update the key version, you'll need to update the storage account's encryption settings to use the new version. First, query for the key vault URI by calling [az keyvault show](/cli/azure/keyvault#az-keyvault-show), and for the key version by calling [az keyvault key list-versions](/cli/azure/keyvault/key#az-keyvault-key-list-versions). Then call [az storage account update](/cli/azure/storage/account#az-storage-account-update) to update the storage account's encryption settings to use the new version of the key, as shown in the previous example.

---

[!INCLUDE [storage-customer-managed-keys-change-include](../../../includes/storage-customer-managed-keys-change-include.md)]

[!INCLUDE [storage-customer-managed-keys-revoke-include](../../../includes/storage-customer-managed-keys-revoke-include.md)]

[!INCLUDE [storage-customer-managed-keys-disable-include](../../../includes/storage-customer-managed-keys-disable-include.md)]

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Configure customer-managed keys in an Azure key vault for an existing storage account](customer-managed-keys-configure-existing-account.md)
- [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md)
