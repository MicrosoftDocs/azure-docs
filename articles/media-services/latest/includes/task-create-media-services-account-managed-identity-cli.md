---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!--Create a media services account -->

The following Azure CLI command creates a new Media Services account. You can replace the following values: `your-media-services-account-name`  `your-storage-account-name`, and `your-resource-group-name`. The command assumes that you have already created a resource group and a Storage account. The command gives the Media Services account a system assigned managed identity.

<!--<Command>-->
```azurecli-interactive

az ams account create --name your-media-services-account-name --resource-group your-resource-group-name --mi-system-assigned --storage-account your-storage-account-name

```
<!--</Command>-->

<!--<Return>-->
The command returns:

```json
{
  "encryption": {
    "keyVaultProperties": null,
    "type": "SystemKey"
  },
  "id": "/subscriptions/2b461b25-f7b4-4a22-90cc-d640a14b5471/resourceGroups/mediatest1rg/providers/Microsoft.Media/mediaservices/mediatest1acc",
  "identity": {
    "principalId": "f3af19d6-9e0f-47ea-98ae-34906266369c",
    "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47",
    "type": "SystemAssigned"
  },
  "location": "West US 2",
  "mediaServiceId": "fe043372-1929-4325-b76f-aa910e81537b",
  "name": "mediatest1acc",
  "resourceGroup": "mediatest1rg",
  "storageAccounts": [
    {
      "id": "/subscriptions/2b461b25-f7b4-4a22-90cc-d640a14b5471/resourceGroups/mediatest1rg/providers/Microsoft.Storage/storageAccounts/mediatest1stor",
      "resourceGroup": "mediatest1rg",
      "type": "Primary"
    }
  ],
  "storageAuthentication": "System",
  "systemData": {
    "createdAt": "2021-05-14T21:25:12.3492071Z",
    "createdBy": "inhenkel@microsoft.com",
    "createdByType": "User",
    "lastModifiedAt": "2021-05-14T21:25:12.3492071Z",
    "lastModifiedBy": "inhenkel@microsoft.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "Microsoft.Media/mediaservices"
}
```
<!--</Return>-->
