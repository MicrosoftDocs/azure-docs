---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Create storage account REST-->

Use the following request to create a storage account.  Replace the `armEndpoint`, `subscriptionId`, `resourceGroup`,`storageName`,and `resourceLocation` values. 

```rest

PUT https://{{armEndpoint}}/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}
    ?api-version=2019-06-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
    "sku": {
      "name": "Standard_GRS"
    },
    "kind": "StorageV2",
    "location": "{{resourceLocation}}"
}

```
