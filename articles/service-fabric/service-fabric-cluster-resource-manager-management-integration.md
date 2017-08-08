---
title: Service Fabric Cluster Resource Manager - Management Integration | Microsoft Docs
description: An overview of the integration points between the Cluster Resource Manager and Service Fabric Management.
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: 956cd0b8-b6e3-4436-a224-8766320e8cd7
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/05/2017
ms.author: masnider

---
# Cluster resource manager integration with Service Fabric cluster management
The Service Fabric Cluster Resource Manager isn’t the main component of Service Fabric that handles management operations (like application upgrades) but it is involved. The first way that the Cluster Resource Manager helps with management is by tracking the desired state of the cluster and the services inside it. The Cluster Resource Manager sends out health reports when it cannot put the cluster into the desired configuration. An example would be if there is insufficient capacity, or conflicting rules about where a service should be placed. Another piece of integration has to do with how upgrades work. During upgrades the Cluster Resource Manager alters its behavior slightly. We’ll talk about both of these integration points below.

## Health integration
The Cluster Resource Manager constantly tracks the rules you have defined for your services and the capacities available on the nodes and in the cluster. If it cannot satisfy those rules or if there is insufficient capacity, health warnings and errors are emitted. For example, if a node is over capacity and the Cluster Resource Manager will try to fix the situation by moving services. If it can't correct the situation it emits a health warning indicating which node is over capacity, and for which metrics.

Another example of the Resource Manager's health warnings is violations of placement constraints. For example, if you have defined a placement constraint (such as `“NodeColor == Blue”`) and the Resource Manager detects a violation of that constraint, it will emit a health warning. This is true for custom constraints and the default constraints (like fault and upgrade domain constraints).

Here’s an example of one such health report. In this case, the health report is for one of the system service’s partitions. The health message indicates the replicas of that partition are temporarily packed into too few Upgrade Domains.

```posh
PS C:\Users\User > Get-WindowsFabricPartitionHealth -PartitionId '00000000-0000-0000-0000-000000000001'


PartitionId           : 00000000-0000-0000-0000-000000000001
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='System.PLB', Property='ReplicaConstraintViolation_UpgradeDomain', HealthState='Warning', ConsiderWarningAsError=false.

ReplicaHealthStates   :
                        ReplicaId             : 130766528804733380
                        AggregatedHealthState : Ok

                        ReplicaId             : 130766528804577821
                        AggregatedHealthState : Ok

                        ReplicaId             : 130766528854889931
                        AggregatedHealthState : Ok

                        ReplicaId             : 130766528804577822
                        AggregatedHealthState : Ok

                        ReplicaId             : 130837073190680024
                        AggregatedHealthState : Ok

HealthEvents          :
                        SourceId              : System.PLB
                        Property              : ReplicaConstraintViolation_UpgradeDomain
                        HealthState           : Warning
                        SequenceNumber        : 130837100116930204
                        SentAt                : 8/10/2015 7:53:31 PM
                        ReceivedAt            : 8/10/2015 7:53:33 PM
                        TTL                   : 00:01:05
                        Description           : The Load Balancer has detected a Constraint Violation for this Replica: fabric:/System/FailoverManagerService Secondary Partition 00000000-0000-0000-0000-000000000001 is
                        violating the Constraint: UpgradeDomain Details: Node -- 3d1a4a68b2592f55125328cd0f8ed477  Policy -- Packing
                        RemoveWhenExpired     : True
                        IsExpired             : False
                        Transitions           : Ok->Warning = 8/10/2015 7:13:02 PM, LastError = 1/1/0001 12:00:00 AM
```

Here's what this health message is telling us is:

1. All the replicas themselves are healthy (this is Service Fabric’s first priority)
2. That the Upgrade Domain distribution constraint is currently being violated (meaning that a particular Upgrade Domain has more of the replicas for this partition than it should)
3. Which node contains the replica causing the violation (The node with ID: 3d1a4a68b2592f55125328cd0f8ed477)
4. When the report happened (8/10/2015 7:13:02 PM)

Information like this powers alerts that fire in production to let you know something has gone wrong. In this case, we’d want to see if we can figure out why the Resource Manager had to pack the replicas into the Upgrade Domain. This could be because the nodes in the other Upgrade Domains were down, for example.

