---
title: Encryption scopes for Blob storage
description: Encryption scopes provide the ability to manage encryption at the level of the container or an individual blob. You can use encryption scopes to create secure boundaries between data that resides in the same storage account but belongs to different customers.
services: storage
author: tamram

ms.service: storage
ms.date: 03/23/2021
ms.topic: conceptual
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
---

# Encryption scopes for Blob storage

Encryption scopes enable you to manage encryption at the level of the container or an individual blob. You can use encryption scopes to create secure boundaries between data that resides in the same storage account but belongs to different customers.

[!INCLUDE [storage-data-lake-gen2-support](../../../includes/storage-data-lake-gen2-support.md)]

## How encryption scopes work

By default, a storage account is encrypted with a key that is scoped to the storage account. You can choose to use either Microsoft-managed keys or customer-managed keys stored in Azure Key Vault to protect and control access to the key that encrypts your data. With an encryption scope, you can also specify that one or more containers are encrypted with a key that is scoped only to those containers.

When you create an encryption scope, you can specify whether the scope is protected with a Microsoft-managed key or with a customer-managed key that is stored in Azure Key Vault. Different encryption scopes on the same storage account can use either Microsoft-managed or customer-managed keys. You can switch the type of key used to protect an encryption scope from a customer-managed key to  a Microsoft-managed key, or vice versa, at any time. For more information about customer-managed keys, see [Customer-managed keys for Azure Storage encryption](../common/customer-managed-keys-overview.md). For more information about Microsoft-managed keys, see [About encryption key management](storage-service-encryption.md#about-encryption-key-management).

If you create an encryption scope with a customer-managed key, then you can choose to update the key version either automatically or manually. If you choose to automatically update the key version, then Azure Storage checks the key vault or managed HSM daily for a new version of the customer-managed key and automatically updates the key to the latest version. For more information about updating the key version for a customer-managed key, see [Update the key version](../common/customer-managed-keys-overview.md#update-the-key-version).

A storage account may have up to 10,000 encryption scopes protected with customer-managed keys for which the key version is automatically updated. If your storage account already has 10,000 encryption scopes that are protected with customer-managed keys, then the key version must be updated manually for any additional encryption scopes that are protected with customer-managed keys.  

After you have created an encryption scope, you can specify that encryption scope on a request to create a container or a blob. For more information about how to create an encryption scope, see [Create and manage encryption scopes](encryption-scope-manage.md).

## Create a container or blob with an encryption scope

Blobs that are created under an encryption scope are encrypted with the key specified for that scope. You can specify an encryption scope for an individual blob when you create the blob, or you can specify a default encryption scope when you create a container. When a default encryption scope is specified at the level of a container, all blobs in that container are encrypted with the key associated with the default scope.

When you create a blob in a container that has a default encryption scope, you can specify an encryption scope that overrides the default encryption scope if the container is configured to allow overrides of the default encryption scope. To prevent overrides of the default encryption scope, configure the container to deny overrides for an individual blob.

Read operations on a blob that belongs to an encryption scope happen transparently, so long as the encryption scope is not disabled.

## Disable an encryption scope

When you disable an encryption scope, any subsequent read or write operations made with the encryption scope will fail with HTTP error code 403 (Forbidden). If you re-enable the encryption scope, read and write operations will proceed normally again.

When an encryption scope is disabled, you are no longer billed for it. Disable any encryption scopes that are not needed to avoid unnecessary charges.

If your encryption scope is protected with customer-managed keys, then you can also delete the associated key in the key vault in order to disable the encryption scope. Keep in mind that customer-managed keys are protected by soft delete and purge protection in the key vault, and a deleted key is subject to the behavior defined for by those properties. For more information, see one of the following topics in the Azure Key Vault documentation:

- [How to use soft-delete with PowerShell](../../key-vault/general/key-vault-recovery.md)
- [How to use soft-delete with CLI](../../key-vault/general/key-vault-recovery.md)

> [!IMPORTANT]
> It is not possible to delete an encryption scope. To avoid unexpected costs, be sure to disable any encryption scopes that you do not currently need.

## Next steps

- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
- [Create and manage encryption scopes](encryption-scope-manage.md)
- [Customer-managed keys for Azure Storage encryption](../common/customer-managed-keys-overview.md)
- [What is Azure Key Vault?](../../key-vault/general/overview.md)