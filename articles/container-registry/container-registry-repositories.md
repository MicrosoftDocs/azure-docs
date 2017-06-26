---
title: Azure container registry repositories | Microsoft Docs
description: How to use Azure Container Registry repositories for Docker images
services: container-registry
documentationcenter: ''
author: cristy
manager: balans
editor: dlepow


ms.service: container-registry
ms.devlang: na
ms.topic: how-to-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2017
ms.author: cristyg

---
# Azure container registry repositories

Azure container registry allows you to store container images in repositories. By storing images in repositories, you can have groups of images (or version of images) in isolated environments. You can specify these repositories when you push images to your registry.


## Prerequisites
* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI 2.0](container-registry-get-started-azure-cli.md).
* **Docker CLI** - To set up your local computer as a Docker host and access the Docker CLI commands, install [Docker Engine](https://docs.docker.com/engine/installation/).
* **Pull an image** - Pull an image from the public Docker Hub registry, tag it, and push it to your registry. For guidance on how push and pull images, see [Push Docker image to Azure private registry](container-registry-get-started-docker-cli.md).


## Viewing repositories in the Portal

Once you have pushed images to your container registry, you can see a list of the repositories hosting the images in the Azure portal.

If you followed the steps in the [Push Docker image to Azure private registry](container-registry-get-started-docker-cli.md) article, you should now have a Nginx image in your container registry. As part of the instructions, you should have specified a namespace for the image. In the example below, the command pushes the NGinx image to the "samples" repository:

```
docker push myregistry.azurecr.io/samples/nginx
```
 Azure Container Registry supports multilevel repository namespaces. This feature enables you to group collections of images related to a specific app, or a collection of apps to specific development or operational teams. To read more about repositories in container registries, see [Private Docker container registries in Azure](container-registry-intro.md).

To view the container registry repositories:

1. Log in to the Azure portal
2. On the **Azure Container Registry** blade, select the registry you wish to inspect
3. In the registry blade, click **Repositories** to see a list of all the repositories and their images
4. (Optional) Select a specific image to see tags

![Repositories in the portal](./media/container-registry-repositories/container-registry-repositories.png)


## Next steps
Now that you know the basics, you are ready to start using your registry! For example, start deploying container images to an [Azure Container Service](https://azure.microsoft.com/documentation/services/container-service/) cluster.
