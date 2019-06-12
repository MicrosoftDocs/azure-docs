---
title: Manually stop or start containers in Azure Container Instances 
description: Learn how to manually stop or start a container group in Azure Container Instances.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 04/15/2019
ms.author: danlep
---
# Manually stop or start containers in Azure Container Instances

The [restart policy](container-instances-restart-policy.md) setting of a container group determines how container instances start or stop by default. You can override the default setting by manually stopping or starting a container group.

## Stop

Manually stop a running container group - for example, by using the [az container stop][az-container-stop] command or Azure portal. For certain container workloads, you might want to stop a long-running container group after a defined period to save on costs. 

*When a container group enters the Stopped state, it terminates and recycles all the containers in the group. It does not preserve container state.*

When the containers are recycled, the [resources](container-instances-container-groups.md#resource-allocation) are deallocated and billing stops for the container group.

The stop action has no effect if the container group already terminated (is in either a Succeeded or Failed state). For example, a container group with run-once container tasks that ran successfully terminates in the Succeeded state. Attempts to stop the group in that state do not change the state. 

## Start

When a container group is stopped - either because the containers terminated on their own or you manually stopped the group - you can start the containers. For example, use the [az container start][az-container-start] command or Azure portal to manually start the containers in the group. If the container image for any container is updated, a new image is pulled. 

Starting a container group begins a new deployment with the same container configuration. This action can help you quickly reuse a known container group configuration that works as you expect. You don't have to create a new container group to run the same workload.

All containers in a container group are started by this action. You can't start a specific container in the group.

After you manually start or restart a container group, the container group runs according to the configured restart policy.
  
## Restart

You can restart a container group while it is running - for example, by using the [az container restart][az-container-restart] command. This action restarts all containers in the container group. If the container image for any container is updated, a new image is pulled. 

Restarting a container group is helpful when you want to troubleshoot a deployment problem. For example, if a temporary resource limitation prevents your containers from running successfully, restarting the group might solve the problem.

All containers in a container group are restarted by this action. You can't restart a specific container in the group.

After you manually restart a container group, the container group runs according to the configured restart policy.

## Next steps

Learn more about [restart policy settings](container-instances-restart-policy.md) in Azure Container Instances.

In addition to manually stopping and starting a container group with the existing configuration, you can [update the settings](container-instances-update.md) of a running container group.

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[az-container-restart]: /cli/azure/container?view=azure-cli-latest#az-container-restart
[az-container-start]: /cli/azure/container?view=azure-cli-latest#az-container-start
[az-container-stop]: /cli/azure/container?view=azure-cli-latest#az-container-stop
