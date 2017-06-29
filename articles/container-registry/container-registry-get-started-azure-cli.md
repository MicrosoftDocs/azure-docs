---
title: Create private Docker container registry - Azure CLI | Microsoft Docs
description: Get started creating and managing private Docker container registries with the Azure CLI 2.0
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: cristyg
tags: ''
keywords: ''

ms.assetid: 29e20d75-bf39-4f7d-815f-a2e47209be7d
ms.service: container-registry
ms.devlang: azurecli
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/06/2017
ms.author: stevelas
ms.custom: H1Hack27Feb2017
---

# Create a private Docker container registry using the Azure CLI 2.0

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images. This guide details creating an Azure Container Registry instance using the Azure CLI.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location westcentralus
```

## Create a container registry

Create an ACR instacne using the [az acr create]() command.

When you create a registry, specify a globally unique top-level domain name, containing only letters and numbers. The registry name in the examples is *mycontainerregistry1*, substitute a unique name of your own.

```azurecli
az acr create --name mycontainerregistry1 --resource-group myResourceGroup --sku Managed_Standard
```

When the registry is created, the output is similar to the following:

```azurecli
{
  "adminUserEnabled": false,
  "creationDate": "2017-06-29T04:50:28.607134+00:00",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry1",
  "location": "westcentralus",
  "loginServer": "mycontainerregistry1.azurecr.io",
  "name": "myContainerRegistry1",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "name": "Managed_Standard",
    "tier": "Managed"
  },
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}

```

## Use Azure Container Registry

### List container images

Use the `az acr` CLI commands to query the images and tags in a repository.

> [!NOTE]
> Currently, Container Registry does not support the `docker search` command to query for images and tags.

### List repositories

The following example lists the repositories in a registry, in JSON (JavaScript Object Notation) format:

```azurecli
az acr repository list -n myRegistry1 -o json
```

### List tags

The following example lists the tags on the **samples/nginx** repository, in JSON format:

```azurecli
az acr repository show-tags -n myRegistry1 --repository samples/nginx -o json
```

## Next steps

In this quick start, you’ve deployed a simple virtual machine, a network security group rule, and installed a web server.

> [!div class="nextstepaction"]
> [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md)
