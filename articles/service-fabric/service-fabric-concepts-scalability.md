---
title: Scalability of Service Fabric services | Microsoft Docs
description: Describes how to scale Service Fabric services
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: ed324f23-242f-47b7-af1a-e55c839e7d5d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/01/2017
ms.author: masnider

---
# Scaling in Service Fabric
Azure Service Fabric makes it easy to build scalable applications by managing the services, partitions, and replicas on all the nodes in a cluster. This enables maximum resource utilization, but also provides a lot of flexibility in terms of how you choose to scale your workloads. 

Scaling in Service Fabric is accomplished several different ways:

1. Scaling by creating or removing stateless service instances
2. Scaling by creating or removing new named services
3. Scaling by creating or removing new named application instances
4. Scaling by using partitioned services
5. Scaling by adding and removing nodes from the cluster 
6. Scaling by using Cluster Resource Manager metrics

## Scaling by creating or removing stateless service instances
One of the simplest ways to scale within Service Fabric works with stateless services. When you create a stateless service, you get a chance to define an `InstanceCount`. `InstanceCount` defines how many running copies of that service's code are created when the service starts up. Let's say for example that in the cluster there are 100 nodes, and the service is created with an `InstanceCount` of 10. During runtime, those 10 running copies of the code could all become too busy (or could be not busy enough). One way to scale that workload is to change the number of instances. For example, some piece of monitoring or management code can change the existing number of instances to 50, or to 5 depending on whether the workload needs to scale in or out based on the load. 

C#:

```csharp
StatelessServiceUpdateDescription updateDescription = new StatelessServiceUpdateDescription(); 
updateDescription.InstanceCount = 50;
await fabricClient.ServiceManager.UpdateServiceAsync(new Uri("fabric:/app/service"), updateDescription);
```

Powershell:

