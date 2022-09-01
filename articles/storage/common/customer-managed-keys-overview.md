---
title: Customer-managed keys for account encryption
titleSuffix: Azure Storage
description: You can use your own encryption key to protect the data in your storage account. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.
services: storage
author: tamram

ms.service: storage
ms.date: 08/31/2022
ms.topic: conceptual
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
---

# Customer-managed keys for Azure Storage encryption

You can use your own encryption key to protect the data in your storage account. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.

You must use one of the following Azure key stores to store your customer-managed keys:

- [Azure Key Vault](../../key-vault/general/overview.md)
- [Azure Key Vault Managed Hardware Security Module (HSM)](../../key-vault/managed-hsm/overview.md)

You can either create your own keys and store them in the key vault or managed HSM, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault or managed HSM can be different Azure Active Directory (Azure AD) tenants, regions, and subscriptions.

> [!NOTE]
> Azure Key Vault and Azure Key Vault Managed HSM support the same APIs and management interfaces for configuration.

## About customer-managed keys

The following diagram shows how Azure Storage uses Azure AD and a key vault or managed HSM to make requests using the customer-managed key:

:::image type="content" source="media/customer-managed-keys-overview/encryption-customer-managed-keys-diagram.png" alt-text="Diagram showing how customer-managed keys work in Azure Storage":::

The following list explains the numbered steps in the diagram:

1. An Azure Key Vault admin grants permissions to encryption keys to a managed identity. The managed identity may be either a user-assigned managed identity that you create and manage, or a system-assigned managed identity that is associated with the storage account.
1. An Azure Storage admin configures encryption with a customer-managed key for the storage account.
1. Azure Storage uses the managed identity to which the Azure Key Vault admin granted permissions in step 1 to authenticate access to Azure Key Vault via Azure AD.
1. Azure Storage wraps the account encryption key with the customer-managed key in Azure Key Vault.
1. For read/write operations, Azure Storage sends requests to Azure Key Vault to unwrap the account encryption key to perform encryption and decryption operations.

The managed identity that is associated with the storage account must have these permissions at a minimum to access a  customer-managed key in Azure Key Vault:

- *wrapkey*
- *unwrapkey*
- *get*

