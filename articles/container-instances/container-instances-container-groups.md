---
title: Azure Container Instances container groups
description: Understand how multi-container groups work in Azure Container Instances
services: container-instances
author: dlepow
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 02/25/2019
ms.author: danlep
ms.custom:
---

# Container groups in Azure Container Instances

The top-level resource in Azure Container Instances is the *container group*. This article describes what container groups are and the types of scenarios they enable.

## How a container group works

A container group is a collection of containers that get scheduled on the same host machine. The containers in a container group share a lifecycle, resources, local network, and storage volumes. It's similar in concept to a *pod* in [Kubernetes][kubernetes-pod].

The following diagram shows an example of a container group that includes multiple containers:

![Container groups diagram][container-groups-example]

This example container group:

* Is scheduled on a single host machine.
* Is assigned a DNS name label.
* Exposes a single public IP address, with one exposed port.
* Consists of two containers. One container listens on port 80, while the other listens on port 5000.
* Includes two Azure file shares as volume mounts, and each container mounts one of the shares locally.

> [!NOTE]
> Multi-container groups are currently available only with Linux containers. Azure Container Instances supports deployment only of an individual Windows container (technically, a single-container group). While we are working to bring all features to Windows containers, you can find current platform differences in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

## Deployment

There are two methods for specifying the container and group properties when deploying a multi-container group: a [Resource Manager template][resource-manager template] and a [YAML file][yaml-file]. Deployment with a Resource Manager template is recommended when you need to deploy additional Azure service resources (for example, an [Azure Files share][azure-files]) at the time of container instance deployment. Due to the YAML format's more concise nature, deployment with a YAML file is recommended when your deployment includes only container instances.

## Resource allocation

Resources such as CPU and memory for a container group are allocated based on the sum of the *resource requests* of the instances in the group. Taking CPU resources as an example, if you create a container group with two instances, each requesting 1 CPU, then the container group is allocated 2 CPUs.

### Resource requests and limits 

* By default, container instances in a group share the requested resources of the group. In a group with two instances requesting 1 CPU, each instance can use up to the 2 CPUs allocated to the group. The instances might compete for CPU resources while they're running.

* To limit resource usage by an instance in a group, optionally set a *resource limit* for the instance in addition to the resource request. In a group with two instances requesting 1 CPU, one of your containers might require more CPUs to run than the other.

  In this scenario, you could set a resource limit of 1 CPU for one instance, and a limit of 2 CPUs for the second. This configuration limits the first container's resource usage to 1 CPU, allowing the second container to use up to the full 2 CPUs.

For more information, see the [ResourceRequirements][resource-requirements] property in the container groups REST API.

### Minimum and maximum allocations

* The **minimum resource allocation** of a container group is 1 CPU and 1 GB of memory. Individual container instances within a group can be provisioned with less than 1 CPU and 1 GB of memory. 

* The **maximum resource allocation** of a container group is limited by the [resource limits][aci-region-availability] for Azure Container Instances in the deployment region.

## Networking

Container groups share an IP address and a port namespace on that IP address. To enable external clients to reach a container within the group, you must expose the port on the IP address and from the container. Because containers within the group share a port namespace, port mapping is not supported. Containers within a group can reach each other via localhost on the ports that they have exposed, even if those ports are not exposed externally on the group's IP address.

## Storage

You can specify external volumes to mount within a container group. You can map those volumes into specific paths within the individual containers in a group.

## Common scenarios

Multi-container groups are useful in cases where you want to divide a single functional task into a small number of container images. These images can then be delivered by different teams and have separate resource requirements.

Example usage could include:

* A container serving a web application and a container pulling the latest content from source control.
* An application container and a logging container. The logging container collects the logs and metrics output by the main application and writes them to long-term storage.
* An application container and a monitoring container. The monitoring container periodically makes a request to the application to ensure that it's running and responding correctly, and raises an alert if it's not.
* A front-end container and a back-end container. The front end might serve a web application, while the back end might run a service to retrieve data. 

## Next steps

Learn how to deploy a multi-container container group with an Azure Resource Manager template:

> [!div class="nextstepaction"]
> [Deploy a container group][resource-manager template]

<!-- IMAGES -->
[container-groups-example]: ./media/container-instances-container-groups/container-groups-example.png

<!-- LINKS - External -->
[dcos-pod]: https://dcos.io/docs/1.10/deploying-services/pods/
[kubernetes-pod]: https://kubernetes.io/docs/concepts/workloads/pods/pod/

<!-- LINKS - Internal -->
[resource-manager template]: container-instances-multi-container-group.md
[yaml-file]: container-instances-multi-container-yaml.md
[aci-region-availability]: https://aka.ms/aci/regions
[resource-requirements]: /rest/api/container-instances/containergroups/createorupdate#resourcerequirements
[azure-files]: container-instances-volume-azure-files.md

