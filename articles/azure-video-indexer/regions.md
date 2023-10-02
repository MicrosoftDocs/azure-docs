---
title: Regions in which Azure AI Video Indexer is available  
description: This article talks about Azure regions in which Azure AI Video Indexer is available.
ms.topic: article
ms.date: 09/14/2020
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Azure regions in which Azure AI Video Indexer exists

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

Azure AI Video Indexer APIs contain a **location** parameter that you should set to the Azure region to which the call should be routed. This must be an [Azure region in which Azure AI Video Indexer is available](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services&regions=all).

## Locations

The `location` parameter must be given the Azure region code name as its value. If you are using Azure AI Video Indexer in preview mode, you should put `"trial"` as the value. `trial` is the default value for the `location` parameter. Otherwise, to get the code name of the Azure region that your account is in and that your call should be routed to, you can use the Azure portal or run a [Azure CLI](/cli/azure) command.

### Azure portal

1. Sign in on the [Azure AI Video Indexer](https://www.videoindexer.ai/) website.
1. Select **User accounts** from the top-right corner of the page.
1. Find the location of your account in the top-right corner.  

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/location/location1.png" alt-text="Location":::
    
###  CLI command

```azurecli-interactive
az account list-locations
```

Once you run the line shown above, you get a list of all Azure regions. Navigate to the Azure region that has the *displayName* you are looking for, and use its *name* value for the **location** parameter.

For example, for the Azure region West US 2 (displayed below), you will use "westus2" for the **location** parameter.

```json
   {
      "displayName": "West US 2",
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/locations/westus2",
      "latitude": "47.233",
      "longitude": "-119.852",
      "name": "westus2",
      "subscriptionId": null
    }
```

## Next steps

- [Customize Language model using APIs](customize-language-model-with-api.md)
- [Customize Brands model using APIs](customize-brands-model-with-api.md)
- [Customize Person model using APIs](customize-person-model-with-api.md)
