---
title: Azure Container Instances tutorial - Prepare Azure Container Registry
description: Azure Container Instances tutorial part 2 of 3 - Prepare Azure Container Registry
services: container-instances
author: neilpeterson
manager: timlt

ms.service: container-instances
ms.topic: tutorial
ms.date: 01/02/2018
ms.author: seanmck
ms.custom: mvc
---

# Deploy and use Azure Container Registry

This is part two of a three-part tutorial. In the [previous step](container-instances-tutorial-prepare-app.md), a container image was created for a simple web application written in [Node.js][nodejs]. In this tutorial, you push the image to an Azure Container Registry. If you have not created the container image, return to [Tutorial 1 – Create container image](container-instances-tutorial-prepare-app.md).

The Azure Container Registry is an Azure-based, private registry for Docker container images. This tutorial walks you through deploying an Azure Container Registry instance, and pushing a container image to it.

In this article, part two of the series, you:

> [!div class="checklist"]
> * Deploy an Azure Container Registry instance
> * Tag a container image for your Azure container registry
> * Upload the image to your registry

In the next article, the final tutorial in the series, you deploy the container from your private registry to Azure Container Instances.

## Before you begin

This tutorial requires that you are running the Azure CLI version 2.0.23 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0][azure-cli-install].

To complete this tutorial, you need a Docker development environment installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

Azure Cloud Shell does not include the Docker components required to complete every step this tutorial. You must install the Azure CLI and Docker development environment on your local computer to complete this tutorial.

## Deploy Azure Container Registry

When deploying an Azure Container Registry, you first need a resource group. An Azure resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create][az-group-create] command. In this example, a resource group named *myResourceGroup* is created in the *eastus* region.

```azurecli
az group create --name myResourceGroup --location eastus
```

Create an Azure container registry with the [az acr create][az-acr-create] command. The container registry name must be unique within Azure, and contain 5-50 alphanumeric characters. Replace `<acrName>` with a unique name for your registry:

```azurecli
az acr create --resource-group myResourceGroup --name <acrName> --sku Basic
```

For example, to create an Azure container registry named *mycontainerregistry082*:

```azurecli
az acr create --resource-group myResourceGroup --name mycontainerregistry082 --sku Basic --admin-enabled true
```

Throughout the rest of this tutorial, we use `<acrName>` as a placeholder for the container registry name that you chose.

## Container registry login

You must log in to your Azure Container Registry instance before pushing images to it. Use the [az acr login][az-acr-login] command to complete the operation. You must provide the unique name you provided for the container registry when you created it.

```azurecli
az acr login --name <acrName>
```

The command returns a `Login Succeeded` message once completed.

## Tag container image

To deploy a container image from a private registry, you must tag the image with the `loginServer` name of the registry.

To see a list of current images, use the [docker images][docker-images] command.

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
aci-tutorial-app             latest              5c745774dfa9        39 seconds ago       68.1 MB
```

To get the loginServer name, run the [az acr show][az-acr-show] command. Replace `<acrName>` with the name of your container registry.

```azurecli
az acr show --name <acrName> --query loginServer --output table
```

Example output:

```
Result
------------------------
mycontainerregistry082.azurecr.io
```

Tag the *aci-tutorial-app* image with the loginServer of your container registry. Also, add `:v1` to the end of the image name. This tag indicates the image version number. Replace `<acrLoginServer>` with the result of the [az acr show][az-acr-show] command you just executed.

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

Push the *aci-tutorial-app* image to the registry with the [docker push][docker-push] command. Replace `<acrLoginServer>` with the full login server name you obtain in the earlier step.

```bash
docker push <acrLoginServer>/aci-tutorial-app:v1
```

The `push` operation should take a few seconds to a few minutes depending on your internet connection, and output is similar to the following:

```bash
The push refers to a repository [mycontainerregistry082.azurecr.io/aci-tutorial-app]
3db9cac20d49: Pushed
13f653351004: Pushed
4cd158165f4d: Pushed
d8fbd47558a8: Pushed
44ab46125c35: Pushed
5bef08742407: Pushed
v1: digest: sha256:ed67fff971da47175856505585dcd92d1270c3b37543e8afd46014d328f05715 size: 1576
```

## List images in Azure Container Registry

To return a list of images that have been pushed to your Azure Container registry, use the [az acr repository list][az-acr-repository-list] command. Update the command with the container registry name.

```azurecli
az acr repository list --name <acrName> --output table
```

Output:

```azurecli
Result
----------------
aci-tutorial-app
```

And then to see the tags for a specific image, use the [az acr repository show-tags][az-acr-repository-show-tags] command.

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

In this tutorial, you prepared an Azure Container Registry for use with Azure Container Instances, and pushed a container image to the registry. The following steps were completed:

> [!div class="checklist"]
> * Deployed an Azure Container Registry instance
> * Tagged a container image for Azure Container Registry
> * Uploaded an image to Azure Container Registry

Advance to the next tutorial to learn about deploying the container to Azure using Azure Container Instances.

> [!div class="nextstepaction"]
> [Deploy containers to Azure Container Instances](./container-instances-tutorial-deploy-app.md)

<!-- LINKS - External -->
[docker-build]: https://docs.docker.com/engine/reference/commandline/build/
[docker-get-started]: https://docs.docker.com/get-started/
[docker-hub-nodeimage]: https://store.docker.com/images/node
[docker-images]: https://docs.docker.com/engine/reference/commandline/images/
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/
[nodejs]: http://nodejs.org

<!-- LINKS - Internal -->
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-acr-repository-list]: /cli/azure/acr/repository#az_acr_list
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az_acr_repository_show_tags
[az-acr-show]: /cli/azure/acr#az_acr_show
[az-group-create]: /cli/azure/group#az_group_create
[azure-cli-install]: /cli/azure/install-azure-cli
