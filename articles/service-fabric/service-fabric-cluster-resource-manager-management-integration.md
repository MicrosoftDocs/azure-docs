---
title: Cluster Resource Manager - Management Integration 
description: An overview of the integration points between the Cluster Resource Manager and Service Fabric Management.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Cluster resource manager integration with Service Fabric cluster management
The Service Fabric Cluster Resource Manager doesn't drive upgrades in Service Fabric, but it is involved. The first way that the Cluster Resource Manager helps with management is by tracking the desired state of the cluster and the services inside it. The Cluster Resource Manager sends out health reports when it cannot put the cluster into the desired configuration. For example, if there is insufficient capacity the Cluster Resource Manager sends out health warnings and errors indicating the problem. Another piece of integration has to do with how upgrades work. The Cluster Resource Manager alters its behavior slightly during upgrades.  

## Health integration
The Cluster Resource Manager constantly tracks the rules you have defined for placing your services. It also tracks the remaining capacity for each metric on the nodes and in the cluster and in the cluster as a whole. If it can't satisfy those rules or if there is insufficient capacity, health warnings and errors are emitted. For example, if a node is over capacity and the Cluster Resource Manager will try to fix the situation by moving services. If it can't correct the situation it emits a health warning indicating which node is over capacity, and for which metrics.

Another example of the Resource Manager's health warnings is violations of placement constraints. For example, if you have defined a placement constraint (such as `“NodeColor == Blue”`) and the Resource Manager detects a violation of that constraint, it emits a health warning. This is true for custom constraints and the default constraints (like the Fault Domain and Upgrade Domain constraints).

Here’s an example of one such health report. In this case, the health report is for one of the system service’s partitions. The health message indicates the replicas of that partition are temporarily packed into too few Upgrade Domains.

```posh
PS C:\Users\User > Get-ServiceFabricPartitionHealth -PartitionId '00000000-0000-0000-0000-000000000001'


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
                        violating the Constraint: UpgradeDomain Details: UpgradeDomain ID -- 4, Replica on NodeName -- Node.8 Currently Upgrading -- false Distribution Policy -- Packing
                        RemoveWhenExpired     : True
                        IsExpired             : False
                        Transitions           : Ok->Warning = 8/10/2015 7:13:02 PM, LastError = 1/1/0001 12:00:00 AM
```

Here's what this health message is telling us is:

