---
title: Customer-managed keys for account encryption
titleSuffix: Azure Storage
description: You can use your own encryption key to protect the data in your storage account. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.date: 05/11/2023
ms.topic: conceptual
ms.author: akashdubey
ms.reviewer: ozgun
ms.subservice: storage-common-concepts
ms.custom: engagement-fy23
---

# Customer-managed keys for Azure Storage encryption

You can use your own encryption key to protect the data in your storage account. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.

You must use one of the following Azure key stores to store your customer-managed keys:

- [Azure Key Vault](../../key-vault/general/overview.md)
- [Azure Key Vault Managed Hardware Security Module (HSM)](../../key-vault/managed-hsm/overview.md)

You can either create your own keys and store them in the key vault or managed HSM, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault or managed HSM can be in different Azure Active Directory (Azure AD) tenants, regions, and subscriptions.

> [!NOTE]
> Azure Key Vault and Azure Key Vault Managed HSM support the same APIs and management interfaces for configuration of customer-managed keys. Any action that is supported for Azure Key Vault is also supported for Azure Key Vault Managed HSM.

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

When you configure customer-managed keys for a storage account, Azure Storage wraps the root data encryption key for the account with the customer-managed key in the associated key vault or managed HSM. The protection of the root encryption key changes, but the data in your Azure Storage account remains encrypted at all times. There is no additional action required on your part to ensure that your data remains encrypted. Protection by customer-managed keys takes effect immediately.

