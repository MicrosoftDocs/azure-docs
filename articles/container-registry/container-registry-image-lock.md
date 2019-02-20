---
title: Lock an image in Azure Container Registry 
description: Configure a container image or repository in an Azure container registry to be immutable, so that it can't be deleted or overwritten.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 02/19/2019
ms.author: danlep
---

# Lock a container image in an Azure container registry

In an Azure container registry, you can lock one or more image versions in a repository, so that the images can't be deleted or updated. To lock one or more image versions, use the Azure CLI command [az acr repository update][az-acr-repository-update] to update the repository properties. 

This article requires that you run the Azure CLI in Azure Cloud Shell or locally (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Scenarios

By default, a tagged image in Azure Container Registry is *mutable*, so if you have appropriate permissions you can repeatedly update and push an image with the same tag to a registry. Also, by default, container images can be [delete](container-registry-delete.md) as needed. This can be useful for some development scenarios and to maintain a size for your registry.

However, when you deploy a container image to production, you might need an *immutable* container image so you don't accidentally delete it or overwrite it. Use the [az acr repository update][az-acr-repository-update] command to set properties for a repository or one or more images in the following scenarios:

* Lock an image version, or an entire repository

* Protect a repository from deletion, but allow individual image versions to be deleted

* Protect an image version from deletion, but allow updates

## Lock an image or repository with the Azure CLI

### Lock an image by tag

To lock the *myrepo/myimage:tag* image in *myregistry*, run the following [az acr repository update][az-acr-repository-update] command:

```azurecli
az acr repository update --name myregistry --image myrepo/myimage:tag --delete-enabled false --write-enabled false
```

### Lock an image by manifest digest

To lock a *myrepo/myimage* image identified by manifest digest (SHA-256 hash, represented as `sha256:...`), run the following command. (To find the manifest digest associated with one or more image tags, run the [az acr repository show-manifests][az-acr-repository-show-manifests] command.)


```azurecli
az acr repository update --name myregistry --image myrepo/myimage@sha256:123456abcdefg --delete-enabled false --write-enabled false
```

### Lock a repository

To lock the *myrepo/myimage* repository and all images in it, run the following command:

```azurecli
az acr repository update --name myregistry --repository myrepo/myimage --write-enabled false
```

### Protect a repository from deletion

The following command locks the *myrepo/myimage* repository, but allows individual images to be deleted:




### Allow image update but not deletion

To set the *myrepo/myimage:tag* image so that it can be updated but not deleted, run the following command:


```azurecli
az acr repository update --name myregistry --repository myrepo/myimage --delete-enabled false --write-enabled true
```

## Unlock an image with the Azure CLI

To restore the default behavior of an image so that it can be deleted and updated, run a command similar to the following:

```azurecli
az acr repository update --image myrepo/myimage:tag --delete-enabled true --write-enabled true
```

## Next steps

In this article you learned about using the [az acr repository update][az-acr-repository-update] command to prevent deletion or updating of image versions in a repository. To set additional properties, see the [az acr repository update][az-acr-repository-update] command reference.

<!-- LINKS - Internal -->
[az-acr-repository-update]: /cli/azure/acr/repository#az-acr-repository-update
[az-acr-repository-show-manifests]: /cli/azure/acr/repository#az-acr-repository-show-manifests
[azure-cli]: /cli/azure/install-azure-cli

