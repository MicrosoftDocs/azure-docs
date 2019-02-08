---
title: Lock an image in Azure Container Registry 
description: Configure a container image or repository in an Azure container registry to be immutable, so that it can't be deleted or overwritten.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 02/07/2019
ms.author: danlep
---

# Lock a container image in an Azure container registry

In an Azure container registry, you can lock one or more image versions in a repository, so that the images can't be deleted or updated. By default, a tagged image in Azure Container Registry is *mutable*, meaning that you can repeatedly update and push an image with the same tag to the registry, or delete the tagged image when needed. This can be useful for some development scenarios. However, when you deploy a container image to production, an *immutable* container image can be advantageous so you don't accidentally introduce changes to a production system. 

To lock one or more image versions in a repository, use the Azure CLI command [az acr repository update][az-acr-repository-update]. Set the `--delete-enabled` and `write-enabled` parameters both to `false`. If you want to protect an image version from deletion, but allow updates, set `delete-enabled` to `false` and set `write-enabled` to `true`

This article requires that you run the Azure CLI in Azure Cloud Shell or locally (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

## Lock an image with the Azure CLI

To lock the *myrepo/myimage:tag* image in *myregistry*, run the following [az acr repository update][az-acr-repository-update] command:

```azurecli
az acr repository update --name myregistry --image myrepo/myimage:tag --delete-enabled false --write-enabled false
```

To lock a *myrepo/myimage* image identified by manifest digest (SHA-256 hash, represented as `sha256:...`), run the following command. (To find the manifest digest associated with one or more image tags, run the [az acr repository show-manifests][az-acr-repository show-manifests] command.)


```azurecli
az acr repository update --name myregistry --image myrepo/myimage@sha256:123456abcdefg --delete-enabled false --write-enabled false
```

To lock all tagged images in the *myrepo/myimage* repository, run the following command:


```azurecli
az acr repository update --name myregistry --repository myrepo/myimage --delete-enabled false --write-enabled false
```



## Unlock an image with the Azure CLI 

If you want to unlock an image so that it can be updated, run a command similar to the following:

```azurecli
az acr repository update --image myrepo/myimage:tag --write-enabled true
```

To unlock an image so that it can be updated or deleted, run a command similar to the following:

```azurecli
az acr repository update --image myrepo/myimage:tag --delete-enabled true --write-enabled true
```

## Next steps

In this article...

<!-- LINKS - Internal -->
[az-acr-repository-update]: /cli/azure/acr/repository#az-acr-repository-update
[az-acr-repository-show-manifests]: /cli/azure/acr/repository#az-acr-repository-show-manifests
[azure-cli]: /cli/azure/install-azure-cli

