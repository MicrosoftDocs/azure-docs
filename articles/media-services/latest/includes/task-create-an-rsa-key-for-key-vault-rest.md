---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Create an RSA key for key vault-->

Use the following request to get a token for Key Vault.  Replace the `keyVaultName`, `keyVaultDomainSuffix`, and `keyName` values. 

```rest

POST https://{{keyVaultName}}.{{keyVaultDomainSuffix}}/keys/{{keyName}}/create?api-version=7.0
Authorization: Bearer {{getKeyVaultToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
  "kty": "RSA",
  "key_size": 2048,
  "attributes": {
    "enabled": true
  }
}

```
