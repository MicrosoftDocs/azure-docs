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

Each Azure container registry includes certain [size limits](container-registry-skus.md#sku-feature-matrix), and requires periodic deletion of image data to maintain its size. Because you can delete several different resources like repositories, tags, and manifests, understanding exactly what is using space in your registry, and freeing that space, can at first seem difficult. This article starts by introducing the components of a Docker registry and its images, explains how to delete those components, and how deleting each affects the size of your registry.

## Components of a registry

Because Docker container images share layer data and include several components that can be deleted, managing registry size requires some knowledge of registry layout, and how container images are constructed.

### Registry

A container registry is a service that stores and distributes container images. For example, Docker Hub is a public Docker container registry, and Azure Container Registry provides private container registries in Azure.

### Repository

Within each registry are image repositories, collections of container images with the same name. Each image can have a different tag, typically used for denoting its version.

## Components of an image

### Tag

### Layer

### Manifest

## Deleting image data

### Delete repository

### Delete tag

### Delete manifest

## Next steps

For more information about how images are stored in Azure Container Registry see [Container image storage in Azure Container Registry](container-registry-storage.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[portal]: https://portal.azure.com

<!-- LINKS - Internal -->
