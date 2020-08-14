---
title: Tutorial - Use Docker Compose to deploy multi-container group
description: Use Docker Compose to build and run a multi-container application and then bring up the application in to Azure Container Instances
ms.topic: tutorial
ms.date: 08/13/2020
ms.custom: 
---

# Tutorial: Deploy a multi-container group using Docker Compose 

Azure Container Instances enables deployment of Docker containers onto Azure infrastructure without provisioning any virtual machines or adopting a higher-level service. In this tutorial, you use [Docker Compose](https://docs.docker.com/compose/) to define and run a multi-container application locally and then deploy it as a container group in Azure Container Instances. 

Deploy to Azure Container Instances on-demand when you develop cloud-native apps with Docker and you want to switch seamlessly from local development to cloud deployment. This capability is enabled by [integration between Docker and Azure](https://docs.docker.com/engine/context/aci-integration/) (beta). 

> [!IMPORTANT]
> This feature is currently in preview, and requires beta (preview) features in Docker. Read more about [Stable and Edge versions of Docker Desktop](https://docs.docker.com/desktop/#stable-and-edge-versions). Not all features of Azure Container Instances are supported. Provide feedback about the Docker-Azure integration by creating an issue in the [aci-integration-beta](https://github.com/docker/aci-integration-beta) GitHub repository.


In this article, you:

> [!div class="checklist"]
> * Create an Azure container registry
> * Clone application source code from GitHub
> * Use Docker Compose to run and build a multi-container application locally
> * Push the application image to your container registry
> * Create an Azure context for Docker
> * Bring the application up in Azure Container Instances

## Prerequisites

* **Azure CLI** - You must have the Azure CLI installed on your local computer. Version 2.10.1 or later is recommended. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

* **Docker Desktop Edge version 2.3.2.0 or later** - Installation packages are available for [Windows](https://desktop.docker.com/win/edge/Docker%20Desktop%20Installer.exe) or [macOS](https://desktop.docker.com/mac/edge/Docker.dmg). Or install the [Docker ACI Integration CLI for Linux](https://docs.docker.com/engine/context/aci-integration/#install-the-docker-aci-integration-cli-on-linux) (beta). 

[!INCLUDE [container-instances-create-registry](../../includes/container-instances-create-registry.md)]

## Get application code

The sample application used in this tutorial is a basic voting app. The application consists of a front-end web component and a back-end Redis instance. The web component is packaged into a custom container image. The Redis instance uses an unmodified image from Docker Hub.

Use [git](https://git-scm.com/downloads) to clone the sample application to your development environment:

```console
git clone https://github.com/Azure-Samples/azure-voting-app-redis.git
```

Change into the cloned directory.

```console
cd azure-voting-app-redis
```

Inside the directory is the application source code and a pre-created Docker compose file, docker-compose.yaml.

## Modify Docker compose file

Open docker-compose.yaml in a text editor. Note the configuration of the `azure-vote-back` and `azure-vote-front` services.

```yml
version: '3'
services:
  azure-vote-back:
    image: redis
    container_name: azure-vote-back
    ports:
        - "6379:6379"

  azure-vote-front:
    build: ./azure-vote
    image: azure-vote-front
    container_name: azure-vote-front
    environment:
      REDIS: azure-vote-back
    ports:
        - "8080:80"
```

In the `azure-vote-front` configuration, make the following two changes

1. Update the `image` property, `azure-vote-front`. Prefix the image name with the login server name of your Azure container registry, \<acrName\>.azurecr.io. For example, if your registry is named *myregistry*, the login server name is *myregistry.azurecr.io* (all lowercase)
1. Change the `ports` mapping to `80:80`.

The updated file should look similar to the following:

```yml
version: '3'
services:
  azure-vote-back:
    image: redis
    container_name: azure-vote-back
    ports:
        - "6379:6379"

  azure-vote-front:
    build: ./azure-vote
    image: myregistry.azurecr.io/zure-vote-front
    container_name: azure-vote-front
    environment:
      REDIS: azure-vote-back
    ports:
        - "80:80"
```




By making these substitutions, the `azure-vote-front` image you build in the next step is tagged for your Azure container registry, and the image can be pulled to run in Azure Container Instances.

> [!NOTE]
> You don't have to use an Azure container registry for this scenario. For example, you can choose a private repository in Docker Hub to host your application image. If you choose a different registry, tag the image appropriately.

## Run multi-container application locally

Run [docker-compose up](https://docs.docker.com/compose/reference/up/), which uses the sample `docker-compose.yaml` file to build the container image, download the Redis image, and start the application:

```console
docker-compose up --build -d
```

When completed, use the [docker images](https://docs.docker.com/engine/reference/commandline/images/) command to see the created images. Three images have been downloaded or created. The `azure-vote-front` image contains the front-end application and uses the `nginx-flask` image as a base. The `redis` image is used to start a Redis instance.

```
$ docker images

REPOSITORY                                TAG        IMAGE ID            CREATED             SIZE
myregistry.azurecr.io/azure-vote-front    latest     9cc914e25834        40 seconds ago      944MB
redis                                     latest     a1b99da73d05        7 days ago          104MB
tiangolo/uwsgi-nginx-flask                python3.6  788ca94b2313        9 months ago        9444MB
```

Run the [docker ps](https://docs.docker.com/engine/reference/commandline/ps/) command to see the running containers:

```
$ docker ps

CONTAINER ID        IMAGE                                   COMMAND                  CREATED             STATUS              PORTS                           NAMES
82411933e8f9        myregistry.azurecr.io/azure-vote-front  "/entrypoint.sh /sta…"   57 seconds ago      Up 30 seconds       443/tcp, 0.0.0.0:80->80/tcp   azure-vote-front
b68fed4b66b6        redis                                   "docker-entrypoint.s…"   57 seconds ago      Up 30 seconds       0.0.0.0:6379->6379/tcp          azure-vote-back
```

To see the running application, enter `http://localhost:80` in a local web browser. The sample application loads, as shown in the following example:

![Image of voting app](./media/container-instances-tutorial-docker-compose/azure-vote.png)

After trying the local applicaion, run [docker-compose down](https://docs.docker.com/compose/reference/down/) to stop the application and remove the containers.

## Push image to container registry

Before you deploy the application to Azure Container Instances, run [docker compose push](https://docs.docker.com/compose/reference/up/)) to push the `azure-vote-front` image to your container registry:

```console
docker-compose push
```

Because the image is large, it can take a few minutes to push to the registry.

To verify the image is stored in your registry, run [az acr repository show](/cli/azure/acr/repository#az-acr-repository-show) command:

```azurecli
az acr repository show --name <acrName> --repository azure-vote-fron
```

[!INCLUDE [container-instances-create-docker-context](../../includes/container-instances-create-docker-context.md)]

## Deploy application to Azure Container instances

First, change to the ACI context. Subsequent Docker commands run in this context.

```console
docker context use myacicontext
```

Run `docker compose up` to start the application in Azure Container Intances.

```console
docker compose up
```

> [!NOTE]
> Docker Compose commands currently available in an ACI context are `docker compose up` and `docker compose down` (no hyphen between `docker` and `compose`).

In a short time, the container group is deployed. Sample output:

```
[+] Running 3/3
 ⠿ Group azurevotingappredis  Created                          3.6s
 ⠿ azure-vote-back            Done                             10.6s
 ⠿ azure-vote-front           Done                             10.6s
```

Run `docker ps` to see the running containers

```console
docker ps
```

Sample output:

```
CONTAINER ID                           IMAGE                                    COMMAND             STATUS              PORTS
azurevotingappredis_azure-vote-back    redis                                                        Running             13.90.155.243:6379->6379/tcp
azurevotingappredis_azure-vote-front   myregistry.azurecr.io/azure-vote-front                       Running             13.90.155.243:80->80/tcp
```

To see the running application in the cloud, enter the displayed IP address in a local web browser. In this example, enter `13.90.155.243`.

To see the logs of the front-end container, run the [docker logs](https://docs.docker.com/engine/reference/commandline/logs) command. For example:

```console
docker logs azurevotingappredis_azure-vote-front
```

You can also use the Azure portal or other Azure tools to see the container status.

When you finish trying the application, stop the application and containers with `docker compose down`:

```console
docker compose down
```

This command deletes the container group in Azure Container Instances.

## Next steps

In this tutorial, you....

...:

> [!div class="nextstepaction"]
> [xxx](xxx)

