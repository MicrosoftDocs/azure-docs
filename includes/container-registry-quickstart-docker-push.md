---
title: include file
description: include file
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: include
ms.date: 01/23/2019
ms.author: danlep
ms.custom: include file
---
## Push image to registry

To push an image to an Azure Container registry, you must first have an image. If you don't yet have any local container images, run the following [docker pull][docker-pull] command to pull an existing image from Docker Hub. For this example, pull the `hello-world` image.

```
docker pull hello-world
```

Before you can push an image to your registry, you must tag it with the fully qualified name of your ACR login server. The login server name is in the format *\<registry-name\>.azurecr.io* (all lowercase), for example, *mycontainerregistry007.azurecr.io*.

Tag the image using the [docker tag][docker-tag] command. Replace `<acrLoginServer>` with the login server name of your ACR instance.

```
docker tag hello-world <acrLoginServer>/hello-world:v1
```

Finally, use [docker push][docker-push] to push the image to the ACR instance. Replace `<acrLoginServer>` with the login server name of your ACR instance. This example creates the **hello-world** repository, containing the `hello-world:v1` image.

```
docker push <acrLoginServer>/hello-world:v1
```

After pushing the image to your container registry, remove the `hello-world:v1` image from your local Docker environment. (Note that this [docker rmi][docker-rmi] command does not remove the image from the **hello-world** repository in your Azure container registry.)

```
docker rmi <acrLoginServer>/hello-world:v1
```

<!-- LINKS - External -->
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-rmi]: https://docs.docker.com/engine/reference/commandline/rmi/
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/

<!-- LINKS - Internal -->