1. All the replicas themselves are healthy: Each has `AggregatedHealthState : Ok`
2. The Upgrade Domain distribution constraint is currently being violated. This means a particular Upgrade Domain has more replicas from this partition than it should.
3. Which node contains the replica causing the violation. In this case it's the node with the name *Node.8*
4. Whether an upgrade is currently happening for this partition ("Currently Upgrading -- false")
5. The distribution policy for this service: "Distribution Policy -- Packing". This is governed by the `RequireDomainDistribution` [placement policy](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md#requiring-replica-distribution-and-disallowing-packing). *Packing* indicates that in this case DomainDistribution was _not_ required, so we know that placement policy was not specified for this service. 
6. When the report happened - 8/10/2015 7:13:02 PM

Information like this powers alerting. You can use alerts in production to let you know something has gone wrong. Alerting is also used to detect and halt bad upgrades. In this case, we’d want to see if we can figure out why the Resource Manager had to pack the replicas into the Upgrade Domain. Usually packing is transient because the nodes in the other Upgrade Domains were down, for example.

Let’s say the Cluster Resource Manager is trying to place some services, but there aren't any solutions that work. When services can't be placed, it is usually for one of the following reasons:

1. Some transient condition has made it impossible to place this service instance or replica correctly
2. The service’s placement requirements are unsatisfiable.

In these cases, health reports from the Cluster Resource Manager help you determine why the service can’t be placed. We call this process the constraint elimination sequence. During it, the system walks through the configured constraints affecting the service and records what they eliminate. This way when services aren’t able to be placed, you can see which nodes were eliminated and why.

## Constraint types
Let’s talk about each of the different constraints in these health reports. You will see health messages related to these constraints when replicas can't be placed.

* **ReplicaExclusionStatic** and **ReplicaExclusionDynamic**: These constraints indicate that a solution was rejected because two service objects from the same partition would have to be placed on the same node. This isn’t allowed because then failure of that node would overly impact that partition. ReplicaExclusionStatic and ReplicaExclusionDynamic are almost the same rule and the differences don't really matter. If you are seeing a constraint elimination sequence containing either the ReplicaExclusionStatic or ReplicaExclusionDynamic constraint, the Cluster Resource Manager thinks that there aren’t enough nodes. This requires remaining solutions to use these invalid placements, which are disallowed. The other constraints in the sequence will usually tell us why nodes are being eliminated in the first place.
* **PlacementConstraint**: If you see this message, it means that we eliminated some nodes because they didn’t match the service’s placement constraints. We trace out the currently configured placement constraints as a part of this message. This is normal if you have a placement constraint defined. However, if placement constraint is incorrectly causing too many nodes to be eliminated this is how you would notice.
* **NodeCapacity**: This constraint means that the Cluster Resource Manager couldn’t place the replicas on the indicated nodes because that would put them over capacity.
* **Affinity**: This constraint indicates that we couldn’t place the replica on the affected nodes since it would cause a violation of the affinity constraint. More information on affinity is in [this article](service-fabric-cluster-resource-manager-advanced-placement-rules-affinity.md)
* **FaultDomain** and **UpgradeDomain**: This constraint eliminates nodes if placing the replica on the indicated nodes would cause packing in a particular fault or upgrade domain. Several examples discussing this constraint are presented in the topic on [fault and upgrade domain constraints and resulting behavior](service-fabric-cluster-resource-manager-cluster-description.md)
* **PreferredLocation**: You shouldn’t normally see this constraint removing nodes from the solution since it runs as an optimization by default. The preferred location constraint is also present during upgrades. During upgrade, it is used to move services back to where they were when the upgrade started.

## Blocklisting Nodes
Another health message the Cluster Resource Manager reports is when nodes are blocklisted. You can think of blocklisting as a temporary constraint that is automatically applied for you. Nodes get blocklisted when they experience repeated failures when launching instances of that service type. Nodes are blocklisted on a per-service-type basis. A node may be blocklisted for one service type but not another. 

You'll see blocklisting kick in often during development: Some bug causes your service host to crash on startup, Service Fabric tries to create the service host a few times, and the failure keeps occurring. After a few attempts, the node gets blocklisted, and the Cluster Resource Manager will try to create the service elsewhere. If that failure keeps happening on multiple nodes, it's possible that all of the valid nodes in the cluster end up blocked. Blocklisting can also remove so many nodes that not enough can successfully launch the service to meet the desired scale. You'll typically see additional errors or warnings from the Cluster Resource Manager indicating that the service is below the desired replica or instance count, as well as health messages indicating what the failure is that's leading to the blocklisting in the first place.

Blocklisting is not a permanent condition. After a few minutes, the node is removed from the blocklist and Service Fabric may activate the services on that node again. If services continue to fail, the node is blocklisted for that service type again. 

### Constraint priorities

> [!WARNING]
> Changing constraint priorities is not recommended and may have significant adverse effects on your cluster. The below information is provided for reference of the default constraint priorities and their behavior. 
>

With all of these constraints, you may have been thinking “Hey – I think that fault domain constraints are the most important thing in my system. In order to ensure the fault domain constraint isn't violated, I’m willing to violate other constraints.”

Constraints can be configured with different priority levels. These are:

   - “hard” (0)
   - “soft” (1)
   - “optimization” (2)
   - “off” (-1). 
   
Most of the constraints are configured as hard constraints by default.

Changing the priority of constraints is uncommon. There have been times where constraint priorities needed to change, usually to work around some other bug or behavior that was impacting the environment. Generally the flexibility of the constraint priority infrastructure has worked very well, but it isn't needed often. Most of the time everything sits at their default priorities. 

The priority levels don't mean that a given constraint _will_ be violated, nor that it will always be met. Constraint priorities define an order in which constraints are enforced. Priorities define the tradeoffs when it is impossible to satisfy all constraints. Usually all the constraints can be satisfied unless there's something else going on in the environment. Some examples of scenarios that will lead to constraint violations are conflicting constraints, or large numbers of concurrent failures.

In advanced situations, you can change the constraint priorities. For example, say you wanted to ensure that affinity would always be violated when necessary to solve node capacity issues. To achieve this, you could set the priority of the affinity constraint to “soft” (1) and leave the capacity constraint set to “hard” (0).

The default priority values for the different constraints are specified in the following config:

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
The Cluster Resource Manager wants to keep services spread out among fault and upgrade domains. It models this as a constraint inside the Cluster Resource Manager’s engine. For more information on how they are used and their specific behavior, check out the article on [cluster configuration](service-fabric-cluster-resource-manager-cluster-description.md#fault-and-upgrade-domain-constraints-and-resulting-behavior).

The Cluster Resource Manager may need to pack a couple replicas into an upgrade domain in order to deal with upgrades, failures, or other constraint violations. Packing into fault or upgrade domains normally happens only when there are several failures or other churn in the system preventing correct placement. If you wish to prevent packing even during these situations, you can utilize the `RequireDomainDistribution` [placement policy](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md#requiring-replica-distribution-and-disallowing-packing). Note that doing so may affect service availability and reliability as a side effect, so consider it carefully.

If the environment is configured correctly, all constraints are fully respected, even during upgrades. The key thing is that the Cluster Resource Manager is watching out for your constraints. When it detects a violation it immediately reports it and tries to correct the issue.

## The preferred location constraint
The PreferredLocation constraint is a little different, as it has two different uses. One use of this constraint is during application upgrades. The Cluster Resource Manager automatically manages this constraint during upgrades. It is used to ensure that when upgrades are complete that replicas return to their initial locations. The other use of the PreferredLocation constraint is for the [`PreferredPrimaryDomain` placement policy](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md). Both of these are optimizations, and hence the PreferredLocation constraint is the only constraint set to "Optimization" by default.

## Upgrades
The Cluster Resource Manager also helps during application and cluster upgrades, during which it has two jobs:

* ensure that the rules of the cluster are not compromised
* try to help the upgrade go smoothly

### Keep enforcing the rules
The main thing to be aware of is that the rules – the strict constraints like placement constraints and capacities - are still enforced during upgrades. Placement constraints ensure that your workloads only run where they are allowed to, even during upgrades. When services are highly constrained, upgrades can take longer. When the service or its node is brought down for an update, there may be few options for where it can go.

### Smart replacements
When an upgrade starts, the Resource Manager takes a snapshot of the current arrangement of the cluster. As each Upgrade Domain completes, it attempts to return the services that were in that Upgrade Domain to their original arrangement. This way there are at most two transitions for a service during the upgrade. There is one move out of the affected node and one move back in. Returning the cluster or service to how it was before the upgrade also ensures the upgrade doesn’t impact the layout of the cluster. 

### Reduced churn
During upgrades, the Cluster Resource Manager also turns off balancing. Preventing balancing prevents unnecessary reactions to the upgrade itself, like moving services into nodes that were emptied for the upgrade. If the upgrade in question is a Cluster upgrade, then the entire cluster is not balanced during the upgrade. Constraint checks stay active, only movement based on the proactive balancing of metrics is disabled.

### Buffered capacity and upgrade
Generally you want the upgrade to complete even if the cluster is constrained or close to full. Managing the capacity of the cluster is even more important during upgrades than usual. Depending on the number of upgrade domains, between 5 and 20 percent of capacity must be migrated as the upgrade rolls through the cluster. That work has to go somewhere. This is where the notion of [buffered capacities](service-fabric-cluster-resource-manager-cluster-description.md#node-buffer-and-overbooking-capacity) is useful. Buffered capacity is respected during normal operation. The Cluster Resource Manager may fill nodes up to their total capacity (consuming the buffer) during upgrades if necessary.

## Next steps
* Start from the beginning and [get an Introduction to the Service Fabric Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md)
