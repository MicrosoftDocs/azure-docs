---
title: Kubernetes on Azure tutorial  - Prepare App
description: AKS tutorial - Prepare App
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: tutorial
ms.date: 02/22/2018
ms.author: nepeters
ms.custom: mvc
---

# Tutorial: Prepare application for Azure Kubernetes Service (AKS)

In this tutorial, part one of eight, a multi-container application is prepared for use in Kubernetes. Steps completed include:

> [!div class="checklist"]
> * Cloning application source from GitHub
> * Creating a container image from the application source
> * Testing the application in a local Docker environment

Once completed, the following application is accessible in your local development environment.

![Image of Kubernetes cluster on Azure](./media/container-service-tutorial-kubernetes-prepare-app/azure-vote.png)

In subsequent tutorials, the container image is uploaded to an Azure Container Registry, and then run in an AKS cluster.

## Before you begin

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic docker commands. If needed, see [Get started with Docker][docker-get-started] for a primer on container basics.

To complete this tutorial, you need a Docker development environment. Docker provides packages that easily configure Docker on any [Mac][docker-for-mac], [Windows][docker-for-windows], or [Linux][docker-for-linux] system.

Azure Cloud Shell does not include the Docker components required to complete every step this tutorial. Therefore, we recommend using a full Docker development environment.

## Get application code

The sample application used in this tutorial is a basic voting app. The application consists of a front-end web component and a back-end Redis instance. The web component is packaged into a custom container image. The Redis instance uses an unmodified image from Docker Hub.

Use git to download a copy of the application to your development environment.

```console
git clone https://github.com/Azure-Samples/azure-voting-app-redis.git
```

Change directories so that you are working from the cloned directory.

```console
cd azure-voting-app-redis
```

Inside the directory is the application source code, a pre-created Docker compose file, and a Kubernetes manifest file. These files are used throughout the tutorial set.

## Create container images

[Docker Compose][docker-compose] can be used to automate the build out of container images and the deployment of multi-container applications.

Run the `docker-compose.yaml` file to create the container image, download the Redis image, and start the application.

```console
docker-compose up -d
```

When completed, use the [docker images][docker-images] command to see the created images.

```console
docker images
```

Notice that three images have been downloaded or created. The `azure-vote-front` image contains the application and uses the `nginx-flask` image as a base. The `redis` image is used to start a Redis instance.

```
REPOSITORY                   TAG        IMAGE ID            CREATED             SIZE
azure-vote-front             latest     9cc914e25834        40 seconds ago      694MB
redis                        latest     a1b99da73d05        7 days ago          106MB
tiangolo/uwsgi-nginx-flask   flask      788ca94b2313        9 months ago        694MB
```

Run the [docker ps][docker-ps] command to see the running containers.

```console
docker ps
```

Output:

```
CONTAINER ID        IMAGE             COMMAND                  CREATED             STATUS              PORTS                           NAMES
82411933e8f9        azure-vote-front  "/usr/bin/supervisord"   57 seconds ago      Up 30 seconds       443/tcp, 0.0.0.0:8080->80/tcp   azure-vote-front
b68fed4b66b6        redis             "docker-entrypoint..."   57 seconds ago      Up 30 seconds       0.0.0.0:6379->6379/tcp          azure-vote-back
```

## Test application locally

Browse to http://localhost:8080 to see the running application.

![Image of Kubernetes cluster on Azure](./media/container-service-tutorial-kubernetes-prepare-app/azure-vote.png)

## Clean up resources

Now that application functionality has been validated, the running containers can be stopped and removed. Do not delete the container images. The `azure-vote-front` image is uploaded to an Azure Container Registry instance in the next tutorial.

Run the following to stop the running containers.

```console
docker-compose stop
```

Delete the stopped containers and resources with the following command.

```console
docker-compose down
```

At completion, you have a container image that contains the Azure Vote application.

## Next steps

In this tutorial, an application was tested and container images created for the application. The following steps were completed:

> [!div class="checklist"]
> * Cloning the application source from GitHub
> * Created a container image from application source
> * Tested the application in a local Docker environment

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry][aks-tutorial-prepare-acr]

<!-- LINKS - external -->
[docker-compose]: https://docs.docker.com/compose/
[docker-for-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-for-mac]: https://docs.docker.com/docker-for-mac/
[docker-for-windows]: https://docs.docker.com/docker-for-windows/
[docker-get-started]: https://docs.docker.com/get-started/
[docker-images]: https://docs.docker.com/engine/reference/commandline/images/
[docker-ps]: https://docs.docker.com/engine/reference/commandline/ps/

<!-- LINKS - internal -->
[aks-tutorial-prepare-acr]: ./tutorial-kubernetes-prepare-acr.md