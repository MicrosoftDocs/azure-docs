---
title: Configure cross-tenant customer-managed keys for an existing storage account
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys in an Azure key vault that resides in a different tenant than the tenant where the storage account resides. Customer-managed keys allow a service provider to encrypt the customer's data using an encryption key that is managed by the service provider's customer and that isn't accessible to the service provider.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 10/31/2022
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure cross-tenant customer-managed keys for an existing storage account

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can manage your own keys. Customer-managed keys must be stored in an Azure Key Vault or in an Azure Key Vault Managed Hardware Security Model (HSM).

This article shows how to configure encryption with customer-managed keys for an existing storage account. In the cross-tenant scenario, the storage account resides in a tenant managed by an ISV, while the key used for encryption of that storage account resides in a key vault in a tenant that is managed by the customer.

To learn how to configure customer-managed keys for a new storage account, see [Configure cross-tenant customer-managed keys for a new storage account](customer-managed-keys-configure-cross-tenant-new-account.md).

> [!NOTE]
> Azure Key Vault and Azure Key Vault Managed HSM support the same APIs and management interfaces for configuration of customer-managed keys. Any action that is supported for Azure Key Vault is also supported for Azure Key Vault Managed HSM.

[!INCLUDE [active-directory-msi-cross-tenant-cmk-overview](../../../includes/active-directory-msi-cross-tenant-cmk-overview.md)]

[!INCLUDE [active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault](../../../includes/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault.md)]

## Configure customer-managed keys for an existing account

Up to this point, you've configured the multi-tenant application on the ISV's tenant, installed the application on the customer's tenant, and configured the key vault and key on the customer's tenant. Next you can configure customer-managed keys on an existing storage account with the key from the customer's tenant.

The examples in this article show how to configure customer-managed keys on an existing storage account by using a user-assigned managed identity to authorize access to the key vault. You can also use a system-assigned managed identity to configure customer-managed keys on an existing storage account. In either case, the managed identity must have appropriate permissions to access the key vault. For more information, see [Authenticate to Azure Key Vault](../../key-vault/general/authentication.md).

When you configure encryption with customer-managed keys for an existing storage account, you can choose to automatically update the key version used for Azure Storage encryption whenever a new version is available in the associated key vault. To do so, omit the key version from the key URI. Alternately, you can explicitly specify a key version to be used for encryption until the key version is manually updated. Including the key version on the key URI configures customer-managed keys for manual updating of the key version.

> [!IMPORTANT]
> To rotate a key, create a new version of the key in Azure Key Vault. Azure Storage does not handle key rotation, so you will need to manage rotation of the key in the key vault. You can [configure key auto-rotation in Azure Key Vault](../../key-vault/keys/how-to-configure-key-rotation.md) or rotate your key manually.
>
> Azure Storage checks the key vault for a new key version only once daily. When you rotate a key in Azure Key Vault, be sure to wait 24 hours before disabling the older version.

### [Azure portal](#tab/azure-portal)

To configure cross-tenant customer-managed keys for an existing storage account in the Azure portal, follow these steps:

1. Navigate to your storage account.
1. On the Under Security + networking, select Encryption. By default, key management is set to Microsoft-managed keys, as shown in the following image.

    :::image type="content" source="media/customer-managed-keys-configure-existing-account/portal-configure-encryption-keys.png" alt-text="Screenshot showing encryption options in Azure portal." lightbox="media/customer-managed-keys-configure-existing-account/portal-configure-encryption-keys.png":::

1. Select the **Customer-managed keys** option.
1. Choose the **Select from Key Vault** option.
1. Select **Enter key URI**, and specify the key URI. Omit the key version from the URI if you want Azure Storage to automatically check for a new key version and update it.
1. Select the subscription that contains the key vault and key.
1. In the **Identity type** field, select **User-assigned**, then specify the managed identity with the federated identity credential that you created previously.
1. Expand the **Advanced** section, and select the multi-tenant registered application that you previously created in the ISV's tenant.

    :::image type="content" source="media/customer-managed-keys-configure-cross-tenant-existing-account/portal-configure-cross-tenant-cmk.png" alt-text="Screenshot showing how to configure cross-tenant customer-managed keys for an existing storage account in Azure portal.":::

