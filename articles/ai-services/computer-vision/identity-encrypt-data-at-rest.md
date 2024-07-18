---
title: Face service encryption of data at rest
titleSuffix: Azure AI services
description: Microsoft offers Microsoft-managed encryption keys, and also lets you manage your Azure AI services subscriptions with your own keys, called customer-managed keys (CMK). This article covers data encryption at rest for Face, and how to enable and manage CMK. 
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: conceptual
ms.date: 02/27/2024
ms.author: pafarley
ms.custom: cogserv-non-critical-vision
#Customer intent: As a user of the Face service, I want to learn how encryption at rest works.
---

# Face service encryption of data at rest

The Face service automatically encrypts your data when it's persisted to the cloud. That encryption protects your data and helps you meet your organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* For a full list of services that support CMK, see [Customer-Managed Keys for Azure AI services](../encryption/cognitive-services-encryption-keys-portal.md)
* [What is Azure Key Vault?](../../key-vault/general/overview.md)?

