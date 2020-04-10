---
title: Azure Storage encryption for data at rest
description: Azure Storage protects your data by automatically encrypting it before persisting it to the cloud. You can rely on Microsoft-managed keys for the encryption of the data in your storage account, or you can manage encryption with your own keys.
services: storage
author: tamram

ms.service: storage
ms.date: 04/10/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Azure Storage encryption for data at rest

Azure Storage automatically encrypts your data when it is persisted it to the cloud. Azure Storage encryption protects your data and to help you to meet your organizational security and compliance commitments.

## About Azure Storage encryption

Data in Azure Storage is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all storage accounts, including both Resource Manager and classic storage accounts. Azure Storage encryption cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

Data in a storage account is encrypted regardless of performance tier (standard or premium), access tier (hot or cool), or deployment model (Azure Resource Manager or classic). All blobs in the archive tier are also encrypted. All Azure Storage redundancy options support encryption, and all data in both the primary and secondary regions is encrypted when geo-replication is enabled. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables. All object metadata is also encrypted. There is no additional cost for Azure Storage encryption.

Every block blob, append blob, or page blob that was written to Azure Storage after October 20, 2017 is encrypted. Blobs created prior to this date continue to be encrypted by a background process. To force the encryption of a blob that was created before October 20, 2017, you can rewrite the blob. To learn how to check the encryption status of a blob, see [Check the encryption status of a blob](../blobs/storage-blob-encryption-status.md).

For more information about the cryptographic modules underlying Azure Storage encryption, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal).

## Encryption key management

Data in a new storage account is encrypted with Microsoft-managed keys. You can rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you have two options:

- You can specify a *customer-managed key* with Azure Key Vault to use for encrypting and decrypting data in Blob storage and in Azure Files.<sup>1,2</sup> For more information about customer-managed keys, see [Use customer-managed keys with Azure Key Vault to manage Azure Storage encryption](encryption-customer-managed-keys.md).
- You can specify a *customer-provided key* on Blob storage operations. A client making a read or write request against Blob storage can include an encryption key on the request for granular control over how blob data is encrypted and decrypted. For more information about customer-provided keys, see [Provide an encryption key on a request to Blob storage (preview)](encryption-customer-provided-keys.md).

The following table compares key management options for Azure Storage encryption.

|                                        |    Microsoft-managed keys                             |    Customer-managed keys                                                                                                                        |    Customer-provided keys                                                          |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
|    Encryption/decryption operations    |    Azure                                              |    Azure                                                                                                                                        |    Azure                                                                         |
|    Azure Storage services supported    |    All                                                |    Blob storage, Azure Files<sup>1,2</sup>                                                                                                               |    Blob storage                                                                  |
|    Key storage                         |    Microsoft key store    |    Azure Key Vault                                                                                                                              |    Azure Key Vault or any other key store                                                                 |
|    Key rotation responsibility         |    Microsoft                                          |    Customer                                                                                                                                     |    Customer                                                                      |
|    Key control                          |    Microsoft                                     |    Customer                                                                                                                    |    Customer                                                                 |

<sup>1</sup> For information about creating an account that supports using customer-managed keys with Queue storage, see [Create an account that supports customer-managed keys for queues](account-encryption-key-create.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json).<br />
<sup>2</sup> For information about creating an account that supports using customer-managed keys with Table storage, see [Create an account that supports customer-managed keys for tables](account-encryption-key-create.md?toc=%2fazure%2fstorage%2ftables%2ftoc.json).

## Encryption scopes for Blob storage (preview)

By default, a storage account is encrypted with a key that is scoped to the storage account. The key may be either a Microsoft-managed key or a customer-managed key stored in Azure Key Vault. All data in the storage account is encrypted with that key.

Encryption scopes enable you to manage encryption at the level of the container or blob with a key that is scoped to that object. An encryption scope isolates blob data in a secure enclave within a storage account. You can use encryption scopes to create secure boundaries between data belonging to different customers that resides in the same storage account.

You can create one or more encryption scopes for a storage account using the Azure Storage resource provider. When you create the scope, you specify what type of key you want to use for that scope. The key may be either a Microsoft-managed key or a customer-managed key that is stored in Azure Key Vault. Encryption scopes on the same storage account can use either Microsoft-managed or customer-managed keys.

After you have created an encryption scope, you can specify that encryption scope on a request to create a container or a blob. For more information about how to create an encryption scope, see [Create and manage encryption scopes (preview)](../blobs/encryption-scope-create.md).

### Create a container or blob with an encryption scope

When you create a container and specify an encryption scope for that container, all blobs subsequently created in that container belong to that encryption scope by default. You can also specify an encryption scope when you create an individual blob.

When you create a blob, you can specify an encryption scope that overrides the encryption scope specified for the container, unless the container was created with the Deny Override flag (???figure out what to call this).

Read operations on a blob that belongs to an encryption scope happen transparently, so long as the encryption scope is not disabled.

### Disable an encryption scope

When you disable an encryption scope, any subsequent read or write operations made with the encryption scope will fail with HTTP error code 403 (Forbidden). If you re-enable the encryption scope, read and write operations will proceed normally again.

When an encryption scope is disabled, you are no longer billed for it. ???Need more info on pricing/costs???

> [!NOTE]
> It is not possible to delete an encryption scope in the preview (???will it be possible in GA???).

## Next steps

- [What is Azure Key Vault?](../../key-vault/key-vault-overview.md)
- [Configure customer-managed keys for Azure Storage encryption from the Azure portal](storage-encryption-keys-portal.md)
- [Configure customer-managed keys for Azure Storage encryption from PowerShell](storage-encryption-keys-powershell.md)
- [Configure customer-managed keys for Azure Storage encryption from Azure CLI](storage-encryption-keys-cli.md)
