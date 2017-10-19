---
title: Azure Container Instances Container Groups
description: Understand how Container Groups work in Azure Container Instances
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
ms.date: 08/08/2017
ms.author: seanmck
ms.custom: mvc
---

# Container Groups in Azure Container Instances

The top-level resource in Azure Container Instances is a container group. This article describes what container groups are and what types of scenarios they enable.

## How a container group works

A container group is a collection of containers that get scheduled on the same host machine and share a lifecycle, local network, and storage volumes. It is similar to the concept of a *pod* in [Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/pod/) and [DC/OS](https://dcos.io/docs/1.9/deploying-services/pods/).

The following diagram shows an example of a container group that includes multiple containers.

![Container groups example][container-groups-example]

Note that:

- The group is scheduled on a single host machine.
- The group exposes a single public IP address, with one exposed port.
- The group is made up of two containers. One container listens on port 80, while the other listens on port 5000.
- The group includes two Azure file shares as volume mounts, and each container mounts one of the shares locally.

### Networking

Container groups share an IP address and a port namespace on that IP address. To enable external clients to reach a container within the group, you must expose the port on the IP address and from the container. Because containers within the group share a port namespace, port mapping is not supported. Containers within a group can reach each other via localhost on the ports that they have exposed, even if those ports are not exposed externally on the group's IP address.

### Storage

You can specify external volumes to mount within a container group. You can map those volumes into specific paths within the individual containers in a group.

## Common scenarios

Multi-container groups are useful in cases where you want to divide up a single functional task into a small number of container images, which can be delivered by different teams and have separate resource requirements. Example usage could include:

- An application container and a logging container. The logging container collects the logs and metrics output by the main application and writes them to long-term storage.
- An application and a monitoring container. The monitoring container periodically makes a request to the application to ensure that it's running and responding correctly and raises an alert if it's not.
- A container serving a web application and a container pulling the latest content from source control.

## Next steps

Learn how to [deploy a multi-container group](container-instances-multi-container-group.md) with an Azure Resource Manager template.

<!-- IMAGES -->

[container-groups-example]: ./media/container-instances-container-groups/container-groups-example.png