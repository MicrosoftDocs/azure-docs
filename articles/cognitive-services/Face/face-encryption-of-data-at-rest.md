---
title: Face service encryption of data at rest
titleSuffix: Azure Cognitive Services
description: Face service encryption of data at rest.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: egeaney
#Customer intent: As a user of the Face service, I want to learn how encryption at rest works.
---

# Face service encryption of data at rest

The Face service automatically encrypts your data when persisted it to the cloud. The Face service encryption protects your data and to help you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available on the E0 pricing tier. To request the ability to use customer-managed keys, fill out and submit the [Face Service Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk). It will take approximately 3-5 business days to hear back on the status of your request. Depending on demand, you may be placed in a queue and approved as space becomes available. Once approved for using CMK with the Face service, you will need to create a new Face resource and select E0 as the Pricing Tier. Once your Face resource with the E0 pricing tier is created, you can use Azure Key Vault to set up your managed identity.

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
