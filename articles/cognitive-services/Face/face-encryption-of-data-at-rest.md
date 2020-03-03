---
title: Encryption of data at rest for the Face service
titleSuffix: Azure Cognitive Services
description: Encryption of data at rest for the Face service.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 03/11/2020
ms.author: egeaney
#Customer intent: As a user of the Face service, I want to learn how encryption at rest works.
---

# Encryption of data at rest for the Face service

The Face service automatically encrypts your data when persisted it to the cloud. The Face service encryption protects your data and to help you to meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../../../includes/cognitive-services-about-encryption.md)]

To request the ability to use customer-managed keys, fill out and submit the [Face Service Customer-Managed Key Request Form](http://urltorequest). Once approved for using CMK with the Face service, you will need to create a new Face resource and select E0 as the Pricing Tier.

> [!IMPORTANT]
> Customer-managed keys are only available on the E0 pricing tier. You must fill out and submit the [Face Service Customer-Managed Key Request Form](http://urltorequest) to get access to the E0 pricing tier for your resource.

[!INCLUDE [cognitive-services-cmk](../../../includes/cognitive-services-cmk.md)]

## Next steps

* [Face Service Customer-Managed Key Request Form](http://urltorequest)
* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)