```posh
Update-ServiceFabricService -Stateless -ServiceName $serviceName -InstanceCount 50
```
### Using Dynamic Instance Count
Specifically for stateless services, Service Fabric offers an automatic way to change the instance count so that it scales dynamically with the number of nodes that are available. The way to opt into this behavior is to set the instance count = -1. InstanceCount = -1 is an instruction to Service Fabric that says "Run this stateless service on every node." If the number of nodes changes (which we'll talk about later), Service Fabric automatically changes the instance count to match, ensuring that the service is running on all valid nodes. 

C#:

```csharp
StatelessServiceDescription serviceDescription = new StatelessServiceDescription();
//Set other service properties necessary for creation....
serviceDescription.InstanceCount = -1;
await fc.ServiceManager.CreateServiceAsync(serviceDescription);
```

Powershell:

```posh
New-ServiceFabricService -ApplicationName $applicationName -ServiceName $serviceName -ServiceTypeName $serviceTypeName -Stateless -PartitionSchemeSingleton -InstanceCount "-1"
```

## Scaling by creating or removing new named services
A named service instance is a specific instance of a service type (see [Service Fabric application life cycle](./service-fabric-application-lifecycle.md)) within some named application instance in the cluster. 

New named service instances can be created (or removed) as services become more or less busy. This allows requests to be spread across more service instances, usually allowing load on existing services to decrease. When services are created dynamically the Service Fabric Cluster Resource Manager takes care of placing the services in the cluster in a distributed fashion, as governed by the [metrics](./service-fabric-cluster-resource-manager-metrics.md) in the cluster. Services can be created several different ways, but the most common are either through administrative actions like someone calling [`New-ServiceFabricService`](https://docs.microsoft.com/en-us/powershell/module/servicefabric/new-servicefabricservice?view=azureservicefabricps), or by code running somewhere (perhaps even inside another service in the cluster) calling [`CreateServiceAsync`](https://docs.microsoft.com/en-us/dotnet/api/system.fabric.fabricclient.servicemanagementclient.createserviceasync?view=servicefabric-5.5.216#System_Fabric_FabricClient_ServiceManagementClient_CreateServiceAsync_System_Fabric_Description_ServiceDescription_).

Creating services dynamically can be used in all sorts of scenarios, and is a very common pattern. For example, consider a stateful service which represents a particular workflow. Calls representing work are going to show up to this service, and this service is going to execute the steps to that workflow and record progress. 

How would you make this particular service scale? You could try to have the service be multi-tenant in some form, and accept calls and kick off steps for many different instances of the same workflow all at once, but that can make the code of the service more complex (since now it has to worry about many different instances of the same workflow, all at different stages). Also, handling multiple work flows at the same time doesn't _completely_ solve the scale problem (since at some point this service will consume too many resources to be hosted on a particular machine and would need to scale out). Many services not built for this pattern in the first place also experience difficulty where they find that there is some inherent bottleneck or slowdown in their code that causes the service to not work as well when the number of concurrent workflows it is tracking gets larger.  

A solution is to create an instance of this service for every different instance of the workflow you want to track. This is a great pattern and works whether the service is stateless or stateful! For this pattern to work, there's usually another service which would be something like the "Workload Manager Service". The job of this service would be to receive requests and to either route those requests to workflow services that already existed, or to dynamically create more workload services on the fly, and then to pass on the request. The manager service usually also would receive calls back when a given workflow service had completed its job, at which point it could delete that instance of the workflow service. 

Advanced versions of this type of manager can even create pools of the services that it manages, so that when a new request comes in it doesn't have to wait for the service to spin up. Instead it can just pick one that it knows is not currently busy from the pool, or route randomly. This makes handling new requests faster, since it is less likely that the request has to wait for a new service to be spun up; creating new services after all is quick, but not free or instantaneous. You'll often see this pattern when response times matter the most. Queuing the request and creating the service in the background and _then_ passing it on is also a popular manager pattern, as is creating and deleting services based on some tracking of the amount of work that service currently has pending. 

## Scaling by creating or removing new named application instances
Creating and deleting whole application instances is similar to the pattern of creating and deleting services. Usually there's some manager service that is making the decision based on the requests that it is seeing and the information it is receiving from the other services inside the cluster. 

When should creating a new named application instance be used instead of creating a new named service instance (in some already existing application)? There's a few cases:

  * The new application instance is for a customer whose code needs to run under some particular identity or security settings.
    * Service Fabric allows defining different code packages to run under particular identities. In order to launch the same code package under different identities, the activations need to occur in different application instances. Consider a case where you have an existing customer's workloads deployed, running under a particular identity so you can monitor and control their access to other resources, such as remote databases or other systems. In this case, when a new customer signs up, you probably don't want to activate their code in the same context (process space). While you could, it now is very hard for your service code to act within the context of a particular identity without a lot of complicated security, isolation, and impersonation/identity management code. Instead of using different named service instances (within the same application instance and hence the same process space), you can instead use different named Service Fabric Application instances, giving you an opportunity to define different identity contexts.
  * The new application instance also serves as a means of configuration
    * By default, all of the named service instances of a particular service type within a named application instance share the same environment (process, etc). What this means is that while technically speaking you can configure each service instance differently, doing so is complicated - services have to have some token (usually their name), which they can use to look up their particular config within a configuration package deployed alongside that service instance. This works fine, but it couples the configuration (normally a design time artifact with application instance specific overrides defined values) to the names of the individual named service instances within that application instance. Creating more services always means more application upgrades to change the information within the config packages so that the new services can look up their specific information. When this happens, it's often just easier to create a whole new named application instance, and to use the application parameters to set whatever configuration is necessary for the service at that time. This way all of the services that are created within that named application instance can inherit particular configuration settings, such as the secrets necessary to access some other system or other particular settings for other policies defined on a per customer level (timeouts, retry counts, dead letter queue locations, health notification and alert locations, resource limits, etc). 
  * The new application serves as an upgrade boundary
    * Within Service Fabric, different named application instances serve as boundaries for upgrade - an upgrade of one named application instance will not impact on the code that another named application instance is running. This can be useful when you need to make a scaling decision because you can choose whether the new code that you want to run should be scoped to the same upgrade as another service or not. Say for example that a call has showed up at the manager service which is normally responsible for scaling a particular customer's workloads by creating and deleting named service instances on the fly. In this case however, the call is for a workload associated with a _new_ customer. Most customers like being isolated from each other not just for the security and identity isolation reasons listed above, but because it provides more flexibility in terms of running specific versions of the software and having their own specific configuration. 
  * The existing application instance is full
    In Service Fabric, [application capacity](./service-fabric-cluster-resource-manager-application-groups.md) is a concept that you can use to define to control the amount of resources dedicated and available for particular application instances. For example, you may decide that a given service needs to have another instance created. However, say that the application that you would create this service in is "full". Full can mean that the application already has too many services in it and that further services should be placed in a different application instance, just to ensure that no more than some percentage of a given service should ever be upgraded at the same time. Full could also mean that the application's full up to its capacity but that this particular customer or workload should still be granted more resources. For more on capacity generally check out [this document](./service-fabric-cluster-resource-manager-application-groups.md).


## Scaling at the partition level
Service Fabric supports partitioning. Partitioning is a useful capability that allows a "whole" service to be split into several logical and physical partitions, each of which operates independently. This is particularly useful with stateful services, since no one set of replicas has to handle all the calls and manipulate all of the state at once. The [partitioning overview](service-fabric-concepts-partitioning.md) provides information on the types of partitioning schemes that are supported. In practice, the replicas of each partition are spread across the nodes in a cluster, spreading the work that service represents out in the cluster as well, giving each partition access to its own set of resources while also ensuring that a subset of the total traffic and state is managed by that one partition. 

Consider a service that uses a ranged partitioning scheme with a low key of 0, a high key of 99, and a partition count of 4. In a three-node cluster, the service might be laid out with four replicas that share the resources on each node as shown here:

<center>
![Partition layout with three nodes](./media/service-fabric-concepts-scalability/layout-three-nodes.png)
</center>

If you increase the number of nodes, Service Fabric will utilize the resources on the new nodes by moving some of the existing replicas there. By increasing the number of nodes to four, the service now has three replicas running on each node (each belonging to different partitions), allowing for better resource utilization and performance.

<center>
![Partition layout with four nodes](./media/service-fabric-concepts-scalability/layout-four-nodes.png)
</center>

## Scaling by using the Service Fabric Cluster Resource Manager and metrics
[Metrics](./service-fabric-cluster-resource-manager-metrics.md) are how services express their resource consumption to Service Fabric. Using metrics gives the Cluster Resource Manager an opportunity to reorganize and optimize the layout of the cluster. For example, there may be plenty of resources in the cluster, however they may not be allocated to the services that are currently doing work. Using metrics allows the Cluster Resource manager to reorganize the cluster to ensure that services have access to the available. 


## Scaling by adding and removing nodes from the cluster 
Another option for scaling with Service Fabric is to change the size of the cluster. Changing the size of the cluster is typically achieved by adding or removing nodes for one or more of the node types in the cluster. For example, consider a case where all of the nodes in the cluster are hot (the cluster's resources are almost all consumed). In this case, adding more nodes to the cluster is the best way to scale, since once the new nodes join the cluster the Service Fabric Cluster Resource Manager will move services to them (or, in the case of a stateless service with instance count = -1, create more service instances), resulting in less total load on the existing nodes. 

Adding and removing nodes to the cluster can be accomplished via the Service Fabric Azure Resource Manager PowerShell module.

```posh
Add-AzureRmServiceFabricNode -ResourceGroupName $resourceGroupName -Name $clusterResourceName -NodeType $nodeTypeName  -NumberOfNodesToAdd 5 
Remove-AzureRmServiceFabricNode -ResourceGroupName $resourceGroupName -Name $clusterResourceName -NodeType $nodeTypeName -NumberOfNodesToRemove 5
```

## Putting it all together
Let's take all the ideas that we've discussed here and talk through an example. Consider the following service: you are trying to build a service that acts as an address book, holding on to names and contact information. 

Right up front you have a bunch of questions related to scale: How many users are you going to have? How many contacts will each user store? Trying to figure this all out when you are standing up your service for the first time is really hard. Let's say you were going to go with a single static service with a specific partition count. The consequences of picking the wrong partition count could cause you to have scale issues later. Similarly, even if you pick the right count you might not have all the information you need. For example, you also have to decide the size of the cluster up front, both in terms of the number of nodes and their sizes. It's usually hard to predict how many resources a service is going to consume over its lifetime, or the traffic pattern that the service will actually see (maybe people add and remove their contacts only first thing in the morning, maybe it's actually distributed evenly over the course of the day). Based on this you might need to scale out and in dynamically, maybe you can learn to predict when you're going to need to scale out and in, but either way you're probably going to need to react to changing resource consumption by your service and hence change the size of the cluster. 

But why try to pick single partition scheme out for all users at all? Why limit yourself to one service and one static cluster? The real situation is obviously more dynamic than that. 

When trying to plan and build for scale, consider the following dynamic pattern instead and see if there is a way to adapt it to your situation:
1. Instead of trying to pick a partitioning scheme for everyone up front, build a "manager service".
2. The job of the manager service is to look at customer information when they sign up for your service. Then depending on that information the manager service create an instance of your _actual_ contact-storage service _just for that customer_. You can also decide to spin up an Application instance for this customer if they require particular configuration, isolation, or upgrades. This dynamic creation pattern many benefits:

    * You're not trying to guess the correct partition count for all users up front or build a single service that is infinitely scalable all on its own. 
    *Users don't have to have the same partition count, replica count, placement constraints, metrics, default loads, service names, dns settings, or any of the other properties specified at the service or application level. 
    * Data segmentation, since each customer has their own copy of the service
    * Each customer service can be configured differently and granted more or fewer resources, with more or fewer partitions or replicas as necessary based on their expected scale.
      * For example, say the customer paid for the "Gold" tier - they could get more replicas or greater partition count, and potentially resources dedicated to their services via metrics and application capacities.
      * Or say they provided information indicating the number of contacts they needed was "Small" - they would get only a few partitions, or could even be put into a shared service pool with other customers.
    * You're not running a bunch of service instances or replicas while you're waiting for customers to show up
    * If a customer ever leaves, then removing their information from your service is as simple as having the manager delete that service or application that it created.

## Next steps
For more information on Service Fabric concepts, see the following articles:

* [Availability of Service Fabric services](service-fabric-availability-services.md)
* [Partitioning Service Fabric services](service-fabric-concepts-partitioning.md)
