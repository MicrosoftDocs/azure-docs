---
title: Mount an emptyDir volume in Azure Container Instances
description: Learn how to mount an emptyDir volume to share data between the containers in a container group in Azure Container Instances
services: container-instances
author: mmacy
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 02/07/2018
ms.author: marsma
---

# Mount an emptyDir volume Azure Container Instances

Learn how to mount an emptyDir volume to share data between the containers in a container group in Azure Container Instances.

> [!NOTE]
> Mounting an emptyDir volume is currently restricted to Linux containers. While we are working to bring all features to Windows containers, you can find current platform differences in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

## Mount an emptyDir volume

To mount an emptyDir volume in a container instance, you must deploy using an [Azure Resource Manager template](/azure/templates/microsoft.containerinstance/containergroups).

First, populate the `volumes` array in the `properties` section of the template. Next, for each container in the container group in which you'd like to mount the *emptyDir* volume, populate the `volumeMounts` array in the `properties` section of the container definition.

For example, following Resource Manager template creates container group consisting of two containers, each of which mounts the *emptyDir* volume:

[!code-json[volume-emptydir](~/azure-docs-json-samples/container-instances/aci-deploy-volume-emptydir.json)]

To see an example of container instance deployment with an Azure Resource Manager template, see [Deploy multi-container groups in Azure Container Instances](container-instances-multi-container-group.md).

## Next steps

Learn how to mount other volume types in Azure Container Instances:

* [Mount an Azure file share in Azure Container Instances](container-instances-volume-azure-files.md)
* [Mount a gitRepo volume Azure Container Instances](container-instances-volume-gitrepo.md)
* [Mount a secret volume Azure Container Instances](container-instances-volume-secret.md)