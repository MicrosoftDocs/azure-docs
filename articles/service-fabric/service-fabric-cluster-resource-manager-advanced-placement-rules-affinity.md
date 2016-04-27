<properties
   pageTitle="Service Fabric Cluster Resource Manager - Affinity | Microsoft Azure"
   description="Overview of additional placement policies and rules for Service Fabric Services"
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
   ms.date="03/10/2016"
   ms.author="masnider"/>

# Configuring and using service affinity in Service Fabric

Affinity is one of those things that, at least at first glance, doesn’t make a lot of sense for a microservice environment. And that’s because it doesn’t make a lot of sense in a microservice environment. Affinity is a control that is provided mainly to help ease the transition of larger previously-monolithic applications into the cloud and microservices world.

Let’s say you’re bringing a larger app, or one that just wasn’t designed with microservices in mind, to Service Fabric. This is actually pretty common, and we’ve had several customers (both internal and external) in this situation. You start by lifting the entire app up into the environment, getting it packaged and running. Then you start breaking it down into different smaller services that all talk to each other.

Then there’s an “Oops”. The “Oops” usually falls into one of these categories:

1. Turns out that component X in the monolithic app had an undocumented dependency on component Y that we just turned into a service and moved across the cluster. Now it’s broken.
2.	These things communicate via (local named pipes| shared memory | files on disk) but I just really need to be able to update it independently to speed things up a bit.
3.	Everything is fine, but it turns out that these two components are actually very chatty/performance sensitive and so when I moved them into separate services my perf tanked.

In all of these cases we don’t want to lose our refactoring work, and don’t want to go back to the monolith, but we want to try to put things back together so they “feel” local until we can fix things up.

What to do? Well you could try turning on affinity.

## How affinity works
In order to set up affinity, you define an affinity relationship between two different services. Generally you can think of this as “pointing” one service at another and saying “This service can only run where that service is running.” Sometimes we refer to these as parent child relationships (where you point the child at the parent). What this does is ensure that the replicas or instances of one service are placed on the same nodes as the replicas or instances of the service to which it is affinitized.

``` csharp
ServiceCorrelationDescription affinityDescription = new ServiceCorrelationDescription();
affinityDescription.Scheme = ServiceCorrelationScheme.Affinity;
affinityDescription.ServiceName = new Uri("fabric:/otherApplication/parentService");
serviceDescription.Correlations.Add(affinityDescription);
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

## Different affinity options
Affinity is represented via one of several correlation schemes, and has two different modes. The most common mode of affinity is what we call NonAlignedAffinity. In NonAlignedAffinity the replicas or instances of the different services are placed on the same nodes. The other mode is AlignedAffinity. Aligned Affinity is used with stateful services. Configuring one stateful service as having aligned affinity with another stateful service ensures that the primaries of those services are placed on the same nodes as each other, and that each pair of secondaries are also placed on the same nodes. It is also possible (though less common) to configure NonAlignedAffinity for stateful services. In this case you’d get much the same behavior as for stateless services – the different replicas of the two stateful services would be collocated on the same nodes, but no attempt would be made to ensure that the primaries and secondaries were on the same nodes.

![Affinity Modes and Their Effects][Image1]

### Best effort desired state
There are a few differences between affinity and monolithic architectures. Almost all of them boil down to the fact that an affinity relationship is best effort – since they are fundamentally different services they can fail independently for example. Other things can cause the different replicas of the service to become separated, such as capacity limitations.


### Chains vs. stars
Today we aren’t able to model chains of affinity relationships. What this means is that a service that is a child in one affinity relationship can’t be a parent in another affinity relationship. What this means is that if you want to model this sort of relationship, you effectively have to model it as a star, rather than a chain, by parenting the bottommost child to the “middle” child’s parent instead.

![Chains vs. Stars in the Context of Affinity Relationships][Image2]

Another thing to note about affinity relationships today is that they are directional. This is subtle, but effectively what this means is that the “affinity” rule only enforces that the child is where the parent is – should the parent suddenly fail over to another node (or any other limited action which forces movement of just the parent) then the Resource Manager doesn’t actually think there’s anything wrong until it notices that the child is not located with a parent; the relationship is not immediately enforced.

### Partitioning support
The final thing to notice about affinity is that affinity relationships aren’t supported where the parent is partitioned. This is something that we may support eventually, but today it is not allowed.

## Next steps
- For more information about the other options available for configuring services check out the topic on the other Cluster Resource Manager configurations available [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)

[Image1]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-affinity/cluster-resrouce-manager-affinity-modes.png
[Image2]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-affinity/cluster-resource-manager-chains-vs-stars.png
