---
title: Azure Container Registry  repositories
description: How to use Azure Container Registry repositories for Docker images
services: container-registry
author: cristy
manager: timlt

ms.service: container-registry
ms.topic: article
ms.date: 01/05/2018
ms.author: cristyg
---

# Azure Container Registry repositories

Azure container registry allows you to store Docker container images in repositories. By storing images in repositories, you can have groups of images (or versions of images) in isolated environments. You can specify these repositories when you push images to your registry.

## Prerequisites

* **Container registry**: Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
* **Docker CLI**: Install [Docker](https://docs.docker.com/engine/installation/) on your local machine, which provides you with the Docker command-line interface.
* **Container image**: Push an image to your container registry. For guidance on how push and pull images, see [Push and pull and image](container-registry-get-started-docker-cli.md).

## View repositories in Azure portal

You can see a list of the repositories hosting your images in the Azure portal, as well as image tags.

If you followed the steps in [Push and pull and image](container-registry-get-started-docker-cli.md) (and didn't subsequently delete the image), you should have a Nginx image in your container registry. The instructions in that article specified that you tag the image with a namespace, the "samples" in `/samples/nginx`. As a refresher, the command specified to push the image was:

```Bash
docker push myregistry.azurecr.io/samples/nginx
```

 Because Azure Container Registry supports such multilevel repository namespaces, you can group collections of images related to a specific app, or a collection of apps, to different development or operational teams. To read more about repositories in container registries, see [Private Docker container registries in Azure](container-registry-intro.md).

To view container a repository:

1. Sign in to the [Azure portal][portal]
1. Select the Azure Container Registry to which you pushed the Nginx image
1. Select **Repositories** to see a list of the repositories that contain the images in the registry
1. Select a repository to see the image tags within that repository

For example, if you pushed the Nginx image as instructed in [Push and pull and image](container-registry-get-started-docker-cli.md), you should see something similar to the following:

![Repositories in the portal](./media/container-registry-repositories/container-registry-repositories.png)

## Next steps

Now that you know the basics, you're ready to start using your registry! For example, start deploying container images to an [Azure Container Service](https://azure.microsoft.com/documentation/services/container-service/) cluster.

<!-- LINKS - External -->
[portal]: https://portal.azure.com

<!-- LINKS - Internal -->
