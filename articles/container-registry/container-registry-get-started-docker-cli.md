---
title: Docker operations on a container registry | Microsoft Docs
description: Push and pull Docker images to an Azure container registry using the Docker CLI
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: dlepow
tags: ''
keywords: ''

ms.assetid: 64fbe43f-fdde-4c17-a39a-d04f2d6d90a1
ms.service: container-registry
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/09/2016
ms.author: stevelas
---
# Push your first image to a container registry using the Docker CLI
An Azure container registry stores and manages private [Docker](http://hub.docker.com) container images, similar to the way [Docker Hub](https://hub.docker.com/) stores public Docker images. You use the [Docker Command-Line Interface](https://docs.docker.com/engine/reference/commandline/cli/) (Docker CLI) for [login](https://docs.docker.com/engine/reference/commandline/login/), [push](https://docs.docker.com/engine/reference/commandline/push/), [pull](https://docs.docker.com/engine/reference/commandline/pull/), and other operations on your container registry. 

For more background and concepts, see [What is Azure Container Registry?](container-registry-intro.md)


> [!NOTE]
> Container Registry is currently in preview.
> 
> 

## Prerequisites
* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI 2.0 Preview](container-registry-get-started-azure-cli.md).
* **Docker CLI** - To set up your local computer as a Docker host and access the Docker CLI commands, install [Docker Engine](https://docs.docker.com/engine/installation/).

## Log in to a registry
Run `docker login` to log in to your container registry with your [registry credentials](container-registry-authentication.md).

The following example passes the ID and password of an Azure Active Directory [service principal](../active-directory/active-directory-application-objects.md). For example, you might have assigned a service principal to your registry to use in automation scenarios. 

```
docker login myregistry.contoso.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
```

> [!TIP]
> Make sure to specify the fully qualified registry name (all lowercase). In this example, it is `myregistry.contoso.azurecr.io`.

## Walkthrough to pull and push an image
The follow example downloads an Nginx image from the public Docker Hub registry, tags it for your private Azure container registry, pushes it to your registry, then pulls it again.

**1. Pull the Docker official image for Nginx**

First pull the public Nginx image to your local computer.

```
docker pull nginx
```
**2. Start the Nginx container**

The following command starts the local Nginx container interactively (so you can see output from Nginx) and listening on port 8080. It removes the running container once stopped.

```
docker run -it --rm -p 8080:80 nginx
```

Browse to [http://localhost:8080](http://localhost:8080) to view the running container. You'll see a screen similar to the following one.

![Nginx on local computer](./media/container-registry-get-started-docker-cli/nginx.png)

Press [CTRL]+[C] to stop the running container.

**3. Create an alias of the image in your registry**

The following command creates an alias of the image, with a fully qualified path to your  registry. This example specifies the `samples` namespace to avoid clutter in the root of the registry.

```
docker tag nginx myregistry-exp.azurecr.io/samples/nginx
```  

**4. Push the image to your registry**

```
docker push myregistry.contoso.azurecr.io/samples/nginx
``` 

**5. Pull the image from your registry**

```
docker pull myregistry.contoso.azurecr.io/samples/nginx
``` 

**6. Start the Nginx container from your registry**

```
docker run -it --rm -p 8080:80 myregistry-exp.azurecr.io/samples/nginx
```

Browse to [http://localhost:8080](http://localhost:8080) to view the running container.

Press [CTRL]+[C] to stop the running container.

**6. Remove the image**

```
docker rmi myregistry.contoso.azurecr.io/samples/nginx
```



## Next steps
Now that you know the basics, you are ready to start using your registry! For example, start deploying container images to an [Azure Container Service](https://azure.microsoft.com/documentation/services/container-service/) cluster.



