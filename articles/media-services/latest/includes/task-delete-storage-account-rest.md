---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Delete a storage account-->

Use the following request to delete a storage account.  Replace the `armEndpoint`, `subscription`, `resourceGroup`, and `storageName` values. 

```rest
DELETE https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}?api-version=2019-06-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
```