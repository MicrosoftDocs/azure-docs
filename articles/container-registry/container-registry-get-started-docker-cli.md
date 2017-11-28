---
title: Push Docker image to private Azure registry
description: Push and pull Docker images to a private container registry in Azure using the Docker CLI
services: container-registry
author: stevelas
manager: balans
editor: mmacy

ms.service: container-registry
ms.topic: article
ms.date: 12/01/2017
ms.author: stevelas
ms.custom: H1Hack27Feb2017
---

# Push your first image to a private Docker container registry using the Docker CLI

An Azure container registry stores and manages private [Docker](http://hub.docker.com) container images, similar to the way [Docker Hub](https://hub.docker.com/) stores public Docker images. You use the [Docker command-line interface](https://docs.docker.com/engine/reference/commandline/cli/) (Docker CLI) for [login](https://docs.docker.com/engine/reference/commandline/login/), [push](https://docs.docker.com/engine/reference/commandline/push/), [pull](https://docs.docker.com/engine/reference/commandline/pull/), and other operations on your container registry.

In the following steps, you download an official NGINX image from the public Docker Hub registry, tag it for your private Azure container registry, push it to your registry, and then pull it from the registry.

## Prerequisites

* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI 2.0](container-registry-get-started-azure-cli.md).
* **Docker CLI** - To set up your local computer as a Docker host and access the Docker CLI commands, install [Docker Engine](https://docs.docker.com/engine/installation/).

## Log in to a registry

There are [several ways to authenticate](container-registry-authentication.md) to your private container registry. The recommended method when working in a command line is with the Azure CLI command [az acr login](/cli/azure/acr?view=azure-cli-latest#az_acr_login):

```azurecli
az acr login --name <acrName>
```

You can also log in with `docker login`. The following example passes the ID and password of an Azure Active Directory [service principal](../active-directory/active-directory-application-objects.md). For example, you might have [assigned a service principal](container-registry-authentication.md#service-principal) to your registry for an automation scenario.

```
docker login myregistry.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
```

Both commands returns `Login Succeeded` once completed. If you use `docker login`, you might also see a security warning recommending the use of the `--password-stdin` parameter. While its use is outside the scope of this article, we recommend following this best practice. See the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command reference for more information.

> [!TIP]
> Make sure to specify the fully qualified registry name (all lowercase) when you use `docker login` and when you tag your images. In this example, the fully qualified name is *myregistry.azurecr.io*.

## Pull the official NGINX Docker image

First, pull the public NGINX image to your local computer.

```
docker pull nginx
```

You can optionally execute following command to start a local instance of the NGINX container on port 8080, allowing you to see output from NGINX. It removes the running container once stopped.

```
docker run -it --rm -p 8080:80 nginx
```

Browse to [http://localhost:8080](http://localhost:8080) to view the running container. You see a screen similar to the following:

![Nginx on local computer](./media/container-registry-get-started-docker-cli/nginx.png)

To stop the container, press `Control+C`.

## Create an alias of the image for your registry

The following command creates an alias of the image, with a fully qualified path to your registry. This example specifies the `samples` namespace to avoid clutter in the root of the registry.

```
docker tag nginx myregistry.azurecr.io/samples/nginx
```

## Push the image to your registry

```
docker push myregistry.azurecr.io/samples/nginx
```

## Pull the image from your registry

```
docker pull myregistry.azurecr.io/samples/nginx
```

## Start the NGINX container from your registry

```
docker run -it --rm -p 8080:80 myregistry.azurecr.io/samples/nginx
```

Browse to [http://localhost:8080](http://localhost:8080) to view the running container.

To stop the running container, press [CTRL]+[C].

## Remove the image (optional)

```
docker rmi myregistry.azurecr.io/samples/nginx
```

## Next steps

Now that you know the basics, you're ready to start using your registry! For example, deploy container images from your registry to an [Azure Container Service (AKS)](../aks/tutorial-kubernetes-prepare-app.md) cluster.
