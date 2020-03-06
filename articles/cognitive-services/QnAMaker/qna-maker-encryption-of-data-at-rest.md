---
title: Encryption of data at rest for the QnA Maker service
titleSuffix: Azure Cognitive Services
description: Encryption of data at rest for the QnA Maker service.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: egeaney
#Customer intent: As a user of the QnA Maker service, I want to learn how encryption at rest works.
---

# Encryption of data at rest for the QnA Maker

QnA Maker automatically encrypts your data when it is persisted to the cloud, helping to meet your organizational security and compliance goals.

## About encryption key management

By default, your subscription uses Microsoft-managed encryption keys. There is also an option to manage your subscription with your own keys. Customer-managed keys (CMK) offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

QnA Maker uses CMK support from Azure search. You need to create [CMK in Azure Search using Azure Key Vault](https://docs.microsoft.com/azure/search/search-security-manage-encryption-keys). This Azure instance should be associated with QnA Maker service to make it CMK enabled. 

> [!IMPORTANT]
> Your Azure Search service resource must have been created after January 2019 and cannot be in the free (shared) tier. There is no support to configure customer-managed keys in the Azure portal.

## Enable customer-managed keys

The QnA Maker service uses CMK from the Azure Search service. Follow these steps to enable CMKs:

1. Create a new Azure Search instance and enable the prerequisites mentioned in the [customer-managed key prerequisites for Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-security-manage-encryption-keys#prerequisites).

   ![View Encryption settings](../cognitive-services/media/cognitive-services-encryption/qna-encryption-1.png)

2. When you create a QnA Maker resource, it's automatically associated with an Azure Search instance. This cannot be used with CMK. To use CMK, you'll need to associate your newly created instance of Azure Search that was created in step 1. Specifically, you'll need to update the `AzureSearchAdminKey` and `AzureSearchName` in your QnA Maker resource.

   ![View Encryption settings](../cognitive-services/media/cognitive-services-encryption/qna-encryption-2.png)

3. Next, create a new application setting:
   * **Name**: Set this to `CustomerManagedEncryptionKeyUrl`
   * **Value**: This is the value that you got in Step 1 when creating your Azure Search instance.

   ![View Encryption settings](../cognitive-services/media/cognitive-services-encryption/qna-encryption-3.png)

4. When finished, restart the runtime. Now your QnA Maker service is CMK-enabled.


## Next steps

* [Encryption in Azure Search using CMKs in Azure Key Vault](https://docs.microsoft.com/en-US/azure/search/search-security-manage-encryption-keys)
* [Data encryption at rest](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest)
* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)