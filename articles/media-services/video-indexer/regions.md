---
title: Regions in which Video Indexer is available - Azure  
titlesuffix: Azure Media Services
description: This article talks about Azure regions in which Video Indexer is available.  
services: media-services
author: anikaz
manager: johndeu

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: anzaman
---

# Azure regions in which Video Indexer exists

Video Indexer APIs contain a **location** parameter that you should set to the Azure region to which the call should be routed. This must be an [Azure region in which Video Indexer is available](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services&regions=all).

## Locations

The **location** parameter must be given the Azure region code name as its value. If you are using Video Indexer in preview mode, you should put *"trial"* as the value. Otherwise, to get the code name of the Azure region that your account is in and that your call should be routed to, you can run the following line in [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest):

```bash
az account list-locations
```

Once you run the line shown above, you get a list of all Azure regions. Navigate to the Azure region that has the *displayName* you are looking for, and use its *name* value for the **location** parameter.

For example, for the Azure region West US 2 (displayed below), you will use "westus2" for the **location** parameter.

```json
   {
      "displayName": "West US 2",
      "id": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/locations/westus2",
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
