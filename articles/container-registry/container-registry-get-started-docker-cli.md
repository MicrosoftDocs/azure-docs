---
title: Work with images in a container registry | Microsoft Docs
description: Push and pull Docker images to an Azure container registry using the Docker CLI
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: dlepow
tags: ''
keywords: ''

ms.service: container-registry
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/02/2016
ms.author: stevelas
---
# Push your first image to a container registry using the Docker CLI
The Azure Container Registry is a private instance of the public [Docker Hub](http://hub.docker.com). You use the [Docker Command-Line Interface](https://docs.docker.com/engine/reference/commandline/cli/) (Docker CLI) for [login](https://docs.docker.com/engine/reference/commandline/login/), [push](https://docs.docker.com/engine/reference/commandline/push/), [pull](https://docs.docker.com/engine/reference/commandline/pull/), and other operations on your container registry. 

> [!NOTE]
> Container Registry is currently in private preview.
> 
> 

## Prerequisites
* **Azure container registry** - Create a container registry in your Azure subscription, for example using the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
* **Docker host** - To set up your local computer as a Docker host to run the Docker CLI, see the [Docker documentation](https://docs.docker.com/engine/installation/).

## Login to a registry
Run **docker login** to login to your container registry with your [registry credentials](container-registry-authentication.md). We recommend that you login with an Azure Active Directory [service principal](https://azure.microsoft.com/documentation/articles/active-directory-application-objects/) that you assign to your registry. 

The following example passes the service principal ID and password. Make sure to Fspecify he fully qualified registry name (all lowercase; the **-exp** in the prefix is required for preview).

```
docker login myregistry-exp.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
```


## Walkthrough to pull and push an image
The follow example downloads an Nginx image from the public Docker Hub, tags it for your private Azure container registry, pushes it to your registry, then pulls it again.

**1. Pull the Docker official image for Nginx**

```
docker pull nginx
```
**2. Start the Nginx container**

The following command starts the Nginx container interactively to see output from Nginx, listening on port 8080. It removes the running container once stopped.

```
docker run -it --rm -p 8080:80 nginx
```

Browse to [http://localhost:8080](http://localhost:8080) to view the running container.

Press [CTRL]+[C] to stop the running container.

**3. Create an alias of the image in your registry**

The following command creates an alias of the image, with a fully qualified path to your  registry. This example specifies the **samples** namespace to avoid polluting the root of the registry.

```
docker tag nginx myregistry-exp.azurecr.io/samples/nginx
```  

**4. Push the image to your registry**

```
docker push myregistry-exp.azurecr.io/samples/nginx
``` 

**5. Pull the image from your registry**

```
docker pull myregistry-exp.azurecr.io/samples/nginx
``` 

**6. Start the Nginx container from your registry**

```
docker run -it --rm -p 8080:80 myregistry-exp.azurecr.io/samples/nginx
```

Browse to [http://localhost:8080](http://localhost:8080) to view the running container.

Press [CTRL]+[C] to stop the running container.

**6. Remove the image**

```
docker rmi myregistry-exp.azurecr.io/samples/nginx
```



## Next steps
Start deploying images to the [Azure Container Service](https://azure.microsoft.com/documentation/services/container-service/).

## Additional docs
* [Create a container registry using the Azure portal ](container-registry-get-started-portal.md)
* [Authenticate with a container registry](container-registry-authentication.md) 
* [Install the Azure CLI for container Registry ](./container-registry-get-started-azure-cli-install.md)
* [Create a container registry using the Azure CLI](container-registry-get-started-docker-cli.md)

