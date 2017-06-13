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
ms.date: 06/09/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Prepare App

Throughout the Azure Container Service tutorial set, a sample application will be deployed and managed in Kubernetes cluster. In this tutorial, a sample application will be prepared on your local system for use throughout the remaining tutorials. Steps completed are:

> [!div class="checklist"]docker-compose rm --force
> * Clone an existing application code repository
> * Create container images from application
> * Test the application locally

## Prerequisites

To complete this tutorial, you will need a Docker development environment. Docker provides packages that easily configure a Docker development environment on any Mac or Windows system.

[Docker for Mac]( https://docs.docker.com/docker-for-mac/)

[Docker for Windows](https://docs.docker.com/docker-for-windows/) 

## Create container images

```bash
git clone https://github.com/neilpeterson/azure-kubernetes-samples.git
```

```bash
cd ./azure-kubernetes-samples/flask-mysql-vote/
```

```bash
docker-compose up -d
```

```bash
docker images
```

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
azure-vote-front             latest              08f036033a2f        39 seconds ago       716 MB
azure-vote-backend           latest              93cdf071f8c3        About a minute ago   407 MB
mysql                        latest              e799c7f9ae9c        4 weeks ago          407 MB
tiangolo/uwsgi-nginx-flask   flask               788ca94b2313        8 months ago         694 MB
```


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

```bash
docker-compose stop
```

```bash
docker-compose rm --force
```

## Next steps

A sample application was prepared and tested in a Docker development environment. Tasks covered included:

> [!div class="checklist"]
> * Clone an existing application code repository
> * Create container images from application
> * Test the application locally

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](./container-service-tutorial-kubernetes-prepare-acr.md)