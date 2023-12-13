---
title: Reliability in Azure Operator Nexus
description: Find out about reliability in Azure Operator Nexus
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: azure-operator-nexus
ms.date: 06/13/2023
#Customer intent: I want to understand reliability support in Azure Operator Nexus so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure Operator Nexus

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the supplemental terms of use.

This article describes reliability support in Azure Operator Nexus and covers intra-regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Operator Nexus offers availability zone-redundant deployments by default. Operator Nexus components, such as Cluster Manager and Network Fabric Controller are all deployed on an Azure Kubernetes Service (AKS) cluster that's enabled with availability zones. Other service dependencies, such as Storage Account Service, and KeyVault are also configured with availability zone-redundancy.

>[!NOTE]
>Operator Nexus On-Premises instance implements a multi-rack design that provides physical redundancy at all levels of the stack. Each rack is designed as a failure domain or Nexus zone. Customer workloads can be deployed across multiple racks/nodes, essentially providing a similar multi-availability zone experience.

### Azure availability zone down experience

In an availability zone-down scenario, API calls against the cluster and resource providers would continue to work without interruption. There would be no impact on the currently running on-premises tenant workloads or on the ability to create new tenant workloads. Also, no data loss should occur, as the resilience of the Operator Nexus and other resource types is ensured. 

### Azure availability zone failover support

In the case of an availability zone failure, reconnection to another Azure availability zone is automatic and requires no interaction from the user.
## Availability on Operator Nexus instance deployments

Ensuring availability in the Azure Operator Nexus workload deployments is a split responsibility. As stated in the previous section, the Operator Nexus AKS based resources are deployed with availability zone redundancy. In this section, we consider best practices for on-premises workload availability.

In general, availability targets are achieved through local and geo-redundant deployments. 

### Nexus zone: a mechanism for local workload redundancy

Operator Nexus on-premises instances consist of a multi-rack design that provides physical redundancy at all levels of the stack. Each rack is designated as a failure domain and, thus, can be configured as a Nexus zone where these zones can and, preferably, should be used for local redundant workload deployments.

### Nexus instance: a mechanism for geo workload redundancy

The Nexus on-premises instances are hosted in a specific Azure region. As stated previously, the used Azure services and the Nexus resources are deployed in multiple availability zones of that Azure region.

Nexus instances that are geographically distributed, i.e., not in the same operator data center (possibly not even the same geographic region), **and hosted on different Azure regions** should be utilized to redundantly deploy workloads for geo-redundancy.

> [!WARNING]
> Deploying workloads on, say, two geographically distributed Nexus instances is insufficient to achieve true geo-redundancy unless the geo-redundant Nexus instances are hosted on different Azure regions.
> 
> In the unlikely event that an Azure region becomes unavailable, the Azure services as well as the Nexus resources on that region will also become unavailable. While this doesn't impact running workloads, it prevents capabilities such as starting new workloads, analytics, etc.

### Multiple Nexus instances in the same geo-location

There are scenarios where multiple Nexus instances need to be deployed in the same geographic location.
Workload geo-redundancy is obviously not achieved by deploying workloads on Nexus instances in the same geographic location.

One consideration in designing for reliability, other than availability, is resiliency and the ability to recover from failures. Recovery from failures, and the ability to meet recovery time objectives, requires that we limit the "blast" or impact radius of failures.  In the scenario where multiple Nexus instances are deployed in the same geo-location, resilient design demands that these Nexus instances be hosted on different Azure regions. Thus, when an Azure region fails, its impact is limited to one Nexus instance.

## Next steps

>[!div class="nextstepaction"]
>[Azure Architecture Center's guide on availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

>[!div class="nextstepaction"]
>[Reliability in Azure](./overview.md)
