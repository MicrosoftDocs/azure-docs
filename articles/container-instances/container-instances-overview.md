---
title: Serverless containers in Azure
description: The Azure Container Instances service offers the fastest and simplest way to run isolated containers in Azure, without having to manage virtual machines and without having to adopt a higher-level orchestrator.
ms.topic: overview
ms.date: 03/22/2021
ms.custom: "seodec18, mvc"
---

# What is Azure Container Instances?

Containers are becoming the preferred way to package, deploy, and manage cloud applications. Azure Container Instances offers the fastest and simplest way to run a container in Azure, without having to manage any virtual machines and without having to adopt a higher-level service.

Azure Container Instances is a great solution for any scenario that can operate in isolated containers, including simple applications, task automation, and build jobs. For scenarios where you need full container orchestration, including service discovery across multiple containers, automatic scaling, and coordinated application upgrades, we recommend [Azure Kubernetes Service (AKS)](../aks/index.yml).

## Fast startup times

Containers offer significant startup benefits over virtual machines (VMs). Azure Container Instances can start containers in Azure in seconds, without the need to provision and manage VMs.

Bring Linux or Windows container images from Docker Hub, a private [Azure container registry](../container-registry/index.yml), or another cloud-based docker registry. Visit the [FAQ](container-instances-faq.yml) to learn which registries are supported by ACI. Azure Container Instances caches several common base OS images, helping speed deployment of your custom application images.

## Container access

Azure Container Instances enables exposing your container groups directly to the internet with an IP address and a fully qualified domain name (FQDN). When you create a container instance, you can specify a custom DNS name label so your application is reachable at *customlabel*.*azureregion*.azurecontainer.io.

Azure Container Instances also supports executing a command in a running container by providing an interactive shell to help with application development and troubleshooting. Access takes places over HTTPS, using TLS to secure client connections.

> [!IMPORTANT]
> Starting January 13, 2020, Azure Container Instances will require all secure connections from servers and applications to use TLS 1.2. Support for TLS 1.0 and 1.1 will be retired.

## Compliant deployments

### Hypervisor-level security

Historically, containers have offered application dependency isolation and resource governance but have not been considered sufficiently hardened for hostile multi-tenant usage. Azure Container Instances guarantees your application is as isolated in a container as it would be in a VM.

### Customer data

The ACI service stores the minimum customer data required to ensure your container groups are running as expected. Storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and Brazil South (Sao Paulo State) Region of Brazil Geo. For all other regions, customer data is stored in [Geo](https://azure.microsoft.com/global-infrastructure/geographies/). Please get in touch with Azure Support to learn more.

## Custom sizes

Containers are typically optimized to run just a single application, but the exact needs of those applications can differ greatly. Azure Container Instances provides optimum utilization by allowing exact specifications of CPU cores and memory. You pay based on what you need and get billed by the second, so you can fine-tune your spending based on actual need.

For compute-intensive jobs such as machine learning, Azure Container Instances can schedule Linux containers to use NVIDIA Tesla [GPU resources](container-instances-gpu.md) (preview).

## Persistent storage

To retrieve and persist state with Azure Container Instances, we offer direct [mounting of Azure Files shares](./container-instances-volume-azure-files.md) backed by Azure Storage.

## Linux and Windows containers

Azure Container Instances can schedule both Windows and Linux containers with the same API. Simply specify the OS type when you create your [container groups](container-instances-container-groups.md).

Some features are currently restricted to Linux containers:

* Multiple containers per container group
* Volume mounting ([Azure Files](container-instances-volume-azure-files.md), [emptyDir](container-instances-volume-emptydir.md), [GitRepo](container-instances-volume-gitrepo.md), [secret](container-instances-volume-secret.md))
* [Resource usage metrics](container-instances-monitor.md) with Azure Monitor
* [Virtual network deployment](container-instances-vnet.md)
* [GPU resources](container-instances-gpu.md) (preview)

For Windows container deployments, use images based on common [Windows base images](/azure/container-instances/container-instances-faq#what-windows-base-os-images-are-supported).

## Co-scheduled groups

Azure Container Instances supports scheduling of [multi-container groups](container-instances-container-groups.md) that share a host machine, local network, storage, and lifecycle. This enables you to combine your main application container with other supporting role containers, such as logging sidecars.

## Virtual network deployment

Azure Container Instances enables [deployment of container instances into an Azure virtual network](container-instances-vnet.md). When deployed into a subnet within your virtual network, container instances can communicate securely with other resources in the virtual network, including those that are on premises (through [VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../expressroute/expressroute-introduction.md)).

## Next steps

Try deploying a container to Azure with a single command using our quickstart guide:

> [!div class="nextstepaction"]
> [Azure Container Instances Quickstart](container-instances-quickstart.md)

<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/