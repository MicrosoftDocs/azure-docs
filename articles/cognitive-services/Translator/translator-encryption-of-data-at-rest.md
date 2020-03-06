---
title: Translator encryption of data at rest
titleSuffix: Azure Cognitive Services
description: Translator encryption of data at rest.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: egeaney
#Customer intent: As a user of the Translator service, I want to learn how encryption at rest works.
---

# Translator encryption of data at rest

Translator automatically encrypts your data when it is persisted to the cloud, helping to meet your organizational security and compliance goals.

[!INCLUDE [cognitive-services-about-encryption](../../../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are available for all pricing tiers for the Translator service. 

Follow these steps to enable customer-managed keys for Translator:

1. Create your new regional Translator Text or regional Cognitive Services resource. This will not work with a global resource.
2. Enabled Managed Identity in the Azure portal, and add your customer-managed key information.
3. Create a new workspace in Custom Translator and associate this subscription information. 

[!INCLUDE [cognitive-services-cmk](../../../includes/cognitive-services-cmk.md)]

## Next steps

* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)