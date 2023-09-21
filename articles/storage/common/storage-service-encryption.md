---
title: Azure Storage encryption for data at rest
description: Azure Storage protects your data by automatically encrypting it before persisting it to the cloud. You can rely on Microsoft-managed keys for the encryption of the data in your storage account, or you can manage encryption with your own keys.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.date: 02/09/2023
ms.topic: conceptual
ms.author: akashdubey
ms.reviewer: ozgun
ms.subservice: storage-common-concepts
---

# Azure Storage encryption for data at rest

Azure Storage uses service-side encryption (SSE) to automatically encrypt your data when it is persisted to the cloud. Azure Storage encryption protects your data and to help you to meet your organizational security and compliance commitments.

Microsoft recommends using service-side encryption to protect your data for most scenarios. However, the Azure Storage client libraries for Blob Storage and Queue Storage also provide client-side encryption for customers who need to encrypt data on the client. For more information, see [Client-side encryption for blobs and queues](#client-side-encryption-for-blobs-and-queues).

## About Azure Storage service-side encryption

Data in Azure Storage is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Azure Storage encryption is similar to BitLocker encryption on Windows.

Azure Storage encryption is enabled for all storage accounts, including both Resource Manager and classic storage accounts. Azure Storage encryption cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Azure Storage encryption.

Data in a storage account is encrypted regardless of performance tier (standard or premium), access tier (hot or cool), or deployment model (Azure Resource Manager or classic). All new and existing block blobs, append blobs, and page blobs are encrypted, including blobs in the archive tier. All Azure Storage redundancy options support encryption, and all data in both the primary and secondary regions is encrypted when geo-replication is enabled. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables. All object metadata is also encrypted.

There is no additional cost for Azure Storage encryption.

For more information about the cryptographic modules underlying Azure Storage encryption, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal).

For information about encryption and key management for Azure managed disks, see [Server-side encryption of Azure managed disks](../../virtual-machines/disk-encryption.md).

## About encryption key management

Data in a new storage account is encrypted with Microsoft-managed keys by default. You can continue to rely on Microsoft-managed keys for the encryption of your data, or you can manage encryption with your own keys. If you choose to manage encryption with your own keys, you have two options. You can use either type of key management, or both:

- You can specify a *customer-managed key* to use for encrypting and decrypting data in Blob Storage and in Azure Files.<sup>1,2</sup> Customer-managed keys must be stored in Azure Key Vault or Azure Key Vault Managed Hardware Security Model (HSM). For more information about customer-managed keys, see [Use customer-managed keys for Azure Storage encryption](./customer-managed-keys-overview.md).
- You can specify a *customer-provided key* on Blob Storage operations. A client making a read or write request against Blob Storage can include an encryption key on the request for granular control over how blob data is encrypted and decrypted. For more information about customer-provided keys, see [Provide an encryption key on a request to Blob Storage](../blobs/encryption-customer-provided-keys.md).

By default, a storage account is encrypted with a key that is scoped to the entire storage account. Encryption scopes enable you to manage encryption with a key that is scoped to a container or an individual blob. You can use encryption scopes to create secure boundaries between data that resides in the same storage account but belongs to different customers. Encryption scopes can use either Microsoft-managed keys or customer-managed keys. For more information about encryption scopes, see [Encryption scopes for Blob storage](../blobs/encryption-scope-overview.md).

The following table compares key management options for Azure Storage encryption.

| Key management parameter | Microsoft-managed keys | Customer-managed keys | Customer-provided keys |
|--|--|--|--|
| Encryption/decryption operations | Azure | Azure | Azure |
| Azure Storage services supported | All | Blob Storage, Azure Files<sup>1,2</sup> | Blob Storage |
| Key storage | Microsoft key store | Azure Key Vault or Key Vault HSM | Customer's own key store |
| Key rotation responsibility | Microsoft | Customer | Customer |
| Key control | Microsoft | Customer | Customer |
| Key scope | Account (default), container, or blob | Account (default), container, or blob | N/A |

<sup>1</sup> For information about creating an account that supports using customer-managed keys with Queue storage, see [Create an account that supports customer-managed keys for queues](account-encryption-key-create.md?toc=/azure/storage/queues/toc.json).<br />
<sup>2</sup> For information about creating an account that supports using customer-managed keys with Table storage, see [Create an account that supports customer-managed keys for tables](account-encryption-key-create.md?toc=/azure/storage/tables/toc.json).

> [!NOTE]
> Microsoft-managed keys are rotated appropriately per compliance requirements. If you have specific key rotation requirements, Microsoft recommends that you move to customer-managed keys so that you can manage and audit the rotation yourself.

## Doubly encrypt data with infrastructure encryption

