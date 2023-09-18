---
title: Kubernetes on Azure tutorial - Create a container registry
description: In this Azure Kubernetes Service (AKS) tutorial, you create an Azure Container Registry instance and upload a sample application container image.
ms.topic: tutorial
ms.date: 02/27/2023
ms.custom: mvc, devx-track-azurecli, devx-track-azurepowershell

#Customer intent: As a developer, I want to learn how to create and use a container registry so that I can deploy my own applications to Azure Kubernetes Service.
---

# Tutorial: Deploy and use Azure Container Registry (ACR)

Azure Container Registry (ACR) is a private registry for container images. A private container registry allows you to securely build and deploy your applications and custom code. In this tutorial, part two of seven, you deploy an ACR instance and push a container image to it. You learn how to:

> [!div class="checklist"]
>
> * Create an ACR instance
> * Tag a container image for ACR
> * Upload the image to ACR
> * View images in your registry

In later tutorials, you integrate your ACR instance with a Kubernetes cluster in AKS, and deploy an application from the image.

## Before you begin

In the [previous tutorial][aks-tutorial-prepare-app], you created a container image for a simple Azure Voting application. If you haven't created the Azure Voting app image, return to [Tutorial 1: Prepare an application for AKS][aks-tutorial-prepare-app].

### [Azure CLI](#tab/azure-cli)

This tutorial requires that you're running the Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

## Create an Azure Container Registry

Before creating an ACR, you need a resource group. An Azure resource group is a logical container into which you deploy and manage Azure resources.

### [Azure CLI](#tab/azure-cli)

1. Create a resource group with the [`az group create`][az-group-create] command.

```azurecli
az group create --name myResourceGroup --location eastus
```

2. Create an ACR instance with the [`az acr create`][az-acr-create] command and provide your own unique registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the rest of this tutorial, `<acrName>` is used as a placeholder for the container registry name. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

```azurecli
az acr create --resource-group myResourceGroup --name <acrName> --sku Basic
```

### [Azure PowerShell](#tab/azure-powershell)

1. Create a resource group with the [`New-AzResourceGroup`][new-azresourcegroup] cmdlet.

```azurepowershell
New-AzResourceGroup -Name myResourceGroup -Location eastus
```

2. Create an ACR instance with the [`New-AzContainerRegistry`][new-azcontainerregistry] cmdlet and provide your own unique registry name. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the rest of this tutorial, `<acrName>` is used as a placeholder for the container registry name. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

```azurepowershell
New-AzContainerRegistry -ResourceGroupName myResourceGroup -Name <acrname> -Sku Basic
```

---

## Log in to the container registry

### [Azure CLI](#tab/azure-cli)

Log in to your ACR using the [`az acr login`][az-acr-login] command and provide the unique name given to the container registry in the previous step.

```azurecli
az acr login --name <acrName>
```

### [Azure PowerShell](#tab/azure-powershell)

Log in to your ACR using the [`Connect-AzContainerRegistry`][connect-azcontainerregistry] cmdlet and provide the unique name given to the container registry in the previous step.

```azurepowershell
Connect-AzContainerRegistry -Name <acrName>
```

---

The command returns a *Login Succeeded* message once completed.

## Tag a container image

To see a list of your current local images, use the [`docker images`][docker-images] command.

```console
docker images
```

The following example output shows a list of the current local Docker images:

```output
REPOSITORY                                     TAG                 IMAGE ID            CREATED             SIZE
mcr.microsoft.com/azuredocs/azure-vote-front   v1                  84b41c268ad9        7 minutes ago       944MB
mcr.microsoft.com/oss/bitnami/redis            6.0.8               3a54a920bb6c        2 days ago          103MB
```

To use the *azure-vote-front* container image with ACR, you need to tag the image with the login server address of your registry. The tag is used for routing when pushing container images to an image registry.

### [Azure CLI](#tab/azure-cli)

To get the login server address, use the [`az acr list`][az-acr-list] command and query for the *loginServer*.

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

### [Azure PowerShell](#tab/azure-powershell)

To get the login server address, use the [`Get-AzContainerRegistry`][get-azcontainerregistry] cmdlet and query for the *loginServer*.

```azurepowershell
(Get-AzContainerRegistry -ResourceGroupName myResourceGroup -Name <acrName>).LoginServer
```

---

Then, tag your local *azure-vote-front* image with the *acrLoginServer* address of the container registry. To indicate the image version, add *:v1* to the end of the image name:

