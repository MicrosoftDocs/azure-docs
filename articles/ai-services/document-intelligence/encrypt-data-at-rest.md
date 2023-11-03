---
title: Service encryption of data at rest - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Microsoft offers Microsoft-managed encryption keys, and also lets you manage your Azure AI services subscriptions with your own keys, called customer-managed keys (CMK). This article covers data encryption at rest for Document Intelligence, and how to enable and manage CMK. 
author: erindormier
manager: venkyv
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: egeaney
ms.custom: applied-ai-non-critical-form
monikerRange: '<=doc-intel-3.1.0'
---


# Document Intelligence encryption of data at rest

[!INCLUDE [applies to v3.1, v3.0, and v2.1](includes/applies-to-v3-1-v3-0-v2-1.md)]

Azure AI Document Intelligence automatically encrypts your data when persisting it to the cloud. Document Intelligence encryption protects your data to help you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../../ai-services/includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available resources created after 11 May, 2020. To use CMK with Document Intelligence, you will need to create a new Document Intelligence resource. Once the resource is created, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../../ai-services/includes/configure-customer-managed-keys.md)]

## Next steps

* [Learn more about Azure Key Vault](../../key-vault/general/overview.md)
