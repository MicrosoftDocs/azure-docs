<properties
   pageTitle="Service Fabric Cluster Resource Manager - Management Integration | Microsoft Azure"
   description="An overview of the integration points between the Cluster Resource Manager and Service Fabric Management."
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


# Cluster resource manager integration with Service Fabric cluster management
The Service Fabric Cluster Resource Manager isn’t the main component of Service Fabric that handles management operations (like application upgrades) but it is involved. The first way that the Resource Manager helps with management is by tracking the desired state of the cluster and the services inside it from a resourcing and balance perspective and sending out health reports when it cannot put the cluster into the desired configuration (and example would be if there is insufficient capacity for example, or conflicting rules about where a service should be placed). Another piece of integration has to do with how upgrades work: during upgrades the Cluster Resource Manager alters its behavior during upgrades. We’ll talk about both of these below.

## Health integration
The Resource Manager constantly tracks the rules you have defined for your services, as well as the capacities available on the nodes and in the cluster, and emits health warnings and errors if it cannot satisfy those rules or if there is insufficient capacity. For example, if a node is over capacity and the Resource Manager cannot correct the situation it will emit a health warning indicating which node is over capacity, and for which metrics.

Another example of a time when you’ll see the Resource Manager emit health warnings is if you have defined a placement constraint (such as “NodeColor == Blue”) and the Resource Manager detects a violation of that constraint. We do this both for custom constraints as well as the default constraints (like fault and upgrade domain constraints) that the Resource Manager enforces for you. Here’s an example of one such health report. In this case the health report is for one of the system service’s partitions because the replicas of that partition are temporarily packed into too few Upgrade Domains, like could happen if there were a string of failures:

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

1.	All the replicas themselves are healthy (this is Service Fabric’s first priority)
2.	That the Upgrade Domain distribution constraint is currently being violated (meaning that a particular Upgrade Domain has more of the replicas for this partition than it should)
3.	Which node contains the replica causing the violation (The node with ID: 3d1a4a68b2592f55125328cd0f8ed477)
4.	When this all happened (8/10/2015 7:13:02 PM)

This is great data for an alert that fires in production to let you know something has gone wrong and you probably want to go take a look. In this case, for example, we’d want to see if we can figure out why the Resource Manager didn’t feel like it had any choice but to pack the replicas into the Upgrade Domain. This could be because all of the nodes in the other Upgrade Domains were down and there weren’t enough spare other domains, or if there were enough domains up something else which caused the nodes in those other Upgrade Domains to be invalid (like some placement policy on the service or insufficient capacity, for example).

Let’s say however that you want to create a service, or the Resource Manager is trying to find a place to place some services, but there doesn’t appear to be any solutions that work. This could be for many reasons, but usually it is due to one of the two following conditions:

1.	Some transient condition has made it impossible to place this service instance or replica correctly
2.	The service’s requirements are misconfigured in a way that causes its requirements to be unsatisfiable.

In each of these conditions you’ll see a health report from the Resource Manager that provides information to help you determine what is going on and why the service can’t be placed. We call this process the “Constraint Elimination Sequence”. During it, we walk through the configured constraints affecting the service and see what they eliminate. Thus when things aren’t able to be placed, you can see which nodes were eliminated and why.

Let’s talk about each of the different constraints you can see in these health reports and what it is checking for. Note that most of the time you won’t see these constraints eliminate nodes since the constraints are at the soft or optimize level by default (as we indicated previously). You could see them if they are flipped or treated as hard constraints, so we present them here for completeness:

-	ReplicaExclusionStatic and ReplicaExclusionDynamic – This is an internal constraint that indicates that during the search we determined that two replicas would have to be placed on the node (which isn’t allowed). ReplicaExclusionStatic and ReplicaExclusionDynamic are almost exactly the same rule. The ReplicaExclusionDynamic constraint says “we couldn’t place this replica here because the only proposed solution already had placed a replica here”. This is different from the ReplicaExclusionStatic exclusion which indicates not a proposed conflict but an actual one – there is a replica already on the node. Is this confusing? Yes. Does it matter a lot? No. Suffice it to say that if you are seeing a constraint elimination sequence containing either the ReplicaExclusionStatic or ReplicaExclusionDynamic constraint then the Resource Manager thinks that there aren’t enough nodes to place all of the replicas. The further constraints can usually tell us how we’re ending up with too few in the first place.
-	PlacementConstraint: If you see this message, it means that we eliminated some nodes because they didn’t match the service’s placement constraints. We trace out the currently configured placement constraints as a part of this message.
-	NodeCapacity: If you see this constraint it means that we couldn’t place the replicas on the indicated nodes because doing so would cause the node to go over capacity
-	Affinity: This constraint indicates that we couldn’t place the replica on the affected nodes since it would cause a violation of the affinity constraint.
-	FaultDomain & UpgradeDomain: This constraint eliminates nodes if placing the replica on the indicated nodes would cause packing in a particular fault or upgrade domain
-	PreferredLocation: You shouldn’t normally see this constraint causing nodes to get removed from the solution since it is optimization only by default. Further, the preferred location constraint is usually only present during upgrades (when it is used to move replicas back to where they were when the upgrade started), however it is possible.

