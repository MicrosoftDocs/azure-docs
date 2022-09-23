---
title: Configure cross-tenant customer-managed keys for a new storage account (preview)
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys in an Azure key vault that resides in a different tenant than the tenant where the storage account will be created (preview). Customer-managed keys allow a service provider to encrypt the customer's data using an encryption key that is managed by the service provider's customer and that isn't accessible to the service provider.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 09/14/2022
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure cross-tenant customer-managed keys for a new storage account (preview)

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can manage your own keys. Customer-managed keys must be stored in an Azure Key Vault or in an Azure Key Vault Managed Hardware Security Model (HSM).

This article shows how to configure encryption with customer-managed keys at the time that you create a new storage account. In the cross-tenant scenario, the storage account resides in a tenant managed by an ISV, while the key used for encryption of that storage account resides in a key vault in a tenant that is managed by the customer.

To learn how to configure customer-managed keys for an existing storage account, see [Configure cross-tenant customer-managed keys for an existing storage account (preview)](customer-managed-keys-configure-cross-tenant-existing-account.md).

## About the preview

To use the preview, you must register for the Azure Active Directory federated client identity feature in the ISV's tenant. Follow these instructions to register with PowerShell or Azure CLI:

### [PowerShell](#tab/powershell-preview)

To register with PowerShell, call the **Register-AzProviderFeature** command.

```azurepowershell
Register-AzProviderFeature -ProviderNamespace Microsoft.Storage `
 -FeatureName FederatedClientIdentity
```

To check the status of your registration with PowerShell, call the **Get-AzProviderFeature** command.

```azurepowershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
 -FeatureName FederatedClientIdentity
```

After your registration is approved, you must re-register the Azure Storage resource provider. To re-register the resource provider with PowerShell, call the **Register-AzResourceProvider** command.

```azurepowershell
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Storage'
```

### [Azure CLI](#tab/azure-cli-preview)

To register with Azure CLI, call the **az feature register** command.

```azurecli
az feature register --namespace Microsoft.Storage \
 --name FederatedClientIdentity
```

To check the status of your registration with Azure CLI, call the **az feature show** command.

```azurecli
az feature show --namespace Microsoft.Storage \
 --name FederatedClientIdentity
```

After your registration is approved, you must re-register the Azure Storage resource provider. To re-register the resource provider with Azure CLI, call the **az provider register command**.

```azurecli
az provider register --namespace 'Microsoft.Storage'
```

---

> [!IMPORTANT]
> Using cross-tenant customer-managed keys with Azure Storage encryption is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [active-directory-msi-cross-tenant-cmk-overview](../../../includes/active-directory-msi-cross-tenant-cmk-overview.md)]

[!INCLUDE [active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault](../../../includes/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault.md)]

## Create a new storage account encrypted with a key from a different tenant

Up to this point, you've configured the multi-tenant application on the ISV's tenant, installed the application on the customer's tenant, and configured the key vault and key on the customer's tenant. Next you can create a new storage account on the ISV's tenant and configure customer-managed keys with the key from the customer's tenant.

You must use an existing user-assigned managed identity to authorize access to the key vault when you configure customer-managed keys while creating the storage account. The user-assigned managed identity must have appropriate permissions to access the key vault. For more information, see [Authenticate to Azure Key Vault](../../key-vault/general/authentication.md).

When you configure encryption with customer-managed keys for an existing storage account, you can choose to automatically update the key version used for Azure Storage encryption whenever a new version is available in the associated key vault. To do so, omit the key version from the key URI. Alternately, you can explicitly specify a key version to be used for encryption until the key version is manually updated. Including the key version on the key URI configures customer-managed keys for manual updating of the key version.

> [!IMPORTANT]
> To rotate a key, create a new version of the key in Azure Key Vault. Azure Storage does not handle key rotation, so you will need to manage rotation of the key in the key vault. You can [configure key auto-rotation in Azure Key Vault](../../key-vault/keys/how-to-configure-key-rotation.md) or rotate your key manually.
>
> Azure Storage checks the key vault for a new key version only once daily. When you rotate a key in Azure Key Vault, be sure to wait 24 hours before disabling the older version.

### [Azure portal](#tab/azure-portal)

To configure cross-tenant customer-managed keys for a new storage account in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the **Storage accounts** page in the ISV's tenant, and select the **Create** button to create a new account.
1. Follow the steps outlined in [Create a storage account](storage-account-create.md) to fill out the fields on the **Basics**, **Advanced**, **Networking**, and **Data Protection** tabs.
1. On the **Encryption** tab, indicate for which services you want to enable support for customer-managed keys in the **Enable support for customer-managed keys** field.
1. In the **Encryption type** field, select **Customer-managed keys (CMK)**.
1. In the **Encryption key** field, choose **Enter key from key vault**, and specify the key URI. Omit the key version from the URI if you want Azure Storage to automatically check for a new key version and update it.
1. For the **User-assigned identity** field, search for the user-assigned managed identity that you created previously in the ISV's tenant.
1. Expand the **Advanced** section, and select the multi-tenant registered application that you previously created in the ISV's tenant.

    :::image type="content" source="media/customer-managed-keys-configure-cross-tenant-new-account/portal-new-account-configure-cross-tenant-cmk.png" alt-text="Screenshot showing how to configure cross-tenant customer-managed keys for a new storage account in Azure portal.":::

1. Select the **Review** button to validate and create the account.

### [PowerShell](#tab/azure-powershell)

N/A

### [Azure CLI](#tab/azure-cli)

N/A

---

You can also configure customer-managed keys with manual updating of the key version when you create a new storage account. To do so, include the key version when you specify the key URI.

[!INCLUDE [storage-customer-managed-keys-change-include](../../../includes/storage-customer-managed-keys-change-include.md)]

[!INCLUDE [storage-customer-managed-keys-revoke-include](../../../includes/storage-customer-managed-keys-revoke-include.md)]

[!INCLUDE [storage-customer-managed-keys-disable-include](../../../includes/storage-customer-managed-keys-disable-include.md)]

## See also

- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Configure cross-tenant customer-managed keys for an existing storage account](customer-managed-keys-configure-cross-tenant-existing-account.md)
