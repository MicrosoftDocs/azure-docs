---
title: Service Fabric tutorial - Create Container Images | Microsoft Docs
description: Service Fabric tutorial - Create Container Images
services: service-fabric
documentationcenter: ''
author: suhuruli
manager: mfussel
editor: suhuruli
tags: servicefabric
keywords: Docker, Containers, Micro-services, Service Fabric, Azure

ms.assetid: 
ms.service: service-fabric
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/15/2017
ms.author: suhuruli
ms.custom: mvc
---

# Create container images to be used with Service Fabric

This tutorial is part one of a tutorial series that demonstrates how to use containers in a Linux Service Fabric cluster. In this tutorial series, you learn how to: 

> [!div class="checklist"]
> * Create container images
> * Push container images to Azure Container Registry
> * Package Containers for Service Fabric using Yeoman
> * Build and Run a Service Fabric Application with Containers
> * How failover and scaling are handled in Service Fabric

In this tutorial, a multi-container application is prepared for use with Service Fabric. Steps completed include: 

> [!div class="checklist"]
> * Cloning application source from GitHub  
> * Creating a container image from the application source

In subsequent tutorials, these images are pushed to the Azure Container Registry and used by a Service Fabric application.

## Prerequisites

- This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic docker commands. If needed, see [Get started with Docker]( https://docs.docker.com/get-started/) for a primer on container basics. 

- Proper Linux dev environment set up for Service Fabric. Follow the instructions [here](service-fabric-get-started-linux.md) to set up your Linux environment. 

## Get application code

The sample application used in this tutorial is a basic voting app. The application consists of a front-end web component and a back-end Redis instance. The components are packaged into custom container images. 

Use git to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/service-fabric-dotnet-containers.git
```

Change directories so that you are working from the cloned directory.

```
cd Linux/container-tutorial
```

Inside the cloned directory, is the 'azure-vote' directory. The directory contains the front-end source code and the 'redis' directory that contains a Dockerfile to  build the redis image. These directories contain the necessary assets for this tutorial set. 

## Create container images

Inside the 'azure-vote' directory, run the following command to build the image for the front-end web component. This command uses the Dockerfile in this directory to build the image. 

```
docker build -t azure-vote-front .
```

Inside, the 'redis' directory, run the following command to build the image for the redis backend. This command uses the Dockerfile in the directory to build the image. 

```
docker build -t azure-vote-back .
```

When completed, use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to see the created images.

```bash
docker images
```

Notice that four images have been downloaded or created. The *azure-vote-front* image contains the application. It was derived from a *python* image from Docker Hub. The Redis image was downloaded from Docker Hub.

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
azure-vote-back              latest              bf9a858a9269        3 seconds ago        107MB
azure-vote-front             latest              052c549a75bf        About a minute ago   708MB
redis                        latest              9813a7e8fcc0        2 days ago           107MB
tiangolo/uwsgi-nginx-flask   python3.6           590e17342131        5 days ago           707MB

```

## Next steps

In this tutorial, an application was pulled from Github and container images created for the application. The following steps were completed:

> [!div class="checklist"]
> * Cloning the application source from GitHub  
> * Created a container image from application source

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](service-fabric-tutorial-prepare-acr.md)
