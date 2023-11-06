---
title: Kubernetes on Azure tutorial - Create an Azure Container Registry and build images
description: In this Azure Kubernetes Service (AKS) tutorial, you create an Azure Container Registry instance and upload sample application container images.
ms.topic: tutorial
ms.date: 11/02/2023
ms.custom: mvc, devx-track-azurecli, devx-track-azurepowershell

#Customer intent: As a developer, I want to learn how to create and use a container registry so that I can deploy my own applications to Azure Kubernetes Service.
---

# Tutorial - Create an Azure Container Registry (ACR) and build images

Azure Container Registry (ACR) is a private registry for container images. A private container registry allows you to securely build and deploy your applications and custom code.

In this tutorial, part two of seven, you deploy an ACR instance and push a container image to it. You learn how to:

> [!div class="checklist"]
>
> * Create an ACR instance.
> * Use [ACR Tasks][acr-tasks] to build and push container images to ACR.
> * View images in your registry.

## Before you begin

In the [previous tutorial][aks-tutorial-prepare-app], you used Docker to create a container image for a simple Azure Store Front application. If you haven't created the Azure Store Front app image, return to [Tutorial 1 - Prepare an application for AKS][aks-tutorial-prepare-app].

### [Azure CLI](#tab/azure-cli)

This tutorial requires Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

## Create an Azure Container Registry

Before creating an ACR instance, you need a resource group. An Azure resource group is a logical container into which you deploy and manage Azure resources.

> [!IMPORTANT]
> This tutorial uses *myResourceGroup* as a placeholder for the resource group name. If you want to use a different name, replace *myResourceGroup* with your own resource group name.

### [Azure CLI](#tab/azure-cli)

1. Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

2. Create an ACR instance using the [`az acr create`][az-acr-create] command and provide your own unique registry name. The registry name must be unique within Azure and contain 5-50 alphanumeric characters. The rest of this tutorial uses an environment variable, `$ACRNAME`, as a placeholder for the container registry name. You can set this environment variable to your unique ACR name to use in future commands. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

    ```azurecli-interactive
    az acr create --resource-group myResourceGroup --name $ACRNAME --sku Basic
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Create a resource group using the [`New-AzResourceGroup`][new-azresourcegroup] cmdlet.

    ```azurepowershell-interactive
    New-AzResourceGroup -Name myResourceGroup -Location eastus
    ```

2. Create an ACR instance using the [`New-AzContainerRegistry`][new-azcontainerregistry] cmdlet and provide your own unique registry name. The registry name must be unique within Azure and contain 5-50 alphanumeric characters. The rest of this tutorial uses an environment variable, `$ACRNAME`, as a placeholder for the container registry name. You can set this environment variable to your unique ACR name to use in future commands. The *Basic* SKU is a cost-optimized entry point for development purposes that provides a balance of storage and throughput.

    ```azurepowershell-interactive
    New-AzContainerRegistry -ResourceGroupName myResourceGroup -Name $ACRNAME -Location eastus -Sku Basic
    ```

---

## Build and push container images to registry

* Build and push the images to your ACR using the [`az acr build`][az-acr-build] command.

    > [!NOTE]
    > In the following example, we don't build the `rabbitmq` image. This image is available from the Docker Hub public repository and doesn't need to be built or pushed to your ACR instance.

    ```azurecli-interactive
    az acr build --registry $ACRNAME --image aks-store-demo/product-service:latest ./src/product-service/
    az acr build --registry $ACRNAME --image aks-store-demo/order-service:latest ./src/order-service/
    az acr build --registry $ACRNAME --image aks-store-demo/store-front:latest ./src/store-front/
    ```

## List images in registry

### [Azure CLI](#tab/azure-cli)

* View the images in your ACR instance using the [`az acr repository list`][az-acr-repository-list] command.

    ```azurecli-interactive
    az acr repository list --name $ACRNAME --output table
    ```

    The following example output lists the available images in your registry:

    ```output
    Result
    ----------------
    aks-store-demo/product-service
    aks-store-demo/order-service
    aks-store-demo/store-front
    ```

### [Azure PowerShell](#tab/azure-powershell)

* View the images in your ACR instance using the [`Get-AzContainerRegistryRepository`][get-azcontainerregistryrepository] cmdlet.

    ```azurepowershell-interactive
    Get-AzContainerRegistryRepository -RegistryName $ACRNAME
    ```

    The following example output lists the available images in your registry:

    ```output
    aks-store-demo/productservice
    aks-store-demo/orderservice
    aks-store-demo/storefront
    ```

---

## Next steps

In this tutorial, you created an ACR and pushed images to it to use in an AKS cluster. You learned how to:

> [!div class="checklist"]
>
> * Create an ACR instance.
> * Use [ACR Tasks][acr-tasks] to build and push container images to ACR.
> * View images in your registry.

In the next tutorial, you learn how to deploy a Kubernetes cluster in Azure.

> [!div class="nextstepaction"]
> [Deploy Kubernetes cluster][aks-tutorial-deploy-cluster]

<!-- LINKS - internal -->
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-repository-list]: /cli/azure/acr/repository#az_acr_repository_list
[az-group-create]: /cli/azure/group#az_group_create
[azure-cli-install]: /cli/azure/install-azure-cli
[aks-tutorial-deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[azure-powershell-install]: /powershell/azure/install-az-ps
[new-azresourcegroup]: /powershell/module/az.resources/new-azresourcegroup
[new-azcontainerregistry]: /powershell/module/az.containerregistry/new-azcontainerregistry
[get-azcontainerregistryrepository]: /powershell/module/az.containerregistry/get-azcontainerregistryrepository
[acr-tasks]: ../container-registry/container-registry-tasks-overview.md
[az-acr-build]: /cli/azure/acr#az_acr_build