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
ms.date: 06/14/2017
ms.author: nepeters
---

# Deploy and use Azure Container Registry

Azure Container Registry (ACR) is an Azure-based, private registry, for Docker container images. This tutorial walks through deploying an Azure Container Registry instance, and pushing container images to it.  In subsequent tutorials, this ACR instance is integrated with an Azure Container Service Kubernetes cluster for securely running container images. The steps in this tutorial include:

> [!div class="checklist"]
> * Deploying an Azure Container Registry instance
> * Tagging container images for ACR
> * Uploading images to ACR

For detailed information on Azure Container Registry, see [Introduction to private Docker container registries](../container-registry/container-registry-intro.md). 

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Prerequisites

This is one tutorial of a multi-part series. You do not need to complete the full series to work through this tutorial, however the following items are required.

**Container Images** - in the [previous tutorial](container-service-tutorial-kubernetes-prepare-app.md) two container images were created and will now be pushed to ACR. That said, the commands in this tutorial can be used to push container images of your choice. 

## Deploy Azure Container Registry

When deploying an Azure Container Registry, you first need a resource group. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#create) command. In this example, a resource group named *myResourceGroup* is created in the eastus region.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Create an Azure Container registry with the [az acr create](/cli/azure/acr#create) command. The name of a Container Registry **must be unique**, update the name below with some random characters.

```azurecli-interactive
az acr create --resource-group myResourceGroup --name myContainerRegistry007 --sku Basic --admin-enabled true
```

## Get ACR information 

Once the ACR instance has been created, the name, login server name, and authentication password are needed. The code below returns each of these values. Note each value down, they will be referenced throughout this tutorial.  

ACR Name:

```azurecli-interactive
az acr list --resource-group myResourceGroup --query [0].name -o tsv
```

ACR Login Server:

```azurecli-interactive
az acr list --resource-group myResourceGroup --query [0].loginServer -o tsv
```

ACR Password - update with the ACR name.

```azurecli-interactive
az acr credential show --name <acrName> --query passwords[0].value -o tsv
```

## Container registry login

You must log in to your ACR instance before pushing images to it. Use the `docker login` command to complete the operation. When running `docker login` you need to provide a login server, this is the ACR loginServer name. You also need to provide ACR credentials.

```bash
docker login --username=<acrName> --password=<acrPassword> <acrLoginServer>
```

The command returns a 'Login Succeeded’ message once completed.

## Tag container images

Each container image needs to be tagged with the `loginServer` name of the registry. This tag is used for routing when pushing the container image.

To see a list of current images, use the `docker images` command.

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
azure-vote-front             latest              08f036033a2f        39 seconds ago       716 MB
azure-vote-back              latest              93cdf071f8c3        About a minute ago   407 MB
mysql                        latest              e799c7f9ae9c        4 weeks ago          407 MB
tiangolo/uwsgi-nginx-flask   flask               788ca94b2313        8 months ago         694 MB
```

Tag the *azure-vote-front* image with the loginServer of the container registry. Also, add `:v1:` to the end of the image name. This tag indicates the image version number.

```bash
docker tag azure-vote-front <acrLoginServer>/azure-vote-front:v1
```

Do the same to the *azure-vote-back* image.

```bash
docker tag azure-vote-back <acrLoginServer>/azure-vote-back:v1
```

Once tagged, run `docker images` to verify the operation.

```bash
docker images
```

Output:

```bash
REPOSITORY                                               TAG                 IMAGE ID            CREATED             SIZE
mycontainerregistry8781.azurecr.io/azure-vote-front:v1   latest              a3d423cf3260        About an hour ago   716 MB
azure-vote-front                                         latest              a3d423cf3260        About an hour ago   716 MB
azure-vote-back                                          latest              ad6b280678eb        About an hour ago   407 MB
mycontainerregistry8781.azurecr.io/azure-vote-back:v1    latest              ad6b280678eb        About an hour ago   407 MB
mysql                                                    latest              e799c7f9ae9c        5 weeks ago         407 MB
tiangolo/uwsgi-nginx-flask                               flask               788ca94b2313        8 months ago        694 MB
```

## Push images to ACR

Push the *azure-vote-front* image to the registry. 

Using the following example, replace the ACR loginServer name with the loginServer from your environment.

```bash
docker push <acrLoginServer>/azure-vote-front:v1
```

Do the same to the *azure-vote-back* image.

```bash
docker push <acrLoginServer>/azure-vote-back:v1
```

## List images in ACR 

To return a list of images that have been pushed to your Azure Container registry, user the [az acr repository list](/cli/azure/acr/repository#list) command. Update the command with the ACR instance name.

```azurecli-interactive
az acr repository list --name <acrName> --output table
```

Output:

```azurecli
Result
----------------
azure-vote-back
azure-vote-front
```

And then to see the tags for a specific image, use the [az acr repository show-tags](/cli/azure/acr/repository#show-tags) command.

```azurecli-interactive
az acr repository show-tags --name <acrName> --repository azure-vote-front --output table
```

Output:

```azurecli
Result
--------
v1
```

At tutorial completion, the two container images for the Azure Vote app have been stored in a private Azure Container Registry instance. These images will be deployed from ACR to a Kubernetes cluster in subsequent tutorials.

## Next steps

In this tutorial, an Azure Container Registry was prepared for use in an ACS Kubernetes cluster. Task covered included:

> [!div class="checklist"]
> * Deploying an Azure Container Registry instance
> * Tagging container images for ACR
> * Uploading images to ACR

Advance to the next tutorial to learn about deploying a Kubernetes cluster in Azure.

> [!div class="nextstepaction"]
> [Deploy ACS cluster](./container-service-tutorial-kubernetes-deploy-cluster.md)