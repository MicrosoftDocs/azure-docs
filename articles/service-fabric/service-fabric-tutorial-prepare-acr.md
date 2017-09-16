---
title: Service Fabric tutorial - Prepare ACR | Microsoft Docs
description: Service Fabric tutorial - Prepare ACR
services: service-fabric
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: servicefabric
keywords: Docker, Containers, Micro-services, Service-Fabric, DC/OS, Azure

ms.assetid: 
ms.service: service-fabric
ms.devlang: azurecli
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/21/2017
ms.author: nepeters
ms.custom: mvc
---

# Deploy and use Azure Container Registry

This tutorial is part two in a series. Azure Container Registry (ACR) is an Azure-based, private registry, for Docker container images. This tutorial walks through deploying an Azure Container Registry instance, and pushing a container image to it. Steps completed include:

> [!div class="checklist"]
> * Deploying an Azure Container Registry (ACR) instance
> * Tagging a container image for ACR
> * Uploading the image to ACR

In subsequent tutorials, this ACR instance is integrated with a Service Fabric cluster, for securely pulling and running container images. 

## Prerequisites

- If you have not created the Azure Voting app image, return to [Tutorial 1 – Create container images](./service-fabric-tutorial-create-container-images.md). Alternatively, the steps detailed here work with any container image.

- This tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

- Additionally, it requires that you have an Azure subscription available. For more information on a free trial version, go [here](https://azure.microsoft.com/en-us/free/).

## Deploy Azure Container Registry

First run the [az login](/cli/azure/login) command to log in to your Azure account. 

Next, use the [az account](/cli/azure/account#set) command to choose your subscription to create the Azure Container registry. 

```azurecli
az account set --subscription <subscription_id>
```

When deploying an Azure Container Registry, you first need a resource group. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#create) command. In this example, a resource group named *myResourceGroup* is created in the *westus* region.

```azurecli
az group create --name myResourceGroup --location westus
```

Create an Azure Container registry with the [az acr create](/cli/azure/acr#create) command. The name of a Container Registry **must be unique**.

```azurecli
az acr create --resource-group myResourceGroup --name <acrName> --sku Basic --admin-enabled true
```

Throughout the rest of this tutorial, we use "acrname" as a placeholder for the container registry name that you chose.

## Container registry login

Log in to your ACR instance before pushing images to it. Use the [az acr login](https://docs.microsoft.com/en-us/cli/azure/acr#az_acr_login) command to complete the operation. Provide the unique name given to the container registry when it was created.

```azurecli
az acr login --name <acrName>
```

The command returns a 'Login Succeeded’ message once completed.

## Tag container images

Each container image needs to be tagged with the loginServer name of the registry. This tag is used for routing when pushing container images to an image registry.

To see a list of current images, use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command.

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
azure-vote-back              latest              bf9a858a9269        3 seconds ago        107MB
azure-vote-front             latest              052c549a75bf        About a minute ago   708MB
redis                        latest              9813a7e8fcc0        2 days ago           107MB
tiangolo/uwsgi-nginx-flask   python3.6           590e17342131        5 days ago           707MB
```

To get the loginServer name, run the following command:

```azurecli
az acr show --name <acrName> --query loginServer --output table
```

Now, tag the *azure-vote-front* image with the loginServer of the container registry. Also, add `:v1` to the end of the image name. This tag indicates the image version.

```bash
docker tag azure-vote-front <acrLoginServer>/azure-vote-front:v1
```

Next, tag the *azure-vote-back* image with the loginServer of the container registry. Also, add `:v1` to the end of the image name. This tag indicates the image version.

```bash
docker tag azure-vote-front <acrLoginServer>/azure-vote-back:v1
```

Once tagged, run 'docker images' to verify the operation.


Output:

```bash
REPOSITORY                             TAG                 IMAGE ID            CREATED             SIZE
azure-vote-back                        latest              bf9a858a9269        22 minutes ago      107MB
<acrName>.azurecr.io/azure-vote-back    v1                  bf9a858a9269        22 minutes ago      107MB
azure-vote-front                       latest              052c549a75bf        23 minutes ago      708MB
<acrName>.azurecr.io/azure-vote-front   v1                  052c549a75bf        23 minutes ago      708MB
redis                                  latest              9813a7e8fcc0        2 days ago          107MB
tiangolo/uwsgi-nginx-flask             python3.6           590e17342131        5 days ago          707MB

```

## Push images to registry

Push the *azure-vote-front* image to the registry. 

Using the following example, replace the ACR loginServer name with the loginServer from your environment.

```bash
docker push <acrLoginServer>/azure-vote-front:v1
```

Push the *azure-vote-back* image to the registry. 

Using the following example, replace the ACR loginServer name with the loginServer from your environment.

```bash
docker push <acrLoginServer>/azure-vote-back:v1
```

The docker push commands take a couple of minutes to complete.

## List images in registry

To return a list of images that have been pushed to your Azure Container registry, use the [az acr repository list](/cli/azure/acr/repository#list) command. Update the command with the ACR instance name.

```azurecli
az acr repository list --name <acrName> --output table
```

Output:

```azurecli
Result
----------------
azure-vote-back
azure-vote-front
```

At tutorial completion, the container image has been stored in a private Azure Container Registry instance. This image is deployed from ACR to a Service Fabric cluster in subsequent tutorials.

## Next steps

In this tutorial, an Azure Container Registry was prepared for use. The following steps were completed:

> [!div class="checklist"]
> * Deployed an Azure Container Registry instance
> * Tagged a container image for ACR
> * Uploaded the image to ACR

Advance to the next tutorial to learn about packaging containers into a Service Fabric application using Yeoman. 

> [!div class="nextstepaction"]
> [Package Container Applications into a Service Fabric Applications](service-fabric-tutorial-package-containers.md)