Customers who require high levels of assurance that their data is secure can also enable 256-bit AES encryption at the Azure Storage infrastructure level. When infrastructure encryption is enabled, data in a storage account is encrypted twice &mdash; once at the service level and once at the infrastructure level &mdash; with two different encryption algorithms and two different keys. Double encryption of Azure Storage data protects against a scenario where one of the encryption algorithms or keys may be compromised. In this scenario, the additional layer of encryption continues to protect your data.

Service-level encryption supports the use of either Microsoft-managed keys or customer-managed keys with Azure Key Vault. Infrastructure-level encryption relies on Microsoft-managed keys and always uses a separate key.

For more information about how to create a storage account that enables infrastructure encryption, see [Create a storage account with infrastructure encryption enabled for double encryption of data](infrastructure-encryption-enable.md).

## Client-side encryption for blobs and queues

The Azure Blob Storage client libraries for .NET, Java, and Python support encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client. The Queue Storage client libraries for .NET and Python also support client-side encryption.

> [!NOTE]
> Consider using the service-side encryption features provided by Azure Storage to protect your data, instead of client-side encryption.

The Blob Storage and Queue Storage client libraries uses [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) in order to encrypt user data. There are two versions of client-side encryption available in the client libraries:

- Version 2 uses [Galois/Counter Mode (GCM)](https://en.wikipedia.org/wiki/Galois/Counter_Mode) mode with AES. The Blob Storage and Queue Storage SDKs support client-side encryption with v2.
- Version 1 uses [Cipher Block Chaining (CBC)](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher-block_chaining_.28CBC.29) mode with AES. The Blob Storage, Queue Storage, and Table Storage SDKs support client-side encryption with v1.

> [!WARNING]
> Using client-side encryption v1 is no longer recommended due to a security vulnerability in the client library's implementation of CBC mode. For more information about this security vulnerability, see [Azure Storage updating client-side encryption in SDK to address security vulnerability](https://aka.ms/azstorageclientencryptionblog). If you are currently using v1, we recommend that you update your application to use client-side encryption v2 and migrate your data.
>
> The Azure Table Storage SDK supports only client-side encryption v1. Using client-side encryption with Table Storage is not recommended.

The following table shows which client libraries support which versions of client-side encryption and provides guidelines for migrating to client-side encryption v2.

| Client library | Version of client-side encryption supported | Recommended migration | Additional guidance |
|--|--|--|--|
| Blob Storage client libraries for .NET (version 12.13.0 and above), Java (version 12.18.0 and above), and Python (version 12.13.0 and above) | 2.0<br/><br/>1.0 (for backward compatibility only) | Update your code to use client-side encryption v2.<br/><br/>Download any encrypted data to decrypt it, then reencrypt it with client-side encryption v2. | [Client-side encryption for blobs](../blobs/client-side-encryption.md) |
| Blob Storage client library for .NET (version 12.12.0 and below), Java (version 12.17.0 and below), and Python (version 12.12.0 and below) | 1.0 (not recommended) | Update your application to use a version of the Blob Storage SDK that supports client-side encryption v2. See [SDK support matrix for client-side encryption](../blobs/client-side-encryption.md#sdk-support-matrix-for-client-side-encryption) for details.<br/><br/>Update your code to use client-side encryption v2.<br/><br/>Download any encrypted data to decrypt it, then reencrypt it with client-side encryption v2. | [Client-side encryption for blobs](../blobs/client-side-encryption.md) |
| Queue Storage client library for .NET (version 12.11.0 and above) and Python (version 12.4 and above) | 2.0<br/><br/>1.0 (for backward compatibility only) | Update your code to use client-side encryption v2. | [Client-side encryption for queues](../queues/client-side-encryption.md) |
| Queue Storage client library for .NET (version 12.10.0 and below) and Python (version 12.3.0 and below) | 1.0 (not recommended) | Update your application to use a version of the Queue Storage SDK version that supports client-side encryption v2. See [SDK support matrix for client-side encryption](../queues/client-side-encryption.md#sdk-support-matrix-for-client-side-encryption)<br/><br/>Update your code to use client-side encryption v2. | [Client-side encryption for queues](../queues/client-side-encryption.md) |
| Table Storage client library for .NET, Java, and Python | 1.0 (not recommended) | Not available. | N/A |

## Next steps

- [What is Azure Key Vault?](../../key-vault/general/overview.md)
- [Customer-managed keys for Azure Storage encryption](customer-managed-keys-overview.md)
- [Encryption scopes for Blob Storage](../blobs/encryption-scope-overview.md)
- [Provide an encryption key on a request to Blob Storage](../blobs/encryption-customer-provided-keys.md)
