---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Create a media services account with managed identity-->

Use the following request to create a Media Services account with Managed Identity.  Replace the `armEndpoint`, `subscription`, `resourceGroup`,`accountName` and `resourceLocation` values. 

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
        "id": "{{getStorageAccount.response.body.id}}"
      }
    ]
  },
  "location": "{{resourceLocation}}"
}

```
