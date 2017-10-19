---
title: Azure Container Registry tutorial - Prepare ACR
description: Create an Azure container registry, configure geo-replication, prepare a Docker image, and deploy it to the registry. Part one of a three-part series.
services: container-registry
documentationcenter: ''
author: mmacy
manager: timlt
editor: mmacy
tags: acr, azure-container-registry, geo-replication
keywords: Docker, Containers, Registry, Azure

ms.service: container-registry
ms.devlang:
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: marsma
ms.custom:
---

# Deploy and use Azure Container Registry

An Azure container registry is a private Docker registry deployed in Azure that you can keep network-close to your deployments. In this set of three tutorial articles, you learn how to use geo-replication to deploy an ASP.NET Core web application running in a Linux container to two [Web App for Containers](../app-service/containers/index.yml) instances. You'll see how Azure automatically deploys the image to each Web App instance from the closest geo-replicated repository.

In this tutorial article, part one of a three-part series, you:

> [!div class="checklist"]
> * Create a geo-replicated Azure container registry
> * Clone application source code from GitHub
> * Create a container image from application source
> * Push the container image to your registry

In subsequent tutorials, you deploy the container from your private registry to a web app running in two Azure regions. You then update the code in the application, and update both Web App instances with a single `docker push` to your registry.

## Before you begin

