---
 title: include file
 description: include file
 services: cognitive-services
 author: erindormier
 ms.service: cognitive-services
 ms.topic: include
 ms.date: 03/11/2020
 ms.author: egeaney
 ms.custom: include
---

## About Cognitive Services encryption

Data is encrypted and decrypted using [FIPS 140-2](https://en.wikipedia.org/wiki/FIPS_140-2) compliant [256-bit AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption. Encryption and decryption are transparent, meaning encryption and access are managed for you. Your data is secure by default and you don’t need to modify your code or applications to take advantage of encryption.

## About encryption key management

By default, your subscription uses Microsoft-managed encryption keys. If you are using a pricing tier that supports Customer-managed keys, you can see the encryption settings for your resource in the **Encryption** section of the [Azure portal](https://portal.azure.com), as shown in the following image.

![View Encryption settings](../articles/cognitive-services/media/cognitive-services-encryption/encryptionblade.png)

For subscriptions that only support Microsoft-managed encryption keys, you will not have an **Encryption** section.

## Customer-managed keys with Azure Key Vault

There is also an option to manage your subscription with your own keys. Customer-managed keys (CMK), also known as Bring your own key (BYOK), offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.
