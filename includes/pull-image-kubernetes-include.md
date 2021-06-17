---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 06/17/2021
ms.author: danlep
---
> [!NOTE]
> The following example pulls a public container image from Docker Hub. We recommend that you set up a [pull secret](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/) to authenticate using a Docker Hub account instead of making an anonymous pull request. To improve reliability when working with public content, import and manage the image in a private Azure container registry. [Learn more about working with public images](../articles/container-registry/buffer-gate-public-content.md).