### Constraint priorities
In all of these constraints, you may have been thinking “Hey – I think that placement constraints are the most important thing in my system. I’m willing to violate other constraints, even things like affinity and capacity, if it ensures that the placement constraints aren’t ever violated.”

Well it turns out we can do that! Constraints can be configured with a few different levels of enforcement, but they boil down to “hard” (0), “soft” (1), “optimization” (2), and “off” (-1). Most of the constraints we’ve defined as hard by default (since, for example, most people don’t normally think about capacity as something they are willing to relax), and almost all are either hard or soft. However in advanced situations these can be changed. For example, what if you wanted to ensure that affinity would always be violated in order to solve node capacity issues, you could priority of the affinity constraint to “Soft” (1) and leave the capacity constraint set to “Hard” (0). The different constraint priorities are also why you'll see some constraint violation warnings more often than others - because there are certain constraints that we're willing to relax (violate) temporarily. Note that these levels don't really mean that a given constraint will or will not always be violated, just that there's an order in which they are preferentially enforced so that we can make the right tradeoffs if it is impossible to satisfy all of them.

The configuration and default priority values for the different constraints are listed below:

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

You’ll notice here that there are constraints defined for Upgrade and Fault domains, and also that Upgrade Domain constraint is Soft. Also there’s this weird “PreferredLocation” constraint with a priority. What is all this stuff?

First off, we model the desire to keep services spread out amongst fault and upgrade domains as a constraint inside the Resource Manager’s engine. Historically there have been a couple of times where we needed either to get really strict about placement with regard to fault and upgrade domains, and also a couple cases where there was some issue where we just needed to ignore them entirely (though briefly!), so generally we’ve been glad both for that design choice and for the flexibility of the constraint infrastructure. Most of the time though, Upgrade domain constraint sits as a soft constraint, meaning that if the Resource Manager temporarily needs to pack a couple replicas into an upgrade domain in order to deal with, say, an upgrade going on, or a bunch of concurrent failures or other constraint violations (from the hard constraints) then that is ok. This normally doesn’t happen unless there are a lot of failures or other churn in the system preventing correct placement, and if the environment is configured correctly the stable state is always upgrade domain being fully respected. The PreferredLocation constraint is a little different, and hence it is the only constraint set to “Optimization”. We use this constraint while upgrades in flight in order to try to prefer putting services back where we found them before the upgrade. There’s all sorts of reasons why this may not work in practice, but it’s a nice optimization, so here it sits. We’ll talk more about it when we talk about how the Cluster Resource Manager assists with upgrades

## Upgrades
The Resource Manager also helps during application and cluster upgrades in order to ensure that the upgrade goes smoothly, but also to ensure that the rules and performance of the cluster are not compromised.

### Keep enforcing the rules
The main thing to be aware of is that the rules – the strict controls around things like placement constraints are still enforced during upgrades. You’d think that this goes without saying, but we’re saying it anyway just to be explicit about it. The positive side of this is that you can ensure that if you wanted to be sure that certain workloads don’t run on certain nodes those rules will be enforced even during the upgrade automatically. If your environment is highly constrained, this can cause upgrades to take a long time since there are only a few options for where a service can go if it (or the node it sits on) needs to be brought down for patching.

### Smart replacements
When an upgrade starts the Resource Manager takes a snapshot of the current arrangement of the cluster and attempts to return things to that state when the upgrade is done. The reasoning behind this is simple – first it ensures that there are only a couple transitions for each service as a part of the upgrade (the move out of the affected node and the move back in). Secondly it ensures that the upgrade itself doesn’t have much impact on the layout of the cluster; if the cluster was arranged well before the upgrade it will be arranged well after it, or at least no worse.

### Reduced churn
Another thing that happens during upgrades is that the Cluster Resource Manager turns off balancing for the entity being upgraded. So if you have two different application instances and then start an upgrade on one of them, then balancing is paused for that application instance, but not the other one. Preventing reactive balancing prevents unnecessary reactions to the upgrade itself (“Oh no! An empty node! Better fill it with all sorts of stuff!”) and consequently prevents in a lot of extra movements for services in the cluster that would just have to be undone when the services need to move back to the nodes after the upgrade is finished. If the upgrade in question is a Cluster upgrade, then the entire cluster is paused for balancing for the duration of the upgrade (constraint checks – ensuring the rules are enforced – stay active).

### Relaxed rules
One of the things that comes up during upgrades is generally that you want the upgrade to complete even if the cluster is overall rather constrained or full. We’ve actually already talked about how we do this but during upgrades it is even more important as you usually have between 5 and 20 percent of your cluster down at a time as the upgrade rolls through the cluster, and that workload has to go somewhere. This is where the notion of [buffered capacities](service-fabric-cluster-resource-manager-cluster-description.md#buffered-capacity) really comes into play – while the buffered capacity is respected during normal operation (leaving some overhead), the Resource Manager will fill up to the total capacity (taking up the buffer) during upgrades.

## Next steps
- Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
