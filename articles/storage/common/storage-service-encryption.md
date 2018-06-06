---
title: Azure Storage Service Encryption for Data at Rest | Microsoft Docs
description: Use the Azure Storage Service Encryption feature to encrypt Azure Blob storage on the service side when storing the data, and decrypt it when retrieving the data.
services: storage
author: lakasa
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 03/14/2018
ms.author: lakasa

---
# Azure Storage Service Encryption for Data at Rest

Azure Storage Service Encryption for Data at Rest helps you protect your data to meet your organizational security and compliance commitments. With this feature, Azure Storage automatically encrypts your data before persisting it to Azure Storage, and decrypts the data before retrieval. The handling of encryption, encryption at rest, decryption, and key management in Storage Service Encryption is transparent to users. All data written to Azure Storage is encrypted through 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available.

Storage Service Encryption is enabled for all new and existing storage accounts and cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of Storage Service Encryption.

The feature automatically encrypts data in:

- Both performance tiers (Standard and Premium).
- Both deployment models (Azure Resource Manager and classic).
- All of the Azure Storage services (Blob storage, Queue storage, Table storage, and Azure Files). 

Storage Service Encryption does not affect Azure Storage performance.

You can use Microsoft-managed encryption keys with Storage Service Encryption, or you can use your own encryption keys. For more information about using your own keys, see [Storage Service Encryption using customer-managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md).

## View encryption settings in the Azure portal

To view settings for Storage Service Encryption, sign in to the [Azure portal](https://portal.azure.com) and select a storage account. In the **SETTINGS** pane, select the **Encryption** setting.

![Portal screenshot showing the Encryption setting](./media/storage-service-encryption/image1.png)

## FAQ for Storage Service Encryption

**Q: I have a classic storage account. Can I enable Storage Service Encryption on it?**

A: Storage Service Encryption is enabled by default for all storage accounts (classic and Resource Manager).

**Q: How can I encrypt data in my classic storage account?**

A: With encryption enabled by default, Azure Storage automatically encrypts your new data. 

**Q: I have a Resource Manager storage account. Can I enable Storage Service Encryption on it?**

A: Storage Service Encryption is enabled by default on all existing Resource Manager storage accounts. This is supported for Blob storage, Table storage, Queue storage, and Azure Files. 

**Q: How do I encrypt the data in a Resource Manager storage account?**

A: Storage Service Encryption is enabled by default for all storage accounts--classic and Resource Manager, any existing files in the storage account created before encryption was enabled will retroactively get encrypted by a background encryption process.

**Q: Can I create storage accounts with Storage Service Encryption enabled by using Azure PowerShell and Azure CLI?**

A: Storage Service Encryption is enabled by default at the time of creating any storage account (classic or Resource Manager). You can verify account properties by using both Azure PowerShell and Azure CLI.

**Q: How much more does Azure Storage cost if Storage Service Encryption is enabled?**

A: There is no additional cost.

**Q: Can I use my own encryption keys?**

A: Yes, you can use your own encryption keys. For more information, see [Storage Service Encryption using customer-managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md).

**Q: Can I revoke access to the encryption keys?**

A: Yes, if you [use your own encryption keys](storage-service-encryption-customer-managed-keys.md) in Azure Key Vault.

**Q: Is Storage Service Encryption enabled by default when I create a storage account?**

A: Yes, Storage Service Encryption is enabled by default for all storage accounts and for all Azure Storage services.

**Q: How is this different from Azure Disk Encryption?**

A: Azure Disk Encryption is used to encrypt OS and data disks in IaaS VMs. For more information, see the [Storage security guide](../storage-security-guide.md).

**Q: What if I enable Azure Disk Encryption on my data disks?**

A: This will work seamlessly. Both methods will encrypt your data.

**Q: My storage account is set up to be replicated geo-redundantly. With Storage Service Encryption, will my redundant copy also be encrypted?**

A: Yes, all copies of the storage account are encrypted. All redundancy options are supported--locally redundant storage, zone-redundant storage, geo-redundant storage, and read-access geo-redundant storage.

**Q: Can I disable encryption on my storage account?**

A: Encryption is enabled by default, and there is no provision to disable encryption for your storage account. 

**Q: Is Storage Service Encryption permitted only in specific regions?**

A: Storage Service Encryption is available in all regions for all services. 

**Q: How do I contact someone if I have any problems or want to provide feedback?**

A: Contact [ssediscussions@microsoft.com](mailto:ssediscussions@microsoft.com) for any problems or feedback related to Storage Service Encryption.

## Next steps
Azure Storage provides a comprehensive set of security capabilities that together help developers build secure applications. For more information, see the [Storage security guide](../storage-security-guide.md).