This tutorial requires that you are running the Azure CLI version 2.0.19 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic docker commands. If needed, see [Get started with Docker]( https://docs.docker.com/get-started/) for a primer on container basics.

To complete this tutorial, you need a Docker development environment. Docker provides packages that easily configure Docker on any [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), or [Linux](https://docs.docker.com/engine/installation/#supported-platforms) system.

Azure Cloud Shell does not include the Docker components required to complete every step this tutorial. Therefore, we recommend using a full Docker development environment.

## Create a container registry

Log in to the Azure portal at http://portal.azure.com.

Select **New** > **Containers** > **Azure Container Registry**.

![Creating a container registry in the Azure portal][tut-portal-01]

Configure your new registry with the following settings:

* **Registry name**: Create a registry name that's globally unique within Azure, and contains 5-50 alphanumeric characters
* **Resource Group**: **Create new** > `myResourceGroup`
* **Location**: `West US`
* **Admin user**: `Enable` (required for Web App for Containers to pull images)
* **SKU**: `Premium` (required for geo-replication)

Select **Create** to deploy the ACR instance.

![Creating a container registry in the Azure portal][tut-portal-02]

Throughout the rest of this tutorial, we use `<acrname>` as a placeholder for the container registry name that you chose.

> [!TIP]
> Because Azure container registries are typically long-lived resources that are used across multiple container hosts, we recommend that you create your registry in its own resource group. As you configure geo-replicated registries and webhooks, these additional resources are placed in the same resource group.
>

## Configure geo-replication

To configure geo-replication for your Premium registry, log in to the Azure portal at http://portal.azure.com.

Navigate to your Azure Container Registry, and select **Replications** under **SERVICES**:

![Replications in the Azure portal container registry UI](./media/container-registry-geo-replication/registry-services.png)

A map is displayed showing all current Azure Regions:

 ![Region map in the Azure portal](./media/container-registry-geo-replication/registry-geo-map.png)

To configure a replica, select a green hexagon, then select **Create**:

 ![Create replication UI in the Azure portal](./media/container-registry-geo-replication/create-replication.png)

To configure additional replicas, select the green hexagons for other regions, then click **Create**.

ACR begins syncing images across the configured replicas. Once complete, the portal reflects *Ready*. The replica status in the portal doesn't automatically update. Use the refresh button to see the updated status.

## Container registry login

You must log in to your ACR instance before pushing images to it. With [Basic, Standard, and Premium SKUs](container-registry-skus.md), you can authenticate by using your Azure identity.

 Use the [az acr login](https://docs.microsoft.com/en-us/cli/azure/acr#az_acr_login) command to authenticate and cache the credentials for your registry. Replace `<acrName>` with the name you specified in the previous step.

```azurecli
az acr login --name <acrName>
```

The command returns `Login Succeeded` when complete.

## Get application code

The sample in this tutorial includes a small web application built with [ASP.NET Core](http://dot.net). The app serves an HTML page that displays the region from which the image was deployed by Azure Container Registry.

![Tutorial app shown in browser][tut-app-01]

Use git to download the sample into a local directory, and `cd` into the directory:

```bash
git clone https://github.com/Azure-Samples/acr-helloworld.git
cd acr-helloworld
```

## Update Dockerfile

The Dockerfile included in the sample shows how the container is built. It starts from an official [aspnetcore](https://store.docker.com/community/images/microsoft/aspnetcore) image, copies the application files into the container, installs dependencies, compiles the output using the official [aspnetcore-build](https://store.docker.com/community/images/microsoft/aspnetcore-build) image, and builds an optimized aspnetcore image.

```dockerfile
FROM microsoft/aspnetcore:2.0 AS base
# Update <acrname> with the name of your registry
# Example: uniqueregistryname.azurecr.io
ENV DOCKER_REGISTRY <acrname>.azurecr.io
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

The application in the *acr-helloworld* image tries to determine the region from which its container was deployed by querying DNS for information about the registry's login server. We specify the login server URL in the `DOCKER_REGISTRY` environment variable in the Dockerfile.

First, get the registry's login server URL with the `az acr show` command. Replace `<acrName>` with the name of the registry you created in previous steps.

```azurecli
az acr show --name <acrName> --query "[].{acrLoginServer:loginServer}" --output table
```

Output:

```
AcrLoginServer
-----------------------------
uniqueregistryname.azurecr.io
```

Next, update the `DOCKER_REGISTRY` line with your registry's login server URL. In this example, we update the line to reflect our example registry name, *uniqueregistryname*:

```dockerfile
ENV DOCKER_REGISTRY uniqueregistryname.azurecr.io
```

## Build the container image

Now that you've updated the Dockerfile with the URL of your registry, you can use `docker build` to create the container image. Run the following command to build the image and tag it with the URL of your private registry, again replacing `<acrName>` with the name of your registry:

```bash
docker build . -f ./AcrHelloworld/Dockerfile -t <acrName>.azurecr.io/acr-helloworld:v1
```

Several lines of output are displayed as the Docker image is built (shown here truncated):

```
Sending build context to Docker daemon  523.8kB
Step 1/18 : FROM microsoft/aspnetcore:2.0 AS base
2.0: Pulling from microsoft/aspnetcore
3e17c6eae66c: Pulling fs layer
...
Step 18/18 : ENTRYPOINT dotnet AcrHelloworld.dll
 ---> Running in 6906d98c47a1
 ---> c9ca1763cfb1
Removing intermediate container 6906d98c47a1
Successfully built c9ca1763cfb1
Successfully tagged uniqueregistryname.azurecr.io/acr-helloworld:v1
```

Use the `docker images` command to see the built image:

```bash
docker images
```

Output:

```bash
REPOSITORY                                     TAG                 IMAGE ID            CREATED              SIZE
uniqueregistryname.azurecr.io/acr-helloworld   v1                  c9ca1763cfb1        About a minute ago   285MB
...
```

## Push image to Azure Container Registry

Finally, use the `docker push` command to push the *acr-helloworld* image to your registry. Replace `<acrName>` with the name of your registry.

```
docker push <acrName>.azurecr.io/acr-helloworld:v1
```

Because you've configure your registry for geo-replication, your image is automatically replicated to both the West US and East US regions with this single `docker push` command.

## Next steps

In this tutorial, an Azure Container Registry was created, and a container image was pushed.

The following steps were completed:

> [!div class="checklist"]
> * Deploying an Azure Container Registry
> * Update the image to reference the registry
> * Tagging container image for the registry
> * Uploading image to the registry

Advance to the next tutorial to learn about deploying your container to multiple Azure App Services, using geo-replication to serve the images locally.

> [!div class="nextstepaction"]
> [Deploy containers to Azure App Services](container-registry-deploy-application.md)

<!-- IMAGES -->
[tut-portal-01]: ./media/container-registry-tutorial-prepare-acr/tut-portal-01.png
[tut-portal-02]: ./media/container-registry-tutorial-prepare-acr/tut-portal-02.png
[tut-app-01]: ./media/container-registry-tutorial-prepare-acr/tut-app-01.png
