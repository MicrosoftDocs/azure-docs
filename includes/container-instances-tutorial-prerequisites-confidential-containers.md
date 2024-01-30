---
title: include file
description: include file
services: container-instances
author: tomvcassidy

ms.service: container-instances
ms.topic: include
ms.date: 03/01/2023
ms.author: tomcassidy
ms.custom: include file
---

You must satisfy the following requirements to complete this tutorial:

1. **Azure CLI**: You must have Azure CLI version 2.44.1 or later installed on your local computer. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI][azure-cli-install].

2. **Azure CLI confcom extension**: You must have the Azure CLI confcom extension version 0.2.13+ installed to generate confidential computing enforcement policies. 

**Docker**: This tutorial assumes a basic understanding of core Docker concepts like containers, container images, and basic `docker` commands. For a primer on Docker and container basics, see the [Docker overview][docker-get-started].

**Docker**: To complete this tutorial, you need Docker installed locally. Docker provides packages that configure the Docker environment on [macOS][docker-mac], [Windows][docker-windows], and [Linux][docker-linux].

**Azure CLI confcom extension**: You must have the Azure CLI confcom extension version 0.30+ to generate confidential computing enforcement policies. 
   
```bash
   az extension add -n confcom
 ```

> [!IMPORTANT]
> Because the Azure Cloud shell does not include the Docker daemon, you *must* install both the Azure CLI and Docker Engine on your *local computer* to complete this tutorial. You cannot use the Azure Cloud Shell for this tutorial.

<!-- LINKS - External -->
[docker-get-started]: https://docs.docker.com/engine/docker-overview/
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
