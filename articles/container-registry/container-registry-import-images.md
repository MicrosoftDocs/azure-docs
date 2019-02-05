---
title: Import container images to an Azure container registry 
description: Import container images to an Azure container registry by using Azure APIs, without needing to run Docker commands.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 02/04/2019
ms.author: danlep
---

# Import container images to a container registry

You can easily import (copy) container images to an Azure container registry, without having to use Docker commands. For example, import images from a development registry to a production registry, or copy base images from a public registry.

Azure Container Registry handles a number of common scenarios to copy images from an existing registry:

* Import from a public registry

* Import from another Azure container registry, either in the same or a different Azure subscription

* Import from a non-Azure private container registry

Image import into an Azure Azure container registry has the following benefits over using Docker CLI commands:
 
1. Because your client environment doesn’t need a local Docker installation, you can import any container image, regardless of the supported OS type. 

2. When you import multi-architecture images (such as official Docker images), images for all architectures and platforms specified in the manifest list are copied to the registry.

To import container images, this article requires that you run the Azure CLI in Azure Cloud Shell or locally (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Prerequisites

If you don't already have an Azure container registry, create a registry. For steps, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md).

To import an image to an Azure container registry, your identity must have write permissions to the registry (at least Contributor role). See [Azure Container Registry roles and permissions](container-registry-roles.md). 

## Import from a public registry

### Import from Docker Hub

For example, use the [az acr import][az-acr-import] command to import the multi-architecture `hello-world:latest` image from Docker Hub to a registry named *myregistry*. Because `hello-world` is an official image from Docker Hub, this image is in the default `library` repository. Include the repository name and optionally a tag in the value of the `--source` image parameter. (In addition to importing an image by tag, you can specify a manifest digest.)
 
```azurecli
az acr import --name myregistry --source docker.io/library/hello-world:latest --image hello-world:latest
```

You can verify that multiple manifests are associated with this image by running the `az acr repository show-manifests` command:

```azurecli
az acr repository show-manifests --name myregistry --repository hello-world
```

The following example imports a public image from the `tensorflow` repository in Docker Hub:

```azurecli
az acr import --name myregistry --source docker.io/tensorflow/tensorflow:latest-gpu --image tensorflow:latest-gpu
```

### Import from Microsoft Container Registry

For example, import the latest Windows Server Core image from the `windows` repository in Microsoft Container Registry.

```azurecli
az acr import --name myregistry --source mcr.microsoft.com/windows/servercore:latest --image servercore:latest
```

## Import from another Azure container registry

You can import an image from another Azure container registry using integrated Azure Active Directory permissions.

* Your identity must have Azure Active Directory permissions to read from the source registry (Reader role) and to write to the target registry (Contributor role).

* The registry can be in the same or a different Azure subscription in the same Active Directory tenant.

### Import from a registry in the same subscription

For example, import the `aci-helloworld:latest` image from a source registry *mysourceregistry* to *myregistry* in the same Azure subscription.

```azurecli
az acr import --name myregistry --source mysourceregistry.azurecr.io/aci-helloworld:latest --image hello-world:latest
```

### Import from a registry in a different subscription

In the following example, *mysourceregistry* is in a different subscription from *myregistry* in the same Active Directory tenant. Supply the resource ID of the source registry with the `--registry` parameter.
 
```azurecli
az acr import --name myregistry --source mysourceregistry.azurecr.io/aci-helloworld:latest --image hello-world:latest --registry /subscriptions/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sourceResourceGroup/providers/Microsoft.ContainerRegistry/registries/mysourceregistry
```

### Import from a registry using service principal credentials

To import from an Azure container registry that you can't access using integrated Azure Active Directory permissions, you can use service principal credentials, if available. Supply the appID and password of an Active Directory [service principal](container-registry-auth-service-principal.md) that has ACRPull access to the source registry. Using a service principal is useful for build systems and other unattended systems that need to import images to your registry.

```azurecli
az acr import --name myregistry --source sourceregistry.azurecr.io/sourcerepo/sourceimage:tag --image targetimage:tag --username <SP_App_ID> –-password <SP_Passwd>
```

## Import from a non-Azure private container registry

Import an image from a private registry by specifying credentials that have pull access to the registry. For example, pull an image from a private Docker registry: 

```azurecli
az acr import --name myregistry --source docker.io/sourcerepo/sourceimage:tag --image sourceimage:tag --username <username> --password <password>
```

## Next steps

In this article, you learned about importing container images to an Azure container registry from a public Docker container registry or another private container registry. 

If you need to push only trusted images to a container registry, using Docker's content trust model, see [Content trust in Azure Container Registry](container-registry-content-trust.md). 

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az-login
[az-acr-import]: /cli/azure/acr#az-acr-import
[azure-cli]: /cli/azure/install-azure-cli