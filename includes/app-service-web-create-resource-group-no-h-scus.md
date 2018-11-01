---
title: "include file"
description: "include file"
services: app-service
author: msangapu
ms.service: app-service
ms.topic: "include"
ms.date: 09/18/2018
ms.author: msangapu
ms.custom: "include file"
---

[!INCLUDE [resource group intro text](resource-group.md)]

In the Cloud Shell, create a resource group with the [`az group create`](/cli/azure/group?view=azure-cli-latest#az-group-create) command. The following example creates a resource group named *myResourceGroup* in the *South Central US* location. To see all supported locations for App Service in **Free** tier, run the [`az appservice list-locations --sku FREE`](/cli/azure/appservice?view=azure-cli-latest#az-appservice-list-locations) command.

```azurecli-interactive
az group create --name myResourceGroup --location "South Central US"
```

You generally create your resource group and the resources in a region near you. 

When the command finishes, a JSON output shows you the resource group properties.