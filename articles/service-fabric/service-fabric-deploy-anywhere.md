---
title: Create Azure Service Fabric clusters on Windows Server and Linux | Microsoft Docs
description: Service Fabric clusters run on Windows Server and Linux, which means you'll be able to deploy and host Service Fabric applications anywhere you can run Windows Server or Linux.
services: service-fabric
documentationcenter: .net
author: Chackdan
manager: timlt
editor: ''

ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/08/2017
ms.author: chackdan

---
# Create Service Fabric clusters on Windows Server or Linux
An Azure Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that is part of a cluster is called a cluster node. Clusters can scale to thousands of nodes. If you add new nodes to the cluster, Service Fabric rebalances the service partition replicas and instances across the increased number of nodes. Overall application performance improves and contention for access to memory decreases. If the nodes in the cluster are not being used efficiently, you can decrease the number of nodes in the cluster. Service Fabric again rebalances the partition replicas and instances across the decreased number of nodes to make better use of the hardware on each node.

Service Fabric allows for the creation of Service Fabric clusters on any VMs or computers running Windows Server or Linux. This means you are able to deploy and run Service Fabric applications in any environment where you have a set of Windows Server or Linux computers that are interconnected, be it on-premises, Microsoft Azure or with any cloud provider.

## Create Service Fabric clusters on Azure
Creating a cluster on Azure is done either via a Resource Model template or the Azure portal. Read [Create a Service Fabric cluster by using a Resource Manager template](service-fabric-cluster-creation-via-arm.md) or [Create a Service Fabric cluster from the Azure portal](service-fabric-cluster-creation-via-portal.md) for more information.

## Supported operating systems for clusters on Azure
You are able to create clusters on VMs running these operating systems:

* Windows Server 2012 R2
* Windows Server 2016 
* Linux Ubuntu 16.04 (in public preview) 

## Create Service Fabric standalone clusters on-premise or with any cloud provider
Service Fabric provides an install package for you to create standalone Service Fabric clusters on-premises or on any cloud provider

For more information on setting up standalone service fabric clusters on Windows Server, read [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)

### Any cloud deployments vs. on-premises deployments
The process for creating a Service Fabric cluster on-premises is similar to the process of creating a cluster on any cloud of your choice with a set of VMs. The initial steps to provision the VMs are governed by the cloud provider or on-premises environment that you are using. Once you have a set of VMs with network connectivity enabled between them, then the steps to set up the Service Fabric package, edit the cluster settings, and run the cluster creation and management scripts are identical. This ensures that your knowledge and experience of operating and managing Service Fabric clusters is transferable when you choose to target new hosting environments.

### Benefits of creating standalone Service Fabric clusters
* You are free to choose any cloud provider to host your cluster.
* Service Fabric applications, once written, can be run in multiple hosting environments with minimal to no changes.
* Knowledge of building Service Fabric applications carries over from one hosting environment to another.
* Operational experience of running and managing Service Fabric clusters carries over from one environment to another.
* Broad customer reach is unbounded by hosting environment constraints.
* An extra layer of reliability and protection against widespread outages exists because you can move the services over to another deployment environment if a data center or cloud provider has a blackout.

## Supported operating systems for standalone clusters
You are able to create clusters on VMs or computers running these operating systems:

* Windows Server 2012 R2
* Windows Server 2016 
* Linux ( coming soon)

## Advantages of Service Fabric clusters on Azure over standalone Service Fabric clusters created on-premises
Running Service Fabric clusters on Azure provides advantages over the on-premises option, so if you don't have specific needs for where you run your clusters, then we suggest that you run them on Azure. On Azure, we provide integration with other Azure features and services, which makes operations and management of the cluster easier and more reliable.

* **Azure portal:** Azure portal makes it easy to create and manage clusters.
* **Azure Resource Manager:** Use of Azure Resource Manager allows easy management of all resources used by the cluster as a unit and simplifies cost tracking and billing.
* **Service Fabric Cluster as an Azure Resource** A Service Fabric cluster is an ARM resource, so you can model it like you do other ARM resources in Azure.
* **Integration with Azure Infrastructure** Service Fabric coordinates with the underlying Azure infrastructure for OS, network, and other upgrades to improve availability and reliability of your applications.  
* **Diagnostics:** On Azure, we provide integration with Azure diagnostics and Log Analytics.
* **Auto-scaling:** For clusters on Azure, we provide built-in auto-scaling functionality due to Virtual Machine scale-sets. In on-premises and other cloud environments, you have to build your own auto-scaling feature or scale manually using the APIs that Service Fabric exposes for scaling clusters.

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Service Fabric on Linux](service-fabric-linux-overview.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

