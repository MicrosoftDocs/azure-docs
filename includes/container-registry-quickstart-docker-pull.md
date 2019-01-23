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

## Run image from registry

Now, you can pull and run the `busybox:v1` container image from your container registry. This [docker run][docker-run] example displays the current date and time:

```Docker
docker run <acrLoginServer>/busybox:v1 date 
```

Example output: 

```
Unable to find image 'mycontainerregistry007.azurecr.io/busybox:v1' locally
v1: Pulling from busybox
Digest: sha256:662dd8e65ef7ccf13f417962c2f77567d3b132f12c95909de6c85ac3c326a345
Status: Downloaded newer image for mycontainerregistry007.azurecr.io/busybox:v1
Wed Jan 23 00:45:03 UTC 2019
```

<!-- LINKS - External -->
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/
