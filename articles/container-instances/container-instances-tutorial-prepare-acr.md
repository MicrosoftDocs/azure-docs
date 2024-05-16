---
title: Tutorial - Prepare container registry to deploy image
description: Azure Container Instances tutorial part 2 of 3 - Prepare an Azure container registry and push an image
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 06/17/2022
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Create an Azure container registry and push a container image

This is part two of a three-part tutorial. [Part one](container-instances-tutorial-prepare-app.md) of the tutorial created a Docker container image for a Node.js web application. In this tutorial, you push the image to Azure Container Registry. If you haven't yet created the container image, return to [Tutorial 1 – Create container image](container-instances-tutorial-prepare-app.md).

Azure Container Registry is your private Docker registry in Azure. In this tutorial, part two of the series, you:

> [!div class="checklist"]
> * Create an Azure Container Registry instance with the Azure CLI
> * Tag a container image for your Azure container registry
> * Upload the image to your registry

In the next article, the last in the series, you deploy the container from your private registry to Azure Container Instances.

## Before you begin

[!INCLUDE [container-instances-tutorial-prerequisites](../../includes/container-instances-tutorial-prerequisites.md)]

[!INCLUDE [container-instances-create-registry](../../includes/container-instances-create-registry.md)]

## Tag container image

To push a container image to a private registry like Azure Container Registry, you must first tag the image with the full name of the registry's login server.

First, get the full login server name for your Azure container registry. Run the following [az acr show][az-acr-show] command, and replace `<acrName>` with the name of registry you just created:

```azurecli-interactive
az acr show --name <acrName> --query loginServer --output table
```

For example, if your registry is named *mycontainerregistry082*:

```azurecli-interactive
az acr show --name mycontainerregistry082 --query loginServer --output table
```

```output
Result
------------------------
mycontainerregistry082.azurecr.io
```

Now, display the list of your local images with the [docker images][docker-images] command:

```bash
docker images
```

Along with any other images you have on your machine, you should see the *aci-tutorial-app* image you built in the [previous tutorial](container-instances-tutorial-prepare-app.md):

```bash
docker images
```
```output
REPOSITORY          TAG       IMAGE ID        CREATED           SIZE
aci-tutorial-app    latest    5c745774dfa9    39 minutes ago    68.1 MB
```

Tag the *aci-tutorial-app* image with the login server of your container registry. Also, add the `:v1` tag to the end of the image name to indicate the image version number. Replace `<acrLoginServer>` with the result of the [az acr show][az-acr-show] command you executed earlier.

```bash
docker tag aci-tutorial-app <acrLoginServer>/aci-tutorial-app:v1
```

Run `docker images` again to verify the tagging operation:

```bash
docker images
```
```output
REPOSITORY                                            TAG       IMAGE ID        CREATED           SIZE
aci-tutorial-app                                      latest    5c745774dfa9    39 minutes ago    68.1 MB
mycontainerregistry082.azurecr.io/aci-tutorial-app    v1        5c745774dfa9    7 minutes ago     68.1 MB
```

## Push image to Azure Container Registry

Now that you've tagged the *aci-tutorial-app* image with the full login server name of your private registry, you can push the image to the registry with the [docker push][docker-push] command. Replace `<acrLoginServer>` with the full login server name you obtained in the earlier step.

```bash
docker push <acrLoginServer>/aci-tutorial-app:v1
```

The `push` operation should take a few seconds to a few minutes depending on your internet connection, and output is similar to the following:

```bash
docker push mycontainerregistry082.azurecr.io/aci-tutorial-app:v1
```
```output
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

To verify that the image you just pushed is indeed in your Azure container registry, list the images in your registry with the [az acr repository list][az-acr-repository-list] command. Replace `<acrName>` with the name of your container registry.

```azurecli-interactive
az acr repository list --name <acrName> --output table
```

For example:

```azurecli-interactive
az acr repository list --name mycontainerregistry082 --output table
```

```output
Result
----------------
aci-tutorial-app
```

To see the *tags* for a specific image, use the [az acr repository show-tags][az-acr-repository-show-tags] command.

```azurecli-interactive
az acr repository show-tags --name <acrName> --repository aci-tutorial-app --output table
```

You should see output similar to the following:

```output
--------
v1
```

## Next steps

In this tutorial, you prepared an Azure container registry for use with Azure Container Instances, and pushed a container image to the registry. The following steps were completed:

> [!div class="checklist"]
> * Created an Azure Container Registry instance with the Azure CLI
> * Tagged a container image for Azure Container Registry
> * Uploaded an image to Azure Container Registry

Advance to the next tutorial to learn how to deploy the container to Azure using Azure Container Instances:

> [!div class="nextstepaction"]
> [Deploy container to Azure Container Instances](container-instances-tutorial-deploy-app.md)

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
[nodejs]: https://nodejs.org

<!-- LINKS - Internal -->
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-acr-repository-list]: /cli/azure/acr/repository
[az-acr-repository-show-tags]: /cli/azure/acr/repository#az_acr_repository_show_tags
[az-acr-show]: /cli/azure/acr#az_acr_show
[az-group-create]: /cli/azure/group#az_group_create
[azure-cli-install]: /cli/azure/install-azure-cli
