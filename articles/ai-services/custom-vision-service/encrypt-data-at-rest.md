---
title: Custom Vision encryption of data at rest
titleSuffix: Azure AI services
description: Microsoft offers Microsoft-managed encryption keys, and also lets you manage your Azure AI services subscriptions with your own keys, called customer-managed keys (CMK). This article covers data encryption at rest for Custom Vision, and how to enable and manage CMK. 
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: conceptual
ms.date: 08/28/2020
ms.author: egeaney
ms.custom: cogserv-non-critical-vision
#Customer intent: As a user of the Face service, I want to learn how encryption at rest works.
---

# Custom Vision encryption of data at rest

Azure AI Custom Vision automatically encrypts your data when persisted it to the cloud. Custom Vision encryption protects your data and to help you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available resources created after 11 May, 2020. To use CMK with Custom Vision, you will need to create a new Custom Vision resource. Once the resource is created, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* For a full list of services that support CMK, see [Customer-Managed Keys for Azure AI services](../encryption/cognitive-services-encryption-keys-portal.md)
* [What is Azure Key Vault](../../key-vault/general/overview.md)?
* [Azure AI services Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
