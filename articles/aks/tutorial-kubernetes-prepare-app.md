---
title: Kubernetes on Azure tutorial  - Prepare an application
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to prepare and build a multi-container app with Docker Compose that you can then deploy to AKS.
ms.topic: tutorial
ms.date: 12/06/2022
ms.custom: mvc

#Customer intent: As a developer, I want to learn how to build a container-based application so that I can deploy the app to Azure Kubernetes Service.
---

# Tutorial: Prepare an application for Azure Kubernetes Service (AKS)

In this tutorial, part one of seven, you prepare a multi-container application to use in Kubernetes. You use existing development tools like Docker Compose to locally build and test the application. You learn how to:

> [!div class="checklist"]
>
> * Clone a sample application source from GitHub
> * Create a container image from the sample application source
> * Test the multi-container application in a local Docker environment

Once completed, the following application runs in your local development environment:

:::image type="content" source="./media/container-service-kubernetes-tutorials/azure-vote-local.png" alt-text="Screenshot showing the container image Azure Voting App running locally opened in a local web browser" lightbox="./media/container-service-kubernetes-tutorials/azure-vote-local.png":::

In later tutorials, you upload the container image to an Azure Container Registry (ACR), and then deploy it into an AKS cluster.

## Before you begin

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and `docker` commands. For a primer on container basics, see [Get started with Docker][docker-get-started].

To complete this tutorial, you need a local Docker development environment running Linux containers. Docker provides packages that configure Docker on a [Mac][docker-for-mac], [Windows][docker-for-windows], or [Linux][docker-for-linux] system.

> [!NOTE]
> Azure Cloud Shell does not include the Docker components required to complete every step in these tutorials. Therefore, we recommend using a full Docker development environment.

## Get application code

The [sample application][sample-application] used in this tutorial is a basic voting app consisting of a front-end web component and a back-end Redis instance. The web component is packaged into a custom container image. The Redis instance uses an unmodified image from Docker Hub.

Use [git][] to clone the sample application to your development environment.

```console
git clone https://github.com/Azure-Samples/azure-voting-app-redis.git
```

Change into the cloned directory.

```console
cd azure-voting-app-redis
```

The directory contains the application source code, a pre-created Docker compose file, and a Kubernetes manifest file. These files are used throughout the tutorial set. The contents and structure of the directory are as follows:

```output
azure-voting-app-redis
│   azure-vote-all-in-one-redis.yaml
│   docker-compose.yaml
│   LICENSE
│   README.md
│
├───azure-vote
│   │   app_init.supervisord.conf
│   │   Dockerfile
│   │   Dockerfile-for-app-service
│   │   sshd_config
│   │
│   └───azure-vote
│       │   config_file.cfg
│       │   main.py
│       │
│       ├───static
│       │       default.css
│       │
│       └───templates
│               index.html
│
└───jenkins-tutorial
        config-jenkins.sh
        deploy-jenkins-vm.sh
```

## Create container images

[Docker Compose][docker-compose] can be used to automate building container images and the deployment of multi-container applications.

The following command uses the sample `docker-compose.yaml` file to create the container image, download the Redis image, and start the application.

```console
docker compose up -d
```

When completed, use the [`docker images`][docker-images] command to see the created images. Two images are downloaded or created. The *azure-vote-front* image contains the front-end application. The *redis* image is used to start a Redis instance.

```
$ docker images
REPOSITORY                                     TAG       IMAGE ID       CREATED       SIZE
mcr.microsoft.com/oss/bitnami/redis            6.0.8     3a54a920bb6c   2 years ago   103MB
mcr.microsoft.com/azuredocs/azure-vote-front   v1        4d4d08c25677   5 years ago   935MB
```

Run the [`docker ps`][docker-ps] command to see the running containers.

```
$ docker ps

CONTAINER ID        IMAGE                                             COMMAND                  CREATED             STATUS              PORTS                           NAMES
d10e5244f237        mcr.microsoft.com/azuredocs/azure-vote-front:v1   "/entrypoint.sh /sta…"   3 minutes ago       Up 3 minutes        443/tcp, 0.0.0.0:8080->80/tcp   azure-vote-front
21574cb38c1f        mcr.microsoft.com/oss/bitnami/redis:6.0.8         "/opt/bitnami/script…"   3 minutes ago       Up 3 minutes        0.0.0.0:6379->6379/tcp          azure-vote-back
```

## Test application locally

To see your running application, navigate to `http://localhost:8080` in a local web browser. The sample application loads, as shown in the following example:

:::image type="content" source="./media/container-service-kubernetes-tutorials/azure-vote-local.png" alt-text="Screenshot showing the container image Azure Voting App running locally opened in a local web browser" lightbox="./media/container-service-kubernetes-tutorials/azure-vote-local.png":::

## Clean up resources

Now that the application's functionality has been validated, the running containers can be stopped and removed. ***Do not delete the container images*** - in the next tutorial, you'll upload the *azure-vote-front* image to an ACR instance.

To stop and remove the container instances and resources, use the [`docker-compose down`][docker-compose-down] command.

```console
docker compose down
```

When the local application has been removed, you have a Docker image that contains the Azure Vote application, *azure-vote-front*, to use in the next tutorial.

## Next steps

In this tutorial, you created a sample application, created container images for the application, and then tested the application. You learned how to:

> [!div class="checklist"]

> * Clone a sample application source from GitHub
> * Create a container image from the sample application source
> * Test the multi-container application in a local Docker environment

In the next tutorial, you'll learn how to store container images in an ACR.

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
[docker-compose-down]: https://docs.docker.com/compose/reference/down
[git]: https://git-scm.com/downloads
[sample-application]: https://github.com/Azure-Samples/azure-voting-app-redis

<!-- LINKS - internal -->
[aks-tutorial-prepare-acr]: ./tutorial-kubernetes-prepare-acr.md
