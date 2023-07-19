---
title: Face service encryption of data at rest
titleSuffix: Azure AI services
description: Microsoft offers Microsoft-managed encryption keys, and also lets you manage your Azure AI services subscriptions with your own keys, called customer-managed keys (CMK). This article covers data encryption at rest for Face, and how to enable and manage CMK. 
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 08/28/2020
ms.author: egeaney
ms.custom: cogserv-non-critical-vision
#Customer intent: As a user of the Face service, I want to learn how encryption at rest works.
---

# Face service encryption of data at rest

The Face service automatically encrypts your data when persisted to the cloud. The Face service encryption protects your data and helps you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available on the E0 pricing tier. To request the ability to use customer-managed keys, fill out and submit the [Face Service Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk). It will take approximately 3-5 business days to hear back on the status of your request. Depending on demand, you may be placed in a queue and approved as space becomes available. Once approved for using CMK with the Face service, you will need to create a new Face resource and select E0 as the Pricing Tier. Once your Face resource with the E0 pricing tier is created, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* For a full list of services that support CMK, see [Customer-Managed Keys for Azure AI services](../encryption/cognitive-services-encryption-keys-portal.md)
* [What is Azure Key Vault](../../key-vault/general/overview.md)?
* [Azure AI services Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