Let’s say you want to create a service, or the Resource Manager is trying to find a place to place some services, but there aren't any solutions that work. This could be for many reasons, but usually it is due to one of the two following conditions:

1. Some transient condition has made it impossible to place this service instance or replica correctly
2. The service’s requirements are misconfigured in a way that causes its requirements to be unsatisfiable.

In each of these conditions, you’ll see a health report from the Cluster Resource Manager providing information to help you determine what is going on and why the service can’t be placed. We call this process the “Constraint Elimination Sequence”. During it, the system walks through the configured constraints affecting the service and records what they eliminate. This way when services aren’t able to be placed, you can see which nodes were eliminated and why.

## Constraint types
Let’s talk about each of the different constraints you can see in these health reports. Most of the time these constraints won't eliminate nodes since they are at the soft or optimize level by default. You could however see health messages related to these constraints if they are configured as hard constraints or in the rare cases that they do cause nodes to be eliminated.

* **ReplicaExclusionStatic** and **ReplicaExclusionDynamic**: This constraint indicates that two stateful replicas or stateless instances from the same partition would have to be placed on the same node (which isn’t allowed). ReplicaExclusionStatic and ReplicaExclusionDynamic are almost the same rule. The ReplicaExclusionDynamic constraint says “we couldn’t place this replica here because the only proposed solution had already placed a replica here”. This is different from the ReplicaExclusionStatic constraint that indicates not a proposed conflict but an actual one. In this case, there is a replica already on the node. Is this confusing? Yes. Does it matter a lot? No. If you are seeing a constraint elimination sequence containing either the ReplicaExclusionStatic or ReplicaExclusionDynamic constraint the Cluster Resource Manager thinks that there aren’t enough nodes. The further constraints can usually tell us how we’re ending up with too few nodes.
* **PlacementConstraint**: If you see this message, it means that we eliminated some nodes because they didn’t match the service’s placement constraints. We trace out the currently configured placement constraints as a part of this message. This is normal if you have a placement constraints defined. However, if there is a bug in the placement constraint causing too many nodes to be eliminated this is where you would notice.
* **NodeCapacity**: This constraint means that the Cluster Resource Manager couldn’t place the replicas on the indicated nodes because doing so would cause the node to go over capacity.
* **Affinity**: This constraint indicates that we couldn’t place the replica on the affected nodes since it would cause a violation of the affinity constraint. More information on affinity is in [this article](service-fabric-cluster-resource-manager-advanced-placement-rules-affinity.md)
* **FaultDomain** and **UpgradeDomain**: This constraint eliminates nodes if placing the replica on the indicated nodes would cause packing in a particular fault or upgrade domain. Several examples discussing this constraint are presented in the topic on [fault and upgrade domain constraints and resulting behavior](service-fabric-cluster-resource-manager-cluster-description.md)
* **PreferredLocation**: You shouldn’t normally see this constraint causing nodes to get removed from the solution since it is set at the optimization level by default. Further, the preferred location constraint is usually present during upgrades. During upgrade it is used to move replicas back to where they were when the upgrade started.

### Constraint priorities
With all of these constraints, you may have been thinking “Hey – I think that placement constraints are the most important thing in my system. I’m willing to violate other constraints, even things like affinity and capacity, if it ensures that the placement constraints aren’t ever violated.”

Well it turns out we can do that! Constraints can be configured with a few different levels of enforcement, but they boil down to “hard” (0), “soft” (1), “optimization” (2), and “off” (-1). Most of the constraints we’ve defined as hard by default. For example, most people don’t normally think about capacity as something they are willing to relax, and almost all are either hard or soft.

The different constraint priorities are why some constraint violation warnings show up more often than others: there are certain constraints that we're willing to relax (violate) temporarily. These levels don't really mean that a given constraint will be violated, just that there's an order in which they are preferentially enforced. This allows the Cluster Resource Manager to make the right tradeoffs if it is impossible to satisfy all constraints.

In advanced situations constraint priorities can be changed. For example, say you wanted to ensure that affinity would be violated to solve node capacity issues. To achieve this, you could set the priority of the affinity constraint to “soft” (1) and leave the capacity constraint set to “hard” (0).

The default priority values for the different constraints are specified in config:

ClusterManifest.xml

