---
title: Form Recognizer service encryption of data at rest
titleSuffix: Azure Cognitive Services
description: Form Recognizer encryption of data at rest.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: egeaney
#Customer intent: As a user of the Form Recognizer service, I want to learn how encryption at rest works.
---

# Form Recognizer encryption of data at rest

Azure Form Recognizer automatically encrypts your data when persisted it to the cloud. Form Recognizer encryption protects your data and to help you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available resources created after 11 May, 2020. To use CMK with Form Recognizer, you will need to create a new Form Recognizer resource. Once the resource is created, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../includes/cognitive-services-cmk-regions.md)]

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* [Form Recognizer Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)


