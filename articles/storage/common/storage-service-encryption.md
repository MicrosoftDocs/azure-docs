---
title: Azure Storage Service Encryption for Data at Rest | Microsoft Docs
description: Use the Azure Storage Service Encryption feature to encrypt your Azure Blob Storage on the service side when storing the data, and decrypt it when retrieving the data.
services: storage
author: lakasa
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 03/06/2018
ms.author: lakasa

---
# Azure Storage Service Encryption for Data at Rest

Azure Storage Service Encryption (SSE) for Data at Rest helps you protect and safeguard your data to meet your organizational security and compliance commitments. With this feature, Azure Storage automatically encrypts your data prior to persisting it to Azure Storage, and decrypts it prior to retrieval. The handling encryption, encryption at rest, decryption, and key management provided by SSE are transparent to users. All data written to Azure Storage is encrypted using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available.

SSE is enabled for all new and existing storage accounts and cannot be disabled. Because your data is secured by default, you do not need to modify your code or applications to take advantage of SSE. For more information, see [Announcing Default Encryption for Azure Blobs, Files, Table and Queue Storage](https://azure.microsoft.com/blog/announcing-default-encryption-for-azure-blobs-files-table-and-queue-storage/).

 SSE automatically encrypts data in all performance tiers (Standard and Premium), all deployment models (Azure Resource Manager and Classic), and all of the Azure Storage services (Blob, Queue, Table, and File). 

You can use Microsoft-managed encryption keys with SSE or you can use your own encryption keys. For more information about using your own keys, see [Storage Service Encryption using customer managed keys in Azure Key Vault](storage-service-encryption-customer-managed-keys.md).

## View encryption settings in the Azure portal

To view settings for Storage Service Encryption, log into the [Azure portal](https://portal.azure.com) and select a storage account. On the **Settings** blade, click on the Encryption setting.

![Portal Screenshot showing Encryption option](./media/storage-service-encryption/image1.png)

## FAQ for Storage Service Encryption

**Q: I have an existing classic storage account. Can I enable SSE on it?**

A: SSE is enabled by default for all storage accounts (Classic and Resource Manager storage accounts).

**Q: How can I encrypt data in my classic storage account?**

A: With encryption enabled by default, your new data is automatically encrypted by the storage service. 

**Q: I have an existing Resource Manager storage account. Can I enable SSE on it?**

A: SSE is enabled by default on all existing Resource Manager storage accounts. This is supported for Blobs, Tables, File, and Queue storage. 

**Q: I would like to encrypt the current data in an existing Resource Manager storage account?**

A: With SSE enabled by default for all storage accounts - Classic and Resource Manager storage accounts. However, data that were already present will not be encrypted. To encrypt existing data, you can copy them to another name or another container and then remove the unencrypted versions. 

**Q: Can I create new storage accounts with SSE enabled using Azure PowerShell and Azure CLI?**

A: SSE is enabled by default at the time of creating any storage account (Classic and Resource Manager accounts). You can verify account properties using both Azure PowerShell and Azure CLI.

**Q: How much more does Azure Storage cost if SSE is enabled?**

A: There is no additional cost.

**Q: Who manages the encryption keys?**

A: The keys are managed by Microsoft.

**Q: Can I use my own encryption keys?**

A: We are working on providing capabilities for customers to bring their own encryption keys.

**Q: Can I revoke access to the encryption keys?**

A: Not at this time; the keys are fully managed by Microsoft.

**Q: Is SSE enabled by default when I create a new storage account?**

A: Yes, SSE using Microsoft Managed keys is enabled by default for all storage accounts - Azure Resource Manager and Classic storage accounts. It is enabled for all services as well - Blob, Table, Queue, and File storage.

**Q: How is this different from Azure Disk Encryption?**

A: Azure Disk Encryption is used to encrypt OS and Data disks in IaaS VMs. For more details, please visit our [Storage Security Guide](../storage-security-guide.md).

**Q: What if I enable Azure Disk Encryption on my data disks?**

A: This will work seamlessly. Your data will be encrypted by both methods.

**Q: My storage account is set up to be replicated geo-redundantly. With SSE, will my redundant copy also be encrypted?**

A: Yes, all copies of the storage account are encrypted, and all redundancy options – Locally Redundant Storage (LRS), Zone-Redundant Storage (ZRS), Geo-Redundant Storage (GRS), and Read Access Geo-Redundant Storage (RA-GRS) – are supported.

**Q: I can't disable encryption on my storage account.**

A: Encryption is enabled by default and there is no provision to disable encryption for your storage account. 

**Q: Is SSE only permitted in specific regions?**

A: The SSE is available in all regions for all services. 

**Q: How do I contact someone if I have any issues or want to provide feedback?**

A: Contact [ssediscussions@microsoft.com](mailto:ssediscussions@microsoft.com) for any issues related to Storage Service Encryption.

## Next Steps
Azure Storage provides a comprehensive set of security capabilities, which together enable developers to build secure applications. For more details, visit the [Storage Security Guide](../storage-security-guide.md).
