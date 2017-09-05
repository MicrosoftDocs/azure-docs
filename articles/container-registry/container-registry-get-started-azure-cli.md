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
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/06/2017
ms.author: stevelas
ms.custom: H1Hack27Feb2017
---

# Create a container registry using the Azure CLI

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images. This guide details creating a Azure Container Registry instance using the Azure CLI.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *westcentralus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location westcentralus
```

## Create a container registry

Create an ACR instance using the [az acr create](/cli/azure/acr#create) command.

The name of the registry must be unique. In the following example *myContainerRegistry007* is used. Update this to a unique value. 

Several different registry sku’s are available, choose one appropriate to your needs.

| Sku | Description | Notes |
| Basic | Limited capability and images stored in an Azure storage account. | Avaliable in all regions.|
| Managed_Basic | Advanced capabilities such as managed storage and Webhooks. | Preview in limited regions. |
| Managed_Premium | Advanced capabilities such as managed storage and Webhooks. | Preview in limited regions. |
| Managed_Standard | Advanced capabilities such as managed storage and Webhooks. | Preview in limited regions. |

```azurecli
az acr create --name myContainerRegistry1  --resource-group myResourceGroup --sku Basic
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

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. To do so, use the [az acr login](/cli/azure/acr#login) command.

```azurecli-interactive
az acr login --name myAzureContainerRegistry1
```

The command returns a 'Login Succeeded' message once completed.

## Push image to ACR

To push an image to an Azure Container registry, you must first have an image. If needed, run the following command to pull are pre-created image from Docker Hub.

```bash
docker pull microsoft/azure-vote-front
```

The image will need to be tagged with the ACR login server name. Run the following command to return the login server name of the ACR instance.

```bash
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Tag the image using the [docker tag]() command. Replace *acrLoginServer* with the login server name of your ACR instance.

```
docker tag microsoft/azure-vote-front acrLoginServer/azure-vote-front

Finally, use [Docker push]() to push the images to the ACR instance. Replace *acrLoginServer* with the login server name of your ACR instance.

```
docker push acrLoginServer/azure-vote-front
```

## List container images

The following example lists the repositories in a registry, in JSON (JavaScript Object Notation) format:

```azurecli
az acr repository list -n myContainerRegistry1 -o json
```

The following example lists the tags on the **samples/nginx** repository, in JSON format:

```azurecli
az acr repository show-tags -n myContainerRegistry1 --repository samples/nginx -o json
```

## Clean up resources

## Next steps

In this quick start, you've created a managed Azure Container Registry instance using the Azure CLI.

> [!div class="nextstepaction"]
> [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md)