---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 05/18/2021
ms.author: danlep
---
> [!NOTE]
> The following example pulls a public container image from Docker Hub. We recommend that you set up a [pull secret](../articles/container-registry/container-registry-auth-kubernetes.md) to authenticate using a Docker Hub account instead of making an anonymous pull request. For improved reliability in build and deployment workflows, copy and manage the image in a private registry. [Learn more about working with public images](../../container-registry/buffer-gate-public-content.md).