---
title: Create container images for Azure Service Fabric | Microsoft Docs
description: Learn how to create container images for a multi-container Service Fabric application.
services: service-fabric
documentationcenter: ''
author: suhuruli
manager: timlt
editor: suhuruli
tags: servicefabric
keywords: Docker, Containers, Microservices, Service Fabric, Azure

ms.assetid: 
ms.service: service-fabric
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/15/2017
ms.author: suhuruli
ms.custom: mvc
---

# Create container images for Service Fabric

This tutorial is part one of a tutorial series that demonstrates how to use containers in a Linux Service Fabric cluster. In this tutorial, a multi-container application is prepared for use with Service Fabric. In subsequent tutorials, these images are used as part of a Service Fabric application. In this tutorial you learn how to: 

> [!div class="checklist"]
> * Clone application source from GitHub  
> * Create a container image from the application source
> * Deploy an Azure Container Registry (ACR) instance
> * Tag a container image for ACR
> * Upload the image to ACR

In this tutorial series, you learn how to: 

> [!div class="checklist"]
> * Create container images for Service Fabric
> * [Build and Run a Service Fabric Application with Containers](service-fabric-tutorial-package-containers.md)
> * [How failover and scaling are handled in Service Fabric](service-fabric-tutorial-containers-failover.md)

## Prerequisites

- Linux development environment set up for Service Fabric. Follow the instructions [here](service-fabric-get-started-linux.md) to set up your Linux environment. 
- This tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 
- Additionally, it requires that you have an Azure subscription available. For more information on a free trial version, go [here](https://azure.microsoft.com/free/).

## Get application code

The sample application used in this tutorial is a voting app. The application consists of a front-end web component and a back-end Redis instance. The components are packaged into container images. 

Use git to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/service-fabric-dotnet-containers.git

```

From the cloned directory, use the following command to enter the working directory. 

```bash 
cd Linux/container-tutorial/
```

Inside this working directory is the 'azure-vote' directory. The directory contains the front-end source code and the 'redis' directory that contains a Dockerfile to  build the redis image. These directories contain the necessary assets for this tutorial set. 

## Create container images

Inside the 'azure-vote' directory, run the following command to build the image for the front-end web component. This command uses the Dockerfile in this directory to build the image. 

```bash
docker build -t azure-vote-front .
```

Inside, the 'redis' directory, run the following command to build the image for the redis backend. This command uses the Dockerfile in the directory to build the image. 

```bash
docker build -t azure-vote-back .
```

When completed, use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to see the created images.

```bash
docker images
```

Notice that four images have been downloaded or created. The *azure-vote-front* image contains the application. It was derived from a *python* image from Docker Hub. The Redis image was downloaded from Docker Hub.

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
azure-vote-back              latest              bf9a858a9269        3 seconds ago        107MB
azure-vote-front             latest              052c549a75bf        About a minute ago   708MB
redis                        latest              9813a7e8fcc0        2 days ago           107MB
tiangolo/uwsgi-nginx-flask   python3.6           590e17342131        5 days ago           707MB

```

## Deploy Azure Container Registry

First run the [az login](/cli/azure/login) command to log in to your Azure account. 

Next, use the [az account](/cli/azure/account#set) command to choose your subscription to create the Azure Container registry. 

```bash
az account set --subscription <subscription_id>
```

When deploying an Azure Container Registry, you first need a resource group. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#create) command. In this example, a resource group named *myResourceGroup* is created in the *westus* region. Please choose the resource group in a region near you. 

```bash
az group create --name myResourceGroup --location westus
```

Create an Azure Container registry with the [az acr create](/cli/azure/acr#create) command. The name of a Container Registry **must be unique**.

```bash
az acr create --resource-group myResourceGroup --name <acrName> --sku Basic --admin-enabled true
```

Throughout the rest of this tutorial, we use "acrname" as a placeholder for the container registry name that you chose.

## Log in to your container registry

Log in to your ACR instance before pushing images to it. Use the [az acr login](/cli/azure/acr?view=azure-cli-latest#az_acr_login) command to complete the operation. Provide the unique name given to the container registry when it was created.

```bash
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

```bash
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

```bash
az acr repository list --name <acrName> --output table
```

Output:

```bash
Result
----------------
azure-vote-back
azure-vote-front
```

At tutorial completion, the container image has been stored in a private Azure Container Registry instance. This image is deployed from ACR to a Service Fabric cluster in subsequent tutorials.

## Next steps

In this tutorial, an application was pulled from Github and container images were created and pushed to a registry. The following steps were completed:

> [!div class="checklist"]
> * Clone application source from GitHub  
> * Create a container image from the application source
> * Deploy an Azure Container Registry (ACR) instance
> * Tag a container image for ACR
> * Upload the image to ACR

Advance to the next tutorial to learn about packaging containers into a Service Fabric application using Yeoman. 

> [!div class="nextstepaction"]
> [Package and deploy containers as a Service Fabric application](service-fabric-tutorial-package-containers.md)
