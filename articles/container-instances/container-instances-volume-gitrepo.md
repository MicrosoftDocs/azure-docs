---
title: Mount a gitRepo volume Azure Container Instances
description: Learn how to mount a gitRepo volume to clone a git repository into your container instances
services: container-instances
author: mmacy
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 02/07/2018
ms.author: marsma
---

# Mount a *gitRepo* volume in Azure Container Instances

Learn how to mount a *gitRepo* volume to clone a git repository into your container instances.

> [!NOTE]
> Mounting a *gitRepo* volume is currently restricted to Linux containers. While we are working to bring all features to Windows containers, you can find current platform differences in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

## *gitRepo* volume

The *gitRepo* volume mounts a directory and clones the specified git repository into into the directory at container startup. By using a *gitRepo* volume in your container instances, you can avoid adding code for doing so in your applications.

## Mount a *gitRepo* volume

To mount a gitRepo volume in a container instance, you must deploy using an [Azure Resource Manager template](/azure/templates/microsoft.containerinstance/containergroups).

First, populate the `volumes` array in the container group `properties` section of the template. Next, for each container in the container group in which you'd like to mount the *emptyDir* volume, populate the `volumeMounts` array in the `properties` section of the container definition.

For example, following Resource Manager template creates container group consisting of a single container. The container clones the GitHub repository specified by the *gitRepo* volume.

[!code-json[volume-gitrepo](~/azure-docs-json-samples/container-instances/aci-deploy-volume-gitrepo.json)]

To see an example of container instance deployment with an Azure Resource Manager template, see [Deploy multi-container groups in Azure Container Instances](container-instances-multi-container-group.md).

## Next steps

Learn how to mount other volume types in Azure Container Instances:

* [Mount an Azure file share in Azure Container Instances](container-instances-volume-azure-files.md)
* [Mount an emptyDir volume in Azure Container Instances](container-instances-volume-emptydir.md)
