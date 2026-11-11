---
title: Encryption at rest for Azure Files
description: Learn how Azure Files encrypts data at rest, how to choose between Microsoft-managed and customer-managed keys, and when to use infrastructure encryption.
author: wmgries
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 10/25/2026
ms.author: wgries
---

# Encryption at rest for Azure Files
:heavy_check_mark: **Applies to:** All Azure file shares

Azure Files encrypts all file share data at rest. This article describes how encryption at rest works and the decisions to make before you deploy Azure Files: who manages the key that encrypts your data and whether you need a second layer of encryption. For the steps to use your own key, see [Configure encryption at rest with customer-managed keys for Azure Files](customer-managed-keys.md). To protect data as it moves between clients and Azure Files, see [Configure encryption in transit for Azure Files](files-encryption-in-transit.md). For other deployment decisions, see [Plan an Azure Files deployment](storage-files-planning.md).

The available options depend on the resource provider that you use to create the file share. Classic file shares (Microsoft.Storage) support Microsoft-managed keys, customer-managed keys, and infrastructure encryption. File shares created with Microsoft.FileShares support Microsoft-managed keys only. For other differences between the resource providers, see [Azure Files management concepts](files-management-concepts.md).

| Encryption option | Classic file shares (Microsoft.Storage) | Microsoft.FileShares |
|-|-|-|
| Encryption at rest with Microsoft-managed keys | Supported | Supported |
| Customer-managed keys | Supported | Not supported |
| Infrastructure encryption | Supported | Not supported |

## How encryption at rest works
Azure Files encrypts data as it writes the data to disk and decrypts the data as it reads it. Encryption happens beneath the file system of the file share, similar to how BitLocker works on Windows. Because the service does the encryption, clients don't need access to the encryption key, and you don't need to change your applications or client configuration. Encryption at rest applies to file data and metadata, regardless of whether clients use SMB, NFS, or FileREST.

Encryption at rest is always on and can't be disabled. It applies to every file share, regardless of the media tier, billing model, or redundancy. If a storage account uses geo-redundant storage, the data in the secondary region is also encrypted. Encryption at rest doesn't add charges to your bill.

Azure Files uses 256-bit AES-GCM, which is FIPS 140-2 compliant. For more information about the cryptographic modules that Azure Files uses, see [Cryptography API: Next Generation](/windows/win32/seccng/cng-portal).

Encryption at rest protects data where it's stored. It doesn't control who can read or change files; to control access to file data, see [Secure your Azure file shares](secure-files.md).

## Encryption keys
Azure Files encrypts your data with a key, and you choose who manages that key. By default, Microsoft manages it. For classic file shares, you can manage the key yourself instead. In both cases, Azure Files seamlessly handles the encryption and decryption.

| Attribute | Microsoft-managed keys | Customer-managed keys |
|-|-|-|
| Default | Yes | No |
| Encryption and decryption operations | Azure | Azure |
| Key storage | Microsoft key store | Azure Key Vault or Azure Key Vault Managed HSM |
| Key rotation | Microsoft | You |
| Key control | Microsoft | You |

### Microsoft-managed keys
Microsoft-managed keys need no configuration. Microsoft stores and controls the keys and rotates them as compliance requirements specify. File shares created with Microsoft.FileShares always use Microsoft-managed keys. If you have specific requirements for key rotation or audit, use customer-managed keys so that you can manage and audit the rotation yourself.

### Customer-managed keys
With customer-managed keys, you control the key that protects the data in a storage account. You store the key in Azure Key Vault or Azure Key Vault Managed HSM, and the storage account uses a managed identity to access it. The key vault can be in a different region or subscription than the storage account. It can also be in a different Microsoft Entra tenant, for example when a service provider stores data that its customer's key protects.

A customer-managed key applies to the whole storage account. One key protects all classic file shares in the storage account, and you can't use a different key for each file share. If file shares need different keys, put them in different storage accounts.

When you manage the key, you also manage its lifecycle, including rotation. You can configure the storage account to use the latest version of the key automatically. With this option, the storage account starts to use a new key version within 24 hours after you create it. Alternatively, you can specify a key version and then update the storage account each time you rotate the key.

The storage account must be able to access the key to read and write data. If you disable the key or remove the storage account's access to it, clients can't read or write data in the storage account until you restore access. You can use this behavior to revoke access on purpose, but an accidental change to the key or its permissions has the same effect. To prevent an accidental change, limit who can disable the key or change its permissions. Customer-managed keys require purge protection on the key vault or managed HSM, so a deleted key stays recoverable until its retention period ends.

For the steps to configure customer-managed keys, rotate the key, and revoke access, see [Configure encryption at rest with customer-managed keys for Azure Files](customer-managed-keys.md).

## Infrastructure encryption
Infrastructure encryption adds a second layer of encryption beneath the first. With infrastructure encryption, Azure Files encrypts your data twice: once at the service level, with the key that you choose, and once at the infrastructure level, with a separate Microsoft-managed key. The two layers use different encryption algorithms and different keys. If one algorithm or key is compromised, the other layer continues to protect your data.

Most workloads don't need infrastructure encryption, because the service-level encryption is sufficient. Use infrastructure encryption when your compliance requirements call for double encryption.

Plan for infrastructure encryption before you deploy, because you can enable it only when you create a storage account. You can't enable or disable it on an existing storage account. To use infrastructure encryption for data that you already have, create a new storage account with infrastructure encryption and [migrate the data to a new file share](migrate-files-between-shares.md). Microsoft.FileShares doesn't support infrastructure encryption.

To create a storage account with infrastructure encryption, follow the steps in [Create a storage account for classic file shares](create-classic-file-share.md#create-a-storage-account-for-classic-file-shares).

## Related content
- [Configure encryption at rest with customer-managed keys for Azure Files](customer-managed-keys.md)
- [Configure encryption in transit for Azure Files](files-encryption-in-transit.md)
- [Secure your Azure file shares](secure-files.md)
