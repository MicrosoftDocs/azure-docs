---
title: Configure cross-tenant customer-managed keys for an existing storage account (preview)
titleSuffix: Azure Storage
description: Learn how to configure Azure Storage encryption with customer-managed keys in an Azure key vault that resides in a different tenant than the tenant where the storage account resides (preview). Customer-managed keys allow a service provider to encrypt the customer's data using an encryption key that is managed by the service provider's customer and that is not accessible to the service provider.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/29/2022
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure cross-tenant customer-managed keys for an existing storage account (preview)

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can manage your own keys. Customer-managed keys must be stored in an Azure Key Vault or in an Azure Key Vault Managed Hardware Security Model (HSM).

This article shows how to configure encryption with customer-managed keys for an existing storage account. In the cross-tenant scenario, the storage account resides in a tenant managed by an ISV, while the key used for encryption of that storage account resides in a key vault in a tenant that is managed by the customer.

To learn how to configure customer-managed keys for a new storage account, see [Configure cross-tenant customer-managed keys for a new storage account (preview)](customer-managed-keys-configure-cross-tenant-new-account.md).

## About the preview

To use the preview, you must register for the Azure Active Directory federated client identity feature. Follow these instructions to register with PowerShell or Azure CLI:

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



## See also

- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Configure cross-tenant customer-managed keys for a new storage account](customer-managed-keys-configure-cross-tenant-new-account.md)