---
title: Azure Container Service tutorial - Prepare ACR | Microsoft Docs
description: Azure Container Service tutorial - Prepare ACR
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/08/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Prepare ACR

In this article, we explore how to use Azure Container Registry with <update>. Using ACR allows you to privately store and manage container images. This tutorial covers the following tasks:

> [!div class="checklist"]
> * Deploy Azure Container Registry
> * Uploading an image to the Azure Container Registry

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Deploy Azure Container Registry

When deploying an Azure Container Registry, you will first need a resource group. In this example, a resource group named *myResourceGroup* is created in the eastus region.

Create a resource group with the [az greoup create](/cli/azure/group#create) command.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Create an Azure Container registry with the [az acr create](/cli/azure/acr#create) command. 

The following example creates a registry with a randomly generate name. The registry is also configured with an admin account using the `--admin-enabled` argument.

```azurecli-interactive
az acr create --resource-group myResourceGroup --name myContainerRegistry$RANDOM --sku Basic --admin-enabled true
```

Once the registry has been created, the Azure CLI outputs data similar to the following. Take note of the `name` and `loginServer`, these are used in later steps.

```azurecli
{
  "adminUserEnabled": false,
  "creationDate": "2017-06-06T03:40:56.511597+00:00",
  "id": "/subscriptions/f2799821-a08a-434e-9128-454ec4348b10/resourcegroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry23489",
  "location": "eastus",
  "loginServer": "mycontainerregistry23489.azurecr.io",
  "name": "myContainerRegistry23489",
  "provisioningState": "Succeeded",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "storageAccount": {
    "name": "mycontainerregistr034017"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

Get the container registry credentials using the [az acr credential show](/cli/azure/acr/credential) command. Substitute the `--name` with the one noted in the last step. Take note of one password, it is needed in a later step.

```azurecli-interactive
az acr credential show --name myContainerRegistry23489
```

For more information on Azure Container Registry, see [Introduction to private Docker container registries](../container-registry/container-registry-intro.md). 

## Push image to ACR

```bash
docker login --username=myContainerRegistry1326 --password==N+/=J/=++Rns2==+=Me3/EM0Xvw0Fis mycontainerregistry1326.azurecr.io
```

```bash
REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
azure-vote-back     latest              dfdc614becea        7 seconds ago        407 MB
azure-vote-front    latest              67e8582e68a8        About a minute ago   445 MB
ubuntu              latest              7b9b13f7b9c0        6 days ago           118 MB
mysql               latest              e799c7f9ae9c        4 weeks ago          407 MB
```

```bash
docker tag dfdc614becea mycontainerregistry1326.azurecr.io/azure-vote-back
```

```bash
docker tag 67e8582e68a8 mycontainerregistry1326.azurecr.io/azure-vote-front
```


```bash
docker push mycontainerregistry1326.azurecr.io/azure-vote-back
```

```bash
docker push mycontainerregistry1326.azurecr.io/azure-vote-back
```


## Next steps

In this tutorial, an Azure Container Registry was prepared for use in an ACS Kubernetes cluster. Task covered included:

> [!div class="checklist"]
> * Deploy Azure Container Registry
> * Uploading an image to the Azure Container Registry

Advance to the next tutorial to learn about deploying a Kubernetes cluster in Azure.
> [!div class="nextstepaction"]
> [Deploy ACS cluster](./container-service-tutorial-kubernetes-deploy-cluster.md)