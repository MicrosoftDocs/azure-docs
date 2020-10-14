---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Update media services to use a customer managed key-->

Use the following request to tell media services to use a customer managed key.  Replace the `armEndPoint`, `subscription`, `resourceGroup`, `accountName`, `keyIdentifier` and `resourceLocation` values. 

```rest

PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Media/mediaservices/{{accountName}}
    ?api-version=2020-05-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
  "identity": {
    "type": "SystemAssigned"
  },
  "properties": {
    "storageAccounts": [
      {
        "id": "{{getStorageAccountStatus.response.body.id}}"
      }
    ],
    "encryption": {
      "type": "CustomerKey",
      "keyVaultProperties": {
        "keyIdentifier": "{{keyIdentifier}}"
      }
    }
  },
  "location": "{{resourceLocation}}"
}

```
