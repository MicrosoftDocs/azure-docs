---
title: Geo-replicate Azure Container Registry tutorial - Deploy App Service | Microsoft Docs
description: Geo-replicate Azure Container Registry tutorial - Deploy App Service
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: mmacy
tags: acr, azure-container-registry, geo-replication
keywords: Docker, Containers, Registry, Azure

ms.service: container-registry
ms.devlang: 
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/06/2017
ms.author: stevelas
ms.custom: 
---

# Deploy and use Azure Container Registry

This is part two of a three-part tutorial. In the [previous step](./container-registry-tutorial-prepare-app.md), a container image was created for a simple web application written in [Node.js](http://nodejs.org). In this tutorial, this image is pushed to an Azure Container Registry. If you have not created the container image, return to [Tutorial 1 – Create container image](./container-registry-tutorial-prepare-app.md). 

The Azure Container Registry is an private registry, deployed in Azure and kept network-close to your deployments. This tutorial walks through deploying an Azure Container Registry instance, and pushing a container image to it. Steps completed include:

> [!div class="checklist"]
> * Deploying an Azure Container Registry
> * Tagging container image for Azure Container Registry
> * Uploading image to Azure Container Registry

In subsequent tutorials, you deploy the container from your private registry to Azure App Services.

## Before you begin

This tutorial requires that you are running the Azure CLI version 2.0.12 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## az cli login
Login using the [az login](/cli/azure/index?view=azure-cli-latest#az_login) cli. 

```
az login
```

Once logged in, you'll need to configure the default subscription. 

List the available subscriptions:
```
az account list -o table
```
Copy the subscription id

Paste the subscription in the following command between the quotes:
```
az account set --subscription "<subid>"
```
## Deploy Azure Container Registry

When deploying an Azure Container Registry, you first need a resource group. An Azure resource group is a logical collection into which Azure resources are deployed and managed. Azure Container Registries are typically long lived resoruces, used across multiple container hosts. For this reason, you may want to create ACR in it's own resource group.

Create a resource group with the [az group create](/cli/azure/group#create) command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region.

```azurecli
az group create --name myResourceGroup --location eastus
```

Create an Azure Container registry with the [az acr create](/cli/azure/acr#create) command. The name of a Container Registry **must be unique**. In the following example, we use the name *mycontainerregistry082*.

```azurecli
az acr create --resource-group myResourceGroup --name mycontainerregistry082 --sku Basic
```

Throughout the rest of this tutorial, we use `<acrname>` as a placeholder for the container registry name that you chose.

## Container registry login

You must log in to your ACR instance before pushing images to it.

With [Basic, Standard and Premium SKUs](container-registry-skus.md), you can now authenticate with ACR using your Azure identity. 

 Use the [az acr login](https://docs.microsoft.com/en-us/cli/azure/acr#az_acr_login) command to complete the operation passing in the unique registry name given when it was created.

```azurecli
az acr login --name <acrName>
```


The command returns a 'Login Succeeded’ message once completed.

## Tag container image

To deploy a container image from a private registry, the image needs to be tagged with the `loginServer` name of the registry.

To see a list of current images, use the `docker images` command.

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
aci-tutorial-app             latest              5c745774dfa9        39 seconds ago       68.1 MB
```

To get the loginServer name, run the following command.

```azurecli
az acr show --name <acrName> --query loginServer --output table
```

Tag the *aci-tutorial-app* image with the loginServer of the container registry. Also, add `:v1` to the end of the image name. This tag indicates the image version number.

```bash
docker tag aci-tutorial-app <acrLoginServer>/aci-tutorial-app:v1
```

Once tagged, run `docker images` to verify the operation.

```bash
docker images
```

Output:

```bash
REPOSITORY                                                TAG                 IMAGE ID            CREATED             SIZE
aci-tutorial-app                                          latest              5c745774dfa9        39 seconds ago      68.1 MB
mycontainerregistry082.azurecr.io/aci-tutorial-app        v1                  a9dace4e1a17        7 minutes ago       68.1 MB
```

## Push image to Azure Container Registry

Push the *aci-tutorial-app* image to the registry.

Using the following example, replace the container registry loginServer name with the loginServer from your environment.

```bash
docker push <acrLoginServer>/aci-tutorial-app:v1
```

## List images in Azure Container Registry

To return a list of images that have been pushed to your Azure Container registry, use the [az acr repository list](/cli/azure/acr/repository#list) command. Update the command with the container registry name.

```azurecli
az acr repository list --name <acrName> --output table
```

Output:

```azurecli
Result
----------------
aci-tutorial-app
```

And then to see the tags for a specific image, use the [az acr repository show-tags](/cli/azure/acr/repository#show-tags) command.

```azurecli
az acr repository show-tags --name <acrName> --repository aci-tutorial-app --output table
```

Output:

```azurecli
Result
--------
v1
```

## Next steps

In this tutorial, an Azure Container Registry was prepared for use with Azure Container Instances, and the container image was pushed. The following steps were completed:

> [!div class="checklist"]
> * Deploying an Azure Container Registry instance
> * Tagging container image for Azure Container Registry
> * Uploading image to Azure Container Registry

Advance to the next tutorial to learn about deploying the container to Azure using Azure Container Instances.

> [!div class="nextstepaction"]
> [Deploy containers to Azure Container Instances](./container-instances-tutorial-deploy-app.md)