1. Save your changes.

After you've specified the key from the key vault in the customer's tenant, the Azure portal indicates that customer-managed keys are configured with that key. It also indicates that automatic updating of the key version is enabled, and displays the key version currently in use for encryption. The portal also displays the type of managed identity used to authorize access to the key vault, the principal ID for the managed identity, and the application ID of the multi-tenant application.

:::image type="content" source="media/customer-managed-keys-configure-cross-tenant-existing-account/portal-cross-tenant-cmk-settings.png" alt-text="Screenshot showing cross-tenant customer-managed key configuration.":::

### [PowerShell](#tab/azure-powershell)

To configure cross-tenant customer-managed keys for a new storage account with PowerShell, first install the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage), version 5.1.0 or later. This module is installed with the [Az PowerShell module](https://www.powershellgallery.com/packages/Az), version 9.1.0 or later.

Next, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount), providing the resource ID for the user-assigned managed identity that you configured previously in the ISV's subscription, and the application (client) ID for the multi-tenant application that you configured previously in the ISV's subscription. Provide the key vault URI and key name from the customer's key vault.

Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
$accountName = "<storage-account>"
$kvUri = "<key-vault-uri>"
$keyName = "<key-name>"
$multiTenantAppId = "<multi-tenant-app-id>"

Set-AzStorageAccount -ResourceGroupName $isvRgName `
    -Name $accountName `
    -KeyvaultEncryption `
    -UserAssignedIdentityId $userIdentity.Id `
    -IdentityType SystemAssignedUserAssigned `
    -KeyName $keyName `
    -KeyVaultUri $kvUri `
    -KeyVaultUserAssignedIdentityId $userIdentity.Id `
    -KeyVaultFederatedClientId $multiTenantAppId 
```

### [Azure CLI](#tab/azure-cli)

To configure cross-tenant customer-managed keys for an existing storage account with Azure CLI, first install the Azure CLI, version 2.42.0 or later. For more information about installing Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

Next, call [az storage account update](/cli/azure/storage/account#az-storage-account-update), providing the resource ID for the user-assigned managed identity that you configured previously in the ISV's subscription, and the application (client) ID for the multi-tenant application that you configured previously in the ISV's subscription. Provide the key vault URI and key name from the customer's key vault.

Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurecli
accountName="<storage-account>"
kvUri="<key-vault-uri>"
keyName="<key-name>"
multiTenantAppId="<multi-tenant-app-id>" # appId value from multi-tenant app

# Get the resource ID for the user-assigned managed identity.
identityResourceId=$(az identity show --name $userIdentityName \
    --resource-group $isvRgName \
    --query id \
    --output tsv)

az storage account update --name $accountName \
    --resource-group $isvRgName \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id $identityResourceId \
    --encryption-key-vault $kvUri \
    --encryption-key-name $keyName \
    --encryption-key-source Microsoft.Keyvault \
    --key-vault-user-identity-id $identityResourceId \
    --key-vault-federated-client-id $multiTenantAppId
```

---

[!INCLUDE [storage-customer-managed-keys-change-include](../../../includes/storage-customer-managed-keys-change-include.md)]

[!INCLUDE [storage-customer-managed-keys-revoke-include](../../../includes/storage-customer-managed-keys-revoke-include.md)]

[!INCLUDE [storage-customer-managed-keys-disable-include](../../../includes/storage-customer-managed-keys-disable-include.md)]

## See also

- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Configure cross-tenant customer-managed keys for a new storage account](customer-managed-keys-configure-cross-tenant-new-account.md)
