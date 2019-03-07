---
title: Tutorial - Create a geo-replicated Docker registry in Azure
description: Create an Azure container registry, configure geo-replication, prepare a Docker image, and deploy it to the registry. Part one of a three-part series.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: tutorial
ms.date: 04/30/2017
ms.author: danlep
ms.custom: "seodec18, mvc"
---

# Tutorial: Prepare a geo-replicated Azure container registry

An Azure container registry is a private Docker registry deployed in Azure that you can keep network-close to your deployments. In this set of three tutorial articles, you learn how to use geo-replication to deploy an ASP.NET Core web application running in a Linux container to two [Web Apps for Containers](../app-service/containers/index.yml) instances. You'll see how Azure automatically deploys the image to each Web App instance from the closest geo-replicated repository.

In this tutorial, part one in a three-part series:

> [!div class="checklist"]
> * Create a geo-replicated Azure container registry
> * Clone application source code from GitHub
> * Build a Docker container image from application source
> * Push the container image to your registry

In subsequent tutorials, you deploy the container from your private registry to a web app running in two Azure regions. You then update the code in the application, and update both Web App instances with a single `docker push` to your registry.

## Before you begin

This tutorial requires a local installation of the Azure CLI (version 2.0.31 or later). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

You should be familiar with core Docker concepts such as containers, container images, and basic Docker CLI commands. For a primer on container basics, see [Get started with Docker]( https://docs.docker.com/get-started/).

To complete this tutorial, you need a local Docker installation. Docker provides installation instructions for [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms) systems.

Azure Cloud Shell does not include the Docker components required to complete every step this tutorial. Therefore, we recommend a local installation of the Azure CLI and Docker development environment.

## Create a container registry

Sign in to the [Azure portal](https://portal.azure.com).

Select **Create a resource** > **Containers** > **Azure Container Registry**.

![Creating a container registry in the Azure portal][tut-portal-01]

Configure your new registry with the following settings:

* **Registry name**: Create a registry name that's globally unique within Azure, and contains 5-50 alphanumeric characters
* **Resource Group**: **Create new** > `myResourceGroup`
* **Location**: `West US`
* **Admin user**: `Enable` (required for Web App for Containers to pull images)
* **SKU**: `Premium` (required for geo-replication)

Select **Create** to deploy the ACR instance.

![Creating a container registry in the Azure portal][tut-portal-02]

Throughout the rest of this tutorial, we use `<acrName>` as a placeholder for the container **Registry name** that you chose.

> [!TIP]
> Because Azure container registries are typically long-lived resources that are used across multiple container hosts, we recommend that you create your registry in its own resource group. As you configure geo-replicated registries and webhooks, these additional resources are placed in the same resource group.
>

## Configure geo-replication

Now that you have a Premium registry, you can configure geo-replication. Your web app, which you configure in the next tutorial to run in two regions, can then pull its container images from the nearest registry.

Navigate to your new container registry in the Azure portal and select **Replications** under **SERVICES**:

![Replications in the Azure portal container registry UI][tut-portal-03]

A map is displayed showing green hexagons representing Azure regions available for geo-replication:

 ![Region map in the Azure portal][tut-map-01]

Replicate your registry to the East US region by selecting its green hexagon, then select **Create** under **Create replication**:

 ![Create replication UI in the Azure portal][tut-portal-04]

When the replication is complete, the portal reflects *Ready* for both regions. Use the **Refresh** button to refresh the status of the replication; it can take a minute or so for the replicas to be created and synchronized.

![Replication status UI in the Azure portal][tut-portal-05]

## Container registry login

Now that you've configured geo-replication, build a container image and push it to your registry. You must first log in to your ACR instance before pushing images to it.

Use the [az acr login](https://docs.microsoft.com/cli/azure/acr#az-acr-login) command to authenticate and cache the credentials for your registry. Replace `<acrName>` with the name of the registry you created earlier.

```azurecli
az acr login --name <acrName>
```

The command returns `Login Succeeded` when complete.

## Get application code

The sample in this tutorial includes a small web application built with [ASP.NET Core][aspnet-core]. The app serves an HTML page that displays the region from which the image was deployed by Azure Container Registry.

![Tutorial app shown in browser][tut-app-01]

Use git to download the sample into a local directory, and `cd` into the directory:

```bash
git clone https://github.com/Azure-Samples/acr-helloworld.git
cd acr-helloworld
```

If you don't have `git` installed, you can [download the ZIP archive][acr-helloworld-zip] directly from GitHub.

## Update Dockerfile

The Dockerfile included in the sample shows how the container is built. It starts from an official [aspnetcore][dockerhub-aspnetcore] image, copies the application files into the container, installs dependencies, compiles the output using the official [aspnetcore-build][dockerhub-aspnetcore-build] image, and finally, builds an optimized aspnetcore image.

The [Dockerfile][dockerfile] is located at `./AcrHelloworld/Dockerfile` in the cloned source.

```Dockerfile
FROM microsoft/aspnetcore:2.0 AS base
# Update <acrName> with the name of your registry
# Example: uniqueregistryname.azurecr.io
ENV DOCKER_REGISTRY <acrName>.azurecr.io
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY *.sln ./
COPY AcrHelloworld/AcrHelloworld.csproj AcrHelloworld/
RUN dotnet restore
COPY . .
WORKDIR /src/AcrHelloworld
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS production
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "AcrHelloworld.dll"]
```

The application in the *acr-helloworld* image tries to determine the region from which its container was deployed by querying DNS for information about the registry's login server. You must specify your registry login server's fully qualified domain name (FQDN) in the `DOCKER_REGISTRY` environment variable in the Dockerfile.

First, get the registry's login server with the `az acr show` command. Replace `<acrName>` with the name of the registry you created in previous steps.

```azurecli
az acr show --name <acrName> --query "{acrLoginServer:loginServer}" --output table
```

Output:

```bash
AcrLoginServer
-----------------------------
uniqueregistryname.azurecr.io
```

Next, update the `ENV DOCKER_REGISTRY` line with the FQDN of your registry's login server. This example reflects the example registry name, *uniqueregistryname*:

```Dockerfile
ENV DOCKER_REGISTRY uniqueregistryname.azurecr.io
```

## Build container image

Now that you've updated the Dockerfile with the FQDN of your registry login server, you can use `docker build` to create the container image. Run the following command to build the image and tag it with the URL of your private registry, again replacing `<acrName>` with the name of your registry:

```bash
docker build . -f ./AcrHelloworld/Dockerfile -t <acrName>.azurecr.io/acr-helloworld:v1
```

Several lines of output are displayed as the Docker image is built (shown here truncated):

```bash
Sending build context to Docker daemon  523.8kB
Step 1/18 : FROM microsoft/aspnetcore:2.0 AS base
2.0: Pulling from microsoft/aspnetcore
3e17c6eae66c: Pulling fs layer

[...]

Step 18/18 : ENTRYPOINT dotnet AcrHelloworld.dll
 ---> Running in 6906d98c47a1
 ---> c9ca1763cfb1
Removing intermediate container 6906d98c47a1
Successfully built c9ca1763cfb1
Successfully tagged uniqueregistryname.azurecr.io/acr-helloworld:v1
```

Use `docker images` to see the built and tagged image:

```console
$ docker images
REPOSITORY                                      TAG    IMAGE ID        CREATED               SIZE
uniqueregistryname.azurecr.io/acr-helloworld    v1     01ac48d5c8cf    About a minute ago    284MB
[...]
```

## Push image to Azure Container Registry

Next, use the `docker push` command to push the *acr-helloworld* image to your registry. Replace `<acrName>` with the name of your registry.

```bash
docker push <acrName>.azurecr.io/acr-helloworld:v1
```

Because you've configured your registry for geo-replication, your image is automatically replicated to both the *West US* and *East US* regions with this single `docker push` command.

```console
$ docker push uniqueregistryname.azurecr.io/acr-helloworld:v1
The push refers to a repository [uniqueregistryname.azurecr.io/acr-helloworld]
cd54739c444b: Pushed
d6803756744a: Pushed
b7b1f3a15779: Pushed
a89567dff12d: Pushed
59c7b561ff56: Pushed
9a2f9413d9e4: Pushed
a75caa09eb1f: Pushed
v1: digest: sha256:0799014f91384bda5b87591170b1242bcd719f07a03d1f9a1ddbae72b3543970 size: 1792
```

## Next steps

In this tutorial, you created a private, geo-replicated container registry, built a container image, and then pushed that image to your registry.

Advance to the next tutorial to deploy your container to multiple Web Apps for Containers instances, using geo-replication to serve the images locally.

> [!div class="nextstepaction"]
> [Deploy web app from Azure Container Registry](container-registry-tutorial-deploy-app.md)

<!-- IMAGES -->
[tut-portal-01]: ./media/container-registry-tutorial-prepare-registry/tut-portal-01.png
[tut-portal-02]: ./media/container-registry-tutorial-prepare-registry/tut-portal-02.png
[tut-portal-03]: ./media/container-registry-tutorial-prepare-registry/tut-portal-03.png
[tut-portal-04]: ./media/container-registry-tutorial-prepare-registry/tut-portal-04.png
[tut-portal-05]: ./media/container-registry-tutorial-prepare-registry/tut-portal-05.png
[tut-app-01]: ./media/container-registry-tutorial-prepare-registry/tut-app-01.png
[tut-map-01]: ./media/container-registry-tutorial-prepare-registry/tut-map-01.png

<!-- LINKS - External -->
[acr-helloworld-zip]: https://github.com/Azure-Samples/acr-helloworld/archive/master.zip
[aspnet-core]: https://dot.net
[dockerhub-aspnetcore]: https://hub.docker.com/r/microsoft/aspnetcore/
[dockerhub-aspnetcore-build]: https://store.docker.com/community/images/microsoft/aspnetcore-build
[dockerfile]: https://github.com/Azure-Samples/acr-helloworld/blob/master/AcrHelloworld/Dockerfile