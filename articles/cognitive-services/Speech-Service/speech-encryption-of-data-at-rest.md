---
title: Speech service encryption of data at rest
titleSuffix: Azure Cognitive Services
description: Speech service encryption of data at rest.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 03/13/2020
ms.author: egeaney
#Customer intent: As a user of the Translator service, I want to learn how encryption at rest works.
---

# Speech service encryption of data at rest

Speech Service automatically encrypts your data when it is persisted it to the cloud. Speech service encryption protects your data and to help you to meet your organizational security and compliance commitments.

## About Cognitive Services encryption

Data is encrypted and decrypted using [FIPS 140-2](https://en.wikipedia.org/wiki/FIPS_140-2) compliant [256-bit AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption. Encryption and decryption are transparent, meaning encryption and access are managed for you. Your data is secure by default and you don’t need to modify your code or applications to take advantage of encryption.

## About encryption key management

When you use Custom Speech and Custom Voice, Speech service may store following data in the cloud:  

* Speech trace data - only if your turn the trace on for your custom endpoint
* Uploaded training and test data

By default, your data are stored in Microsoft’s storage and your subscription uses Microsoft-managed encryption keys. You also have an option to prepare your own storage account. Access to the store is managed by the Managed Identity, and Speech service cannot directly access to your own data, such as speech trace data, customization training data and custom models.

For more information about Managed Identity, see [What are managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

## Bring your own storage (BYOS) for customization and logging

To request access to bring your own storage, fill out and submit the [Speech service - bring your own storage (BYOS) request form](https://aka.ms/cogsvc-cmk). Once approved, you'll need to create your own storage account to store the data required for customization and logging. When adding a storage account, the Speech service resource will enable a system assigned managed identity. After the system assigned managed identity is enabled, this resource will be registered with Azure Active Directory (AAD). After being registered, the managed identity will be given access to the storage account. You can learn more about Managed Identities here. For more information about Managed Identity, see [What are managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

> [!IMPORTANT]
> If you disable system assigned managed identities, access to the storage account will be removed. This will cause the parts of the Speech service that require access to the storage account to stop working.  

## Regional availability

BYOS is currently available in these regions:

* US South Central
* West US 2
* East US

## Next steps

* [Speech service - bring your own storage (BYOS) request form](https://aka.ms/cogsvc-cmk)
* [What are managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).
