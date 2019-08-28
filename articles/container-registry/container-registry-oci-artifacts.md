---
title: Push OCI artifacts to private Azure container registry
description: Push and pull Open Container Initiative (OCI) artifacts using a private container registry in Azure 
services: container-registry
author: dlepow
manager: gwallace

ms.service: container-registry
ms.topic: article
ms.date: 08/29/2019
ms.author: danlep
ms.custom: 
---

# Push and pull OCI artifacts using an Azure container registry

An Azure container registry is able to store and manage [Open Container Initiative (OCI) artifacts](container-registry-image-formats.md#oci-artifacts) in addition to Docker and Docker-compatible container images.

This article shows how to use the [OCI Registry as Storage (ORAS)](https://github.com/deislabs/oras) tool to push a sample artifact -  a text file - to an Azure container registry. Then, pull the image from the registry. While this example is basic, you can build and store a range of OCI artifacts in an Azure container registry using native command line tools for those artifacts.

## Prerequisites

* **Azure CLI** - You need a local installation of the Azure CLI to run the examples in this article. Version 2.0.71 or later is recommended. Run `az --version `to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* **Docker** - You must also have Docker installed locally, to authenticate with the registry. Docker provides packages that easily configure Docker on any [macOS][docker-mac], [Windows][docker-windows], or [Linux][docker-linux] system.
* **Azure container registry** - Create a container registry in your Azure subscription. For example, use the [Azure portal](container-registry-get-started-portal.md) or the [Azure CLI](container-registry-get-started-azure-cli.md).
* **ORAS tool** - Download and install a current `oras` release for your operating system from the [GitHub repo](https://github.com/deislabs/oras/releases). Currently the tool is released as a compressed tarball (`.tar.gz` file). Extract and install the file using stand procedures for your operating system.
* **Azure Active Directory service principal (optional)** - Optionally create a [service principal](container-registry-auth-service-principal.md) to access your registry. For this article, ensure that the service principal is assigned the AcrPush role, which has permissions to push and pull artifacts.

## Sign in to a registry

First, [sign in](/cli/azure/authenticate-azure-cli) to the Azure CLI with an identity (your own, or a service principal) that has permissions to push and pull artifacts from the container registry.

Then, use the Azure CLI command [az acr login](/cli/azure/acr?view=azure-cli-latest#az-acr-login) to access the registry. For example, to log in to a registry named *myregistry*:

```azurecli
az acr login --name myregistry
```

## Push an artifact

Create a text file with some sample text. For example, in a bash shell:

```bash
echo "Here is an artifact!" > artifact.txt
```

Use the `oras` tool to push this artifact to your registry. The following example pushes the sample text file to the `samples/artifact` repo in *myregistry*. The artifact is tagged `v1`. Be sure to use the fully qualified registry name (all lowercase):

```bash
oras push myregistry.azurecr.io/samples/artifact:v1 artifact.txt
```


## Pull an artifact





## Next steps




<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-windows]: https://docs.docker.com/docker-for-windows/
