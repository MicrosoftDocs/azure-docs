---
title: Service Fabric Cluster Resource Manager - Application Groups 
description: Overview of the Application Group functionality in the Service Fabric Cluster Resource Manager
author: masnider

ms.topic: conceptual
ms.date: 08/18/2017
ms.author: masnider
---
# Introduction to Application Groups
Service Fabric's Cluster Resource Manager typically manages cluster resources by spreading the load (represented via [Metrics](service-fabric-cluster-resource-manager-metrics.md)) evenly throughout the cluster. Service Fabric manages the capacity of the nodes in the cluster and the cluster as a whole via [capacity](service-fabric-cluster-resource-manager-cluster-description.md). Metrics and capacity work great for many workloads, but patterns that make heavy use of different Service Fabric Application Instances sometimes bring in additional requirements. For example you may want to:

- Reserve some capacity on the nodes in the cluster for the services within some named application instance
- Limit the total number of nodes that the services within a named application instance run on (instead of spreading them out over the entire cluster)
- Define capacities on the named application instance itself to limit the number of services or total resource consumption of the services inside it

To meet these requirements, the Service Fabric Cluster Resource Manager supports a feature called Application Groups.

## Limiting the maximum number of nodes
The simplest use case for Application capacity is when an application instance needs to be limited to a certain maximum number of nodes. This consolidates all services within that application instance onto a set number of machines. Consolidation is useful when you're trying to predict or cap physical resource use by the services within that named application instance. 

The following image shows an application instance with and without a maximum number of nodes defined:

<center>

![Application Instance Defining Maximum Number of Nodes][Image1]
</center>

In the left example, the application doesn’t have a maximum number of nodes defined, and it has three services. The Cluster Resource Manager has spread out all replicas across six available nodes to achieve the best balance in the cluster (the default behavior). In the right example, we see the same application limited to three nodes.

The parameter that controls this behavior is called MaximumNodes. This parameter can be set during application creation, or updated for an application instance that was already running.

Powershell

``` posh
New-ServiceFabricApplication -ApplicationName fabric:/AppName -ApplicationTypeName AppType1 -ApplicationTypeVersion 1.0.0.0 -MaximumNodes 3
Update-ServiceFabricApplication –ApplicationName fabric:/AppName –MaximumNodes 5
```

C#

``` csharp
ApplicationDescription ad = new ApplicationDescription();
ad.ApplicationName = new Uri("fabric:/AppName");
ad.ApplicationTypeName = "AppType1";
ad.ApplicationTypeVersion = "1.0.0.0";
ad.MaximumNodes = 3;
await fc.ApplicationManager.CreateApplicationAsync(ad);

ApplicationUpdateDescription adUpdate = new ApplicationUpdateDescription(new Uri("fabric:/AppName"));
adUpdate.MaximumNodes = 5;
await fc.ApplicationManager.UpdateApplicationAsync(adUpdate);

```

Within the set of nodes, the Cluster Resource Manager doesn't guarantee which service objects get placed together or which nodes get used.

## Application Metrics, Load, and Capacity
Application Groups also allow you to define metrics associated with a given named application instance, and that application instance's capacity for those metrics. Application metrics allow you to track, reserve, and limit the resource consumption of the services inside that application instance.

For each application metric, there are two values that can be set:

- **Total Application Capacity** – This setting represents the total capacity of the application for a particular metric. The Cluster Resource Manager disallows the creation of any new services within this application instance that would cause total load to exceed this value. For example, let's say the application instance had a capacity of 10 and already had load of five. The creation of a service with a total default load of 10 would be disallowed.
- **Maximum Node Capacity** – This setting specifies the maximum total load for the application on a single node. If load goes over this capacity, the Cluster Resource Manager moves replicas to other nodes so that the load decreases.


Powershell:

``` posh
New-ServiceFabricApplication -ApplicationName fabric:/AppName -ApplicationTypeName AppType1 -ApplicationTypeVersion 1.0.0.0 -Metrics @("MetricName:Metric1,MaximumNodeCapacity:100,MaximumApplicationCapacity:1000")
```

C#:

``` csharp
ApplicationDescription ad = new ApplicationDescription();
ad.ApplicationName = new Uri("fabric:/AppName");
ad.ApplicationTypeName = "AppType1";
ad.ApplicationTypeVersion = "1.0.0.0";

var appMetric = new ApplicationMetricDescription();
appMetric.Name = "Metric1";
appMetric.TotalApplicationCapacity = 1000;
appMetric.MaximumNodeCapacity = 100;
ad.Metrics.Add(appMetric);
await fc.ApplicationManager.CreateApplicationAsync(ad);
```

## Reserving Capacity
Another common use for application groups is to ensure that resources within the cluster are reserved for a given application instance. The space is always reserved when the application instance is created.

Reserving space in the cluster for the application happens immediately even when:
- the application instance is created but doesn't have any services within it yet
- the number of services within the application instance changes every time 
- the services exist but aren't consuming the resources 

Reserving resources for an application instance requires specifying two additional parameters: *MinimumNodes* and *NodeReservationCapacity*

