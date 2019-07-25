---
title: About repositories and images in Azure Container Registry
description: Introduction to key concepts of Azure container registries, repositories, and container images.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 07/01/2019
ms.author: danlep
---

# About registries, repositories, and images

This article introduces the key concepts of container registries, repositories, and container images and related artifacts. 

## Registry

A container *registry* is a service that stores and distributes container images. Docker Hub is a public container registry that supports the open source community and serves as a general catalog of images. Azure Container Registry provides users with direct control of their images, with integrated authentication, [geo-replication](container-registry-geo-replication.md) supporting global distribution and reliability for network-close deployments, [virtual network and firewall configuration](container-registry-vnet.md), [tag locking](container-registry-image-lock.md), and many other enhanced features. 

In addition to Docker container images, Azure Container Registry supports related [content artifacts](container-registry-image-formats.md) including Open Container Initiative (OCI) image formats.

## Content addressable elements of an artifact

The address of an artifact in an Azure container registry includes the following elements. 

```
[loginUrl]/[namespace]/[artifact:][tag]
```

* **loginUrl** - The fully qualified name of the registry host. The registry host in an Azure container registry is in the format *myregistry*.azurecr.io (all lowercase). You must specify the loginUrl when using Docker or other client tools to pull or push artifacts to an Azure container registry. 
* **namespace** - Slash-delimited logical grouping of related images or artifacts - for example, for a workgroup or app
* **artifact** - The name of a repository for a particular image or artifact
* **tag** - A specific version of an image or artifact stored in a repository


For example, the full name of an image in an Azure container registry might look like:

```
myregistry.azurecr.io/marketing/campaign10-18/email-sender:v2
```

See the following sections for details about these elements.

## Repository name

Container registries manage *repositories*, collections of container images or other artifacts with the same name, but different tags. For example, the following three images are in the "acr-helloworld" repository:

```
acr-helloworld:latest
acr-helloworld:v1
acr-helloworld:v2
```

Repository names can also include [namespaces](container-registry-best-practices.md#repository-namespaces). Namespaces allow you to group images using forward slash-delimited repository names, for example:

```
marketing/campaign10-18/web:v2
marketing/campaign10-18/api:v3
marketing/campaign10-18/email-sender:v2
product-returns/web-submission:20180604
product-returns/legacy-integrator:20180715
```

## Image

A container image or other artifact within a registry is associated with one or more tags, has one or more layers, and is identified by a manifest. Understanding how these components relate to each other can help you manage your registry effectively.

### Tag

The *tag* for an image or other artifact specifies its version. A single artifact within a repository can be assigned one or many tags, and may also be "untagged." That is, you can delete all tags from an image, while the image's data (its layers) remain in the registry.

The repository (or repository and namespace) plus a tag defines an image's name. You can push and pull an image by specifying its name in the push or pull operation.

How you tag container images is guided by your scenarios to develop or deploy them. For example, stable tags are recommended for maintaining your base images, and unique tags for deploying images. For more information, see [Recommendations for tagging and versioning container images](container-registry-image-tag-version.md).

### Layer

Container images are made up of one or more *layers*, each corresponding to a line in the Dockerfile that defines the image. Images in a registry share common layers, increasing storage efficiency. For example, several images in different repositories might share the same Alpine Linux base layer, but only one copy of that layer is stored in the registry.

Layer sharing also optimizes layer distribution to nodes with multiple images sharing common layers. For example, if an image already on a node includes the Alpine Linux layer as its base, the subsequent pull of a different image referencing the same layer doesn't transfer the layer to the node. Instead, it references the layer already existing on the node.

To provide secure isolation and protection from potential layer manipulation, layers are not shared across registries.

### Manifest

Each container image or artifact pushed to a container registry is associated with a *manifest*. The manifest, generated by the registry when the image is pushed, uniquely identifies the image and specifies its layers. You can list the manifests for a repository with the Azure CLI command [az acr repository show-manifests][az-acr-repository-show-manifests]:

```azurecli
az acr repository show-manifests --name <acrName> --repository <repositoryName>
```

For example, list the manifest digests for the "acr-helloworld" repository:

```console
$ az acr repository show-manifests --name myregistry --repository acr-helloworld
[
  {
    "digest": "sha256:0a2e01852872580b2c2fea9380ff8d7b637d3928783c55beb3f21a6e58d5d108",
    "tags": [
      "latest",
      "v3"
    ],
    "timestamp": "2018-07-12T15:52:00.2075864Z"
  },
  {
    "digest": "sha256:3168a21b98836dda7eb7a846b3d735286e09a32b0aa2401773da518e7eba3b57",
    "tags": [
      "v2"
    ],
    "timestamp": "2018-07-12T15:50:53.5372468Z"
  },
  {
    "digest": "sha256:7ca0e0ae50c95155dbb0e380f37d7471e98d2232ed9e31eece9f9fb9078f2728",
    "tags": [
      "v1"
    ],
    "timestamp": "2018-07-11T21:38:35.9170967Z"
  }
]
```

### Manifest digest

Manifests are identified by a unique SHA-256 hash, or *manifest digest*. Each image or artifact--whether tagged or not--is identified by its digest. The digest value is unique even if the image's layer data is identical to that of another image. This mechanism is what allows you to repeatedly push identically tagged images to a registry. For example, you can repeatedly push `myimage:latest` to your registry without error because each image is identified by its unique digest.

You can pull an image from a registry by specifying its digest in the pull operation. Some systems may be configured to pull by digest because it guarantees the image version being pulled, even if an identically tagged image is subsequently pushed to the registry.

For example, pull an image from the "acr-helloworld" repository by manifest digest:

```console
$ docker pull myregistry.azurecr.io/acr-helloworld@sha256:0a2e01852872580b2c2fea9380ff8d7b637d3928783c55beb3f21a6e58d5d108
```

> [!IMPORTANT]
> If you repeatedly push modified images with identical tags, you might create orphaned images--images that are untagged, but still consume space in your registry. Untagged images are not shown in the Azure CLI or in the Azure portal when you list or view images by tag. However, their layers still exist and consume space in your registry. For information about freeing space used by untagged images, see [Delete container images in Azure Container Registry](container-registry-delete.md).


## Next steps

Learn more about [image storage](container-registry-storage.md) and [supported content formats](container-registry-image-formats.md) in Azure Container Registry.

<!-- LINKS - Internal -->
[az-acr-repository-show-manifests]: /cli/azure/acr/repository#az-acr-repository-show-manifests


