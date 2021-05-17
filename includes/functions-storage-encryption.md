---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/06/2020
ms.author: glenga
---
Azure Storage encrypts all data in a storage account at rest. For more information, see [Azure Storage encryption for data at rest](../articles/storage/common/storage-service-encryption.md).

By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of blob and file data. These keys must be present in Azure Key Vault for Functions to be able to access the storage account. To learn more, see [Encryption at rest using customer-managed keys](../articles/azure-functions/configure-encrypt-at-rest-using-cmk.md).  