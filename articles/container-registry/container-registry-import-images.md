---
title: Import container images to an Azure container registry 
description: Import container images to an Azure container registry by using Azure APIs, without needing to run Docker commands.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 02/01/2019
ms.author: danlep
---

# Import container images to a container registry 

[Intro here]

Users typically want to be able to push a base image to an Azure container registry without using Docker on the client. ACR enables users to use the import container image API which handles a number of common scenarios to copy images from an existing registry:

* Import from a public registry

* Import from another Azure container registry, either in the same or different Azure subscription

* Import from a non-Azure private container registry

Image import into an Azure Azure container registry has the following benefits:
 
1. Because the client doesn’t need a local Docker installation, you can import an image irrespective of the platform. 

2. When you import multi-architecture images, images for all architectures and platforms specified in the manifest list are copied to the registry. This feature is more convenient than when using the Docker CLI, which only allows you to pull the image of the matching platform. 

To import container images, this article requires that you run the Azure CLI in Azure Cloud Shell or locally (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Container registry permissions

To import an image to an Azure container registry, your identity must have Contributor permissions to the registry. See [Azure Container Registry roles and permissions](container-registry-roles.md). 

If you don't already have an Azure container registry, create a registry. For steps, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md).

## Import from another Azure container registry

If you have , you can import an image from another Azure container registry using integrated Azure Active Directory permissions.

* Your identity must have permission to read from the source registry as well as Contributor permissions to the target registry.

* The registry can be in the same or a different Azure subscription in the same Active Directory tenant.

### Import from a registry in the same subscription

For example, import the `aci-helloworld:latest` image from a source registry *mysourceregistry* to a registry called *myregistry* in the same Azure subscription.

```azurecli
az acr import --name myregistry --source mysourceregistry.azurecr.io/aci-helloworld:latest --image hello-world:latest
```

### Import from a registry in a different subscroption

In the following example, *mysourceregistry* is in a different subscription from *myregistry*.
 
```azurecli
az acr import --name myregistry --source mysourceregistry.azurecr.io/aci-helloworld:latest --image hello-world:latest --registry /subscriptions/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sourceResourceGroup/providers/Microsoft.ContainerRegistry/registries/mysourceregistry
```

## Import from a public registry

### Import from Docker Hub

For example, import the multi-architecture `hello-world` image from Docker Hub to a registry named *myregistry*. Because it is an official image from Docker Hub, the name is qualified with `docker.io/library`.
 
```azurecli
az acr import --name myregistry --source docker.io/library/hello-world:latest --image hello-world:latest
```

You can verify that multiple manifests are associated with this image by running the `az acr repository show-manifests` command:

```azurecli
az acr repository show-manifests --name myregistry --repository hello-world
```

The following example imports a public image from Docker Hub that's in the separate *tensorflow* repository:

```azurecli
az acr import --name myregistry --source docker.io/tensorflow/tensorflow:latest-gpu --image tensorflow:latest-gpu
```

### Import from Microsoft Container Registry

For example, import the latest Windows Server Core image from Microsoft Container Registry.

```azurecli
az acr import --name myregistry --source mcr.microsoft.com/windows/servercore:latest --image servercore:latest
```


## Import from a private repository

### Import from a repo in a private Docker registry

You can import an image from a private registry by specifying credentials that have pull access to the registry. For example, pull an image from a private Docker registry: 


```azurecli
az acr import --name myregistry --source docker.io/myrepo/image:tag --image privateimage:tag --username {username} --password {password}
```

Similarly, import images from an another Azure container registry using the appID and password an Active Directory [service principal](container-registry-auth-service-principal.md) that has ACRPull access to the source registry.

```azurecli
az acr import --name myregistry --source sourceregistry.azurecr.io/sourcerepo/image:tag --image image:tag --username <SP_App_ID> –-password <SP_Passwd>
```

## Next steps

In this article, you learned about ...

* Learn more about ....


<!-- LINKS - external -->
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-pull]: https://docs.docker.com/engine/reference/commandline/pull/
[docker-windows]: https://docs.docker.com/docker-for-windows/

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az-login
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-vm-create]: /cli/azure/vm#az-vm-create
[az-vm-show]: /cli/azure/vm#az-vm-show
[az-vm-identity-assign]: /cli/azure/vm/identity#az-vm-identity-assign
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[az-acr-login]: /cli/azure/acr#az-acr-login
[az-identity-show]: /cli/azure/identity#az-identity-show
[azure-cli]: /cli/azure/install-azure-cli