For more information about key permissions, see [Key types, algorithms, and operations](../../key-vault/keys/about-keys-details.md#key-access-control).

Azure Policy provides a built-in policy to require that storage accounts use customer-managed keys for Blob Storage and Azure Files workloads. For more information, see the **Storage** section in [Azure Policy built-in policy definitions](../../governance/policy/samples/built-in-policies.md#storage).

## Customer-managed keys for queues and tables

Data stored in Queue and Table storage isn't automatically protected by a customer-managed key when customer-managed keys are enabled for the storage account. You can optionally configure these services to be included in this protection at the time that you create the storage account.

For more information about how to create a storage account that supports customer-managed keys for queues and tables, see [Create an account that supports customer-managed keys for tables and queues](account-encryption-key-create.md).

Data in Blob storage and Azure Files is always protected by customer-managed keys when customer-managed keys are configured for the storage account.

## Enable customer-managed keys for a storage account

When you configure a customer-managed key, Azure Storage wraps the root data encryption key for the account with the customer-managed key in the associated key vault or managed HSM. Enabling customer-managed keys doesn't impact performance, and takes effect immediately.

You can configure customer-managed keys with the key vault and storage account in the same tenant or in different Azure AD tenants. To learn how to configure Azure Storage encryption with customer-managed keys when the key vault and storage account are in the same tenants, see one of the following articles:

- [Configure encryption with customer-managed keys stored in Azure Key Vault](customer-managed-keys-configure-key-vault.md).
- [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md).

To learn how to configure Azure Storage encryption with customer-managed keys when the key vault and storage account are in different Azure AD tenants, see one of the following articles:

- [Configure cross-tenant customer-managed keys for a new storage account (preview)](customer-managed-keys-configure-cross-tenant-new-account.md)
- [Configure cross-tenant customer-managed keys for an existing storage account (preview)](customer-managed-keys-configure-cross-tenant-existing-account.md)

When you enable or disable customer-managed keys, or when you modify the key or the key version, the protection of the root encryption key changes, but the data in your Azure Storage account doesn't need to be re-encrypted.

You can enable customer-managed keys on both new and existing storage accounts. When you enable customer-managed keys, you must specify a managed identity to be used to authorize access to the key vault that contains the key. The managed identity may be either a user-assigned or system-assigned managed identity:

- When you configure customer-managed keys at the time that you create a storage account, you must use a user-assigned managed identity.
- When you configure customer-managed keys on an existing storage account, you can use either a user-assigned managed identity or a system-assigned managed identity.

To learn more about system-assigned versus user-assigned managed identities, see [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

You can switch between customer-managed keys and Microsoft-managed keys at any time. For more information about Microsoft-managed keys, see [About encryption key management](storage-service-encryption.md#about-encryption-key-management).

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure AD. Managed identities do not currently support cross-tenant scenarios. When you configure customer-managed keys in the Azure portal, a managed identity is automatically assigned to your storage account under the covers. If you subsequently move the subscription, resource group, or storage account from one Azure AD tenant to another, the managed identity associated with the storage account is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see **Transferring a subscription between Azure AD directories** in [FAQs and known issues with managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).

Azure storage encryption supports RSA and RSA-HSM keys of sizes 2048, 3072 and 4096. For more information about keys, see [About keys](../../key-vault/keys/about-keys.md).

Using a key vault or managed HSM has associated costs. For more information, see [Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault/).

## Update the key version

When you configure encryption with customer-managed keys, you have two options for updating the key version:

- **Automatically update the key version:** To automatically update a customer-managed key when a new version is available, omit the key version when you enable encryption with customer-managed keys for the storage account. If the key version is omitted, then Azure Storage checks the key vault or managed HSM daily for a new version of a customer-managed key. If a new key version is available, then Azure Storage automatically uses the latest version of the key.

    Azure Storage checks the key vault for a new key version only once daily. When you rotate a key, be sure to wait 24 hours before disabling the older version.

- **Manually update the key version:** To use a specific version of a key for Azure Storage encryption, specify that key version when you enable encryption with customer-managed keys for the storage account. If you specify the key version, then Azure Storage uses that version for encryption until you manually update the key version.

    When the key version is explicitly specified, then you must manually update the storage account to use the new key version URI when a new version is created. To learn how to update the storage account to use a new version of the key, see [Configure encryption with customer-managed keys stored in Azure Key Vault](customer-managed-keys-configure-key-vault.md) or [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md).

When you update the key version, the protection of the root encryption key changes, but the data in your Azure Storage account isn't re-encrypted. There's no further action required from the user.

> [!NOTE]
> To rotate a key, create a new version of the key in the key vault or managed HSM, according to your compliance policies. You can rotate your key manually or create a function to rotate it on a schedule.

## Revoke access to customer-managed keys

You can revoke the storage account's access to the customer-managed key at any time. After access to customer-managed keys is revoked, or after the key has been disabled or deleted, clients can't call operations that read from or write to a blob or its metadata. Attempts to call any of the following operations will fail with error code 403 (Forbidden) for all users:

- [List Blobs](/rest/api/storageservices/list-blobs), when called with the `include=metadata` parameter on the request URI
- [Get Blob](/rest/api/storageservices/get-blob)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)
- [Snapshot Blob](/rest/api/storageservices/snapshot-blob), when called with the `x-ms-meta-name` request header
- [Copy Blob](/rest/api/storageservices/copy-blob)
- [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url)
- [Set Blob Tier](/rest/api/storageservices/set-blob-tier)
- [Put Block](/rest/api/storageservices/put-block)
- [Put Block From URL](/rest/api/storageservices/put-block-from-url)
- [Append Block](/rest/api/storageservices/append-block)
- [Append Block From URL](/rest/api/storageservices/append-block-from-url)
- [Put Blob](/rest/api/storageservices/put-blob)
- [Put Page](/rest/api/storageservices/put-page)
- [Put Page From URL](/rest/api/storageservices/put-page-from-url)
- [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob)

To call these operations again, restore access to the customer-managed key.

All data operations that aren't listed in this section may proceed after customer-managed keys are revoked or a key is disabled or deleted.

To revoke access to customer-managed keys, use [PowerShell](./customer-managed-keys-configure-key-vault.md#revoke-customer-managed-keys) or [Azure CLI](./customer-managed-keys-configure-key-vault.md#revoke-customer-managed-keys).

## Customer-managed keys for Azure managed disks

Customer-managed keys are also available for managing encryption of Azure managed disks. Customer-managed keys behave differently for managed disks than for Azure Storage resources. For more information, see [Server-side encryption of Azure managed disks](../../virtual-machines/disk-encryption.md) for Windows or [Server side encryption of Azure managed disks](../../virtual-machines/disk-encryption.md) for Linux.

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [Configure encryption with customer-managed keys stored in Azure Key Vault](customer-managed-keys-configure-key-vault.md)
- [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md)
