---
title: Azure Container Registry content formats
description: Learn about supported content formats in Azure Container Registry.
services: container-registry
author: dlepow
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 10/31/2018
ms.author: danlep
---

# Content formats supported in Azure Container Registry

Use a private repository in Azure Container Registry to manage one of the following content formats. 

## Docker-compatible container images

* [Docker Image Manifest V2, Schema 1](https://docs.docker.com/registry/spec/manifest-v2-1/)

* [Docker Image Manifest V2, Schema 2](https://docs.docker.com/registry/spec/manifest-v2-2/) - includes Manifest Lists which allow registries to store multiplatform images under a single "image:tag" reference

* [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md) 


## Helm charts

Azure Container Registry can also host repositories for [Helm charts](https://helm.sh/), a packaging format used to quickly manage and deploy applications for Kubernetes. [Helm client](https://docs.helm.sh/using_helm/#installing-helm) version 2.11.0 or later is supported.

## Next steps

* See how to [push and pull](container-registry-get-started-docker-cli.md) images with Azure Container Registry.

* Use [ACR tasks](container-registry-tasks-overview.md) to build and test container images. 

* Use the [Moby BuildKit](https://github.com/moby/buildkit) to build and package containers in OCI format.

* Set up a [Helm repository](container-registry-helm-repos.md) hosted in Azure Container Registry. 


