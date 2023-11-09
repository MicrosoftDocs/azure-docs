---
title: Service encryption of data at rest - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Microsoft offers Microsoft-managed encryption keys, and also lets you manage your Azure AI services subscriptions with your own keys, called customer-managed keys (CMK). This article covers data encryption at rest for Document Intelligence, and how to enable and manage CMK.
author: erindormier
manager: venkyv
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: egeaney
ms.custom: applied-ai-non-critical-form
monikerRange: '<=doc-intel-4.0.0'
---


# Document Intelligence encryption of data at rest

[!INCLUDE [applies to v4.0, v3.1, v3.0, and v2.1](includes/applies-to-v40-v31-v30-v21.md)]

> [!IMPORTANT]
>
> * Earlier versions of customer managed keys only encrypted your models.
> *Starting with the  ```07/31/2023``` release, all new resources use customer managed keys to encrypt both the models and document results.
> To upgrade an existing service to encrypt both the models and the data, simply disable and reenable the customer managed key.

Azure AI Document Intelligence automatically encrypts your data when persisting it to the cloud. Document Intelligence encryption protects your data to help you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../../ai-services/includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available resources created after 11 May, 2020. To use CMK with Document Intelligence, you will need to create a new Document Intelligence resource. Once the resource is created, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../../ai-services/includes/configure-customer-managed-keys.md)]

## Next steps

* [Document Intelligence Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
* [Learn more about Azure Key Vault](../../key-vault/general/overview.md)
