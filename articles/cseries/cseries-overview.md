---
title: C-Series API Overview | Azure Docs
description: Understand the C-Series API
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
ms.date: 07/05/2017
ms.author: seanmck
ms.custom: 
---

# C-Series API Overview

The C-Series API is designed to support the scheduling of one or more containers in a group on a single host machine in the Azure infrastructure. It is designed with two core scenarios in mind:

- **Direct invocation** for the creation of simple container-based applications or compute tasks.

- **Indirect invocation via orchestrator APIs** for integration with higher-level orchestration platforms such as Kubernetes.

## API Primitives 

The C-Series API includes two main primitives: container groups and containers.

### Container Groups

A container group is a set of containers that are scheduled and run together on a single host machine. They run within the same isolation boundary, can reach each other via the local network, and share access to any mounted volumes. They are analogous to [pods][k8s-pod] in Kubernetes.

Typically, a container group will be made up of a primary container performing the core action of the application and one or more containers that are performing some supporting operations. Examples include:

- One container running a web application, while another syncs the latest content to be served from source control.
- One container doing work and generating logs while another container pushes those logs to long-term storage.

By separating these operations into different containers, they can be built by different teams at different paces and receive different resource allocations. Scheduling them on the same host simplifies development and maximizes performance.

The C-Series resource provider operates exclusively on container groups. However, because single container groups are very common, the C-Series CLI operations are optimized for dealing with individual containers, with groups implicitly created to wrap them.

Because they are scheduled on the same host, all containers in a group must share a base OS type (Linux or Windows). 

### Containers

Container groups are made up of individual containers, which are created from Docker images. In addition to a source image, containers have user-provided names and resource constraints.

Container images can be pulled from any Docker compatible registry, including Docker Hub and the Azure Container Registry.

## Resource management

Part of the value of C-Series is that you pay only for the resources that your containers need. 

Resources are requested at the container level. Hard resource constraints are applied at the group level, by summing the resource requests of the containers within the group. Because container groups are run within an Hyper-V isolation environment, which does not support fractional CPU cores, the group's CPU core request will be rounded up to the next integer.

Consider the following example:

A container group is made up of containers with the following requests:

- Container 1: 0.75 cores, 512mb RAM
- Container 2: 0.5 cores, 1.5gb RAM

In this case, the group will be allocated 2 CPU (ceiling(0.75+0.5)) and 2GB of RAM. The additional CPU capacity will be allocated to the two containers proportionally to their original request, such that container 1 will have 50% more CPU capacity than container 2.

## Networking

You can expose your C-Series to the internet by requesting a public IP address. The IP is allocated to the container group and any ports specified on that IP will be forwarded on to the corresponding port of the container. Note that since containers within a group share a local network, they must listen on distinct ports. Port mapping is not supported.

We intend to add support for putting a container group into a virtual network and for fronting container groups with a load balancer, but neither of these capabilities exist yet.

## Logs

The API allows for pulling recent logs for individual running containers. Currently, logs are not persisted after a container exits or is stopped, but this is planned.

## Volume mounts

Container groups can be created with an array of associated volumes, which can then be mounted within individual containers. Initially, the API will support mounting from Azure Files (SMB) and eventually Azure Disks.

<!-- Links -->

[k8s-pod]: https://kubernetes.io/docs/concepts/workloads/pods/pod/