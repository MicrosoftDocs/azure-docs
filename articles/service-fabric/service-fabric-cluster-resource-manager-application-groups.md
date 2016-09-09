<properties
   pageTitle="Service Fabric Cluster Resource Manager - Application Groups | Microsoft Azure"
   description="Overview of the Application Group functionality in the Service Fabric Cluster Resource Manager"
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

# Introduction to Application Groups
Service Fabric's Cluster Resource Manager typically manages cluster resources by spreading the load (represented via Metrics) evenly throughout the cluster. Service Fabric also manages the capacity of the nodes in the cluster and the cluster as a whole through the notion of capacity. This works great for a lot of different types of workloads, but patterns that make heavy use of different Service Fabric Application Instances sometimes bring in additional requirements. Some additional requirements are typically:

- Ability to reserve capacity for an Application Instance's services on some number of nodes
- Ability to limit the total number of nodes that a given set of services within an application is allowed to run on
- Defining capacities on the application instance itself in order to limit the number or total resource consumption of the services inside it

In order to meet these requirements, we developed support for what we call Application Groups.

## Managing Application capacity
Application capacity can be used to limit the number of nodes spanned by an application, as well as the total metric load of that the applications’ instances on individual nodes. It can also be used to reserve resources in the cluster for the application.

Application capacity can be set for new applications when they are created; it can also be updated for existing applications that were created without specifying Application capacity.

### Limiting the maximum number of nodes
The simplest use case for Application capacity is when an application instantiation needs to be limited to a certain maximum number of nodes. If no Application Capacity is specified, the Service Fabric Cluster Resource Manager will instantiate replicas according to normal rules (balancing or defragmentation), which usually means that its services will be spread across all of the available nodes in the cluster, or if defragmentation is turned on some arbitrary but smaller number of nodes.

The following image shows the potential placement of an application instance without the maximum number of nodes defined and then same application with a maximum number of nodes set. Note that there is no guarantees made about which replicas or instances of which services will get placed together.

![Application Instance Defining Maximum Number of Nodes][Image1]

In the left example, the application doesn’t have Application Capacity set, and it has three services. CRM has made a logical decision to spread out all replicas across six available nodes in order to achieve the best balance in the cluster. In the right example, we see the same application that is constrained on three nodes, and where Service Fabric CRM has achieved the best balance for the replicas of application’s services.

The parameter that controls this behavior is called MaximumNodes. This parameter can be set during application creation, or updated for an application instance which was already running, in which case Service Fabric CRM will constrain the replicas of application’s services to the defined maximum number of nodes.

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
Application Groups also allow you to define metrics associated with a given application instance, as well as the capacity of the application with regard to those metrics. So for example you could define that as many services as you want could be created in

For each metric, there are 2 values that can be set to describe the capacity for that application instance:

-	Total Application Capacity – Represents the total capacity of the application for a particular metric. Service Fabric CRM will try to limit the sum of metric loads of this application’s services to the specified value; furthermore, if the application’s services are already consuming load up to this limit, Service Fabric Cluster Resource Manager will disallow the creation of any new services or partitions which would cause total load to go over this limit.
-	Maximum Node Capacity – Specifies the maximum total load for replicas of the applications’ services on a single node. If total load on the node goes over this capacity, Service Fabric CRM will attempt to move replicas to other nodes so that the capacity constraint is respected.

## Reserving Capacity
Another common use for application groups is to ensure that resources within the cluster are reserved for a given application instance, even if the application instance doesn't have the services within it yet, or even if they aren't consuming the resources yet. Let's take a look at how that would work.  

### Specifying a minimum number of nodes and resource reservation
Reserving resources for an application instance requires specifying a couple additional parameters: *MinimumNodes* and *NodeReservationCapacity*

- MinimumNodes - Just like specifying a target maximum number of nodes that the services within an application can run on, you can also specify the minimum number of nodes that an application should run on. This setting effectively defines the number of nodes that the resources should be reserved on at a minimum, guaranteeing capacity within the cluster as a part of creating the application instance.
- NodeReservationCapacity - The NodeReservationCapacity can be defined for each metric within the application. This defines the amount of metric load reserved for the application on any node where any of the replicas or instances of the services within it are placed.

Let's take a look at an example of capacity reservation:

![Application Instances Defining Reserved Capacity][Image2]

In the left example, applications do not have any Application Capacity defined. Service Fabric Cluster Resource Manager will balance the application’s child services replicas and instances along with those from other services (outside of the application) to ensure balance in the cluster.

In the example on the right, let's say that the application was created with a MinimumNodes set to 2, MaximumNodes set to 3 and an application Metric defined with a reservation of 20, max capacity on a node of 50, and a total application capacity of 100, Service Fabric will reserve capacity on two nodes for the blue application, and will not allow other replicas in the cluster to consume that capacity. This reserved application capacity will be considered consumed and counted against the remaining cluster capacity.