- **MinimumNodes** - Defines the minimum number of nodes that the application instance should run on.  
- **NodeReservationCapacity** - This setting is per metric for the application. The value is the amount of that metric reserved for the application on any node where that the services in that application run.

Combining **MinimumNodes** and **NodeReservationCapacity** guarantees a minimum load reservation for the application within the cluster. If there's less remaining capacity in the cluster than the total reservation required, creation of the application fails. 

Let's look at an example of capacity reservation:

<center>

![Application Instances Defining Reserved Capacity][Image2]
</center>

In the left example, applications do not have any Application Capacity defined. The Cluster Resource Manager balances everything according to normal rules.

In the example on the right, let's say that Application1 was created with the following settings:

- MinimumNodes set to two
- An application Metric defined with
  - NodeReservationCapacity of 20

Powershell

 ``` posh
 New-ServiceFabricApplication -ApplicationName fabric:/AppName -ApplicationTypeName AppType1 -ApplicationTypeVersion 1.0.0.0 -MinimumNodes 2 -Metrics @("MetricName:Metric1,NodeReservationCapacity:20")
 ```

C#

 ``` csharp
ApplicationDescription ad = new ApplicationDescription();
ad.ApplicationName = new Uri("fabric:/AppName");
ad.ApplicationTypeName = "AppType1";
ad.ApplicationTypeVersion = "1.0.0.0";
ad.MinimumNodes = 2;

var appMetric = new ApplicationMetricDescription();
appMetric.Name = "Metric1";
appMetric.NodeReservationCapacity = 20;

ad.Metrics.Add(appMetric);

await fc.ApplicationManager.CreateApplicationAsync(ad);
```

Service Fabric reserves capacity on two nodes for Application1, and doesn't allow services from Application2 to consume that capacity even if there are no load is being consumed by the services inside Application1 at the time. This reserved application capacity is considered consumed  and counts against the remaining capacity on that node and within the cluster.  The reservation is deducted from the remaining cluster capacity immediately, however the reserved consumption is deducted from the capacity of a specific node only when at least one service object is placed on it. This later reservation allows for flexibility and better resource utilization since resources are only reserved on nodes when needed.

## Obtaining the application load information
For each application that has an Application Capacity defined for one or more metrics you can obtain the information about the aggregate load reported by replicas of its services.

Powershell:

``` posh
Get-ServiceFabricApplicationLoadInformation –ApplicationName fabric:/MyApplication1
```

C#

``` csharp
var v = await fc.QueryManager.GetApplicationLoadInformationAsync("fabric:/MyApplication1");
var metrics = v.ApplicationLoadMetricInformation;
foreach (ApplicationLoadMetricInformation metric in metrics)
{
    Console.WriteLine(metric.ApplicationCapacity);  //total capacity for this metric in this application instance
    Console.WriteLine(metric.ReservationCapacity);  //reserved capacity for this metric in this application instance
    Console.WriteLine(metric.ApplicationLoad);  //current load for this metric in this application instance
}
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

This command removes all Application capacity management parameters from the application instance. This includes MinimumNodes, MaximumNodes, and the Application's metrics, if any. The effect of the command is immediate. After this command completes, the Cluster Resource Manager uses the default behavior for managing applications. Application Capacity parameters can be specified again via `Update-ServiceFabricApplication`/`System.Fabric.FabricClient.ApplicationManagementClient.UpdateApplicationAsync()`.

### Restrictions on Application Capacity
There are several restrictions on Application Capacity parameters that must be respected. If there are validation errors no changes take place.

- All integer parameters must be non-negative numbers.
- MinimumNodes must never be greater than MaximumNodes.
- If capacities for a load metric are defined, then they must follow these rules:
  - Node Reservation Capacity must not be greater than Maximum Node Capacity. For example, you cannot limit the capacity for the metric “CPU” on the node to two units and try to reserve three units on each node.
  - If MaximumNodes is specified, then the product of MaximumNodes and Maximum Node Capacity must not be greater than Total Application Capacity. For example, let's say the Maximum Node Capacity for load metric “CPU” is set to eight. Let's also say you set the Maximum Nodes to 10. In this case, Total Application Capacity must be greater than 80 for this load metric.

The restrictions are enforced both during application creation and updates.

## How not to use Application Capacity
- Do not try to use the Application Group features to constrain the application to a _specific_ subset of nodes. In other words, you can specify that the application runs on at most five nodes, but not which specific five nodes in the cluster. Constraining an application to specific nodes can be achieved using placement constraints for services.
- Do not try to use the Application Capacity to ensure that two services from the same application are placed on the same nodes. Instead use [affinity](service-fabric-cluster-resource-manager-advanced-placement-rules-affinity.md) or [placement constraints](service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints).

## Next steps
- For more information on configuring services, [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
- Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
- For more information on how metrics work generally, read up on [Service Fabric Load Metrics](service-fabric-cluster-resource-manager-metrics.md)
- The Cluster Resource Manager has many options for describing the cluster. To find out more about them, check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)

[Image1]:./media/service-fabric-cluster-resource-manager-application-groups/application-groups-max-nodes.png
[Image2]:./media/service-fabric-cluster-resource-manager-application-groups/application-groups-reserved-capacity.png
