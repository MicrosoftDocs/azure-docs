---
title: Overview of Azure and standalone Service Fabric clusters 
description: Analysis of differences between Azure and standalone Service Fabric clusters on Windows Server and Linux machines.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: linux-related-content
services: service-fabric
ms.date: 05/13/2024
---

# Comparing Azure and standalone Service Fabric clusters on Windows Server and Linux

A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or virtual machine (VM) that is part of a cluster is called a cluster node. Clusters can scale to thousands of nodes. If you add new nodes to the cluster, Service Fabric rebalances the service partition replicas and instances across the increased number of nodes. Overall application performance improves and contention for access to memory decreases. If the nodes in the cluster aren't being used efficiently, you can decrease the number of nodes in the cluster. Service Fabric again rebalances the partition replicas and instances across the decreased number of nodes to make better use of the hardware on each node.

Service Fabric allows for the creation of Service Fabric clusters on any VMs or computers running Windows Server or Linux. However, [standalone clusters](service-fabric-standalone-clusters-overview.md) aren't available on Linux. For more information about the differences in feature support for Windows and Linux, see [Differences between Service Fabric on Linux and Windows](service-fabric-linux-windows-differences.md).

## Benefits of clusters on Azure

On Azure, we provide integration with other Azure features and services, which makes operations and management of the cluster easier and more reliable.

* **Azure portal:** Azure portal makes it easy to create and manage clusters.
* **Azure Resource Manager:** Use of Azure Resource Manager allows easy management of all resources used by the cluster as a unit and simplifies cost tracking and billing.
* **Service Fabric Cluster as an Azure Resource** A Service Fabric cluster is an Azure resource, so you can model it like you do other resources in Azure.
* **Integration with Azure Infrastructure** Service Fabric coordinates with the underlying Azure infrastructure for OS, network, and other upgrades to improve availability and reliability of your applications.  
* **Diagnostics:** On Azure, we provide integration with Azure diagnostics and Azure Monitor logs.
* **Autoscaling:** For clusters on Azure, we provide built-in autoscaling functionality through Virtual Machine scale-sets. In on-premises and other cloud environments, you have to build your own autoscaling feature or scale manually using the APIs that Service Fabric exposes for scaling clusters.

## Benefits of standalone clusters

* You're free to choose any cloud provider to host your cluster.
* Service Fabric applications, once written, can be run in multiple hosting environments with minimal to no changes.
* Knowledge of building Service Fabric applications carries over from one hosting environment to another.
* Operational experience of running and managing Service Fabric clusters carries over from one environment to another.
* Broad customer reach is unbounded by hosting environment constraints.
* An extra layer of reliability and protection against widespread outages exists because you can move the services over to another deployment environment if a data center or cloud provider has a blackout.

## Next steps

* Read the overview of [Service Fabric clusters on Azure](service-fabric-azure-clusters-overview.md)
* Read the overview of [Service Fabric standalone clusters](service-fabric-standalone-clusters-overview.md)
* Learn about [Service Fabric support options](service-fabric-support.md)
