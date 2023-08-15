---
title: Serverless containers in Azure
description: The Azure Container Instances service offers the fastest and simplest way to run isolated containers in Azure, without having to manage virtual machines and without having to adopt a higher-level orchestrator.
ms.topic: overview
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 06/17/2022
ms.custom: "seodec18, mvc"
---

# What is Azure Container Instances?

Containers are becoming the preferred way to package, deploy, and manage cloud applications. Azure Container Instances offers the fastest and simplest way to run a container in Azure, without having to manage any virtual machines and without having to adopt a higher-level service.

Azure Container Instances is a great solution for any scenario that can operate in isolated containers, including simple applications, task automation, and build jobs. For scenarios where you need full container orchestration, including service discovery across multiple containers, automatic scaling, and coordinated application upgrades, we recommend [Azure Kubernetes Service (AKS)](../aks/index.yml). We recommend reading through the [considerations and limitations](#considerations) and the [FAQs](./container-instances-faq.yml) to understand the best practices when deploying container instances.

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

Historically, containers have offered application dependency isolation and resource governance but haven't been considered sufficiently hardened for hostile multi-tenant usage. Azure Container Instances guarantees your application is as isolated in a container as it would be in a VM.

### Customer data

The Azure Container Instances service doesn't store customer data. It does, however, store the subscription IDs of the Azure subscription used to create resources. Storing subscription IDs is required to ensure your container groups continue running as expected.

## Custom sizes

Containers are typically optimized to run just a single application, but the exact needs of those applications can differ greatly. Azure Container Instances provides optimum utilization by allowing exact specifications of CPU cores and memory. You pay based on what you need and get billed by the second, so you can fine-tune your spending based on actual need.

For compute-intensive jobs such as machine learning, Azure Container Instances can schedule Linux containers to use NVIDIA Tesla [GPU resources](container-instances-gpu.md) (preview).

## Persistent storage

To retrieve and persist state with Azure Container Instances, we offer direct [mounting of Azure Files shares](./container-instances-volume-azure-files.md) backed by Azure Storage.

## Linux and Windows containers

Azure Container Instances can schedule both Windows and Linux containers with the same API. You can specify your OS type preference when you create your [container groups](container-instances-container-groups.md).

Some features are currently restricted to Linux containers:

* Multiple containers per container group
* Volume mounting ([Azure Files](container-instances-volume-azure-files.md), [emptyDir](container-instances-volume-emptydir.md), [GitRepo](container-instances-volume-gitrepo.md), [secret](container-instances-volume-secret.md))
* [Resource usage metrics](container-instances-monitor.md) with Azure Monitor
* [Virtual network deployment](container-instances-vnet.md)
* [GPU resources](container-instances-gpu.md) (preview)

For Windows container deployments, use images based on common [Windows base images](./container-instances-faq.yml#what-windows-base-os-images-are-supported-).

## Co-scheduled groups

Azure Container Instances supports scheduling of [multi-container groups](container-instances-container-groups.md) that share a host machine, local network, storage, and lifecycle. This enables you to combine your main application container with other supporting role containers, such as logging sidecars.

## Virtual network deployment

Azure Container Instances enables [deployment of container instances into an Azure virtual network](container-instances-vnet.md). When deployed into a subnet within your virtual network, container instances can communicate securely with other resources in the virtual network, including those that are on premises (through [VPN gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [ExpressRoute](../expressroute/expressroute-introduction.md)).

## Confidential container deployment

Confidential containers on ACI enable you to run containers in a trusted execution environment (TEE) that provides hardware-based confidentiality and integrity protections for your container workloads. Confidential containers on ACI can protect data-in-use and encrypts data being processed in memory. Confidential containers on ACI are supported as a SKU that you can select when deploying your workload. For more information, see [confidential container groups](./container-instances-confidential-overview.md).

## Spot container deployment

ACI Spot containers allow customers to run interruptible, containerized workloads on unused Azure capacity at significantly discounted prices of up to 70% compared to regular-priority ACI containers. ACI spot containers may be preempted when Azure encounters a shortage of surplus capacity, and they're suitable for workloads without strict availability requirements. Customers are billed for per-second memory and core usage. To utilize ACI Spot containers, you can deploy your workload with a specific property flag indicating that you want to use Spot container groups and take advantage of the discounted pricing model. 
For more information, see [spot container groups](container-instances-spot-containers-overview.md).

## Considerations

There are default limits that require quota increases. Not all quota increases may be approved: [Resource availability & quota limits for ACI - Azure Container Instances | Microsoft Learn](./container-instances-resource-and-quota-limits.md)

If your container group stops working, we suggest trying to restart your container, checking your application code, or your local network configuration before opening a [support request][azure-support]. 

Container Images can't be larger than 15 GB, any images above this size may cause unexpected behavior: [How large can my container image be?](./container-instances-faq.yml)

Some Windows Server base images are no longer compatible with Azure Container Instances:  
[What Windows base OS images are supported?](./container-instances-faq.yml)

If a container group restarts, the container group’s IP may change. We advise against using a hard coded IP address in your scenario. If you need a static public IP address, use Application Gateway: [Static IP address for container group - Azure Container Instances | Microsoft Learn](./container-instances-application-gateway.md)

There are ports that are reserved for service functionality. We advise you not to use these ports since this will lead to unexpected behavior: [Does the ACI service reserve ports for service functionality?](./container-instances-faq.yml)

 If you’re having trouble deploying or running your container, first check the [Troubleshooting Guide](./container-instances-troubleshooting.md) for common mistakes and issues 

Your container groups may restart due to platform maintenance events. These maintenance events are done to ensure the continuous improvement of the underlying infrastructure: [Container had an isolated restart without explicit user input](./container-instances-faq.yml)

ACI doesn't allow [privileged container operations](./container-instances-faq.yml). We advise you to not depend on using the root directory for your scenario 

## Next steps

Try deploying a container to Azure with a single command using our quickstart guide:

> [!div class="nextstepaction"]
> [Azure Container Instances Quickstart](container-instances-quickstart.md)

<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
[azure-support]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest
