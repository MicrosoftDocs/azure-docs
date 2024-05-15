---
title: Include file
description: Include file
services: container-instances
author: tomvcassidy

ms.service: container-instances
ms.topic: include
ms.date: 03/01/2023
ms.author: tomcassidy
ms.custom: include file
---

To complete this tutorial, you must satisfy the following requirements:

* **Azure CLI**: You must have Azure CLI version 2.44.1 or later installed on your local computer. To find your version, run `az --version`. If you need to install or upgrade, see [Install the Azure CLI][azure-cli-install].

* **Azure CLI confcom extension**: You must have Azure CLI confcom extension version 0.30+ installed to generate confidential computing enforcement policies.

  ```bash
   az extension add -n confcom
  ```

* **Docker**: You need Docker installed locally. Docker provides packages that configure the Docker environment on [macOS][docker-mac], [Windows][docker-windows], and [Linux][docker-linux].

  This tutorial assumes a basic understanding of core Docker concepts like containers, container images, and basic `docker` commands. For a primer on Docker and container basics, see the [Docker overview][docker-get-started].

> [!IMPORTANT]
> Because Azure Cloud Shell doesn't include the Docker daemon, you must install both the Azure CLI and Docker Engine on your *local computer* to complete this tutorial. You can't use Azure Cloud Shell for this tutorial.

<!-- LINKS - External -->
[docker-get-started]: https://docs.docker.com/engine/docker-overview/
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
