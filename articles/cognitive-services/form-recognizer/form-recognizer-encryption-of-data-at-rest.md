---
title: Form Recognizer service encryption of data at rest
titleSuffix: Azure Cognitive Services
description: Microsoft offers Microsoft-managed encryption keys, and also lets you manage your Cognitive Services subscriptions with your own keys, called customer-managed keys (CMK). This article covers data encryption at rest for Form Recognizer, and how to enable and manage CMK. 
author: erindormier
manager: venkyv
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/10/2020
ms.author: egeaney
#Customer intent: As a user of the Form Recognizer service, I want to learn how encryption at rest works.
---

# Form Recognizer encryption of data at rest

Azure Form Recognizer automatically encrypts your data when persisted it to the cloud. Form Recognizer encryption protects your data and to help you to meet your organizational security and compliance commitments.

## About Cognitive Services encryption

Data is encrypted and decrypted using [FIPS 140-2](https://en.wikipedia.org/wiki/FIPS_140-2) compliant [256-bit AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption. Encryption and decryption are transparent, meaning encryption and access are managed for you. Your data is secure by default and you don't need to modify your code or applications to take advantage of encryption.

## About encryption key management

By default, your subscription uses Microsoft-managed encryption keys. There is also the option to manage your subscription with your own keys called customer-managed keys (CMK). CMK offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data. If CMK is configured for your subscription, double encryption is provided, which offers a second layer of protection, while allowing you to control the encryption key through your Azure Key Vault.

> [!IMPORTANT]
> Customer-managed keys are only available resources created after 11 May, 2020. To use CMK with Form Recognizer, you will need to create a new Form Recognizer resource. Once the resource is created, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../includes/cognitive-services-cmk-regions.md)]

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* [Form Recognizer Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)