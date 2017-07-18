---
title: Create a multi-container group with Azure Container Instances | Azure Docs
description: Create a multi-container group and deploy it to Azure Container Instances from the Azure Container Registry
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: ''

ms.assetid: 
ms.service: 
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/15/2017
ms.author: seanmck
ms.custom: 
---

# Create containers for deployment to Azure Container Instances

Azure Container Instances supports deployment of groups of containers onto a single host machine, where they can share mounted volumes and reach each other on the local network. In this tutorial, we will build two simple containers that can cooperate as part of a group. We will cover:

> [!div class="checklist"]
> * Cloning application source from GitHub  
> * Creating container images from application source
> * Testing the images in a local Docker environment

In subsequent tutorials, these container images are uploaded to an Azure Container Registry, and then deployed in a group using Azure Container Instances.

## Before you begin

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic docker commands. If needed, see [Get started with Docker]( https://docs.docker.com/get-started/) for a primer on container basics. 

To complete this tutorial, you need a Docker development environment. Docker provides packages that easily configure Docker on any [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), or [Linux](https://docs.docker.com/engine/installation/#supported-platforms) system.

## Get application code

The sample in this tutorial includes a simple web application built in [Go](http://golang.org) and a [sidecar][sidecar-pattern] shell script that periodically makes a request to the main app using curl.

Use git to download the sample:

```bash
git clone https://github.com/seanmck/aci-tutorial.git
```

The sample includes two directories, one for each container. Each directory contains a Dockerfile that you can use to build the container image.

## Build the container images

Use the `docker build` command to create the container images. First create the main application image:

```bash
docker build ./aci-tutorial/app -t aci-tutorial-app
```

Repeat for the sidecar container:

```bash
docker build ./aci-tutorial/sidecar -t aci-tutorial-sidecar
```

Use the `docker images` to see the built images:

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
aci-tutorial-app             latest              5c745774dfa9        39 seconds ago       6.45 MB
aci-tutorial-sidecar         latest              057343f8b24a        About a minute ago   6.33 MB
```

You now have two container images that can be deployed to Azure Container Instances as a group.

## Next steps

In this tutorial, you created two container images that can be deployed to Azure Container Instances. The following steps were completed:

> [!div class="checklist"]
> * Cloning the application source from GitHub  
> * Creating container images from application source

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](./container-instances-tutorial-prepare-acr.md)

<!--- Links --->
[sidecar-pattern]:https://docs.microsoft.com/en-us/azure/architecture/patterns/sidecar