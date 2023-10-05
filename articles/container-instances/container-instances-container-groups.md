---
title: Introduction to container groups
description: Learn about container groups in Azure Container Instances, a collection of instances that share a lifecycle and resources such as CPUs, storage, and network
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.topic: conceptual
ms.date: 06/17/2022
ms.custom: mvc

---
# Container groups in Azure Container Instances

The top-level resource in Azure Container Instances is the *container group*. This article describes what container groups are and the types of scenarios they enable.

## What is a container group?

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
> Multi-container groups currently support only Linux containers. For Windows containers, Azure Container Instances only supports deployment of a single container instance. While we are working to bring all features to Windows containers, you can find current platform differences in the service [Overview](container-instances-overview.md#linux-and-windows-containers).

## Deployment

Here are two common ways to deploy a multi-container group: use a [Resource Manager template][resource-manager template] or a [YAML file][yaml-file]. A Resource Manager template is recommended when you need to deploy additional Azure service resources (for example, an [Azure Files share][azure-files]) when you deploy the container instances. Due to the YAML format's more concise nature, a YAML file is recommended when your deployment includes only container instances. For details on properties you can set, see the [Resource Manager template reference](/azure/templates/microsoft.containerinstance/containergroups) or [YAML reference](container-instances-reference-yaml.md) documentation.

To preserve a container group's configuration, you can export the configuration to a YAML file by using the Azure CLI command [az container export][az-container-export]. Export allows you to store your container group configurations in version control for "configuration as code." Or, use the exported file as a starting point when developing a new configuration in YAML.



## Resource allocation

Azure Container Instances allocates resources such as CPUs, memory, and optionally [GPUs][gpus] (preview) to a multi-container group by adding the [resource requests][resource-requests] of the instances in the group. Taking CPU resources as an example, if you create a container group with two container instances, each requesting 1 CPU, then the container group is allocated 2 CPUs.

### Resource usage by container instances

Each container instance in a group is allocated the resources specified in its resource request. However, the maximum resources used by a container instance in a group could be different if you configure its optional [resource limit][resource-limits] property. The resource limit of a container instance must be greater than or equal to the mandatory [resource request][resource-requests] property.

* If you don't specify a resource limit, the container instance's maximum resource usage is the same as its resource request.

* If you specify a limit for a container instance, the instance's maximum usage could be greater than the request, up to the limit you set. Correspondingly, resource usage by other container instances in the group could decrease. The maximum resource limit you can set for a container instance is the total resources allocated to the group.
    
For example, in a group with two container instances each requesting 1 CPU, one of your containers might run a workload that requires more CPUs to run than the other.

In this scenario, you could set a resource limit of up to 2 CPUs for the container instance. This configuration allows the container instance to use up to 2 CPUs if available.

> [!NOTE]
> A small amount of a container group's resources is used by the service's underlying infrastructure. Your containers will be able to access most but not all of the resources allocated to the group. For this reason, plan a small resource buffer when requesting resources for containers in the group.

### Minimum and maximum allocation

* Allocate a **minimum** of 1 CPU and 1 GB of memory to a container group. Individual container instances within a group can be provisioned with less than 1 CPU and 1 GB of memory. 

* For the **maximum** resources in a container group, see the [resource availability][region-availability] for Azure Container Instances in the deployment region.

## Networking

Container groups can share an external-facing IP address, one or more ports on that IP address, and a DNS label with a fully qualified domain name (FQDN). To enable external clients to reach a container within the group, you must expose the port on the IP address and from the container. A container group's IP address and FQDN are released when the container group is deleted. 

Within a container group, container instances can reach each other via localhost on any port, even if those ports aren't exposed externally on the group's IP address or from the container.

Optionally deploy container groups into an [Azure virtual network][virtual-network] to allow containers to communicate securely with other resources in the virtual network.

## Storage

You can specify external volumes to mount within a container group. Supported volumes include:
* [Azure file share][azure-files]
* [Secret][secret]
* [Empty directory][empty-directory]
* [Cloned git repo][volume-gitrepo]

You can map those volumes into specific paths within the individual containers in a group. 

## Common scenarios

Multi-container groups are useful in cases where you want to divide a single functional task into a small number of container images. These images can then be delivered by different teams and have separate resource requirements.

Example usage could include:

* A container serving a web application and a container pulling the latest content from source control.
* An application container and a logging container. The logging container collects the logs and metrics output by the main application and writes them to long-term storage.
* An application container and a monitoring container. The monitoring container periodically makes a request to the application to ensure that it's running and responding correctly, and raises an alert if it's not.
* A front-end container and a back-end container. The front end might serve a web application, with the back end running a service to retrieve data. 

## Next steps

Learn how to deploy a multi-container container group with an Azure Resource Manager template:

> [!div class="nextstepaction"]
> [Deploy a container group][resource-manager template]

<!-- IMAGES -->
[container-groups-example]: ./media/container-instances-container-groups/container-groups-example.png

<!-- LINKS - External -->
[dcos-pod]: https://dcos.io/docs/1.10/deploying-services/pods/
[kubernetes-pod]: https://kubernetes.io/docs/concepts/workloads/pods/

<!-- LINKS - Internal -->
[resource-manager template]: container-instances-multi-container-group.md
[yaml-file]: container-instances-multi-container-yaml.md
[region-availability]: container-instances-region-availability.md
[resource-requests]: /rest/api/container-instances/2022-09-01/container-groups/create-or-update#resourcerequests
[resource-limits]: /rest/api/container-instances/2022-09-01/container-groups/create-or-update#resourcelimits
[resource-requirements]: /rest/api/container-instances/2022-09-01/container-groups/create-or-update#resourcerequirements
[azure-files]: container-instances-volume-azure-files.md
[virtual-network]: container-instances-virtual-network-concepts.md
[secret]: container-instances-volume-secret.md
[volume-gitrepo]: container-instances-volume-gitrepo.md
[gpus]: container-instances-gpu.md
[empty-directory]: container-instances-volume-emptydir.md
[az-container-export]: /cli/azure/container#az_container_export
