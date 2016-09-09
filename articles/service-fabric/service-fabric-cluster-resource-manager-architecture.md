<properties
   pageTitle="Resource Manager Architecture | Microsoft Azure"
   description="An architectural overview of Service Fabric Cluster Resource Manager."
   services="service-fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/20/2016"
   ms.author="masnider"/>

# Cluster resource manager architecture overview
In order to manage the resources in your cluster, the Cluster Resource Manager must have several pieces of information. It has to know which services currently exist and their current (or default) amount of resources that a service is consuming. It has to know the actual capacity of the nodes in the cluster, and thus the amount of resources available both in the cluster as a whole and remaining on a particular node. We’ll have to deal with the fact that the resource consumption of a given service can change over time, as well as the fact that services, in reality, usually care about more than one resource. Across many different services there may be both “real” resources like memory and disk consumption that are commonly used across many different types of services, as well as resources that only a particular service cares about.

## Other considerations
Further complicating things is the fact that the owners and operators of the cluster are occasionally different from the service authors, or at a minimum are the same people wearing different hats; for example when developing your service you know a few things about what it requires in terms of resources and how the different components should ideally be deployed, but as the person handling a live-site incident for that service in production you have a different job to do, and require different tools. In addition, neither the cluster nor the services themselves are a statically configured: the number of nodes in the cluster can grow and shrink, nodes of different sizes can come and go, and services can change their resource allocation, and be created and removed. Upgrades or other management operations can roll through the cluster, and of course things can fail at any time.

## Cluster resource manager components and data flow
Our resource manager will have to know many things about the overall cluster itself, as well as the requirements of particular services. To accomplish this, in Service Fabric, we have both agents of the Resource Manager that run on individual nodes in order to aggregate local resource consumption information, and a centralized, fault-tolerant Resource Manager service that aggregates all of the information about the services and the cluster and reacts to changes based on the desired state configuration of the cluster and service. The fault tolerance is achieved via exactly the same mechanism that we follow for your services, namely replication of the service’s state to some number of replicas (usually 7).

![Resource Balancer Architecture][Image1]

Let’s take a look at this diagram above as an example. During runtime there are a whole bunch of changes which could happen: For example, let’s say there are some changes in the amount of resources services consume, some service failures, some nodes join and leave the cluster, etc. All the changes on a specific node are aggregated and periodically sent to the central Resource Manager service (1,2) where they are aggregated again, analyzed, and stored.  Every few seconds that central service looks at all of the changes, and determines if there are any actions necessary (3). For example, it could notice that nodes have been added to the cluster and are empty, and decide to move some services to those nodes. It could also notice that a particular node is overloaded, or that certain services have failed (or been deleted), freeing up resources on other nodes.

Let’s take a look at the next diagram and see what happens in this example. Let’s say that the Resource Manager determines that changes are necessary. It coordinates with other system services (in particular the Failover Manager) to make the necessary changes. Then the change requests are sent to the appropriate nodes (4). In this case, we presume that the Resource Manager noticed that Node 5 was overloaded, and so decided to move service B from N5 to N4. At the end of the reconfiguration (5), the cluster looks like this:

![Resource Balancer Architecture][Image2]

## Next steps
- The Cluster Resource Manager has a lot of options for describing the cluster. To find out more about them check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)

[Image1]:./media/service-fabric-cluster-resource-manager-architecture/Service-Fabric-Resource-Manager-Architecture-Activity-1.png
[Image2]:./media/service-fabric-cluster-resource-manager-architecture/Service-Fabric-Resource-Manager-Architecture-Activity-2.png
