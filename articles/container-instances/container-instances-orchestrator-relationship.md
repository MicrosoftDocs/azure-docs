---
title: Azure Container Instances and Container Orchestration
description: Understand how Azure Container Instances interact with container orchestrators
services: container-instances
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: ''

ms.assetid: 
ms.service: container-instances
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/24/2017
ms.author: seanmck
ms.custom: mvc
---

# Azure Container Instances and container orchestrators

Because of their small size and application orientation, containers are well suited for agile delivery environments and microservice-based architectures. The task of automating and managing a large number of containers and how they interact is known as *orchestration*. Popular container orchestrators include Kubernetes, DC/OS, and Docker Swarm, all of which are available in the [Azure Container Service](https://docs.microsoft.com/azure/container-service/).

Azure Container Instances provides some of the basic scheduling capabilities of orchestration platforms, but it does not cover the higher-value services that those platforms provide and can in fact be complementary with them. This article describes the scope of what Azure Container Instances handles and how full container orchestrators might interact with it.

## Traditional orchestration

The standard definition of orchestration includes the following tasks:

- **Scheduling**: Given a container image and a resource request, find a suitable machine on which to run the container.
- **Affinity/Anti-affinity**: Specify that a set of containers should run nearby each other (for performance) or sufficiently far apart (for availability).
- **Health monitoring**: Watch for container failures and automatically reschedule them.
- **Failover**: Keep track of what is running on each machine and reschedule containers from failed machines to healthy nodes.
- **Scaling**: Add or remove container instances to match demand, either manually or automatically.
- **Networking**: Provide an overlay network for coordinating containers to communicate across multiple host machines.
- **Service discovery**: Enable containers to locate each other automatically even as they move between host machines and change IP addresses.
- **Coordinated application upgrades**: Manage container upgrades to avoid application down time and enable rollback if something goes wrong.

## Orchestration with Azure Container Instances: A layered approach

Azure Container Instances enables a layered approach to orchestration, providing all of the scheduling and management capabilities required to run a single container, while allowing orchestrator platforms to manage multi-container tasks on top of it.

Because all of the underlying infrastructure for Container Instances is managed by Azure, an orchestrator platform does not need to concern itself with finding an appropriate host machine on which to run a single container. The elasticity of the cloud ensures that one is always available. Instead, the orchestrator can focus on the tasks that simplify the development of multi-container architectures, including scaling and coordinated upgrades.



## Potential scenarios

While orchestrator integration with Azure Container Instances is still nascent, we anticipate that a few different environments may emerge:

### Orchestration of Container Instances exclusively

Because they start quickly and bill by the second, an environment based exclusively on Azure Container Instances offers the fastest way to get started and to deal with highly variable workloads.

### Combination of Container Instances and Containers in Virtual Machines

For long-running, stable workloads, orchestrating containers in a cluster of dedicated virtual machines will typically be cheaper than running the same containers with Container Instances. However, Container Instances offer a great solution for quickly expanding and contracting your overall capacity to deal with unexpected or short-lived spikes in usage. Rather than scaling out the number of virtual machines in your cluster, then deploying additional containers onto those machines, the orchestrator can simply schedule the additional containers using Container Instances and delete them when they're no longer needed.

## Sample implementation: Azure Container Instances Connector for Kubernetes

To demonstrate how container orchestration platforms can integrate with Azure Container Instances, we have started building a [sample connector for Kubernetes][aci-connector-k8s]. 

The connector for Kubernetes mimics the [kubelet][kubelet-doc] by registering as a node with unlimited capacity and dispatching the creation of [pods][pod-doc] as container groups in Azure Container Instances. 

<!-- ![ACI Connector for Kubernetes][aci-connector-k8s-gif] -->

Connectors for other orchestrators could be built that similarly integrated with platform primitives to combine the power of the orchestrator API with the speed and simplicity of managing containers in Azure Container Instances.

> [!WARNING]
> The ACI connector for Kubernetes is *experimental* and should not be used in production.

## Next steps

Create your first container with Azure Container Instances using the [quick start guide](container-instances-quickstart.md).

<!-- IMAGES -->
[aci-connector-k8s-gif]: ./media/container-instances-orchestrator-relationship/aci-connector-k8s.gif

<!-- LINKS -->
[aci-connector-k8s]: https://github.com/azure/aci-connector-k8s
[kubelet-doc]: https://kubernetes.io/docs/admin/kubelet/
[pod-doc]: https://kubernetes.io/docs/concepts/workloads/pods/pod/