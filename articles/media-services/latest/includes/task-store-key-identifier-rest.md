---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Store a key identifier-->

Use the following to store the key identifier.  Replace the `keyVaultName`, `keyVaultDomainSuffix`, and `keyName` values. 

```rest

@keyIdentifier = https://{{keyVaultName}}.{{keyVaultDomainSuffix}}/keys/{{keyName}}

```
