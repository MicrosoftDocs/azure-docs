---
title: Geo-replicate Azure Container Registry tutorial - Prepare Azure Container Registry | Microsoft Docs
description: Geo-replicate Azure Container Registry tutorial - Prepare Azure Container Registry
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

This is part two of a three-part tutorial. In the [previous step](./container-registry-tutorial-prepare-app.md), a container image was created for a simple web application. In this tutorial, the image is pushed to an Azure Container Registry. If you have not created the container image, return to [Tutorial 1 – Create container image](./container-registry-tutorial-prepare-app.md). 

The Azure Container Registry is a private registry, deployed in Azure and kept network-close to your deployments. This tutorial walks through deploying an Azure Container Registry, and pushing a container image to it. Steps completed include:

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

Once logged in, configure the default subscription. 

List the available subscriptions:
```
az account list -o table
```
Confirm True is in the IsDefault column for the desired subscription. 

To change the default, copy the subscription id.

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

> [!Note]
> If az acr create outputs a message indicating a storage account was created, the az cli will need to be updated. Delete the resource group with az group delete --name MyResourceGroup and update the az cli
>
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

The loginServer name is typically `<acrName>.azurecr.io`

To get the loginServer name, run the following command.

```azurecli
az acr show --name <acrName> --query loginServer -o table
```

Tag the *acr-tutorial-app* image with the loginServer of the container registry. 

```bash
docker tag acr-tutorial-app <acrName>.azurecr.io/acr-tutorial-app
```

Once tagged, run `docker images` to verify the operation.

```bash
docker images
```

Output:

```bash
REPOSITORY                                                TAG                 IMAGE ID            CREATED             SIZE
acr-tutorial-app                                          latest              5c745774dfa9        39 seconds ago      68.1 MB
<acrName>.azurecr.io/acr-tutorial-app                            a9dace4e1a17        1 minute ago        68.1 MB
```

## Push image to Azure Container Registry

Push the *acr-tutorial-app* image to the registry.

Using the following example, replacing the container registry <acrName>.

```bash
docker push <acrName>.azurecr.io/acr-tutorial-app
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
az acr repository show-tags --name <acrName> --repository acr-tutorial-app --output table
```

Output:

```azurecli
Result
--------
v1
```

## Next steps

In this tutorial, an Azure Container Registry was created, and a container image was pushed. The following steps were completed:

> [!div class="checklist"]
> * Deploying an Azure Container Registry
> * Tagging container image for Azure Container Registry
> * Uploading image to Azure Container Registry

Advance to the next tutorial to learn about deploying the container to Azure using Azure App Services

> [!div class="nextstepaction"]
> [Deploy containers to Azure App Services](container-registry-tutorial-geo-deploy-region1.md)
