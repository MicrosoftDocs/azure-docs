---
 title: include file
 description: include file
 services: cognitive-services
 author: erindormier
 ms.service: azure-ai-services
 ms.topic: include
 ms.date: 03/11/2020
 ms.author: egeaney
 ms.custom: include
---

## About Azure AI services encryption

Data is encrypted and decrypted using [FIPS 140-2](https://en.wikipedia.org/wiki/FIPS_140-2)-compliant [256-bit AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption. Encryption and decryption are transparent, meaning encryption and access are managed for you. Your data is secure by default. You don't need to modify your code or applications to take advantage of encryption.

## About encryption key management

By default, your subscription uses Microsoft-managed encryption keys. You can also manage your subscription with your own keys, which are called customer-managed keys. When you use customer-managed keys, you have greater flexibility in the way you create, rotate, disable, and revoke access controls. You can also audit the encryption keys that you use to protect your data. If customer-managed keys are configured for your subscription, double encryption is provided. With this second layer of protection, you can control the encryption key through your Azure Key Vault.
