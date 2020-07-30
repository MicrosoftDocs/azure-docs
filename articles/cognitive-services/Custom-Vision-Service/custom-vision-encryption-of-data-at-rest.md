---
title: Custom Vision encryption of data at rest
titleSuffix: Azure Cognitive Services
description: Custom Vision encryption of data at rest.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: egeaney
#Customer intent: As a user of the Face service, I want to learn how encryption at rest works.
---

# Custom Vision encryption of data at rest

Azure Custom Vision automatically encrypts your data when persisted it to the cloud. Custom Vision encryption protects your data and to help you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available resources created after 11 May, 2020. To use CMK with Custom Vision, you will need to create a new Custom Vision resource. Once the resource is created, you can use Azure Key Vault to set up your managed identity.

## Regional availability

Customer-managed keys are currently available in these regions:

* US South Central
* West US 2
* East US
* US Gov Virginia

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* For a full list of services that support CMK, see [Customer-Managed Keys for Cognitive Services](../encryption/cognitive-services-encryption-keys-portal.md)
* [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
* [Cognitive Services Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
