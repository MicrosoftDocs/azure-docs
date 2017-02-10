---
title: Service Fabric Cluster Resource Manager - Application Groups | Microsoft Docs
description: Overview of the Application Group functionality in the Service Fabric Cluster Resource Manager
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 4cae2370-77b3-49ce-bf40-030400c4260d
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: masnider

---
# Introduction to Application Groups
Service Fabric's Cluster Resource Manager typically manages cluster resources by spreading the load (represented via [Metrics](service-fabric-cluster-resource-manager-metrics.md)) evenly throughout the cluster. Service Fabric also manages the capacity of the nodes in the cluster and the cluster as a whole through the notion of [capacity](service-fabric-cluster-resource-manager-cluster-description.md). Metrics and capacity work great for many workloads, but patterns that make heavy use of different Service Fabric Application Instances sometimes bring in additional requirements. Some additional requirements are typically:

* Ability to reserve capacity for an Application Instance's services in the cluster
* Ability to limit the total number of nodes that the services within an application run on
* Defining capacities on the application instance itself to limit the number or total resource consumption of the services inside it

To meet these requirements, the Service Fabric Cluster Resource Manager supports Application Groups.

## Managing Application capacity
Application capacity can be used to limit the number of nodes spanned by an application. It can also limit the metric load of that the applications’ services on individual nodes and in total. It can also be used to reserve resources in the cluster for the application.

Application capacity can be set for new applications when they are created and can also be updated for existing applications.

### Limiting the maximum number of nodes
The simplest use case for Application capacity is when an application instantiation needs to be limited to a certain maximum number of nodes. If no Application Capacity is specified, the Service Fabric Cluster Resource Manager creates and places services according to normal rules (balancing or defragmentation).

The following image shows an application instance with and without a maximum number of nodes defined. There are no guarantees made about which replicas or instances of which services get placed together, or which specific nodes get used.

<center>
![Application Instance Defining Maximum Number of Nodes][Image1]
</center>

In the left example, the application doesn’t have Application Capacity set, and it has three services. The Cluster Resource Manager has spread out all replicas across six available nodes to achieve the best balance in the cluster. In the right example, we see the same application limited to three nodes.

The parameter that controls this behavior is called MaximumNodes. This parameter can be set during application creation, or updated for an application instance that was already running.

Powershell

``` posh
New-ServiceFabricApplication -ApplicationName fabric:/AppName -ApplicationTypeName AppType1 -ApplicationTypeVersion 1.0.0.0 -MaximumNodes 3
Update-ServiceFabricApplication –Name fabric:/AppName –MaximumNodes 5
```

C#

``` csharp
ApplicationDescription ad = new ApplicationDescription();
ad.ApplicationName = new Uri("fabric:/AppName");
ad.ApplicationTypeName = "AppType1";
ad.ApplicationTypeVersion = "1.0.0.0";
ad.MaximumNodes = 3;
fc.ApplicationManager.CreateApplicationAsync(ad);

ApplicationUpdateDescription adUpdate = new ApplicationUpdateDescription(new Uri("fabric:/AppName"));
adUpdate.MaximumNodes = 5;
fc.ApplicationManager.UpdateApplicationAsync(adUpdate);

var appMetric = new ApplicationMetricDescription();
appMetric.Name = "Metric1";
appMetric.TotalApplicationCapacity = 1000;

adUpdate.Metrics.Add(appMetric);
```

## Application Metrics, Load, and Capacity
Application Groups also allow you to define metrics associated with a given application instance, and the application's capacity for those metrics. This allows you to track, reserve, and limit the resource consumption of the services inside that application instance.

For each application metric, there are two values that can be set:

* **Total Application Capacity** – This setting represents the total capacity of the application for a particular metric. The Cluster Resource Manager disallows the creation of any new services within this application instance that would cause total load to exceed this value. For example, let's say the application instance had a capacity of 10 and already had load of five. In this case the creation of a service with a total default load of 10 would be disallowed.
* **Maximum Node Capacity** – This setting specifies the maximum total load for replicas of the services inside the application on a single node. If total load on the node goes over this capacity, the Cluster Resource Manager will attempt to move replicas to other nodes so that the capacity constraint is respected.

## Reserving Capacity
Another common use for application groups is to ensure that resources within the cluster are reserved for a given application instance. This happens even if the application instance doesn't have any services within it yet, or even if they aren't consuming the resources yet. Let's look at how that would work.

### Specifying a minimum number of nodes and resource reservation
Reserving resources for an application instance requires specifying a couple additional parameters: *MinimumNodes* and *NodeReservationCapacity*