You can switch between customer-managed keys and Microsoft-managed keys at any time. For more information about Microsoft-managed keys, see [About encryption key management](storage-service-encryption.md#about-encryption-key-management).

### Key vault requirements

The key vault or managed HSM that stores the key must have both soft delete and purge protection enabled. Azure storage encryption supports RSA and RSA-HSM keys of sizes 2048, 3072 and 4096. For more information about keys, see [About keys](../../key-vault/keys/about-keys.md).

Using a key vault or managed HSM has associated costs. For more information, see [Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault/).

### Customer-managed keys with a key vault in the same tenant

You can configure customer-managed keys with the key vault and storage account in the same tenant or in different Azure AD tenants. To learn how to configure Azure Storage encryption with customer-managed keys when the key vault and storage account are in the same tenants, see one of the following articles:

- [Configure customer-managed keys in an Azure key vault for a new storage account](customer-managed-keys-configure-new-account.md)
- [Configure customer-managed keys in an Azure key vault for an existing storage account](customer-managed-keys-configure-existing-account.md)

When you enable customer-managed keys with a key vault in the same tenant, you must specify a managed identity that is to be used to authorize access to the key vault that contains the key. The managed identity may be either a user-assigned or system-assigned managed identity:

- When you configure customer-managed keys at the time that you create a storage account, you must use a user-assigned managed identity.
- When you configure customer-managed keys on an existing storage account, you can use either a user-assigned managed identity or a system-assigned managed identity.

To learn more about system-assigned versus user-assigned managed identities, see [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

### Customer-managed keys with a key vault in a different tenant

To learn how to configure Azure Storage encryption with customer-managed keys when the key vault and storage account are in different Azure AD tenants, see one of the following articles:

- [Configure cross-tenant customer-managed keys for a new storage account](customer-managed-keys-configure-cross-tenant-new-account.md)
- [Configure cross-tenant customer-managed keys for an existing storage account](customer-managed-keys-configure-cross-tenant-existing-account.md)

### Customer-managed keys with a managed HSM

You can configure customer-managed keys with an Azure Key Vault Managed HSM for a new or existing account. And you can configure customer-managed keys with a managed HSM that's in the same tenant as the storage account, or in a different tenant. The process for configuring customer-managed keys in a managed HSM is the same as for configuring customer-managed keys in a key vault, but the permissions are slightly different. For more information, see [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md).

## Update the key version

Following cryptographic best practices means rotating the key that is protecting your storage account on a regular schedule, typically at least every two years. Azure Storage never modifies the key in the key vault, but you can configure a key rotation policy to rotate the key according to your compliance requirements. For more information, see [Configure cryptographic key auto-rotation in Azure Key Vault](../../key-vault/keys/how-to-configure-key-rotation.md).

After the key is rotated in the key vault, the customer-managed keys configuration for your storage account must be updated to use the new key version. Customer-managed keys support both automatic and manual updating of the key version for the key that is protecting the account. You can decide which approach you want to use when you configure customer-managed keys, or when you update your configuration.

When you modify the key or the key version, the protection of the root encryption key changes, but the data in your Azure Storage account remains encrypted at all times. There is no additional action required on your part to ensure that your data is protected. Rotating the key version doesn't impact performance. There is no downtime associated with rotating the key version.

> [!IMPORTANT]
> To rotate a key, create a new version of the key in the key vault or managed HSM, according to your compliance requirements. Azure Storage does not handle key rotation, so you will need to manage rotation of the key in the key vault.
>
> When you rotate the key used for customer-managed keys, that action is not currently logged to the Azure Monitor logs for Azure Storage.

### Automatically update the key version

To automatically update a customer-managed key when a new version is available, omit the key version when you enable encryption with customer-managed keys for the storage account. If the key version is omitted, then Azure Storage checks the key vault or managed HSM daily for a new version of a customer-managed key. If a new key version is available, then Azure Storage automatically uses the latest version of the key.

Azure Storage checks the key vault for a new key version only once daily. When you rotate a key, be sure to wait 24 hours before disabling the older version.

If the storage account was previously configured for manual updating of the key version and you want to change it to update automatically, you might need to explicitly change the key version to an empty string. For details on how to do this, see [Configure encryption for automatic updating of key versions](customer-managed-keys-configure-existing-account.md#configure-encryption-for-automatic-updating-of-key-versions).

### Manually update the key version

To use a specific version of a key for Azure Storage encryption, specify that key version when you enable encryption with customer-managed keys for the storage account. If you specify the key version, then Azure Storage uses that version for encryption until you manually update the key version.

When the key version is explicitly specified, then you must manually update the storage account to use the new key version URI when a new version is created. To learn how to update the storage account to use a new version of the key, see [Configure encryption with customer-managed keys stored in Azure Key Vault](customer-managed-keys-configure-key-vault.md) or [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md).

## Revoke access to a storage account that uses customer-managed keys

To revoke access to a storage account that uses customer-managed keys, disable the key in the key vault. To learn how to disable the key, see [Revoke access to a storage account that uses customer-managed keys](../../storage/common/customer-managed-keys-configure-existing-account.md#revoke-access-to-a-storage-account-that-uses-customer-managed-keys).

After the key has been disabled, clients can't call operations that read from or write to a resource or its metadata. Attempts to call these operations will fail with error code 403 (Forbidden) for all users.

To call these operations again, restore access to the customer-managed key.

All data operations that aren't listed in the following sections may proceed after customer-managed keys are revoked or after a key is disabled or deleted.

To revoke access to customer-managed keys, use [PowerShell](./customer-managed-keys-configure-key-vault.md#revoke-customer-managed-keys) or [Azure CLI](./customer-managed-keys-configure-key-vault.md#revoke-customer-managed-keys).

### Blob Storage operations that fail after a key is revoked

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

### Azure Files operations that fail after a key is revoked

- [Create Permission](/rest/api/storageservices/create-permission)
- [Get Permission](/rest/api/storageservices/get-permission)
- [List Directories and Files](/rest/api/storageservices/list-directories-and-files)
- [Create Directory](/rest/api/storageservices/create-directory)
- [Get Directory Properties](/rest/api/storageservices/get-directory-properties)
- [Set Directory Properties](/rest/api/storageservices/set-directory-properties)
- [Get Directory Metadata](/rest/api/storageservices/get-directory-metadata)
- [Set Directory Metadata](/rest/api/storageservices/set-directory-metadata)
- [Create File](/rest/api/storageservices/create-file)
- [Get File](/rest/api/storageservices/get-file)
- [Get File Properties](/rest/api/storageservices/get-file-properties)
- [Set File Properties](/rest/api/storageservices/set-file-properties)
- [Put Range](/rest/api/storageservices/put-range)
- [Put Range From URL](/rest/api/storageservices/put-range-from-url)
- [Get File Metadata](/rest/api/storageservices/get-file-metadata)
- [Set File Metadata](/rest/api/storageservices/set-file-metadata)
- [Copy File](/rest/api/storageservices/copy-file)
- [Rename File](/rest/api/storageservices/rename-file)

## Customer-managed keys for Azure managed disks

Customer-managed keys are also available for managing encryption of Azure managed disks. Customer-managed keys behave differently for managed disks than for Azure Storage resources. For more information, see [Server-side encryption of Azure managed disks](../../virtual-machines/disk-encryption.md) for Windows or [Server side encryption of Azure managed disks](../../virtual-machines/disk-encryption.md) for Linux.

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [Configure encryption with customer-managed keys stored in Azure Key Vault](customer-managed-keys-configure-key-vault.md)
- [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](customer-managed-keys-configure-key-vault-hsm.md)
