---
title: Push & pull Docker image
description: Push and pull Docker images to a private container registry in Azure using the Docker CLI
ms.topic: article
ms.date: 01/23/2019
ms.custom: "seodec18, H1Hack27Feb2017"
---

# Push your first image to a private Docker container registry using the Docker CLI

An Azure container registry stores and manages private [Docker](https://hub.docker.com) container images, similar to the way [Docker Hub](https://hub.docker.com/) stores public Docker images. You can use the [Docker command-line interface](https://docs.docker.com/engine/reference/commandline/cli/) (Docker CLI) for [login](https://docs.docker.com/engine/reference/commandline/login/), [push](https://docs.docker.com/engine/reference/commandline/push/), [pull](https://docs.docker.com/engine/reference/commandline/pull/), and other operations on your container registry.

In the following steps, you download an official [Nginx image](https://store.docker.com/images/nginx) from the public Docker Hub registry, tag it for your private Azure container registry, push it to your registry, and then pull it from the registry.

## Prerequisites

* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
* **Docker CLI** - You must also have Docker installed locally. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

## Log in to a registry

There are [several ways to authenticate](container-registry-authentication.md) to your private container registry. The recommended method when working in a command line is with the Azure CLI command [az acr login](/cli/azure/acr?view=azure-cli-latest#az-acr-login). For example, to log in to a registry named *myregistry*:

```azurecli
az acr login --name myregistry
```

You can also log in with [docker login](https://docs.docker.com/engine/reference/commandline/login/). For example, you might have [assigned a service principal](container-registry-authentication.md#service-principal) to your registry for an automation scenario. When you run the following command, interactively provide the service principal appID (username) and password when prompted. For best practices to manage login credentials, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command reference:

```
docker login myregistry.azurecr.io
```

Both commands return `Login Succeeded` once completed.

> [!TIP]
> Always specify the fully qualified registry name (all lowercase) when you use `docker login` and when you tag images for pushing to your registry. In the examples in this article, the fully qualified name is *myregistry.azurecr.io*.

## Pull the official Nginx image

First, pull the public Nginx image to your local computer.

```
docker pull nginx
```

## Run the container locally

Execute following [docker run](https://docs.docker.com/engine/reference/run/) command to start a local instance of the Nginx container interactively (`-it`) on port 8080. The `--rm` argument specifies that the container should be removed when you stop it.

```
docker run -it --rm -p 8080:80 nginx
```

Browse to `http://localhost:8080` to view the default web page served by Nginx in the running container. You should see a page similar to the following:

![Nginx on local computer](./media/container-registry-get-started-docker-cli/nginx.png)

Because you started the container interactively with `-it`, you can see the Nginx server's output on the command line after navigating to it in your browser.

To stop and remove the container, press `Control`+`C`.

## Create an alias of the image

Use [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) to create an alias of the image with the fully qualified path to your registry. This example specifies the `samples` namespace to avoid clutter in the root of the registry.

```
docker tag nginx myregistry.azurecr.io/samples/nginx
```

For more information about tagging with namespaces, see the [Repository namespaces](container-registry-best-practices.md#repository-namespaces) section of [Best practices for Azure Container Registry](container-registry-best-practices.md).

## Push the image to your registry

Now that you've tagged the image with the fully qualified path to your private registry, you can push it to the registry with [docker push](https://docs.docker.com/engine/reference/commandline/push/):

```
docker push myregistry.azurecr.io/samples/nginx
```

## Pull the image from your registry

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to pull the image from your registry:

```
docker pull myregistry.azurecr.io/samples/nginx
```

## Start the Nginx container

Use the [docker run](https://docs.docker.com/engine/reference/run/) command to run the image you've pulled from your registry:

```
docker run -it --rm -p 8080:80 myregistry.azurecr.io/samples/nginx
```

Browse to `http://localhost:8080` to view the running container.

To stop and remove the container, press `Control`+`C`.

## Remove the image (optional)

If you no longer need the Nginx image, you can delete it locally with the [docker rmi](https://docs.docker.com/engine/reference/commandline/rmi/) command.

```
docker rmi myregistry.azurecr.io/samples/nginx
```

To remove images from your Azure container registry, you can use the Azure CLI command [az acr repository delete](/cli/azure/acr/repository#az-acr-repository-delete). For example, the following command deletes the manifest referenced by the `samples/nginx:latest` tag, any unique layer data, and all other tags referencing the manifest.

```azurecli
az acr repository delete --name myregistry --image samples/nginx:latest
```

## Next steps

Now that you know the basics, you're ready to start using your registry! For example, deploy container images from your registry to:

* [Azure Kubernetes Service (AKS)](../aks/tutorial-kubernetes-prepare-app.md)
* [Azure Container Instances](../container-instances/container-instances-tutorial-prepare-app.md)
* [Service Fabric](../service-fabric/service-fabric-tutorial-create-container-images.md)

Optionally install the [Docker Extension for Visual Studio Code](https://code.visualstudio.com/docs/azure/docker) and the [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account) extension to work with your Azure container registries. Pull and push images to an Azure container registry, or run ACR Tasks, all within Visual Studio Code.


<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows/
