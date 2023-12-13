---
title: Tutorial - Prepare container image for deployment
description: Azure Container Instances tutorial part 1 of 3 - Prepare an app in a container image for deployment to Azure Container Instances
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 06/17/2022
ms.custom: seodec18, mvc, devx-track-linux
---

# Tutorial: Create a container image for deployment to Azure Container Instances

Azure Container Instances enables deployment of Docker containers onto Azure infrastructure without provisioning any virtual machines or adopting a higher-level service. In this tutorial, you package a small Node.js web application into a container image that can be run using Azure Container Instances.

In this article, part one of the series, you:

> [!div class="checklist"]
> * Clone application source code from GitHub
> * Create a container image from application source
> * Test the image in a local Docker environment

In tutorial parts two and three, you upload your image to Azure Container Registry, and then deploy it to Azure Container Instances.

## Before you begin

[!INCLUDE [container-instances-tutorial-prerequisites](../../includes/container-instances-tutorial-prerequisites.md)]

## Get application code

The sample application in this tutorial is a simple web app built in [Node.js][nodejs]. The application serves a static HTML page, and looks similar to the following screenshot:

![Tutorial app shown in browser][aci-tutorial-app]

Use Git to clone the sample application's repository:

```git
git clone https://github.com/Azure-Samples/aci-helloworld.git
```

You can also [download the ZIP archive][aci-helloworld-zip] from GitHub directly.

## Build the container image

The Dockerfile in the sample application shows how the container is built. It starts from an [official Node.js image][docker-hub-nodeimage] based on [Alpine Linux][alpine-linux], a small distribution that is well suited for use with containers. It then copies the application files into the container, installs dependencies using the Node Package Manager, and finally, starts the application.

```Dockerfile
FROM node:8.9.3-alpine
RUN mkdir -p /usr/src/app
COPY ./app/* /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
CMD node /usr/src/app/index.js
```

Use the [docker build][docker-build] command to create the container image and tag it as *aci-tutorial-app*:

```bash
docker build ./aci-helloworld -t aci-tutorial-app
```

Output from the [docker build][docker-build] command is similar to the following (truncated for readability):

```bash
docker build ./aci-helloworld -t aci-tutorial-app
```
```output
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

Your newly built image should appear in the list:

```bash
docker images
```
```output
REPOSITORY          TAG       IMAGE ID        CREATED           SIZE
aci-tutorial-app    latest    5c745774dfa9    39 seconds ago    68.1 MB
```

## Run the container locally

Before you deploy the container to Azure Container Instances, use [docker run][docker-run] to run it locally and confirm that it works. The `-d` switch lets the container run in the background, while `-p` allows you to map an arbitrary port on your computer to port 80 in the container.

```bash
docker run -d -p 8080:80 aci-tutorial-app
```

Output from the `docker run` command displays the running container's ID if the command was successful:

```bash
docker run -d -p 8080:80 aci-tutorial-app
```output
a2e3e4435db58ab0c664ce521854c2e1a1bda88c9cf2fcff46aedf48df86cccf
```

Now, navigate to `http://localhost:8080` in your browser to confirm that the container is running. You should see a web page similar to the following:

![Running the app locally in the browser][aci-tutorial-app-local]

## Next steps

In this tutorial, you created a container image that can be deployed in Azure Container Instances, and verified that it runs locally. So far, you've done the following:

> [!div class="checklist"]
> * Cloned the application source from GitHub
> * Created a container image from the application source
> * Tested the container locally

Advance to the next tutorial in the series to learn about storing your container image in Azure Container Registry:

> [!div class="nextstepaction"]
> [Push image to Azure Container Registry](container-instances-tutorial-prepare-acr.md)

<!--- IMAGES --->
[aci-tutorial-app]:./media/container-instances-quickstart/aci-app-browser.png
[aci-tutorial-app-local]: ./media/container-instances-tutorial-prepare-app/aci-app-browser-local.png

<!-- LINKS - External -->
[aci-helloworld-zip]: https://github.com/Azure-Samples/aci-helloworld/archive/master.zip
[alpine-linux]: https://alpinelinux.org/
[docker-build]: https://docs.docker.com/engine/reference/commandline/build/
[docker-get-started]: https://docs.docker.com/get-started/
[docker-hub-nodeimage]: https://store.docker.com/images/node
[docker-images]: https://docs.docker.com/engine/reference/commandline/images/
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/
[nodejs]: https://nodejs.org

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
