---
title: Personalizer service encryption of data at rest
titleSuffix: Azure Cognitive Services
description: Personalizer service encryption of data at rest.
author: erindormier
manager: venkyv
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: egeaney
#Customer intent: As a user of the Personalizer service, I want to learn how encryption at rest works.
---

# Personalizer service encryption of data at rest

The Personalizer service automatically encrypts your data when persisted it to the cloud. The Personalizer service encryption protects your data and to help you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available on the E0 pricing tier. To request the ability to use customer-managed keys, fill out and submit the [Personalizer Service Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk). It will take approximately 3-5 business days to hear back on the status of your request. Depending on demand, you may be placed in a queue and approved as space becomes available. Once approved for using CMK with the Personalizer service, you will need to create a new Personalizer resource and select E0 as the Pricing Tier. Once your Personalizer resource with the E0 pricing tier is created, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../includes/cognitive-services-cmk-regions.md)]

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* [Personalizer Service Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)
