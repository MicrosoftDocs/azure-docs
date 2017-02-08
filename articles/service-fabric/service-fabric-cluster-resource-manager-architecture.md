---
title: Resource Manager Architecture | Microsoft Docs
description: An architectural overview of Service Fabric Cluster Resource Manager.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 6c4421f9-834b-450c-939f-1cb4ff456b9b
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: masnider

---
# Cluster resource manager architecture overview
To manage the resources in your cluster, the Service Fabric Cluster Resource Manager must have several pieces of information. It has to know which services currently exist and the current (or default) amount of resources that those services are consuming. To track the available resources in the cluster, it has to know the capacity of the nodes in the cluster and the amount of resources consumed on each. The resource consumption of a given service can change over time, and services usually care about more than one type of resource. Across different services, there may be both real physical and physical resources being measured. Services may track physical metrics like memory and disk consumption. More commonly, services may care about logical metrics - things like "WorkQueueDepth" or "TotalRequests". Both logical and physical metrics may be used across many different types of services or maybe specific to only a couple services.

## Other considerations
The owners and operators of the cluster are occasionally different from the service authors, or at a minimum are the same people wearing different hats. For example, when developing your service you know a few things about what it requires in terms of resources and how the different components should ideally be deployed. However, the person handling a live-site incident for that service in production has a different job to do, and requires different tools. Additionally, neither the cluster or the services are statically configured:

* The number of nodes in the cluster can grow and shrink
* Nodes of different sizes and types can come and go
* Services can be created, removed, and change their desired resource allocations
* Upgrades or other management operations can roll through the cluster, and things can fail at any time.

## Cluster resource manager components and data flow
The Cluster Resource Manager has to track the requirements of individual services and the consumption of resources by the individual service objects that make up those services. To accomplish this, the Cluster Resource Manager has two conceptual parts: agents that run on each node and a fault-tolerant service. The agents on each node track load reports from services, aggregate them, and periodically report them. The Cluster Resource Manager service aggregates all the information from the local agents and reacts based on its current configuration.

Let’s look at the following diagram:

<center>
![Resource Balancer Architecture][Image1]
</center>

During runtime, there are many changes that could happen. For example, let’s say the amount of resources some services consume changes, some services fail, and some nodes join and leave the cluster. All the changes on a node are aggregated and periodically sent to the Cluster Resource Manager service (1,2) where they are aggregated again, analyzed, and stored. Every few seconds that service looks at the changes and determines if any actions are necessary (3). For example, it could notice that some empty nodes have been added to the cluster and decide to move some services to those nodes. The Cluster Resource Manager could also notice that a particular node is overloaded, or that certain services have failed (or been deleted), freeing up resources elsewhere.

Let’s look at the following diagram and see what happens next. Let’s say that the Cluster Resource Manager determines that changes are necessary. It coordinates with other system services (in particular the Failover Manager) to make the necessary changes. Then the necessary commands are sent to the appropriate nodes (4). In this case, we presume that the Resource Manager noticed that Node 5 was overloaded, and so decided to move service B from N5 to N4. At the end of the reconfiguration (5), the cluster looks like this:

<center>
![Resource Balancer Architecture][Image2]
</center>

## Next steps
* The Cluster Resource Manager has many options for describing the cluster. To find out more about them, check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)

[Image1]:./media/service-fabric-cluster-resource-manager-architecture/Service-Fabric-Resource-Manager-Architecture-Activity-1.png
[Image2]:./media/service-fabric-cluster-resource-manager-architecture/Service-Fabric-Resource-Manager-Architecture-Activity-2.png
