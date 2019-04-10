---
title: Overview of Azure and standalone Service Fabric clusters | Microsoft Docs
description: You can create Service Fabric clusters on any VMs or computers running Windows Server or Linux. This means you are able to deploy and run Service Fabric applications in any environment where you have a set of Windows Server or Linux computers that are interconnected- on-premises, Microsoft Azure, or with any cloud provider.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: chackdan
editor: ''

ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/01/2019
ms.author: dekapur

---
# Comparing Azure and standalone Service Fabric clusters on Windows Server and Linux
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that is part of a cluster is called a cluster node. Clusters can scale to thousands of nodes. If you add new nodes to the cluster, Service Fabric rebalances the service partition replicas and instances across the increased number of nodes. Overall application performance improves and contention for access to memory decreases. If the nodes in the cluster are not being used efficiently, you can decrease the number of nodes in the cluster. Service Fabric again rebalances the partition replicas and instances across the decreased number of nodes to make better use of the hardware on each node.

Service Fabric allows for the creation of Service Fabric clusters on any VMs or computers running Windows Server or Linux. This means you are able to deploy and run Service Fabric applications in any environment where you have a set of Windows Server or Linux computers that are interconnected, be it on-premises, Microsoft Azure, or with any cloud provider.

## Benefits of clusters on Azure
On Azure, we provide integration with other Azure features and services, which makes operations and management of the cluster easier and more reliable.

* **Azure portal:** Azure portal makes it easy to create and manage clusters.
* **Azure Resource Manager:** Use of Azure Resource Manager allows easy management of all resources used by the cluster as a unit and simplifies cost tracking and billing.
* **Service Fabric Cluster as an Azure Resource** A Service Fabric cluster is an Azure resource, so you can model it like you do other resources in Azure.
* **Integration with Azure Infrastructure** Service Fabric coordinates with the underlying Azure infrastructure for OS, network, and other upgrades to improve availability and reliability of your applications.  
* **Diagnostics:** On Azure, we provide integration with Azure diagnostics and Azure Monitor logs.
* **Auto-scaling:** For clusters on Azure, we provide built-in auto-scaling functionality due to Virtual Machine scale-sets. In on-premises and other cloud environments, you have to build your own auto-scaling feature or scale manually using the APIs that Service Fabric exposes for scaling clusters.

## Benefits of standalone clusters
* You are free to choose any cloud provider to host your cluster.
* Service Fabric applications, once written, can be run in multiple hosting environments with minimal to no changes.
* Knowledge of building Service Fabric applications carries over from one hosting environment to another.
* Operational experience of running and managing Service Fabric clusters carries over from one environment to another.
* Broad customer reach is unbounded by hosting environment constraints.
* An extra layer of reliability and protection against widespread outages exists because you can move the services over to another deployment environment if a data center or cloud provider has a blackout.

## Next steps

* Read the overview of [Service Fabric clusters on Azure](service-fabric-azure-clusters-overview.md)
* Read the overview of [Service Fabric standalone clusters](service-fabric-standalone-clusters-overview.md)
* Learn about [Service Fabric support options](service-fabric-support.md)