```xml
        <Section Name="PlacementAndLoadBalancing">
            <Parameter Name="PlacementConstraintPriority" Value="0" />
            <Parameter Name="CapacityConstraintPriority" Value="0" />
            <Parameter Name="AffinityConstraintPriority" Value="0" />
            <Parameter Name="FaultDomainConstraintPriority" Value="0" />
            <Parameter Name="UpgradeDomainConstraintPriority" Value="1" />
            <Parameter Name="PreferredLocationConstraintPriority" Value="2" />
        </Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "PlacementConstraintPriority",
          "value": "0"
      },
      {
          "name": "CapacityConstraintPriority",
          "value": "0"
      },
      {
          "name": "AffinityConstraintPriority",
          "value": "0"
      },
      {
          "name": "FaultDomainConstraintPriority",
          "value": "0"
      },
      {
          "name": "UpgradeDomainConstraintPriority",
          "value": "1"
      },
      {
          "name": "PreferredLocationConstraintPriority",
          "value": "2"
      }
    ]
  }
]
```

## Fault domain and upgrade domain constraints
The Cluster Resource Manager models the desire to keep services spread out among fault and upgrade domains as a constraint inside the Resource Manager’s engine. For more information on how they are used, check out the article on [cluster configuration](service-fabric-cluster-resource-manager-cluster-description.md).

There have been times where we needed either to get strict about Fault and Upgrade domains to prevent something bad from happening. There have also been cases where we needed to ignore them entirely (though briefly!). Generally the flexibility of the constraint priority infrastructure has worked very well, but it isn't needed often. Most of the time everything sits at their default priorities. Upgrade domains remain a soft constraint. The Cluster Resource Manager may need to pack a couple replicas into an upgrade domain in order to deal with an upgrade, failures, or constraint violations. This normally happens only when there are several failures or other churn in the system preventing correct placement. If the environment is configured correctly, all constraints, including fault and upgrade constraints, are fully respected, even during upgrades. The key thing is that the Cluster Resource Manager is watching out for your constraints, and immediately reporting when it detects violations.

## The preferred location constraint
The PreferredLocation constraint is a little different, and hence it is the only constraint set to “Optimization”. We use this constraint while upgrades in flight to prefer putting services back where we found them before the upgrade. There’s all sorts of reasons why this may not work in practice, but it’s a nice optimization.

## Upgrades
The Cluster Resource Manager also helps during application and cluster upgrades, during which it has two jobs:

* ensure that the rules and performance of the cluster are not compromised
* try to help the upgrade go smoothly

### Keep enforcing the rules
The main thing to be aware of is that the rules – the strict constraints around things like placement constraints are still enforced during upgrades. Placement constraints ensure that your workloads only run where they are allowed to, even during upgrades. If your environment is highly constrained upgrades may take a long time. This is because there may be few options for where a service can go if it (or the node it sits on) needs to be brought down for an update.

### Smart replacements
When an upgrade starts, the Resource Manager takes a snapshot of the current arrangement of the cluster. As each Upgrade Domain completes, it attempts to return things to the original arrangement. This way there are at most two transitions during the upgrade (the move out of the affected node and the move back in). Returning the cluster to how it was before the upgrade also ensures the upgrade doesn’t impact the layout of the cluster. If the cluster was arranged well before the upgrade it will be arranged well after it, or at least no worse.

### Reduced churn
Another thing that happens during upgrades is that the Cluster Resource Manager turns off balancing for the entity being upgraded. This means that if you have two different application instances and upgrade on one of them, then balancing is paused for that application instance, but not the other one. Preventing balancing prevents unnecessary reactions to the upgrade itself, like moving services into nodes that were emptied for the upgrade. If the upgrade in question is a Cluster upgrade, then the entire cluster is not balanced during the upgrade. Constraint checks – ensuring the rules are enforced – stay active, only rebalancing is disabled.

### Relaxed rules
Generally that you want the upgrade to complete even if the cluster is constrained or full overall. During upgrades being able to manage the capacity of the cluster is even more important than usual. This is because there is typically between 5 and 20 percent of the capacity down at a time as the upgrade rolls through the cluster. That work usually has to go somewhere. This is where the notion of [buffered capacities](service-fabric-cluster-resource-manager-cluster-description.md#buffered-capacity) really comes into play. While the buffered capacity is respected during normal operation (leaving some overhead), the Cluster Resource Manager fills up to the total capacity (taking up the buffer) during upgrades.

## Next steps
* Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
