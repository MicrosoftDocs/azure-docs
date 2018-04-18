---
title: Azure Container Instances tutorial - Prepare your app
description: Azure Container Instances tutorial part 1 of 3 - Prepare an app for deployment to Azure Container Instances
services: container-instances
author: seanmck
manager: timlt

ms.service: container-instances
ms.topic: tutorial
ms.date: 01/02/2018
ms.author: seanmck
ms.custom: mvc
---

# Create container for deployment to Azure Container Instances

Azure Container Instances enables deployment of Docker containers onto Azure infrastructure without provisioning any virtual machines or adopting any higher-level service. In this tutorial, you build a small web application in Node.js and package it in a container that can be run using Azure Container Instances.

In this article, part one of the series, you:

> [!div class="checklist"]
> * Clone application source code from GitHub
> * Create a container image from application source
> * Test the image in a local Docker environment

In subsequent tutorials, you upload your image to an Azure Container Registry, and then deploy it to Azure Container Instances.

## Before you begin

This tutorial requires that you are running the Azure CLI version 2.0.23 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0][azure-cli-install].

This tutorial assumes a basic understanding of core Docker concepts such as containers, container images, and basic `docker` commands. If needed, see [Get started with Docker][docker-get-started] for a primer on container basics.

To complete this tutorial, you need a Docker development environment installed locally. Docker provides packages that easily configure Docker on any [Mac][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.

Azure Cloud Shell does not include the Docker components required to complete every step this tutorial. You must install the Azure CLI and Docker development environment on your local computer to complete this tutorial.

## Get application code

The sample in this tutorial includes a simple web application built in [Node.js][nodejs]. The app serves a static HTML page and looks like this:

![Tutorial app shown in browser][aci-tutorial-app]

Use git to download the sample:

```bash
git clone https://github.com/Azure-Samples/aci-helloworld.git
```

## Build the container image

The Dockerfile provided in the sample repo shows how the container is built. It starts from an [official Node.js image][docker-hub-nodeimage] based on [Alpine Linux][alpine-linux], a small distribution that is well suited to use with containers. It then copies the application files into the container, installs dependencies using the Node Package Manager, and finally starts the application.

```Dockerfile
FROM node:8.9.3-alpine
RUN mkdir -p /usr/src/app
COPY ./app/ /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
CMD node /usr/src/app/index.js
```

Use the [docker build][docker-build] command to create the container image, tagging it as *aci-tutorial-app*:

```bash
docker build ./aci-helloworld -t aci-tutorial-app
```

Output from the [docker build][docker-build] command is similar to the following (truncated for readability):

```bash
Sending build context to Docker daemon  119.3kB
Step 1/6 : FROM node:8.9.3-alpine
8.9.3-alpine: Pulling from library/node
88286f41530e: Pull complete
84f3a4bf8410: Pull complete
d0d9b2214720: Pull complete
Digest: sha256:c73277ccc763752b42bb2400d1aaecb4e3d32e3a9dbedd0e49885c71bea07354
Status: Downloaded newer image for node:8.9.3-alpine
 ---> 90f5ee24bee2
...
Step 6/6 : CMD node /usr/src/app/index.js
 ---> Running in f4a1ea099eec
 ---> 6edad76d09e9
Removing intermediate container f4a1ea099eec
Successfully built 6edad76d09e9
Successfully tagged aci-tutorial-app:latest
```

Use the [docker images][docker-images] command to see the built image:

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
> * Cloned the application source from GitHub
> * Created container images from application source
> * Tested the container locally

Advance to the next tutorial to learn about storing container images in an Azure Container Registry.

> [!div class="nextstepaction"]
> [Push images to Azure Container Registry](./container-instances-tutorial-prepare-acr.md)

<!--- IMAGES --->
[aci-tutorial-app]:./media/container-instances-quickstart/aci-app-browser.png
[aci-tutorial-app-local]: ./media/container-instances-tutorial-prepare-app/aci-app-browser-local.png

<!-- LINKS - External -->
[alpine-linux]: https://alpinelinux.org/
[docker-build]: https://docs.docker.com/engine/reference/commandline/build/
[docker-get-started]: https://docs.docker.com/get-started/
[docker-hub-nodeimage]: https://store.docker.com/images/node
[docker-images]: https://docs.docker.com/engine/reference/commandline/images/
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/
[nodejs]: http://nodejs.org

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
