---
title: Azure Container Instances Overview | Azure Docs
description: Understand Azure Container Instances
services: container-service
documentationcenter: ''
author: seanmck
manager: timlt
editor: ''
tags: 
keywords: ''

ms.assetid: 
ms.service: 
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/20/2017
ms.author: seanmck
ms.custom: 
---

# Azure Container Instances

Containers are quickly becoming the preferred way to package, deploy, and manage cloud applications. Azure Container Instances offers the fastest and simplest way to run a container in Azure, without having to provision any virtual machines and without having to adopt a higher-level service. 

Azure Container Instances is a great solution for any scenario that can operate in isolated containers, including simple applications, task automation, and build jobs. For scenarios where you need full container orchestration, including service discovery across multiple containers, automatic scaling, and coordinated application upgrades, we recommend the [Azure Container Service](https://docs.microsoft.com/azure/container-service/).

## Fast startup times

Containers offer significant startup benefits over virtual machines. With Azure Container Instances, you can start a container in Azure in seconds without the need to provision and manage VMs.

## Hypervisor-level security

Historically, containers have offered application dependency isolation and resource governance but have not been considered sufficiently hardened for hostile multi-tenant usage. With Azure Container Instances, your application is as isolated in a container as it would be in a VM.

## Custom sizes

Containers are typically optimized to run just a single application, but the exact needs of those applications can differ greatly. With Azure Container Instances, you can request exactly what you need in terms of CPU cores and memory. You pay based on what you request, billed by the second, so you can finely optimizing your spending based on your needs.

## Public IP connectivity

With Azure Container Instances, you can expose your containers directly to the internet with a public IP address. In the future, we will expand our networking capabilities to include integration with virtual networks, load balancers, and other core parts of the Azure networking infrastructure.

## Persistent storage

To retrieve and persist state with Azure Container Instances, we offer direct mounting of Azure files shares.

## Linux and Windows containers

With Azure Container Instances, you can schedule both Windows and Linux containers with the same API. Simply indicate the base OS type and everything else is identical.

## Co-scheduled groups

Azure Container Instances supports scheduling of multi-container groups that share a host machine, local network, storage, and lifecycle. This enables you to combine your main application with others acting in a supporting role, such as logging.

## Next steps

Try deploying a container to Azure with a single command using our [quickstart guide](container-instances-quickstart.md). 

<!-- OLD API GUIDE -->
<!--
The Azure Container Instances API is designed to support the scheduling of one or more containers in a group on a single host machine in the Azure infrastructure. It is designed with two core scenarios in mind:

- **Direct invocation** for the creation of simple container-based applications or compute tasks.

- **Indirect invocation via orchestrator APIs** for integration with higher-level orchestration platforms such as Kubernetes.

## API Primitives 

The Azure Container Instances API includes two main primitives: container groups and containers.

### Container Groups

A container group is a set of containers that are scheduled and run together on a single host machine. They run within the same isolation boundary, can reach each other via the local network, and share access to any mounted volumes. They are analogous to [pods][k8s-pod] in Kubernetes.

Typically, a container group will be made up of a primary container performing the core action of the application and one or more containers that are performing some supporting operations. Examples include:

- One container running a web application, while another syncs the latest content to be served from source control.
- One container doing work and generating logs while another container pushes those logs to long-term storage.

By separating these operations into different containers, they can be built by different teams at different paces and receive different resource allocations. Scheduling them on the same host simplifies development and maximizes performance.

The Azure Container Instances resource provider operates exclusively on container groups. However, because single container groups are very common, the Azure Container Instances CLI operations are optimized for dealing with individual containers, with groups implicitly created to wrap them.

Because they are scheduled on the same host, all containers in a group must share a base OS type (Linux or Windows). 

### Containers

Container groups are made up of individual containers, which are created from Docker images. In addition to a source image, containers have user-provided names and resource constraints.

Container images can be pulled from any Docker compatible registry, including Docker Hub and the Azure Container Registry.

## Resource management

Part of the value of Azure Container Instances is that you pay only for the resources that your containers need. 

Resources are requested at the container level. Hard resource constraints are applied at the group level, by summing the resource requests of the containers within the group. Because container groups are run within an Hyper-V isolation environment, which does not support fractional CPU cores, the group's CPU core request will be rounded up to the next integer.

Consider the following example:

A container group is made up of containers with the following requests:

- Container 1: 0.75 cores, 512mb RAM
- Container 2: 0.5 cores, 1.5gb RAM

In this case, the group will be allocated 2 CPU (ceiling(0.75+0.5)) and 2GB of RAM. The additional CPU capacity will be allocated to the two containers proportionally to their original request, such that container 1 will have 50% more CPU capacity than container 2.

## Networking

You can expose your Azure Container Instances to the internet by requesting a public IP address. The IP is allocated to the container group and any ports specified on that IP will be forwarded on to the corresponding port of the container. Note that since containers within a group share a local network, they must listen on distinct ports. Port mapping is not supported.

We intend to add support for putting a container group into a virtual network and for fronting container groups with a load balancer, but neither of these capabilities exist yet.

## Logs

The API allows for pulling recent logs for individual running containers. Currently, logs are not persisted after a container exits or is stopped, but this is planned.

## Volume mounts

Container groups can be created with an array of associated volumes, which can then be mounted within individual containers. Initially, the API will support mounting from Azure Files (SMB) and eventually Azure Disks.

-->

<!-- Links -->

[k8s-pod]: https://kubernetes.io/docs/concepts/workloads/pods/pod/