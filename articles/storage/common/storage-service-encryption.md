---
title: Azure Storage encryption for data at rest
description: Azure Storage protects your data by automatically encrypting it before persisting it to the cloud. You can rely on Microsoft-managed keys for the encryption of the data in your storage account, or you can manage encryption with your own keys.
services: storage
author: tamram

ms.service: storage
ms.date: 09/17/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
---

# Azure Storage encryption for data at rest

Azure Storage uses server-side encryption (SSE) to automatically encrypt your data when it is persisted to the cloud. Azure Storage encryption protects your data and to help you to meet your organizational security and compliance commitments.

## About Azure Storage encryption

Data in Azure Storage is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all storage accounts, including both Resource Manager and classic storage accounts. Azure Storage encryption cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

Data in a storage account is encrypted regardless of performance tier (standard or premium), access tier (hot or cool), or deployment model (Azure Resource Manager or classic). All blobs in the archive tier are also encrypted. All Azure Storage redundancy options support encryption, and all data in both the primary and secondary regions is encrypted when geo-replication is enabled. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables. All object metadata is also encrypted. There is no additional cost for Azure Storage encryption.

Every block blob, append blob, or page blob that was written to Azure Storage after October 20, 2017 is encrypted. Blobs created prior to this date continue to be encrypted by a background process. To force the encryption of a blob that was created before October 20, 2017, you can rewrite the blob. To learn how to check the encryption status of a blob, see [Check the encryption status of a blob](../blobs/storage-blob-encryption-status.md).

For more information about the cryptographic modules underlying Azure Storage encryption, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal).

For information about encryption and key management for Azure managed disks, see [Server-side encryption of Azure managed disks](../../virtual-machines/disk-encryption.md).

## About encryption key management

Data in a new storage account is encrypted with Microsoft-managed keys by default. You can continue to rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you have two options. You can use either type of key management, or both:

- You can specify a *customer-managed key* to use for encrypting and decrypting data in Blob storage and in Azure Files.<sup>1,2</sup> Customer-managed keys must be stored in Azure Key Vault or Azure Key Vault Managed Hardware Security Model (HSM) (preview). For more information about customer-managed keys, see [Use customer-managed keys for Azure Storage encryption](./customer-managed-keys-overview.md).
- You can specify a *customer-provided key* on Blob storage operations. A client making a read or write request against Blob storage can include an encryption key on the request for granular control over how blob data is encrypted and decrypted. For more information about customer-provided keys, see [Provide an encryption key on a request to Blob storage](../blobs/encryption-customer-provided-keys.md).

The following table compares key management options for Azure Storage encryption.

| Key management parameter | Microsoft-managed keys | Customer-managed keys | Customer-provided keys |
|--|--|--|--|
| Encryption/decryption operations | Azure | Azure | Azure |
| Azure Storage services supported | All | Blob storage, Azure Files<sup>1,2</sup> | Blob storage |
| Key storage | Microsoft key store | Azure Key Vault or Key Vault HSM | Customer's own key store |
| Key rotation responsibility | Microsoft | Customer | Customer |
| Key control | Microsoft | Customer | Customer |

<sup>1</sup> For information about creating an account that supports using customer-managed keys with Queue storage, see [Create an account that supports customer-managed keys for queues](account-encryption-key-create.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json).<br />
<sup>2</sup> For information about creating an account that supports using customer-managed keys with Table storage, see [Create an account that supports customer-managed keys for tables](account-encryption-key-create.md?toc=%2fazure%2fstorage%2ftables%2ftoc.json).

> [!NOTE]
> Microsoft-managed keys are rotated appropriately per compliance requirements. If you have specific key rotation requirements, Microsoft recommends that you move to customer-managed keys so that you can manage and audit the rotation yourself.

## Doubly encrypt data with infrastructure encryption

Customers who require high levels of assurance that their data is secure can also enable 256-bit AES encryption at the Azure Storage infrastructure level. When infrastructure encryption is enabled, data in a storage account is encrypted twice &mdash; once at the service level and once at the infrastructure level &mdash; with two different encryption algorithms and two different keys. Double encryption of Azure Storage data protects against a scenario where one of the encryption algorithms or keys may be compromised. In this scenario, the additional layer of encryption continues to protect your data.

Service-level encryption supports the use of either Microsoft-managed keys or customer-managed keys with Azure Key Vault. Infrastructure-level encryption relies on Microsoft-managed keys and always uses a separate key.

For more information about how to create a storage account that enables infrastructure encryption, see [Create a storage account with infrastructure encryption enabled for double encryption of data](infrastructure-encryption-enable.md).

## Encryption scopes for Blob storage

By default, a storage account is encrypted with a key that is scoped to the storage account. You can choose to use either Microsoft-managed keys or customer-managed keys stored in Azure Key Vault to protect and control access to the key that encrypts your data.

Encryption scopes enable you to optionally manage encryption at the level of the container or an individual blob. You can use encryption scopes to create secure boundaries between data that resides in the same storage account but belongs to different customers.

You can create one or more encryption scopes for a storage account using the Azure Storage resource provider. When you create an encryption scope, you specify whether the scope is protected with a Microsoft-managed key or with a customer-managed key that is stored in Azure Key Vault. Different encryption scopes on the same storage account can use either Microsoft-managed or customer-managed keys.

After you have created an encryption scope, you can specify that encryption scope on a request to create a container or a blob. For more information about how to create an encryption scope, see [Create and manage encryption scopes](../blobs/encryption-scope-manage.md).

[!INCLUDE [storage-data-lake-gen2-support](../../../includes/storage-data-lake-gen2-support.md)]

> [!IMPORTANT]
> To avoid unexpected costs, be sure to disable any encryption scopes that you do not currently need.

### Create a container or blob with an encryption scope

Blobs that are created under an encryption scope are encrypted with the key specified for that scope. You can specify an encryption scope for an individual blob when you create the blob, or you can specify a default encryption scope when you create a container. When a default encryption scope is specified at the level of a container, all blobs in that container are encrypted with the key associated with the default scope.

When you create a blob in a container that has a default encryption scope, you can specify an encryption scope that overrides the default encryption scope if the container is configured to allow overrides of the default encryption scope. To prevent overrides of the default encryption scope, configure the container to deny overrides for an individual blob.

Read operations on a blob that belongs to an encryption scope happen transparently, so long as the encryption scope is not disabled.

### Disable an encryption scope

When you disable an encryption scope, any subsequent read or write operations made with the encryption scope will fail with HTTP error code 403 (Forbidden). If you re-enable the encryption scope, read and write operations will proceed normally again.

When an encryption scope is disabled, you are no longer billed for it. Disable any encryption scopes that are not needed to avoid unnecessary charges.

If your encryption scope is protected with customer-managed keys for Azure Key Vault, then you can also delete the associated key in the key vault in order to disable the encryption scope. Keep in mind that customer-managed keys in Azure Key Vault are protected by soft delete and purge protection, and a deleted key is subject to the behavior defined for by those properties. For more information, see one of the following topics in the Azure Key Vault documentation:

- [How to use soft-delete with PowerShell](../../key-vault/general/key-vault-recovery.md)
- [How to use soft-delete with CLI](../../key-vault/general/key-vault-recovery.md)

> [!NOTE]
> It is not possible to delete an encryption scope.

## Next steps

- [What is Azure Key Vault?](../../key-vault/general/overview.md)
- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Encryption scopes for Blob storage](../blobs/encryption-scope-overview.md)
