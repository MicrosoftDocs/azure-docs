---
title: Azure Container Instances tutorial - Prepare ACR | Microsoft Docs
description: Azure Container Instances tutorial - Prepare ACR
services: container-instances
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-instances
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/15/2017
ms.author: seanmck
---

# Deploy and use Azure Container Registry

Azure Container Registry (ACR) is an Azure-based, private registry, for Docker container images. This tutorial walks through deploying an Azure Container Registry instance, and pushing container images to it. Steps completed include:

> [!div class="checklist"]
> * Deploying an Azure Container Registry instance
> * Tagging container images for ACR
> * Uploading images to ACR

In subsequent tutorials, you will deploy containers from your private registry as an Azure Container Instances group. 

## Before you begin

In the [previous tutorial](./container-instances-tutorial-prepare-app.md), container images were created for a simple web application and accompanying sidecar. In this tutorial, these images are pushed to an Azure Container Registry. If you have not created the container images, return to [Tutorial 1 – Create container images](./container-instances-tutorial-prepare-app.md). Alternatively, the steps detailed here work with any container image.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Deploy Azure Container Registry

When deploying an Azure Container Registry, you first need a resource group. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#create) command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Create an Azure Container registry with the [az acr create](/cli/azure/acr#create) command. The name of a Container Registry **must be unique**. Using the following example, update the name with some random characters.

```azurecli-interactive
az acr create --resource-group myResourceGroup --name acidemo --sku Basic --admin-enabled true
```

## Get ACR information 

Once the ACR instance has been created, the name, login server name, and authentication password are needed. The following code returns each of these values. Note each value down, they are referenced throughout this tutorial.  

ACR Name and Login Server:

```azurecli-interactive
az acr list --resource-group myResourceGroup --query "[].{acrName:name,acrLoginServer:loginServer}" --output table
```

ACR Password - update with the ACR name.

```azurecli-interactive
az acr credential show --name <acrName> --query passwords[0].value -o tsv
```

## Container registry login

You must log in to your ACR instance before pushing images to it. Use the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command to complete the operation. When running docker login, you need to provide th ACR login server name and ACR credentials.

```bash
docker login --username=<acrName> --password=<acrPassword> <acrLoginServer>
```

The command returns a 'Login Succeeded’ message once completed.

## Tag container images

Each container image needs to be tagged with the `loginServer` name of the registry. This tag is used for routing when pushing container images to an image registry.

To see a list of current images, use the `docker images` command.

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
aci-tutorial-app             latest              5c745774dfa9        39 seconds ago       6.45 MB
aci-tutorial-sidecar         latest              057343f8b24a        About a minute ago   6.33 MB
```

Tag the *aci-tutorial-app* image with the loginServer of the container registry. Also, add `:v1` to the end of the image name. This tag indicates the image version number.

```bash
docker tag aci-tutorial-app <acrLoginServer>/aci-tutorial-app:v1
```

Repeat the command with the *aci-tutorial-sidecar* image.

```bash
docker tag aci-tutorial-sidecar <acrLoginServer>/aci-tutorial-sidecar:v1
```

Once tagged, run `docker images` to verify the operation.

```bash
docker images
```

Output:

```bash
REPOSITORY                                                TAG                 IMAGE ID            CREATED             SIZE
aci-tutorial-app                                          latest              5c745774dfa9        39 seconds ago      6.45 MB
mycontainerregistry082.azurecr.io/aci-tutorial-app        v1                  a9dace4e1a17        7 minutes ago       6.45 MB
aci-tutorial-sidecar                                      latest              057343f8b24a        About a minute ago  6.33 MB
mycontainerregistry082.azurecr.io/aci-tutorial-sidecar    v1                  a9dace4e1a17        7 minutes ago       6.33 MB
```

## Push images to ACR

Push the *aci-tutorial-app* image to the registry. 

Using the following example, replace the ACR loginServer name with the loginServer from your environment. This takes a couple of minutes to complete.

```bash
docker push <acrLoginServer>/aci-tutorial-app:v1
```

Do the same to the *aci-tutorial-sidecar* image.

```bash
docker push <acrLoginServer>/aci-tutorial-sidecar:v1
```

## List images in ACR 

To return a list of images that have been pushed to your Azure Container registry, user the [az acr repository list](/cli/azure/acr/repository#list) command. Update the command with the ACR instance name.

```azurecli-interactive
az acr repository list --name <acrName> --username <acrName> --password <acrPassword> --output table
```

Output:

```azurecli
Result
----------------
aci-tutorial-sidecar
aci-tutorial-app
```

And then to see the tags for a specific image, use the [az acr repository show-tags](/cli/azure/acr/repository#show-tags) command.

```azurecli-interactive
az acr repository show-tags --name <acrName> --username <acrName> --password <acrPassword> --repository aci-tutorial-app --output table
```

Output:

```azurecli
Result
--------
v1
```

## Create an Azure Key Vault and store ACR credentials

To protect access to your Azure Container Registry credentials, we recommend that you store them in an Azure Key Vault. You can reference your key vault as part of an Azure Resource Manager template when deploying your containers to Azure Container Instances.

Create the key vault with the Azure CLI:

```bash
az keyvault create -n aci-keyvault --enabled-for-template-deployment -g myResourceGroup
```

The `enabled-for-template-deployment` switch allows Azure Resource Manager to pull secrets from your key vault at deployment time.

Store the password for your registry as a new secret in the key vault:

```
az keyvault secret set --vault-name aci-keyvault --name acrpassword --value <acrPassword>
```

## Next steps

In this tutorial, an Azure Container Registry was prepared for use with Azure Container Instances. The following steps were completed:

> [!div class="checklist"]
> * Deploying an Azure Container Registry instance
> * Tagging container images for ACR
> * Uploading images to ACR

Advance to the next tutorial to learn about deploying the containers in an Azure Container Instances group.

> [!div class="nextstepaction"]
> [Deploy containers to Azure Container Instances](./container-instances-tutorial-deploy-app.md)