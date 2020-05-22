---
title: Use customer-managed keys with Azure Key Vault to manage account encryption
titleSuffix: Azure Storage
description: You can use your own encryption key to protect the data in your storage account. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.
services: storage
author: tamram

ms.service: storage
ms.date: 03/12/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Use customer-managed keys with Azure Key Vault to manage Azure Storage encryption

You can use your own encryption key to protect the data in your storage account. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.

You must use Azure Key Vault to store your customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region and in the same Azure Active Directory (Azure AD) tenant, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/general/overview.md).

## About customer-managed keys

The following diagram shows how Azure Storage uses Azure Active Directory and Azure Key Vault to make requests using the customer-managed key:

![Diagram showing how customer-managed keys work in Azure Storage](media/encryption-customer-managed-keys/encryption-customer-managed-keys-diagram.png)

The following list explains the numbered steps in the diagram:

1. An Azure Key Vault admin grants permissions to encryption keys to the managed identity that's associated with the storage account.
2. An Azure Storage admin configures encryption with a customer-managed key for the storage account.
3. Azure Storage uses the managed identity that's associated with the storage account to authenticate access to Azure Key Vault via Azure Active Directory.
4. Azure Storage wraps the account encryption key with the customer key in Azure Key Vault.
5. For read/write operations, Azure Storage sends requests to Azure Key Vault to unwrap the account encryption key to perform encryption and decryption operations.

## Create an account that supports customer-managed keys for queues and tables

Data stored in the Queue and Table services is not automatically protected by a customer-managed key when customer-managed keys are enabled for the storage account. You can optionally configure these services at the time that you create the storage account to be included in this protection.

For more information about how to create a storage account that supports customer-managed keys for queues and tables, see [Create an account that supports customer-managed keys for tables and queues](account-encryption-key-create.md).

Data in the Blob and File services is always protected by customer-managed keys when customer-managed keys are configured for the storage account.

## Enable customer-managed keys for a storage account

Customer-managed keys can enabled only on existing storage accounts. The key vault must be provisioned with access policies that grant key permissions to the managed identity that is associated with the storage account. The managed identity is available only after the storage account is created.

When you configure a customer-managed key, Azure Storage wraps the root data encryption key for the account with the customer-managed key in the associated key vault. Enabling customer-managed keys does not impact performance, and takes effect immediately.

When you modify the key being used for Azure Storage encryption by enabling or disabling customer-managed keys, updating the key version, or specifying a different key, then the encryption of the root key changes, but the data in your Azure Storage account does not need to be re-encrypted.

When you enable or disable customer managed keys, or when you modify the key or the key version, the protection of the root encryption key changes, but the data in your Azure Storage account does not need to be re-encrypted.

To learn how to use customer-managed keys with Azure Key Vault for Azure Storage encryption, see one of these articles:

- [Configure customer-managed keys with Key Vault for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys with Key Vault for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Configure customer-managed keys with Key Vault for Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)

> [!IMPORTANT]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure AD. Managed identities do not currently support cross-directory scenarios. When you configure customer-managed keys in the Azure portal, a managed identity is automatically assigned to your storage account under the covers. If you subsequently move the subscription, resource group, or storage account from one Azure AD directory to another, the managed identity associated with the storage account is not transferred to the new tenant, so customer-managed keys may no longer work. For more information, see **Transferring a subscription between Azure AD directories** in [FAQs and known issues with managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).  

## Store customer-managed keys in Azure Key Vault

To enable customer-managed keys on a storage account, you must use an Azure Key Vault to store your keys. You must enable both the **Soft Delete** and **Do Not Purge** properties on the key vault.

Only 2048-bit RSA and RSA-HSM keys are supported with Azure Storage encryption. For more information about keys, see **Key Vault keys** in [About Azure Key Vault keys, secrets and certificates](../../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).

## Rotate customer-managed keys

You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. When the key is rotated, you must update the storage account to use the new key version URI. To learn how to update the storage account to use a new version of the key in the Azure portal, see the section titled **Update the key version** in [Configure customer-managed keys for Azure Storage by using the Azure portal](storage-encryption-keys-portal.md).

Rotating the key does not trigger re-encryption of data in the storage account. There is no further action required from the user.

## Revoke access to customer-managed keys

You can revoke the storage account's access to the customer-managed key at any time. After access to customer-managed keys is revoked, or after the key has been disabled or deleted, clients cannot call operations that read from or write to a blob or its metadata. Attempts to call any of the following operations will fail with error code 403 (Forbidden) for all users:

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

All data operations that are not listed in this section may proceed after customer-managed keys are revoked or a key is disabled or deleted.

To revoke access to customer-managed keys, use [PowerShell](storage-encryption-keys-powershell.md#revoke-customer-managed-keys) or [Azure CLI](storage-encryption-keys-cli.md#revoke-customer-managed-keys).

## Customer-managed keys for Azure managed disks

Customer-managed keys are also available for managing encryption of Azure managed disks. Customer-managed keys behave differently for managed disks than for Azure Storage resources. For more information, see [Server-side encryption of Azure managed disks](../../virtual-machines/windows/disk-encryption.md) for Windows or [Server side encryption of Azure managed disks](../../virtual-machines/linux/disk-encryption.md) for Linux.

## Next steps

- [Configure customer-managed keys with Key Vault for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys with Key Vault for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Configure customer-managed keys with Key Vault for Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)
- [Azure Storage encryption for data at rest](storage-service-encryption.md)
