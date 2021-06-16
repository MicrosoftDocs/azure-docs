---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI
---

<!-- Create a resource group -->

Use the following command to create a resource group. Change `your-resource-group-name` to the what you want to name your resource group.

Change `your-region` to the geographic region that will be used to store the media and metadata records for your Media Services account. This region will be used to process and stream your media.

```azurecli-interactive
az group create --name <your-resource-group-name> --location <your-region>
```

Example JSON response:

```json
{
  "id": "/subscriptions/00000000-0000-0000-000000000000/resourceGroups/your-resource-group-name",
  "location": "your-region",
  "managedBy": null,
  "name": "your-resource-group-name",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```
