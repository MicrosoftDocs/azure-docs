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
ms.date: 06/13/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Prepare ACR

Azure Container Registry (ACR) is an Azure based, private registry, for Docker container images. This tutorial walks through deploying and Azure Container Registry instance, and pushing container images to it.  In subsequent tutorials, this ACR instance will be integrated with an Azure Container Service Kubernetes cluster, for securely running container images. The steps in this tutorial include:

> [!div class="checklist"]
> * Deploying an Azure Container Registry instance
> * Tagging container images for ACR
> * Uploading images to ACR

For detailed information on Azure Container Registry, see [Introduction to private Docker container registries](../container-registry/container-registry-intro.md). 

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). Alternately, [Azure Cloud Shell](https://review.docs.microsoft.com/en-us/azure/cloud-shell/quickstart?branch=pr-en-us-14901) can be accessed from each code block in this tutorial, giving you access to an in bowser CLI. 

## Deploy Azure Container Registry

When deploying an Azure Container Registry, you first need a resource group. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with the [az greoup create](/cli/azure/group#create) command. In this example, a resource group named *myResourceGroup* is created in the eastus region.

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

Get the container registry credentials using the [az acr credential show](/cli/azure/acr/credential) command. Substitute the `--name` value with the one noted in the last step. Two passwords are returned, take note of one of these.

```azurecli-interactive
az acr credential show --name myContainerRegistry23489
```

## Container registry login

You must login to your ACR instance before pushing images to it. Use the `docker login` command to complete the operation.

Use the following example as a command reference. Substitute the value for `--username` with the name of the container registry. Substitute the value for `--password` with the collected password. Substitute the fully qualified name, in this example `mycontainerregistry1326.azurecr.io` with the loginServer name of your registry.

```bash
docker login --username=myContainerRegistry1326 --password==N+/=J/=++Rns2==+=Me3/EM0Xvw0Fis mycontainerregistry1326.azurecr.io
```

The command will return a 'Login Succeeded’ message once completed.

## Tag container images

Each container image needs to be tagged with the `loginServer` name of the registry. 

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

Tag the *azure-vote-front* image with the loginServer of the container registry. 

Using the following example, replace the ACR login server, `mycontainerregistry1326.azurecr.io` with the loginServer from your ACR instance.

```bash
docker tag azure-vote-front mycontainerregistry1326.azurecr.io/azure-vote-front
```

Do the same to the *azure-vote-back* image.

```bash
docker tag azure-vote-back mycontainerregistry1326.azurecr.io/azure-vote-back
```

Once tagged, run `docker images` to verify the operation.

```bash
docker images
```

Output:

```bash
REPOSITORY                                            TAG                 IMAGE ID            CREATED             SIZE
azure-vote-front                                      latest              2e214fdaeb1b        30 minutes ago      445 MB
mycontainerregistry3433.azurecr.io/azure-vote-front   latest              2e214fdaeb1b        30 minutes ago      445 MB
ubuntu                                                latest              7b9b13f7b9c0        7 days ago          118 MB
mysql                                                 latest              e799c7f9ae9c        4 weeks ago         407 MB
```

## Push images to ACR

Push the *azure-vote-front* image to the registry. 

Using the following example, replace the ACR loginServer name with the loginServer from your environment.

```bash
docker push mycontainerregistry3433.azurecr.io/azure-vote-front 
```

Do the same to the *azure-vote-back* image.

```bash
docker push mycontainerregistry3433.azurecr.io/azure-vote-back
```

At tutorial completion, the two container images for the Azure Vote app have been stored in a private Azure Container Registry instance.  

## Next steps

In this tutorial, an Azure Container Registry was prepared for use in an ACS Kubernetes cluster. Task covered included:

> [!div class="checklist"]
> * Deploying an Azure Container Registry instance
> * Tagging container images for ACR
> * Uploading images to ACR

Advance to the next tutorial to learn about deploying a Kubernetes cluster in Azure.
> [!div class="nextstepaction"]
> [Deploy ACS cluster](./container-service-tutorial-kubernetes-deploy-cluster.md)