---
title: Azure Container Instances overview
description: Understand Azure Container Instances
services: container-instances
author: seanmck
manager: jeconnoc

ms.service: container-instances
ms.topic: overview
ms.date: 10/02/2018
ms.author: seanmck
ms.custom: mvc
---

# Azure Container Instances

Containers are becoming the preferred way to package, deploy, and manage cloud applications. Azure Container Instances offers the fastest and simplest way to run a container in Azure, without having to manage any virtual machines and without having to adopt a higher-level service.

Azure Container Instances is a great solution for any scenario that can operate in isolated containers, including simple applications, task automation, and build jobs. For scenarios where you need full container orchestration, including service discovery across multiple containers, automatic scaling, and coordinated application upgrades, we recommend [Azure Kubernetes Service (AKS)](../aks/index.yml).

## Fast startup times

Containers offer significant startup benefits over virtual machines (VMs). Azure Container Instances can start containers in Azure in seconds, without the need to provision and manage VMs.

## Public IP connectivity and DNS name

Azure Container Instances enables exposing your containers directly to the internet with an IP address and a fully qualified domain name (FQDN). When you create a container instance, you can specify a custom DNS name label so your application is reachable at *customlabel*.*azureregion*.azurecontainer.io.

## Hypervisor-level security

Historically, containers have offered application dependency isolation and resource governance but have not been considered sufficiently hardened for hostile multi-tenant usage. Azure Container Instances guarantees your application is as isolated in a container as it would be in a VM.

## Custom sizes

Containers are typically optimized to run just a single application, but the exact needs of those applications can differ greatly. Azure Container Instances provides optimum utilization by allowing exact specifications of CPU cores and memory. You pay based on what you need and get billed by the second, so you can fine-tune your spending based on actual need.

## Persistent storage

To retrieve and persist state with Azure Container Instances, we offer direct [mounting of Azure Files shares](container-instances-mounting-azure-files-volume.md).

## Linux and Windows containers

Azure Container Instances can schedule both Windows and Linux containers with the same API. Simply specify the OS type when you create your [container groups](container-instances-container-groups.md).

Some features are currently restricted to Linux containers. While we work to bring feature parity to Windows containers, you can find current platform differences in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

Azure Container Instances supports Windows images based on Long-Term Servicing Channel (LTSC) versions. Windows Semi-Annual Channel (SAC) releases like 1709 and 1803 are unsupported.

## Co-scheduled groups

Azure Container Instances supports scheduling of [multi-container groups](container-instances-container-groups.md) that share a host machine, local network, storage, and lifecycle. This enables you to combine your main application container with other supporting role containers, such as logging sidecars.

## Virtual network deployment (preview)

Currently in preview, this feature of Azure Container Instances enables [deployment of container instances into an Azure virtual network](container-instances-vnet.md). By deploying container instances into a subnet within your virtual network, they can communicate securely with other resources in the virtual network, including those that are on premises (through [VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../expressroute/expressroute-introduction.md)).

> [!IMPORTANT]
> Deployment of container groups to a virtual network is currently in preview, and some [limitations apply](container-instances-vnet.md#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Next steps

Try deploying a container to Azure with a single command using our quickstart guide:

> [!div class="nextstepaction"]
> [Azure Container Instances Quickstart](container-instances-quickstart.md)

<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
