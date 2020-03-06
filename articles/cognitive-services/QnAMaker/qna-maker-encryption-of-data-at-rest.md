---
title: Encryption of data at rest for the QnA Maker service
titleSuffix: Azure Cognitive Services
description: Encryption of data at rest for the QnA Maker service.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: egeaney
#Customer intent: As a user of the QnA Maker service, I want to learn how encryption at rest works.
---

# Encryption of data at rest for the QnA Maker

QnA Maker automatically encrypts your data when it is persisted to the cloud, helping to meet your organizational security and compliance goals.

[!INCLUDE [cognitive-services-about-encryption](../../../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available on the E0 pricing tier. To request the ability to use customer-managed keys, fill out and submit the [QnA Maker Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk). Once approved for using CMK with the QnA Maker service, you will need to create a new QnA Maker resource and select E0 as the Pricing Tier. Once your QnA Maker resource with the E0 pricing tier is created, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../../../includes/cognitive-services-cmk.md)]

## Next steps

* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)