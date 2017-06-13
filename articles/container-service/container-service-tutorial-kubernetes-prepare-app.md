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
ms.date: 06/13/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Prepare App

Throughout the Azure Container Service tutorial set, a sample application will be deployed and managed in Kubernetes cluster. In this tutorial, the sample application will be prepared and tested in your own development environment. The outcome will be Docker container images that will be used throughout the remainder of this tutorial set. Steps completed include:

> [!div class="checklist"]docker-compose rm --force
> * Clone an existing applications code repository
> * Create container images from the application
> * Test the application locally

## Prerequisites

This tutorial set assume a basic understanding of core Docker concepts such being familiar with containers, container images, and basic docker commands. If needed, see [Get started with Docker]( https://docs.docker.com/get-started/) on docker.com for a primer on container basics. 

To complete this tutorial, you also need a Docker development environment. Docker provides packages that easily configure a Docker development environment on any Mac or Windows system.

[Docker for Mac]( https://docs.docker.com/docker-for-mac/)

[Docker for Windows](https://docs.docker.com/docker-for-windows/) 

## Create container images

The sample application that will be used in this tutorial is a basic voting system. The application consists of a front-end web component built in Python flask, and a back-end MySQL database. Use git to download a copy to your development environment.

```bash
git clone https://github.com/neilpeterson/azure-kubernetes-samples.git
```

Inside of the application directory are pre-created Docker and Kubernetes configuration files. These are used to create assets throughout the tutorial set. Change directories so that you are in the cloned directory.

```bash
cd ./azure-kubernetes-samples/flask-mysql-vote/
```

Inside of the cloned repo is two directories, *azure-vote* which containers the Azure Vote application, and *azure-vote-mysql* which containers a schema file for the Azure Vote database. In each of these directories is a Dockerfile that automates the creation of the Azure Vote container images.

At the root of the cloned repo is a docker-compose.yaml file. Docker Compose can be used to automate the build out of container images, and automate the deployment of multi-container systems. This file is configured to use both Azure Vote Dockerfiles to create two container images, and then to start the Azure Vote application from these container images.

The following shows the docker-compose.yaml file. Note here that MySQL credentials are provided in the file. These cans be changed in the yaml file. Later in this tutorial set, these credentials will be secured in a Kubernetes secret resource.

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

Run the docker-compose.yaml file to create the container images and start the application in you development environment. 

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
azure-vote-front             latest              08f036033a2f        39 seconds ago       716 MB
azure-vote-backend           latest              93cdf071f8c3        About a minute ago   407 MB
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

Browse to `http://localhost:8080` to see the running application. 

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app.png)

## Delete Resources

Now that application functionality has been validated, the running containers can be stopped and removed.

Run the following to stop the running containers.

```bash
docker-compose stop
```

And delete the container with the following command.

```bash
docker-compose rm --force
```

At completion, you have two container images that make up the Azure Vote application. In subsequent tutorials, these images will be uploaded into an Azure Container Registry, and run in an Azure Container Service Kubernetes cluster.

## Next steps

A sample application was prepared and tested in a Docker development environment. Tasks covered included:

> [!div class="checklist"]docker-compose rm --force
> * Clone an existing applications code repository
> * Create container images from the application
> * Test the application locally

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](./container-service-tutorial-kubernetes-prepare-acr.md)