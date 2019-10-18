---
title: Permissions to repositories in Azure Container Registry
description: 
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 10/18/2019
ms.author: danlep
---

# Repository-scoped permissions in Azure Container Registry 

...

Scenarios include:

* IoT with individual tokens to pull
* outside company that needs perms to a repo

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Preview limitations

* Only a **Premium** container registry can be configured with repository-scoped permissions. For information about registry service tiers, see [Azure Container Registry SKUs](container-registry-skus.md).

* Repository-scoped permissions are currently limited to registry operations using the Docker CLI, such as `docker login`, `docker push`, and `docker pull`. Operations such as tag listing or repository listing aren't currently supported.

* You can't currently assign repository-scoped permissions to Azure Active Directory objects such as a service principal or managed identity.

## Prerequisites

* **Azure CLI** - This article requires a local installation of the Azure CLI (version 2.0.76 or later). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).
* **Docker** - You also need a local Docker installation. Docker provides installation instructions for [macOS](https://docs.docker.com/docker-for-mac/), [Windows](https://docs.docker.com/docker-for-windows/), and [Linux](https://docs.docker.com/engine/installation/#supported-platforms) systems.
* **Container registry with repositories** - If necessary, create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md). 

  For test purposes, [push](container-registry-get-started-docker-cli.md) or [import](container-registry-import-images) images to the registry. Examples in this article refer to the following images in two repositories: `samples/hello-world:v1` and `samples/nginx:v1`. 

## Create a scope map


## Create an access token

## Authenticate with registry

## Verify access token



## Next steps

* See the [authentication overview](container-registry-authentication.md) for other scenarios to authenticate with an Azure container registry.


<!-- LINKS - External -->

<!-- LINKS - Internal -->
[az-acr-login]: /cli/azure/acr#az-acr-login