When an application is created with reservation, the Cluster Resource Manager will reserve capacity equal to MinimumNodes * NodeReservationCapacity in the cluster, but it will not reserve capacity on specific nodes until the replicas of the application’s services are created and placed. This allows for flexibility, since nodes are chosen for new replicas only when they are created. Capacity is reserved on a specific node when at least one replica is placed on it.

## Obtaining the application load information
For each application that has Application Capacity defined you can obtain the information about the aggregate load reported by replicas of its services. Service Fabric provides PowerShell and Managed API queries for this purpose.

For example, load can be retrieved using the following PowerShell cmdlet:

``` posh
Get-ServiceFabricApplicationLoad –ApplicationName fabric:/MyApplication1

```

The output of this query will contain the basic information about Application Capacity that was specified for the application, such as Minimum Nodes and Maximum Nodes. There will also be information about the number of nodes that the application is currently using. Thus, for each load metric there will be information about:
- Metric Name: Name of the metric.
-	Reservation Capacity: Cluster Capacity that is reserved in the cluster for this Application.
-	Application Load: Total Load of this Application’s child replicas.
-	Application Capacity: Maximum permitted value of Application Load.

## Removing Application Capacity
Once the Application Capacity parameters are set for an application, they can be removed using Update Application APIs or PowerShell cmdlets. For example:

``` posh
Update-ServiceFabricApplication –Name fabric:/MyApplication1 –RemoveApplicationCapacity

```

This command will remove all Application Capacity parameters from the application, and Service Fabric Cluster Resource Manager will start treating this application as any other application in the cluster that does not have these parameters defined. The effect of the command is immediate, and Cluster Resource Manager will delete all Application Capacity parameters for this application; specifying them again would require Update Application APIs to be called with the appropriate parameters.

## Restrictions on Application Capacity
There are several restrictions on Application Capacity parameters that must be respected. In case of validation errors, the creation or update of the application will be rejected with an error.
All integer parameters must be non-negative numbers.
Moreover, for individual parameters restrictions are as follows:

-	MinimumNodes must never be greater than MaximumNodes.
-	If capacities for a load metric are defined, then they must follow these rules:
  - Node Reservation Capacity must not be greater than Maximum Node Capacity. For example, you cannot limit the capacity for metric “CPU” on the node to 2 units, and try to reserve 3 units on each node.
  - If MaximumNodes is specified, then the product of MaximumNodes and Maximum Node Capacity must not be greater than Total Application Capacity. For example, if you set the Maximum Node Capacity for load metric “CPU” to 8 and you set the Maximum Nodes to 10, then Total Application Capacity must be greater than 80 for this load metric.

The restrictions are enforced both during application creation (on the client side), and during application update (on the server side). During creation, this is an example of a clear violation of the requirements since MaximumNodes < MinimumNodes, and the command will fail in the client before the request is even sent to Service Fabric cluster:

``` posh
New-ServiceFabricApplication –Name fabric:/MyApplication1 –MinimumNodes 6 –MaximumNodes 2
```

An example of invalid update is as follows. If we take an existing application and update maximum nodes to some value, the update will pass:

``` posh
Update-ServiceFabricApplication –Name fabric:/MyApplication1 6 –MaximumNodes 2
```

After that, we can attempt to update minimum nodes:

``` posh
Update-ServiceFabricApplication –Name fabric:/MyApplication1 6 –MinimumNodes 6
```

The client does not have enough context about the application so it will allow the update to pass to the Service Fabric cluster. However, in the cluster, Service Fabric will validate the new parameter together with the existing parameters and will fail the update operation because the value foe minimum nodes is greater than the value for maximum nodes. In this case, Application Capacity parameters will remain unchanged.

These restrictions are put in place in order for Cluster Resource Manager to be able to provide the best placement for replicas of applications’ services.

## How not to use Application Capacity

-	Do not use the Application Capacity to constrain the application to a specific subset of nodes: Although Service Fabric will ensure that Maximum Nodes is respected for each application that has Application Capacity specified, users cannot decide which nodes it will be instantiated on. This can be achieved using placement constraints for services.
-	Do not use the Application Capacity to ensure that two services from the same application will always be placed alongside each other. This can be achieved by using affinity relationship between services, and affinity can be limited only to the services that should actually be placed together.

## Next steps
- For more information about the other options available for configuring services check out the topic on the other Cluster Resource Manager configurations available [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)
- To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
- Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
- For more information on how metrics work generally, read up on [Service Fabric Load Metrics](service-fabric-cluster-resource-manager-metrics.md)
- The Cluster Resource Manager has a lot of options for describing the cluster. To find out more about them check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)


[Image1]:./media/service-fabric-cluster-resource-manager-application-groups/application-groups-max-nodes.png
[Image2]:./media/service-fabric-cluster-resource-manager-application-groups/application-groups-reserved-capacity.png
