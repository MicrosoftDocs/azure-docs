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
ms.date: 06/21/2017
ms.author: nepeters
---

# Create container images to be used with Azure Container Service

Azure Container Service provides simple deployment of production ready Kubernetes clusters. In this tutorial set, you use source files to create an application, test it locally, and then deploy it into a Kubernetes cluster, where you then scale it, upgrade it, and monitor it. During the tutorial set, you also deploy a Kubernetes cluster and an Azure Container Registry, and the tutorials explain the underlying Azure components.

In this first tutorial, a sample application is built into Docker container images and run locally. Steps completed include:

> [!div class="checklist"]
> * Clone an existing application's code repository
> * Create container images from the application
> * Test the application locally

## Prerequisites

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic docker commands. If needed, see [Get started with Docker]( https://docs.docker.com/get-started/) for a primer on container basics.

**Docker environment** - to complete this tutorial, you need a Docker development environment. Docker provides packages that easily configure a Docker environment on almost any Linux, Mac, or Windows system.

[Docker on Linux](https://docs.docker.com/engine/installation/#supported-platforms)

[Docker for Mac]( https://docs.docker.com/docker-for-mac/)

[Docker for Windows](https://docs.docker.com/docker-for-windows/) 

## Create container images

The sample application used in this tutorial is a basic voting app. The application consists of a front-end web component and a back-end database. 

Use git to download a copy of the application to your development environment.

```bash
git clone https://github.com/Azure-Samples/azure-voting-app.git
```

> [!NOTE]
> Pre-created Dockerfiles, a docker-compose file, and a Kubernetes configuration file are inside the cloned repository. These files are used to create or deploy assets throughout the tutorial set. This tutorial uses Docker Compose to automate building the container images and deploy a multi-container application locally. You can create the same files manually or using some other tool.

Change directories so that you are in the `azure-voting-app` directory.

```bash
cd ./azure-voting-app/
```

At the root of the cloned directory, is a *docker-compose.yaml* file. This file, shown below, builds two container images (`azure-vote-front` and `azure-vote-back`), configures environment variables, and exposes container ports.

```yaml
version: '3'
services:
  azure-vote-back:
    build: ./azure-vote-mysql
    image: azure-vote-back
    container_name: azure-vote-back
    environment:
      MYSQL_USER: dbuser
      MYSQL_PASSWORD: Password12
      MYSQL_DATABASE: azurevote
      MYSQL_ROOT_PASSWORD: Password12
    ports:
        - "3306:3306"

  azure-vote-front:
    build: ./azure-vote
    depends_on:
        - azure-vote-back
    image: azure-vote-front
    container_name: azure-vote-front
    environment:
      MYSQL_USER: dbuser
      MYSQL_PASSWORD: Password12
      MYSQL_DATABASE: azurevote
      MYSQL_HOST: azure-vote-back
    ports:
        - "8080:80"
```

To create the container images and start the application, build and run the `docker-compose.yaml` file with the `docker-compose up` command. The first time this command is run, a few moments are required to download the base layers of the container image.

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

## Delete resources

Now that application functionality has been validated, the running containers can be stopped and removed. Do not delete the container images. These images are uploaded to an Azure Container Registry instance in the next tutorial.

Run the following to stop the running containers.

```bash
docker-compose stop
```

And delete the container with the following command:

```bash
docker-compose rm --force
```

At completion, you have two container images that make up the Azure Vote application, which you can see using `docker images` again. Stopping the running containers does not modify the container _images_.

## Next steps

In this tutorial, container images created for a simple application and the application was tested. The following steps were covered.

> [!div class="checklist"]
> * Clone an existing application's code repository
> * Create container images from the application
> * Test the application locally

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](./container-service-tutorial-kubernetes-prepare-acr.md)