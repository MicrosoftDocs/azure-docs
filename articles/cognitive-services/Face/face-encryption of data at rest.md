---
title: Encryption of data at rest for the Face service
titleSuffix: Azure Cognitive Services
description: Encryption of data at rest for the Face service.
author: erindormier
manager: venkyv

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 02/21/2020
ms.author: egeaney
#Customer intent: As a user of the Face service, I want to learn how encryption at rest works.
---

# Encryption of data at rest for the Face service

The Face service automatically encrypts your data when it is persisted it to the cloud. The Face service encryption protects your data and to help you to meet your organizational security and compliance commitments.

## About the Face service encryption

Data in the Face service is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Encryption is enabled for all Face service subscriptions and cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of encryption.

## About encryption key management

By default, your Face subscription uses Microsoft-managed encryption keys. There is also an option to manage your Face subscription with your own keys. Customer-managed keys (CMK), also known as Bring your own key (BYOK), offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

To request the ability to use customer-managed keys, fill out and submit the [Face Service Customer-Managed Key Request Form](http://urltorequest). Once approved for using CMK with the Face service, you will need to create a new Face subscription using the CMK SKU <TODO: Need details for creating new SKU>.

## Customer-managed keys with Azure Key Vault

You must use Azure Key Vault to store your customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The storage account and the key vault must be in the same region and in the same Azure Active Directory (Azure AD) tenant, but they can be in different subscriptions. For more information about Azure Key Vault, see What is [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?

### Store customer-managed keys in Azure Key Vault

To enable customer-managed keys in the Face service, you must use an Azure Key Vault to store your keys. You must enable both the **Soft Delete** and **Do Not Purge** properties on the key vault.

Only RSA keys of size 2048 are supported with Azure Storage encryption. For more information about keys, see **Key Vault keys** in [About Azure Key Vault keys, secrets and certificates](https://docs.microsoft.com/azure/key-vault/about-keys-secrets-and-certificates#key-vault-keys).

### Rotate customer-managed keys

You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. When the key is rotated, you must update your Face subscription to use the new key URI. <TODO: what do customers need to do for rotation?>

Rotating the key does not trigger re-encryption of data in the storage account. There is no further action required from the user.

### Revoke access to customer-managed keys

To revoke access to customer-managed keys, use PowerShell or Azure CLI. For more information, see [Azure Key Vault PowerShell](https://docs.microsoft.com/powershell/module/az.keyvault//) or [Azure Key Vault CLI](https://docs.microsoft.com/cli/azure/keyvault). Revoking access effectively blocks access to all data in your Face subscription, as the encryption key is inaccessible by the Face service. <TODO: hat happens when key is revoked?>

## Next steps

* [Face Service Customer-Managed Key Request Form](http://urltorequest)
* [Learn more about Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)


