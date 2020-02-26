---
title: Mount emptyDir volume to container group
description: Learn how to mount an emptyDir volume to share data between the containers in a container group in Azure Container Instances
ms.topic: article
ms.date: 01/31/2020
---

# Mount an emptyDir volume in Azure Container Instances

Learn how to mount an *emptyDir* volume to share data between the containers in a container group in Azure Container Instances. Use *emptyDir* volumes as ephemeral caches for your containerized workloads.

> [!NOTE]
> Mounting an *emptyDir* volume is currently restricted to Linux containers. While we are working to bring all features to Windows containers, you can find current platform differences in the [overview](container-instances-overview.md#linux-and-windows-containers).

## emptyDir volume

The *emptyDir* volume provides a writable directory accessible to each container in a container group. Containers in the group can read and write the same files in the volume, and it can be mounted using the same or different paths in each container.

Some example uses for an *emptyDir* volume:

* Scratch space
* Checkpointing during long-running tasks
* Store data retrieved by a sidecar container and served by an application container

Data in an *emptyDir* volume is persisted through container crashes. Containers that are restarted, however, are not guaranteed to persist the data in an *emptyDir* volume. If you stop a container group, the *emptyDir* volume is not persisted.

The maximum size of a Linux *emptyDir* volume is 50 GB.

## Mount an emptyDir volume

To mount an emptyDir volume in a container instance, you can deploy using an [Azure Resource Manager template](/azure/templates/microsoft.containerinstance/containergroups), a [YAML file](container-instances-reference-yaml.md), or other programmatic methods to deploy a container group.

First, populate the `volumes` array in the container group `properties` section of the file. Next, for each container in the container group in which you'd like to mount the *emptyDir* volume, populate the `volumeMounts` array in the `properties` section of the container definition.

For example, the following Resource Manager template creates a container group consisting of two containers, each of which mounts the *emptyDir* volume:

<!-- https://github.com/Azure/azure-docs-json-samples/blob/master/container-instances/aci-deploy-volume-emptydir.json -->
[!code-json[volume-emptydir](~/azure-docs-json-samples/container-instances/aci-deploy-volume-emptydir.json)]

To see examples of container group deployment, see [Deploy a multi-container group using a Resource Manager template](container-instances-multi-container-group.md) and [Deploy a multi-container group using a YAML file](container-instances-multi-container-yaml.md).

## Next steps

Learn how to mount other volume types in Azure Container Instances:

* [Mount an Azure file share in Azure Container Instances](container-instances-volume-azure-files.md)
* [Mount a gitRepo volume in Azure Container Instances](container-instances-volume-gitrepo.md)
* [Mount a secret volume in Azure Container Instances](container-instances-volume-secret.md)