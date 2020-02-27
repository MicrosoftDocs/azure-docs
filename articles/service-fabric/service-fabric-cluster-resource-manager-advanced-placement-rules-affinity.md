---
title: Service Fabric Cluster Resource Manager - Affinity 
description: Overview of service affinity for Azure Service Fabric services and guidance on service affinity configuration.
services: service-fabric
documentationcenter: .net
author: masnider

ms.topic: conceptual
ms.date: 08/18/2017
ms.author: masnider
---
# Configuring and using service affinity in Service Fabric
Affinity is a control that is provided mainly to help ease the transition of larger monolithic applications into the cloud and microservices world. It is also used as an optimization for improving the performance of services, although doing so can have side effects.

Let’s say you’re bringing a larger app, or one that just wasn’t designed with microservices in mind, to Service Fabric (or any distributed environment). This type of transition is common. You start by lifting the entire app into the environment, packaging it, and making sure it is running smoothly. Then you start breaking it down into different smaller services that all talk to each other.

Eventually you may find that the application is experiencing some issues. The issues usually fall into one of these categories:

1. Some component X in the monolithic app had an undocumented dependency on component Y, and you just turned those components into separate services. Since these services are now running on different nodes in the cluster, they're broken.
2. These components communicate via (local named pipes | shared memory | files on disk) and they really need to be able to write to a shared local resource for performance reasons right now. That hard dependency gets removed later, maybe.
3. Everything is fine, but it turns out that these two components are actually chatty/performance sensitive. When they moved them into separate services overall application performance tanked or latency increased. As a result, the overall application is not meeting expectations.

In these cases, we don’t want to lose our refactoring work, and don’t want to go back to the monolith. The last condition may even be desirable as a plain optimization. However, until we can redesign the components to work naturally as services (or until we can solve the performance expectations some other way) we're going to need some sense of locality.

What to do? Well, you could try turning on affinity.

## How to configure affinity
To set up affinity, you define an affinity relationship between two different services. You can think of affinity as “pointing” one service at another and saying “This service can only run where that service is running.” Sometimes we refer to affinity as a parent/child relationship (where you point the child at the parent). Affinity ensures that the replicas or instances of one service are placed on the same nodes as those of another service.

```csharp
ServiceCorrelationDescription affinityDescription = new ServiceCorrelationDescription();
affinityDescription.Scheme = ServiceCorrelationScheme.Affinity;
affinityDescription.ServiceName = new Uri("fabric:/otherApplication/parentService");
serviceDescription.Correlations.Add(affinityDescription);
await fabricClient.ServiceManager.CreateServiceAsync(serviceDescription);
```

> [!NOTE]
> A child service can only participate in a single affinity relationship. If you wanted the child to be affinitized to two parent services at once you have a couple options:
> - Reverse the relationships (have parentService1 and parentService2 point at the current child service), or
> - Designate one of the parents as a hub by convention and have all services point at that service. 
>
> The resulting placement behavior in the cluster should be the same.
>

## Different affinity options
Affinity is represented via one of several correlation schemes, and has two different modes. The most common mode of affinity is what we call NonAlignedAffinity. In NonAlignedAffinity, the replicas or instances of the different services are placed on the same nodes. The other mode is AlignedAffinity. Aligned Affinity is useful only with stateful services. Configuring two stateful services to have aligned affinity ensures that the primaries of those services are placed on the same nodes as each other. It also causes each pair of secondaries for those services to be placed on the same nodes. It is also possible (though less common) to configure NonAlignedAffinity for stateful services. For NonAlignedAffinity, the different replicas of the two stateful services would run on the same nodes, but their primaries could end up on different nodes.

<center>

![Affinity Modes and Their Effects][Image1]
</center>

### Best effort desired state
An affinity relationship is best effort. It does not provide the same guarantees of collocation or reliability that running in the same executable process does. The services in an affinity relationship are fundamentally different entities that can fail and be moved independently. An affinity relationship could also break, though these breaks are temporary. For example, capacity limitations may mean that only some of the service objects in the affinity relationship can fit on a given node. In these cases even though there's an affinity relationship in place, it can't be enforced due to the other constraints. If it is possible to do so, the violation is automatically corrected later.

### Chains vs. stars
Today the Cluster Resource Manager isn't able to model chains of affinity relationships. What this means is that a service that is a child in one affinity relationship can’t be a parent in another affinity relationship. If you want to model this type of relationship, you effectively have to model it as a star, rather than a chain. To move from a chain to a star, the bottommost child would be parented to the first child’s parent instead. Depending on the arrangement of your services, you may have to do this multiple times. If there's no natural parent service, you may have to create one that serves as a placeholder. Depending on your requirements, you may also want to look into [Application Groups](service-fabric-cluster-resource-manager-application-groups.md).

<center>

![Chains vs. Stars in the Context of Affinity Relationships][Image2]
</center>

Another thing to note about affinity relationships today is that they are directional by default. This means that the affinity rule only enforces that the child placed with the parent. It does not ensure that the parent is located with the child. Therefore, if there is an affinity violation and to correct the violation for some reason it is not feasible to move the child to the parent's node, then -- even if moving the parent to the child's node would have corrected the violation -- the parent will not be moved to the child's node. Setting the config [MoveParentToFixAffinityViolation](service-fabric-cluster-fabric-settings.md) to true would remove the directionality. It is also important to note that the affinity relationship can't be perfect or instantly enforced since different services have with different lifecycles and can fail and move independently. For example, let's say the parent suddenly fails over to another node because it crashed. The Cluster Resource Manager and Failover Manager handle the failover first, since keeping the services up, consistent, and available is the priority. Once the failover completes, the affinity relationship is broken, but the Cluster Resource Manager thinks everything is fine until it notices that the child is not located with the parent. These sorts of checks are performed periodically. More information on how the Cluster Resource Manager evaluates constraints is available in [this article](service-fabric-cluster-resource-manager-management-integration.md#constraint-types), and [this one](service-fabric-cluster-resource-manager-balancing.md) talks more about how to configure the cadence on which these constraints are evaluated.   


### Partitioning support
The final thing to notice about affinity is that affinity relationships aren’t supported where the parent is partitioned. Partitioned parent services may be supported eventually, but today it is not allowed.

## Next steps
- For more information on configuring services, [Learn about configuring Services](service-fabric-cluster-resource-manager-configure-services.md)
- To limit services to a small set of machines or aggregating the load of services, use [Application Groups](service-fabric-cluster-resource-manager-application-groups.md)

[Image1]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-affinity/cluster-resrouce-manager-affinity-modes.png
[Image2]:./media/service-fabric-cluster-resource-manager-advanced-placement-rules-affinity/cluster-resource-manager-chains-vs-stars.png