* **MinimumNodes** - Just like specifying a maximum number of nodes that the services within an application can run on, you can also specify the minimum number. This setting defines the number of nodes that the resources should be reserved on, guaranteeing capacity within the cluster as a part of creating the application instance.
* **NodeReservationCapacity** - The NodeReservationCapacity can be defined for each metric within the application. This setting defines the amount of metric load reserved for the application on any node where any of the replicas or instances of the services within it are placed.

Let's look at an example of capacity reservation:

<center>
![Application Instances Defining Reserved Capacity][Image2]
</center>

In the left example, applications do not have any Application Capacity defined. The Cluster Resource Manager balances everything according to normal rules.

In the example on the right, let's say that the application was created with the following settings:

* MinimumNodes set to two
* MaximumNodes set to three
* An application Metric defined with
  * NodeReservationCapacity of 20
  * MaximumNodeCapacity of 50
  * TotalApplicationCapacity of 100

Service Fabric reserves capacity on two nodes for the blue application, and doesn't allow services from other application instances in the cluster to consume that capacity. This reserved application capacity is considered consumed and counted against the remaining capacity on that node and within the cluster.

When an application is created with reservation the Cluster Resource Manager reserves capacity equal to MinimumNodes * NodeReservationCapacity (for each metric). However capacity is reserved on a specific node only when at least one replica is placed on it. This later reservation allows for flexibility and better resource utilization since resources are only reserved on nodes when needed.

## Obtaining the application load information
For each application that has Application Capacity defined you can obtain the information about the aggregate load reported by replicas of its services.

For example, load can be retrieved using the following PowerShell cmdlet:

``` posh
Get-ServiceFabricApplicationLoad –ApplicationName fabric:/MyApplication1

```

The ApplicationLoad query returns the basic information about Application Capacity that was specified for the application. This information includes the Minimum Nodes and Maximum Nodes info, and the number that the application is currently occupying. It also includes information about each application load metric, including:

* Metric Name: Name of the metric.
* Reservation Capacity: Cluster Capacity that is reserved in the cluster for this Application.
* Application Load: Total Load of this Application’s child replicas.
* Application Capacity: Maximum permitted value of Application Load.

## Removing Application Capacity
Once the Application Capacity parameters are set for an application, they can be removed using Update Application APIs or PowerShell cmdlets. For example:

``` posh
Update-ServiceFabricApplication –Name fabric:/MyApplication1 –RemoveApplicationCapacity

```

This command removes all Application Capacity parameters from the application. The effect of the command is immediate. After this command completes, the Cluster Resource Manager reverts to using the default behavior for managing applications. Application Capacity parameters can be specified again via Update-ServiceFabricApplication.

### Restrictions on Application Capacity
There are several restrictions on Application Capacity parameters that must be respected. If there are validation errors, the creation or update of the application is rejected with an error and no changes take place.

* All integer parameters must be non-negative numbers.
* MinimumNodes must never be greater than MaximumNodes.
* If capacities for a load metric are defined, then they must follow these rules:
  * Node Reservation Capacity must not be greater than Maximum Node Capacity. For example, you cannot limit the capacity for the metric “CPU” on the node to two units and try to reserve three units on each node.
  * If MaximumNodes is specified, then the product of MaximumNodes and Maximum Node Capacity must not be greater than Total Application Capacity. For example, let's say the Maximum Node Capacity for load metric “CPU” is set to eight. Let's also say you set the Maximum Nodes to ten. In this case then Total Application Capacity must be greater than 80 for this load metric.

The restrictions are enforced both during application creation (on the client side), and during application update (on the server side).

## How not to use Application Capacity
* Do not try to use the Application Group features to constrain the application to a _specific_ subset of nodes. In other words, you can specify that the application runs on at most five nodes, but not which specific five nodes in the cluster. Constraining an application to specific nodes can be achieved using placement constraints for services.
* Do not try to use the Application Capacity to ensure that two services from the same application are placed alongside each other. Ensuring services run on the same node can be achieved by using affinity or with placement constraints depending on the specific requirements.

## Next steps
* For more information about the other options available for configuring services, check out the topic on the other Cluster Resource Manager configurations available [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)
* To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
* Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
* For more information on how metrics work generally, read up on [Service Fabric Load Metrics](service-fabric-cluster-resource-manager-metrics.md)
* The Cluster Resource Manager has many options for describing the cluster. To find out more about them, check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)

[Image1]:./media/service-fabric-cluster-resource-manager-application-groups/application-groups-max-nodes.png
[Image2]:./media/service-fabric-cluster-resource-manager-application-groups/application-groups-reserved-capacity.png
