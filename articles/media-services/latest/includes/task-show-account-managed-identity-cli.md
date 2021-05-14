---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 05/13/2021
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!--Show Media Services Managed Identity CLI-->

```azurecli-interactive
az ams account show --name your-media-services-account-name --resource-group your-resource-group
```

The command returns:

```json
{
  "id": "/subscriptions/the-subscription-id/resourceGroups/your-resource-group-name/providers/Microsoft.Media/mediaservices/your-media-services-account-name",
  "location": "West US 2",
  "mediaServiceId": "00000000-000-0000-0000-000000000000",
  "name": "your-media-services-account-name",
  "resourceGroup": "your-resource-group-name",
  "storageAccounts": [
    {
      "id": "/subscriptions/the-subscription-id/resourceGroups/your-resource-group-name/providers/Microsoft.Storage/storageAccounts/your-storage-account-name",
      "resourceGroup": "your-resource-group-name",
      "type": "Primary"
    }
  ],
  "tags": null,
  "type": "Microsoft.Media/mediaservices"
}
```