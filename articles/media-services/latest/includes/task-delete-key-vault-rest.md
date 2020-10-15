---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Delete a Key Vault-->

Use the following request to delete a Key Vault.  Replace the `armEndpoint`, `subscription`, `resourceGroup`, and `keyVaultName` values. 

```rest
DELETE https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.KeyVault/vaults/{{keyVaultName}}?api-version=2018-02-14
Authorization: Bearer {{getArmToken.response.body.access_token}}
```