---
title: Azure Container Service tutorial - Prepare App | Microsoft Docs
description: Azure Container Service tutorial - Prepare App 
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/26/2017
ms.author: nepeters
---

# Create container images to be used with Azure Container Service

In this tutorial, an application is prepared for Kubernetes. Steps completed include:  

> [!div class="checklist"]
> * Cloning the application source from GitHub  
> * Creating container images from application source
> * Testing the images in a local Docker environment

In subsequent tutorials, these container images are uploaded to an Azure Container Registry, and then run in an Azure hosted Kubernetes cluster.

## Before you begin

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic docker commands. If needed, see [Get started with Docker]( https://docs.docker.com/get-started/) for a primer on container basics. 

To complete this tutorial, you need a Docker development environment. Docker provides packages that easily configure a Docker environment on any [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), or [Linux](https://docs.docker.com/engine/installation/#supported-platforms) system.

## Get application code

The sample application used in this tutorial is a basic voting app. The application consists of a front-end web component and a back-end database. 

Use git to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/azure-voting-app.git
```

Inside the application directory, pre-created Dockerfiles and Kubernetes manifest files can be found. These files are used to create assets throughout the tutorial set. 

## Create container images

Change directories so that you are in the cloned directory.

```bash
cd ./azure-voting-app/
```

At the root of the cloned directory, is a *docker-compose.yaml* file. Run the docker-compose.yaml file to create the container images, and start the application. 

```bash
docker-compose up -d
```

When completed, use the `docker images` command to see the created images. 

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
azure-vote-front             latest              c13c4f50ede1        39 seconds ago       716 MB
azure-vote-back              latest              33fe5afc1885        About a minute ago   407 MB
mysql                        latest              e799c7f9ae9c        4 weeks ago          407 MB
tiangolo/uwsgi-nginx-flask   flask               788ca94b2313        8 months ago         694 MB
```

And the `docker ps` command to see the running containers. 

```bash
docker ps
```

Output:

```bash
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                           NAMES
3aa02e8ae965        azure-vote-front     "/usr/bin/supervisord"   59 seconds ago      Up 57 seconds       443/tcp, 0.0.0.0:8080->80/tcp   flaskmysqlvote_azure-vote-front_1
5ae60b3ba181        azure-vote-backend   "docker-entrypoint..."   59 seconds ago      Up 58 seconds       0.0.0.0:3306->3306/tcp          azure-vote-back
```

## Test application

Browse to [http://localhost:8080](http://localhost:8080) to see the running application. The application takes a few seconds to initialize. If an error is encountered, try again.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app.png)

## Clean up resources

Now that application functionality has been validated, the running containers can be stopped and removed. Do not delete the container images. These images are uploaded to an Azure Container Registry instance in the next tutorial.

Run the following to stop the running containers.

```bash
docker-compose stop
```

And delete the container with the following command:

```bash
docker-compose rm --force
```

At completion, you have two container images that make up the Azure Vote application.

## Next steps

In this tutorial, an application was tested and container images created for the application. The following steps were completed:

> [!div class="checklist"]
> * Cloning the application source from GitHub  
> * Creating container images from application source
> * Testing the images in a local Docker environment

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](./container-service-tutorial-kubernetes-prepare-acr.md)