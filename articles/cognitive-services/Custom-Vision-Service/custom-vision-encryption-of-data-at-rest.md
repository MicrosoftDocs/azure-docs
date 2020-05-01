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

[!INCLUDE [cognitive-services-about-encryption](../../../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available on the E0 pricing tier. To request the ability to use customer-managed keys, fill out and submit the [Custom Vision Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk). It will take approximately 3-5 business days to hear back on the status of your request. Depending on demand, you may be placed in a queue and approved as space becomes available. Once approved for using CMK with Custom Vision, you will need to create a new Custom Vision resource and select E0 as the Pricing Tier. Once your resource with the E0 pricing tier is created, you can use Azure Key Vault to set up your managed identity.

### Regional availability

Customer-managed keys are currently available in these regions:

* US South Central
* West US 2
* East US
* US Gov Virginia

[!INCLUDE [cognitive-services-cmk](../../../includes/cognitive-services-cmk.md)]

## Next steps

* [Custom Vision Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)


