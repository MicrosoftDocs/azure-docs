---
title: Geo-replicate Azure Container Registry tutorial - Prepare your app | Azure Docs
description: Prepare an app for geo-replicating with Azure Container REgistry
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: 'mmacy'
tags: 
keywords: ''

ms.service: container-registry
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/06/2017
ms.author: stevelas
ms.custom: 
---

# Create container for deployment to Azure Container Registry

The Azure Container Registry is a private registry, deployed in Azure and kept network-close to your deployments. This tutorial walks through deploying an Azure Container Registry, and pushing a container image to it. Steps completed include:

> [!div class="checklist"]
> * Cloning application source from GitHub  
> * Creating container images from application source
> * Testing the images in a local Docker environment

In subsequent tutorials, you will upload your image to an Azure Container Registry, deploy them to multiple Azure App Services in different regions, using the geo-replication feature of ACR.

## Before you begin

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic docker commands. If needed, see [Get started with Docker]( https://docs.docker.com/get-started/) for a primer on container basics. 

To complete this tutorial, you need a Docker development environment. Docker provides packages that easily configure Docker on any [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), or [Linux](https://docs.docker.com/engine/installation/#supported-platforms) system.

Azure Cloud Shell does not include the Docker components required to complete every step this tutorial. Therefore, we recommend using a full Docker development environment.

## Get application code

The sample in this tutorial includes a simple web application built in [Node.js](http://nodejs.org). The app serves a static HTML page and looks like this:

![Tutorial app shown in browser][acr-tutorial-app]

Use git to download the sample into a local directory:

```bash
git clone https://github.com/Azure-Samples/aci-helloworld.git
```

## Build the container image

The Dockerfile provided in the sample repo shows how the container is built. It starts from an [official Node.js image][dockerhub-nodeimage] based on [Alpine Linux](https://alpinelinux.org/). It then copies the application files into the container, installs dependencies using the Node Package Manager, and finally starts the application.

```
FROM node:8.2.0-alpine
RUN mkdir -p /usr/src/app
COPY ./app/* /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
CMD node /usr/src/app/index.js
```

Use the `docker build` command to create the container image, tagging it as *acr-tutorial-app*:

```bash
cd aci-helloworld
docker build . -t acr-tutorial-app
```

Use the `docker images` to see the built image:

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
acr-tutorial-app             latest              5c745774dfa9        39 seconds ago       68.1 MB
```

## Run the container locally

Before you try deploying the container to Azure Container Instances, run it locally to confirm that it works. The `-d` switch lets the container run in the background, while `-p` allows you to map an arbitrary port on your compute to port 80 in the container.

```bash
docker run -d -p 8080:80 acr-tutorial-app
```

Open the browser to http://localhost:8080 to confirm that the container is running.

![Running the app locally in the browser][acr-tutorial-app]

## Next steps

In this tutorial, you created a container image that can be pushed to Azure Container Registry. The following steps were completed:

> [!div class="checklist"]
> * Cloning the application source from GitHub  
> * Creating container images from application source
> * Testing the container locally

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](./container-registry-tutorial-prepare-acr.md)

<!-- LINKS -->

<!--- IMAGES --->
[acr-tutorial-app]:./media/container-registry-tutorial-prepare-app/acr-app-browser-local.png
