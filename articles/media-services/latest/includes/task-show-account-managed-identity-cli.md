---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 05/13/2021
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!--Show Media Services Managed Identity CLI-->

This command shows all of the properties of a Media Services account.

```azurecli-interactive
az ams account show --name your-media-services-account-name --resource-group your-resource-group
```

The command returns:

```json
{
  "encryption": {
    "keyVaultProperties": null,
    "type": "SystemKey"
  },
  "id": "/subscriptions/00000000-0000-0000-000000000000/resourceGroups/mediatest1rg/providers/Microsoft.Media/mediaservices/your-media-services-account-name",
  "identity": {
    "principalId": "00000000-0000-0000-0000-000000000000",
    "tenantId": "the-tenant-id",
    "type": "SystemAssigned"
  },
  "location": "West US 2",
  "mediaServiceId": "the-media-service-id",
  "name": "your-media-services-account-name",
  "resourceGroup": "your-resource-group-name",
  "storageAccounts": [
    {
      "id": "/subscriptions/00000000-0000-0000-000000000000/resourceGroups/your-resource-group-name/providers/Microsoft.Storage/storageAccounts/your-storage-account-name",
      "resourceGroup": "your-resource-group-name",
      "type": "Primary"
    }
  ],
  "storageAuthentication": "System",
  "systemData": {
    "createdAt": "2021-05-14T21:25:12.3492071Z",
    "createdBy": "your@email.address",
    "createdByType": "User",
    "lastModifiedAt": "2021-05-14T21:25:12.3492071Z",
    "lastModifiedBy": "your@email.address",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "Microsoft.Media/mediaservices"
}
```