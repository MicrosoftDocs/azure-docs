---
title: Azure Container Registry image formats
description: Learn about supported container image formats in Azure Container Registry.
services: container-registry
author: dlepow
manager: jeconnoc

ms.service: container-registry
ms.topic: article
ms.date: 10/30/2018
ms.author: danlep
---

# Image formats supported in Azure Container Registry

Azure Container Registry supports the following container image formats:

* [Docker Image Manifest V2, Schema 1](https://docs.docker.com/registry/spec/manifest-v2-1/)

* [Docker Image Manifest V2, Schema 2](https://docs.docker.com/registry/spec/manifest-v2-2/)

* [Open Container Initiative (OCI) Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/spec.md) 

> [!IMPORTANT]
> OCI image format support is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).  
> 


## Manifest lists

[Manifest lists](https://docs.docker.com/registry/spec/manifest-v2-2/#manifest-list) are part of the Docker V2, Schema 2 and OCI images.

Manifest lists allow a single digest or tag to represent multiple forms of an image.

[Questions]
1. Is this article really about "image manifest" formats?
1. Any image manifest conversion by ACR? (see AWS ECR - dependent on the Docker client)
1. What image format does az acr build create?
1. Mention Helm package storage in this doc, or link?

## Next steps

* See how to [push and pull](/container-registry-get-started-docker-cli.md) images with Azure Container Registry.

* Use [ACR tasks](container-registry-tasks-overview.md) to build and test container images. 

* Use the [Moby BuildKit](https://github.com/moby/buildkit) to build and package containers in OCI format.


