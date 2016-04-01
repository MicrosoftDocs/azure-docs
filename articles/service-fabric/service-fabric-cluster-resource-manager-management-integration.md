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
   ms.date="03/10/2016"
   ms.author="masnider"/>


# Cluster resource manager integration with Service Fabric cluster management
The Resource Manager isn’t the main component of Service Fabric that handles management operations (like application upgrades) but it is involved. The first way that the Resource Manager helps with management is by tracking the desired state of the cluster and the services inside it from a resourcing and balance perspective and altering via the Service Fabric health subsystem when things are wrong. Another piece of integration has to do with how upgrades work; specifically during upgrades some things about how the Resource Manager works change during upgrades, and some special behaviors get invoked. We’ll talk about both of these below.

## Health integration
The Resource Manager constantly tracks the rules you have defined for your services and emits health warnings and errors if it cannot satisfy those rules. For example, if a node is over capacity and the Resource Manager cannot correct the situation it will emit a health warning indicating which node is over capacity, and for which metrics.

Another example of a time when you’ll see the Resource Manager emit health warnings is if you have defined a placement constraint (such as “NodeColor == Blue”) and the Resource Manager detects a violation of that constraint. We do this both for custom constraints as well as the default constraints (like fault and upgrade domain distribution) that the Resource Manager enforces for you. Here’s an example of one such health report. In this case the health report is for one of the system service’s partitions because the replicas of that partition are temporarily packed into too few fault domains, like could happen due to a string of failures:

```posh
PS C:\Users\User > Get-WindowsFabricPartitionHealth -PartitionId '00000000-0000-0000-0000-000000000001'


PartitionId           : 00000000-0000-0000-0000-000000000001
AggregatedHealthState : Warning
UnhealthyEvaluations  :
                        Unhealthy event: SourceId='System.PLB', Property='ReplicaConstraintViolation_FaultDomain', HealthState='Warning', ConsiderWarningAsError=false.

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
                        Property              : ReplicaConstraintViolation_FaultDomain
                        HealthState           : Warning
                        SequenceNumber        : 130837100116930204
                        SentAt                : 8/10/2015 7:53:31 PM
                        ReceivedAt            : 8/10/2015 7:53:33 PM
                        TTL                   : 00:01:05
                        Description           : The Load Balancer has detected a Constraint Violation for this Replica: fabric:/System/FailoverManagerService Secondary Partition 00000000-0000-0000-0000-000000000001 is
                        violating the Constraint: FaultDomain Details: Node -- 3d1a4a68b2592f55125328cd0f8ed477  Policy -- Packing
                        RemoveWhenExpired     : True
                        IsExpired             : False
                        Transitions           : Ok->Warning = 8/10/2015 7:13:02 PM, LastError = 1/1/0001 12:00:00 AM
```

Here's what this health message is telling us is:

1.	All the replicas themselves are healthy (this is Service Fabric’s first priority)
2.	That the fault domain distribution constraint is currently being violated (meaning that a particular fault domain has more of the replicas for this partition than it should)
3.	Which node contains the replica causing the violation (The node with ID: 3d1a4a68b2592f55125328cd0f8ed477)
4.	When this all happened (8/10/2015 7:13:02 PM)
This is great data for an alert that fires in production to let you know something has gone wrong and you probably want to go take a look. In this case, for example, we’d want to see if we can figure out why the Resource Manager didn’t feel like it had any choice but to pack the replicas into the fault domain. This could be because all of the nodes in the other fault domains were down and there weren’t enough spare other domains, or if there were enough domains up something else which caused the nodes in those other fault domains to be invalid (like an InvalidDomain policy on the service, for example).

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

## Upgrades
The Resource Manager also helps during application and cluster upgrades in order to ensure that the upgrade goes smoothly, but also to ensure that the rules and performance of the cluster are not compromised.

### Keep enforcing the rules
The main thing to be aware of is that the rules – the strict controls around things like placement constraints are still enforced during upgrades. You’d think that this goes without saying, but we’re saying it anyway just to be explicit about it. The positive side of this is that you can ensure that if you wanted to be sure that certain workloads don’t run on certain nodes that will still (not) happen even during the upgrade, with no interaction from operations. If your environment is highly constrained, this can cause upgrades to take a long time since there are only a few options for where a service can go if it needs to be brought down for patching.

### Smart replacements
When an upgrade starts the Resource Manager takes a snapshot of the current arrangement of the cluster and attempts to return things to that state when the upgrade is done. The reasoning behind this is simple – first it ensures that there are only a couple transitions for each service as a part of the upgrade (the move out of the affected node and the move back in). Secondly it ensures that the upgrade itself doesn’t have much impact on the layout of the cluster; if the cluster was arranged well before the upgrade it will be arranged well after it.

### Reduced churn
Another thing that happens during upgrades is that the resource manager turns off balancing for the entity being upgraded. So if you have two different application instances and then start an upgrade on one of them, then balancing is paused for that application instance, but not the other one. Preventing reactive balancing prevents the resource manager from reacting to the upgrade (“Oh no! An empty node! Better fill it with all sorts of stuff!”) and consequently resulting in a lot of extra movements for services in the cluster that just have to be undone when the services need to move back to the nodes after the upgrade is finished. If the upgrade in question is a Cluster upgrade, then the entire cluster is paused for balancing for the duration of the upgrade (constraint checks – ensuring the rules are enforced – stay active).

### Relaxed rules
One of the things that comes up during upgrades is generally that you want the upgrade to complete even if the cluster is overall rather constrained or full. We’ve actually already talked about how we do this but during upgrades it is even more important as you usually have between 5 and 20 percent of your cluster down at a time as the upgrade rolls through the cluster, and that workload has to go somewhere. This is where the notion of buffered capacities that we mention earlier really comes into play – while the buffered capacity is respected during normal operation, the Resource Manager will fill up to the total capacity during upgrades.

## Next steps
- Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
