---
title: Azure Container Instances container groups
description: Understand how container groups work in Azure Container Instances
services: container-instances
author: seanmck
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 03/20/2018
ms.author: seanmck
ms.custom: mvc
---

# Container groups in Azure Container Instances

The top-level resource in Azure Container Instances is the *container group*. This article describes what container groups are and the types of scenarios they enable.

## How a container group works

A container group is a collection of containers that get scheduled on the same host machine. The containers in a container group share a lifecycle, local network, and storage volumes. It's similar in concept to a *pod* in [Kubernetes][kubernetes-pod] and [DC/OS][dcos-pod].

The following diagram shows an example of a container group that includes multiple containers:

![Container groups diagram][container-groups-example]

This example container group:

* Is scheduled on a single host machine.
* Is assigned a DNS name label.
* Exposes a single public IP address, with one exposed port.
* Consists of two containers. One container listens on port 80, while the other listens on port 5000.
* Includes two Azure file shares as volume mounts, and each container mounts one of the shares locally.

> [!NOTE]
> Multi-container groups are currently restricted to Linux containers. While we are working to bring all features to Windows containers, you can find current platform differences in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

## Deployment

Container *groups* have a minimum resource allocation of 1 vCPU and 1 GB memory. Individual *containers* within a container group can be provisioned with less than 1 vCPU and 1 GB memory. Within a container group, the distribution of resources can be customized to multiple containers within the limits established at the container group-level. For example, two containers each with 0.5 vCPU residing in a container group that's allocated 1 vCPU.

## Networking

Container groups share an IP address and a port namespace on that IP address. To enable external clients to reach a container within the group, you must expose the port on the IP address and from the container. Because containers within the group share a port namespace, port mapping is not supported. Containers within a group can reach each other via localhost on the ports that they have exposed, even if those ports are not exposed externally on the group's IP address.

## Storage

You can specify external volumes to mount within a container group. You can map those volumes into specific paths within the individual containers in a group.

## Common scenarios

Multi-container groups are useful in cases where you want to divide a single functional task into a small number of container images. These images can then be delivered by different teams and have separate resource requirements.

Example usage could include:

* An application container and a logging container. The logging container collects the logs and metrics output by the main application and writes them to long-term storage.
* An application container and a monitoring container. The monitoring container periodically makes a request to the application to ensure that it's running and responding correctly, and raises an alert if it's not.
* A container serving a web application and a container pulling the latest content from source control.

## Next steps

Learn how to deploy a multi-container container group with an Azure Resource Manager template:

> [!div class="nextstepaction"]
> [Deploy a container group](container-instances-multi-container-group.md)

<!-- IMAGES -->
[container-groups-example]: ./media/container-instances-container-groups/container-groups-example.png

<!-- LINKS - External -->
[dcos-pod]: https://dcos.io/docs/1.10/deploying-services/pods/
[kubernetes-pod]: https://kubernetes.io/docs/concepts/workloads/pods/pod/
