---
title: Lock images
description: Set attributes for a container image or repository so it can't be deleted or overwritten in an Azure container registry.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Lock a container image in an Azure container registry

In an Azure container registry, you can lock an image version or a repository so that it can't be deleted or updated. To lock an image or a repository, update its attributes using the Azure CLI command [az acr repository update][az-acr-repository-update]. 

This article requires that you run the Azure CLI in Azure Cloud Shell or locally (version 2.0.55 or later recommended). Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli].

> [!IMPORTANT]
> This article doesn't apply to locking an entire registry, for example, using **Settings > Locks** in the Azure portal, or `az lock` commands in the Azure CLI. Locking a registry resource doesn't prevent you from creating, updating, or deleting data in repositories. Locking a registry only affects management operations such as adding or deleting replications, or deleting the registry itself. More information in [Lock resources to prevent unexpected changes](../azure-resource-manager/management/lock-resources.md).

## Scenarios

By default, a tagged image in Azure Container Registry is *mutable*, so with appropriate permissions you can repeatedly update and push an image with the same tag to a registry. Container images can also be [deleted](container-registry-delete.md) as needed. This behavior is useful when you develop images and need to maintain a size for your registry.

However, when you deploy a container image to production, you might need an *immutable* container image. An immutable image is one that you can't accidentally delete or overwrite.

See [Recommendations for tagging and versioning container images](container-registry-image-tag-version.md) for strategies to tag and version images in your registry.

Use the [az acr repository update][az-acr-repository-update] command to set repository attributes so you can:

* Lock an image version, or an entire repository

* Protect an image version or repository from deletion, but allow updates

* Prevent read (pull) operations on an image version, or an entire repository

See the following sections for examples. 

## Lock an image or repository 

### Show the current repository attributes
To see the current attributes of a repository, run the following [az acr repository show][az-acr-repository-show] command:

```azurecli
az acr repository show \
    --name myregistry --repository myrepo \
    --output jsonc
```

### Show the current image attributes

To see the current attributes of a tag, run the following [az acr repository show][az-acr-repository-show] command:

```azurecli
az acr repository show \
    --name myregistry --image myrepo:tag \
    --output jsonc
```

### Lock an image by tag

To lock the *myrepo:tag* image in *myregistry*, run the following [az acr repository update][az-acr-repository-update] command:

```azurecli
az acr repository update \
    --name myregistry --image myrepo:tag \
    --write-enabled false
```

### Lock an image by manifest digest

To lock a *myrepo* image identified by manifest digest (SHA-256 hash, represented as `sha256:...`), run the following command. (To find the manifest digest associated with one or more image tags, run the [az acr manifest list-metadata][az-acr-manifest-list-metadata] command.)

```azurecli
az acr repository update \
    --name myregistry --image myrepo@sha256:123456abcdefg \
    --write-enabled false
```

### Lock a repository

To lock the *myrepo* repository and all images in it, run the following command:

```azurecli
az acr repository update \
    --name myregistry --repository myrepo \
    --write-enabled false
```

## Check image attributes for tag and its corresponding manifest.

> [!NOTE]
> * The changeable attributes of tags and manifest are managed separately. That is, setting attribute `deleteEnabled=false` for the tag won't set the same for the corresponding manifest.

>* Query the attributes using the script below:

```bash
registry="myregistry"
repo="myrepo"
tag="mytag"

az login
az acr repository show -n $registry --repository $repo
az acr manifest show-metadata -r $registry -n "$repo:$tag"
digest=$(az acr manifest show-metadata -r $registry -n "$repo:$tag" --query digest -o tsv)
az acr manifest show-metadata -r $registry -n "$repo@$digest"
```

## Protect an image or repository from deletion

### Protect an image from deletion

To allow the *myrepo:tag* image to be updated but not deleted, run the following command:

```azurecli
az acr repository update \
    --name myregistry --image myrepo:tag \
    --delete-enabled false --write-enabled true
```

### Protect a repository from deletion

The following command sets the *myrepo* repository so it can't be deleted. Individual images can still be updated or deleted.

```azurecli
az acr repository update \
    --name myregistry --repository myrepo \
    --delete-enabled false --write-enabled true
```

## Prevent read operations on an image or repository

To prevent read (pull) operations on the *myrepo:tag* image, run the following command:

```azurecli
az acr repository update \
    --name myregistry --image myrepo:tag \
    --read-enabled false
```

To prevent read operations on all images in the *myrepo* repository, run the following command:

```azurecli
az acr repository update \
    --name myregistry --repository myrepo \
    --read-enabled false
```

## Unlock an image or repository

To restore the default behavior of the *myrepo:tag* image so that it can be deleted and updated, run the following command:

```azurecli
az acr repository update \
    --name myregistry --image myrepo:tag \
    --delete-enabled true --write-enabled true
```

To restore the default behavior of the *myrepo* repository and all images so that they can be deleted and updated, run the following command:

```azurecli
az acr repository update \
    --name myregistry --repository myrepo \
    --delete-enabled true --write-enabled true
```

## Next steps

In this article, you learned about using the [az acr repository update][az-acr-repository-update] command to prevent deletion or updating of image versions in a repository. To set additional attributes, see the [az acr repository update][az-acr-repository-update] command reference.

To see the attributes set for an image version or repository, use the [az acr repository show][az-acr-repository-show] command.

For details about delete operations, see [Delete container images in Azure Container Registry][container-registry-delete].

<!-- LINKS - Internal -->
[az-acr-manifest-list-metadata]: /cli/azure/acr/manifest#az-acr-manifest-list-metadata
[az-acr-repository-update]: /cli/azure/acr/repository#az_acr_repository_update
[az-acr-repository-show]: /cli/azure/acr/repository#az_acr_repository_show
[azure-cli]: /cli/azure/install-azure-cli
[container-registry-delete]: container-registry-delete.md
