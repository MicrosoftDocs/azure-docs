---
title: Quickstart - Create a private Docker registry in Azure with the Azure CLI
description: Quickly learn to create a private Docker container registry with the Azure CLI.
services: container-registry
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: tysonn
tags: ''
keywords: ''

ms.assetid: 29e20d75-bf39-4f7d-815f-a2e47209be7d
ms.service: container-registry
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/06/2017
ms.author: nepeters
ms.custom: H1Hack27Feb2017
---

# Create a container registry using the Azure CLI

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images. This guide details creating an Azure Container Registry instance using the Azure CLI.

This quickstart requires that you are running the Azure CLI version 2.0.12 or later. Run az --version to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), or [Linux](https://docs.docker.com/engine/installation/#supported-platforms) system.

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a container registry

Azure Container Registry is available in several different SKUs. When deploying an ACR instance, choose a SKU that matches your image management needs. In this quickstart, we select Basic due to its availability in all regions.

| SKU | Description | Notes |
|---|---|---|
| Basic | Limited capability and images stored in an Azure storage account. | Available in all regions. |
| Managed_Basic | Advanced capabilities such as managed storage and Webhooks. | Preview in limited regions. |
| Managed_Standard | Advanced capabilities such as managed storage and Webhooks. | Preview in limited regions. |
| Managed_Premium | Advanced capabilities such as managed storage and Webhooks. | Preview in limited regions. |

Create an ACR instance using the [az acr create](/cli/azure/acr#create) command.

The name of the registry **must be unique**. In the following example *myContainerRegistry007* is used. Update this to a unique value.

```azurecli
az acr create --name myContainerRegistry007 --resource-group myResourceGroup --admin-enabled --sku Basic
```

When the registry is created, the output is similar to the following:

```azurecli
{
  "adminUserEnabled": true,
  "creationDate": "2017-09-08T22:32:13.175925+00:00",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myContainerRegistry007",
  "location": "eastus",
  "loginServer": "myContainerRegistry007.azurecr.io",
  "name": "myContainerRegistry007",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "storageAccount": {
    "name": "mycontainerregistr223140"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

Throughout the rest of this quickstart, we use `<acrname>` as a placeholder for the container registry name that you chose.

## Log in to ACR

Before pushing and pulling container images, you must log in to the ACR instance. To do so, use the [az acr login](/cli/azure/acr#login) command.

```azurecli-interactive
az acr login --name <acrname>
```

The command returns a 'Login Succeeded' message once completed.

## Push image to ACR

To push an image to an Azure Container registry, you must first have an image. If needed, run the following command to pull a pre-created image from Docker Hub.

```bash
docker pull microsoft/aci-helloworld
```

The image needs to be tagged with the ACR login server name. Run the following command to return the login server name of the ACR instance.

```bash
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Tag the image using the [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) command. Replace *acrLoginServer* with the login server name of your ACR instance.

```
docker tag microsoft/aci-helloworld <acrLoginServer>/aci-helloworld:v1
```

Finally, use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push the image to the ACR instance. Replace *acrLoginServer* with the login server name of your ACR instance.

```
docker push <acrLoginServer>/aci-helloworld:v1
```

## List container images

The following example lists the repositories in a registry:

```azurecli
az acr repository list -n <acrname> -o table
```

Output:

```json
Result
----------------
aci-helloworld
```

The following example lists the tags on the **aci-helloworld** repository.

```azurecli
az acr repository show-tags -n <acrname> --repository aci-helloworld -o table
```

Output:

```Result
--------
v1
```

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, ACR instance, and all container images.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you created an Azure Container Registry with the Azure CLI. If you'd like to build a container image, and then deploy it to Azure Container Instances using an Azure Container Registry repository, continue to the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial](../container-instances/container-instances-tutorial-prepare-app.md)