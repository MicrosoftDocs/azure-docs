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

> [!div class="checklist"]
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
docker build ./azure-kubernetes-samples/flask-mysql-vote/azure-vote/ -t azure-vote-front
```

```bash
docker build ./azure-kubernetes-samples/flask-mysql-vote/mysql/ -t azure-vote-back
```

```bash
docker images
```

Output:

```bash
REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
azure-vote-back     latest              dfdc614becea        7 seconds ago        407 MB
azure-vote-front    latest              67e8582e68a8        About a minute ago   445 MB
ubuntu              latest              7b9b13f7b9c0        6 days ago           118 MB
mysql               latest              e799c7f9ae9c        4 weeks ago          407 MB
```

## Test application locally

```bash
docker network create azure-vote
```

Note, in this example the MySQL database file is hosted inside of the container. In a subsequent tutorial, the database file will be moved to a mounted volume which will provide data integrity in the event of container restart / regeneration.

```bash
docker run -v /tmp/docker-mysql:/var/lib/mysql -p 3306:3306 -d --network azure-vote --name azure-vote-back -e MYSQL_ROOT_PASSWORD=Password12 -e MYSQL_USER=dbuser -e MYSQL_PASSWORD=Password12 -e MYSQL_DATABASE=azurevote azure-vote-back 
```

```bash
docker run -p 8000:8000 -d --network=azure-vote -e MYSQL_DATABASE_USER=dbuser -e MYSQL_DATABASE_PASSWORD=Password12 -e MYSQL_DATABASE_DB=azurevote -e MYSQL_DATABASE_HOST=azure-vote-back azure-vote-front
```

```bash
docker ps
```

Output:

```bash
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
ec05f07634d3        azure-vote-front    "/usr/bin/supervis..."   3 seconds ago       Up 2 seconds        0.0.0.0:8000->8000/tcp   romantic_bardeen
ca2aeaf5eed1        azure-vote-back     "docker-entrypoint..."   20 seconds ago      Up 19 seconds       0.0.0.0:3306->3306/tcp   azure-vote-back
```

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app.png)

## Delete Resources

```bash
docker rm -f azure-vote-front
```

```bash
docker rm -f azure-vote-back
```

```bash
docker network rm azure-vote
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




