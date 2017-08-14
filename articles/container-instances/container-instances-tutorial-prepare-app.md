---
title: Azure Container Instances tutorial - Prepare your app | Azure Docs
description: Prepare an app for deployment to Azure Container Instances
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: ''

ms.assetid: 
ms.service: container-instances
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/01/2017
ms.author: seanmck
ms.custom: mvc
---

# Create container for deployment to Azure Container Instances

Azure Container Instances enables deployment of Docker containers onto Azure infrastructure without provisioning any virtual machines or adopting any higher-level service. In this tutorial, you will build a simple web application in Node.js and package it in a container that can be run using Azure Container Instances. We will cover:

> [!div class="checklist"]
> * Cloning application source from GitHub  
> * Creating container images from application source
> * Testing the images in a local Docker environment

In subsequent tutorials, you will upload your image to an Azure Container Registry, and then deploy them to Azure Container Instances.

## Before you begin

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic docker commands. If needed, see [Get started with Docker]( https://docs.docker.com/get-started/) for a primer on container basics. 

To complete this tutorial, you need a Docker development environment. Docker provides packages that easily configure Docker on any [Mac](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), or [Linux](https://docs.docker.com/engine/installation/#supported-platforms) system.

## Get application code

The sample in this tutorial includes a simple web application built in [Node.js](http://nodejs.org). The app serves a static HTML page and looks like this:

![Tutorial app shown in browser][aci-tutorial-app]

Use git to download the sample:

```bash
git clone https://github.com/Azure-Samples/aci-helloworld.git
```

## Build the container image

The Dockerfile provided in the sample repo shows how the container is built. It starts from an [official Node.js image][dockerhub-nodeimage] based on [Alpine Linux](https://alpinelinux.org/), a small distribution that is well suited to use with containers. It then copies the application files into the container, installs dependencies using the Node Package Manager, and finally starts the application.

```
FROM node:8.2.0-alpine
RUN mkdir -p /usr/src/app
COPY ./app/* /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
CMD node /usr/src/app/index.js
```

Use the `docker build` command to create the container image, tagging it as *aci-tutorial-app*:

```bash
docker build ./aci-helloworld -t aci-tutorial-app
```

Use the `docker images` to see the built image:

```bash
docker images
```

Output:

```bash
REPOSITORY                   TAG                 IMAGE ID            CREATED              SIZE
aci-tutorial-app             latest              5c745774dfa9        39 seconds ago       68.1 MB
```

## Run the container locally

Before you try deploying the container to Azure Container Instances, run it locally to confirm that it works. The `-d` switch lets the container run in the background, while `-p` allows you to map an arbitrary port on your compute to port 80 in the container.

```bash
docker run -d -p 8080:80 aci-tutorial-app
```

Open the browser to http://localhost:8080 to confirm that the container is running.

![Running the app locally in the browser][aci-tutorial-app-local]

## Next steps

In this tutorial, you created a container image that can be deployed to Azure Container Instances. The following steps were completed:

> [!div class="checklist"]
> * Cloning the application source from GitHub  
> * Creating container images from application source
> * Testing the container locally

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](./container-instances-tutorial-prepare-acr.md)

<!-- LINKS -->
[dockerhub-nodeimage]: https://hub.docker.com/r/library/node/tags/8.2.0-alpine/

<!--- IMAGES --->
[aci-tutorial-app]:./media/container-instances-quickstart/aci-app-browser.png
[aci-tutorial-app-local]: ./media/container-instances-tutorial-prepare-app/aci-app-browser-local.png