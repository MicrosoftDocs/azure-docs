---
title: Content Moderator encryption of data at rest
titleSuffix: Azure AI services
description: Content Moderator encryption of data at rest.
author: erindormier
manager: nitinme
ms.service: azure-ai-content-moderator
ms.topic: conceptual
ms.date: 03/13/2020
ms.author: egeaney
#Customer intent: As a user of the Content Moderator service, I want to learn how encryption at rest works.
---

# Content Moderator encryption of data at rest

Content Moderator automatically encrypts your data when it is persisted to the cloud, helping to meet your organizational security and compliance goals.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available on the E0 pricing tier. To request the ability to use customer-managed keys, fill out and submit the [Content Moderator Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk). It will take approximately 3-5 business days to hear back on the status of your request. Depending on demand, you may be placed in a queue and approved as space becomes available. Once approved for using CMK with the Content Moderator service, you will need to create a new Content Moderator resource and select E0 as the Pricing Tier. Once your Content Moderator resource with the E0 pricing tier is created, you can use Azure Key Vault to set up your managed identity.

Customer-managed keys are available in all Azure regions.

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* For a full list of services that support CMK, see [Customer-Managed Keys for Azure AI services](../encryption/cognitive-services-encryption-keys-portal.md)
* [What is Azure Key Vault](../../key-vault/general/overview.md)?
* [Azure AI services Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