```console
docker tag mcr.microsoft.com/azuredocs/azure-vote-front:v1 <acrLoginServer>/azure-vote-front:v1
```

To verify the tags are applied, run [`docker images`][docker-images] again.

```console
docker images
```

The following example output shows an image tagged with the ACR instance address and a version number:

```console
REPOSITORY                                      TAG                 IMAGE ID            CREATED             SIZE
mcr.microsoft.com/azuredocs/azure-vote-front    v1                  84b41c268ad9        16 minutes ago      944MB
mycontainerregistry.azurecr.io/azure-vote-front v1                  84b41c268ad9        16 minutes ago      944MB
mcr.microsoft.com/oss/bitnami/redis             6.0.8               3a54a920bb6c        2 days ago          103MB
```

## Push images to registry

Push the *azure-vote-front* image to your ACR instance using the [`docker push`][docker-push] command. Make sure to provide your own *acrLoginServer* address for the image name.

```console
docker push <acrLoginServer>/azure-vote-front:v1
```

It may take a few minutes to complete the image push to ACR.

## List images in registry

### [Azure CLI](#tab/azure-cli)

To return a list of images that have been pushed to your ACR instance, use the [`az acr repository list`][az-acr-repository-list] command, providing your own `<acrName>`.

```azurecli
az acr repository list --name <acrName> --output table
```

The following example output lists the *azure-vote-front* image as available in the registry:

```output
Result
----------------
azure-vote-front
```

To see the tags for a specific image, use the [`az acr repository show-tags`][az-acr-repository-show-tags] command.

```azurecli
az acr repository show-tags --name <acrName> --repository azure-vote-front --output table
```

The following example output shows the *v1* image tagged in a previous step:

```output
Result
--------
v1
```

### [Azure PowerShell](#tab/azure-powershell)

To return a list of images that have been pushed to your ACR instance, use the [`Get-AzContainerRegistryManifest`][get-azcontainerregistrymanifest] cmdlet, providing your own `<acrName>`.

```azurepowershell
Get-AzContainerRegistryManifest -RegistryName <acrName> -RepositoryName azure-vote-front
```

The following example output lists the *azure-vote-front* image as available in the registry:

```output
Registry  ImageName        ManifestsAttributes
--------  ---------        -------------------
<acrName> azure-vote-front {Microsoft.Azure.Commands.ContainerRegistry.Models.PSManifestAttributeBase}
```

To see the tags for a specific image, use the [`Get-AzContainerRegistryTag`][get-azcontainerregistrytag] cmdlet as follows:

```azurepowershell
Get-AzContainerRegistryTag -RegistryName <acrName> -RepositoryName azure-vote-front
```

The following example output shows the *v1* image tagged in a previous step:

```output
Registry  ImageName        Tags
--------  ---------        ----
<acrName> azure-vote-front {v1}
```

---

## Next steps

In this tutorial, you created an ACR and pushed an image to use in an AKS cluster. You learned how to:

> [!div class="checklist"]
>
> * Create an ACR instance
> * Tag a container image for ACR
> * Upload the image to ACR
> * View images in your registry

In the next tutorial, you'll learn how to deploy a Kubernetes cluster in Azure.

> [!div class="nextstepaction"]
> [Deploy Kubernetes cluster][aks-tutorial-deploy-cluster]

<!-- LINKS - external -->
[docker-images]: https://docs.docker.com/engine/reference/commandline/images/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/

<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-list]: /cli/azure/acr#az_acr_list
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-acr-repository-list]: /cli/azure/acr/repository#az_acr_repository_list
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az_acr_repository_show_tags
[az-group-create]: /cli/azure/group#az_group_create
[azure-cli-install]: /cli/azure/install-azure-cli
[aks-tutorial-deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[azure-powershell-install]: /powershell/azure/install-az-ps
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
[new-azcontainerregistry]: /powershell/module/az.containerregistry/new-azcontainerregistry
[connect-azcontainerregistry]: /powershell/module/az.containerregistry/connect-azcontainerregistry
[get-azcontainerregistry]: /powershell/module/az.containerregistry/get-azcontainerregistry
[get-azcontainerregistrymanifest]: /powershell/module/az.containerregistry/get-azcontainerregistrymanifest
[get-azcontainerregistrytag]: /powershell/module/az.containerregistry/get-azcontainerregistrytag
