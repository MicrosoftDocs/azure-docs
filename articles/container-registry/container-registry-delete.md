---
title: Delete image resources in Azure Container Registry
description: Details on how to effectively managed registry size by deleting container image data.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 07/14/2018
ms.author: marsma
---

# Delete container images in Azure Container Registry

Periodic deletion of stale or unused container image data should be included as part of your regular container registry maintenance routine. Because you can initiate deletion on several different resource types (like repositories, images, and manifest digests), it's important to understand how each delete operation affects the space usage of your registry. This article starts by introducing the components of a Docker registry and its images, explains how to delete those components, and how deleting each affects the size of your registry.

## Components of a registry

Because Docker container images share layer data and include several components by which delete operations can be made, managing registry size requires some knowledge of registry layout and how container images are constructed.

### Registry

A container registry is a service that stores and distributes container images. For example, Docker Hub is a public Docker container registry, while Azure Container Registry provides private Docker container registries in Azure.

### Repository

Within each registry are image *repositories*, collections of container images with the same name, but different tags. The name of an image is defined by the repository name, followed by a tag:

`repository:tag`

For example, these three images reside within the `acr-helloworld` repository, each with a different tag:

```
acr-helloworld:latest
acr-helloworld:v1
acr-helloworld:v2
```

## Components of an image

A container image consists of several components, many of which support deletion. Understanding how these components relate to one another can help you determine what to delete, and in which situations they should be deleted.

### Tag

An image's *tag* typically specifies its version. A single image within a repository can be assigned one or multiple tags, and can also be "untagged." That is, you can delete all tags for an image, while still leaving the image data (its layers) within the registry.

You can push and pull an image by specifying its name in `repository:tag` format in the push or pull operation.

### Layer

Images are made up of one or more *layers*, each of which corresponds to a line in the Dockerfile that defines the image. Images within a repository can share layers, reducing the storage required for images that share layers. Network traffic is also minimized, since layers already existing in the local filesystem do not need to be pulled again; only new or modified layers are pulled from the registry.

### Manifest

Within a container registry, an image *manifest* provides the identification for the image and specifies the layers that make up an image within the registry.

### Manifest digest

Manifests are identified by a unique SHA-256 hash, or *digest*. A unique digest is included in each container image you build, uniquely identifying the image even if its layer data is identical to that of another image in the registry. This is what allows you repeatedly push identically tagged images to a registry, even if their layer data is the same. For example, you can repeatedly push `myimage:latest` to your registry without error because each image is identified by its unique digest.

You can pull an image from a registry by specifying its digest in the pull operation. Some systems may be configured to pull by digest because it guarantees the image version being pulled, even if an identically tagged image is subsequently pushed to the registry.

> [!IMPORTANT]
> If you repeatedly push identically tagged images, you create orphaned images--images which are untagged, but not deleted. This can cause "hidden" storage usage because the untagged images are not displayed when listing images with the Azure CLI or in the Azure portal. However, their layers still exist and consume space in your registry. For information about deleting orphaned image data, see [Delete by manifest digest](#delete-by-manifest-digest).

## Delete image data

You can delete images (layer data) and you can delete tags. The former frees space, while the latter does not.

### Delete repository

Deleting a repository deletes all of the images in the repository, including all tags, layers, and manifests. When you delete a repository, you recover the storage space used by the images that were in that repository.

The following Azure CLI command deletes the `acr-helloworld` repository and all tags and manifests within the repository. If layers referenced by the deleted manifests are not referenced by any other images in the registry, their layer data is also deleted.

```azurecli
 az acr repository delete --name myregistry --repository acr-helloworld
```

### Delete by tag

You can delete individual images from a repository by specifying the repository name and tag in the delete operation. When you delete by tag, you recover the storage space used by the image if its layers are not shared with any other images in the registry.

```azurecli
az acr repository delete --name myregistry --image acr-helloworld:latest
```

> [!TIP]
> Deleting *by* tag shouldn't be confused with deleting a tag (untagging). You can delete a tag with the Azure CLI command [az acr repository untag](). No space is freed when you untag an image because its [manifest](#manifest) and layer data remains in the registry--only the tag itself is deleted.

### Delete by manifest digest

A [manifest digest](#manifest-digest) can be associated with one, multiple, or no tags. When you delete by digest, all tags referenced by the manifest are deleted, as is all layer data for any *unique* layers referenced by the manifest. Shared layer data is not deleted.

To delete by digest, first list the manifest digests for the repository containing the images you wish to delete:

```azurecli
az acr repository show-manifests --name myregistry --repository myrepository
```

For example, listing the manifest digests for the `acr-helloworld` repository:

```console
$ az acr repository show-manifests --name myregistry --repository myrepository
[
  {
    "digest": "sha256:37c989e19592d5a63a64f870a62da16c893b1d35832262ba576d29a0e52ceada",
    "tags": [
      "v3"
    ],
    "timestamp": "2018-05-03T18:27:53.5818911Z"
  },
  {
    "digest": "sha256:565dba8ce20ca1a311c2d9485089d7ddc935dd50140510050345a1b0ea4ffa6e",
    "tags": [
      "v4",
      "v5"
    ],
    "timestamp": "2018-06-14T14:44:18.7662996Z"
  },
  {
    "digest": "sha256:a86151c1efeb43ad7ca7de020ffcf1973aca0b5cef832c498b96e687b5f2a028",
    "tags": [
      "v2"
    ],
    "timestamp": "2018-02-24T00:11:11.0507147Z"
  }
]
```

Next, specify the digest you wish to delete in the [az acr repository delete]() command. For example, deleting the first manifest shown in the preceding output:

```azurecli
$ az acr repository delete --name myregistry --image acr-helloworld@sha256:37c989e19592d5a63a64f870a62da16c893b1d35832262ba576d29a0e52ceada
This operation will delete the manifest 'sha256:37c989e19592d5a63a64f870a62da16c893b1d35832262ba576d29a0e52ceada' and all the following images: 'aci-helloworld:v3'.
Are you sure you want to continue? (y/n): y
```

**Delete orphaned images**

Because the push of an already existing tag **untags** the previously pushed image, the previously push image's manifest--and its layer data--remains. However... TODO

## Next steps

For more information about how images are stored in Azure Container Registry see [Container image storage in Azure Container Registry](container-registry-storage.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[portal]: https://portal.azure.com

<!-- LINKS - Internal -->
