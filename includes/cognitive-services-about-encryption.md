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

Data is encrypted and decrypted transparently using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. Encryption is enabled for all Cognitive Services resources and cannot be disabled. Because your data is secured by default, you don't need to modify your code or applications to take advantage of encryption.

## About encryption key management

By default, your subscription uses Microsoft-managed encryption keys. There is also an option to manage your subscription with your own keys. Customer-managed keys (CMK), also known as Bring your own key (BYOK), offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.
