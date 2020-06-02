---
title: Content Moderator encryption of data at rest
titleSuffix: Azure Cognitive Services
description: Content Moderator encryption of data at rest.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: content-moderator
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

[!INCLUDE [cognitive-services-cmk](../includes/cognitive-services-cmk-regions.md)]

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Enable data encryption for your Content Moderator Team

To enable data encryption for your Content Moderator Review Team, see the [Quickstart: Try Content Moderator on the web](quick-start.md#create-a-review-team).  

> [!NOTE]
> You'll need to provide a _Resource ID_ with the Content Moderator E0 pricing tier.

## Next steps

* For a full list of services that support CMK, see [Customer-Managed Keys for Cognitive Services](../encryption/cognitive-services-encryption-keys-portal.md)
* [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
* [Cognitive Services Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)

