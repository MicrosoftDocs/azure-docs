---
title: Restart containers in Azure Container Instances
description: Learn how to restart containers in your Azure Container Instances container groups.
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 08/01/2018
ms.author: marsma
---

# Restart containers in Azure Container Instances

It's sometimes necessary to restart a container instance, for example, to increase its resources (CPU, memory)

Restarting container instances essentially redeploys the containers in the container group.

## Restart a container

To restart the containers in a container group, redeploy (create) the same container group with one or more modified properties. For example, to increase the mem

## Impact of container restarts

* ip address
* use a DNS name
* not all properties supported

## Properties that require delete

If you wish to change any of the following properties on your container group, you must first delete, then redeploy the group:

* OS type
* restart policy
* network profile
* CPU
* memory resources

## Next steps

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container?view=azure-cli-latest#az_container_create
[az-container-logs]: /cli/azure/container?view=azure-cli-latest#az_container_logs
[az-container-show]: /cli/azure/container?view=azure-cli-latest#az_container_show
[azure-cli-install]: /cli/azure/install-azure-cli
