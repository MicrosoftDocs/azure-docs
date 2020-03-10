---
title: Balancing of sub-clustered metrics
description: The effect of placement constraints on balancing and how to handle it
author: nipavlo

ms.topic: conceptual
ms.date: 08/18/2017
ms.author: nipavlo
---
# Balancing of sub-clustered metrics

## What is sub-clustering

Sub-clustering happens when services with different placement constraints have a common metric and they both report load for it. If the load reported by the services differs significantly, the total load on the nodes will have a large standard deviation and it would look like the cluster is imbalanced, even when it has the best possible balance.

## How sub-clustering affects load balancing

If the load reported by the services on different nodes differs significantly, it may look like there is a large imbalance where there is none. Also, if the false imbalance caused by sub-clustering is larger than the actual imbalance, it has the potential to confuse the Resource Manager balancing algorithm and to produce sub-optimal balance in the cluster.

For example, let's say we have four services and they all report a load for metric Metric1:

* Service A – has a placement constraint "NodeType==Type1", reports a load of 10
* Service B – has a placement constraint "NodeType==Type1", reports a load of 10
* Service C – has a placement constraint "NodeType==Type2", reports a load of 100
* Service D – has a placement constraint "NodeType==Type2", reports a load of 100
* And we have four nodes. Two of them have NodeType set as "Type1" and the other two are "Type2"

And we have a placement like this:

<center>

![Sub-clustered placement example][Image1]
</center>

It may look like the cluster is imbalanced, we have a large load on nodes 3 and 4, but this is the best possible balance in this situation.

Resource Manager can recognize sub-clustering situations and in almost all cases it can produce the optimal balance for the given situation.

In some exceptional situations when Resource Manager is not able to optimally balance a sub-clustered metric it will still detect sub-clustering and it will generate a health report to advise you to fix the problem.

## Types of sub-clustering and how they are handled

Sub-clustering situations can be classified into three different categories. The category of a specific sub-clustering situation determines how it will be handled by Resource Manager.

### First category – flat sub-clustering with disjoint node groups

This is the simplest form of sub-clustering where nodes can be separated into different groups and each service can only be placed onto nodes in one of those groups. Each node belongs to one group and one group only. The situation described above belongs in this category as do most of the sub-clustering situations. 

For the situations in this category, the Resource Manager can produce the optimal balance and no further intervention is needed.

### Second category – sub-clustering with hierarchical node groups

This situation happens when a group of nodes allowed for one service is a subset of the group of nodes allowed for another service. The most common example of this situation is when some service has a placement constraint defined and another service has no placement constraint and can be placed on any node.

Example:

* Service A: no placement constraint
* Service B: placement constraint "NodeType==Type1"
* Service C: placement constraint "NodeType==Type2"

This creates a subset-superset relation between node groups for different services.

<center>

![Subset superset sub-clusters][Image2]
</center>

In this situation, there is a chance that a sub-optimal balance gets made.

Resource Manager will recognize this situation and produce a health report advising you to split Service A into two services – Service A1 which can be placed on Type1 nodes and Service A2 which can be placed on Type2 nodes. This will bring us back to first category situation which can be balanced optimally.

### Third category – sub-clustering with partial overlap between node sets

This situation happens when there is a partial overlap between sets of nodes onto which some services can be placed.

For example, if we have a node property called NodeColor and we have three nodes:

* Node 1: NodeColor=Red
* Node 2: NodeColor=Blue
* Node 2: NodeColor=Green

And we have two services:

* Service A: with placement constraint "Color==Red || Color==Blue"
* Service B: with placement constraint "Color==Blue || Color==Green"

Because of this, Service A can be placed on nodes 1 and 2 and Service B can be placed on nodes 2 and 3.

In this situation, there is a chance that a sub-optimal balance gets made.

Resource Manager will recognize this situation and produce a health report advising you to split some of the services.

For this situation, the Resource Manager is not able to give a proposal how to split the services, since multiple splits can be done and there is no way to estimate which way would be the optimal one to split the services.

## Configuring sub-clustering

The behavior of Resource Manager about sub-clustering can be modified by modifying the following configuration parameters:
* SubclusteringEnabled - parameter determines whether Resource Manager will take sub-clustering into account when doing load balancing. If this parameter is turned off, Resource Manager will ignore sub-clustering and try to achieve optimal balance on a global level. The default value of this parameter is false.
* SubclusteringReportingPolicy - determines how Resource Manager will emit health reports for hierarchical and partial-overlap sub-clustering. A value of zero means that health reports about sub-clustering are turned off, 1 means that warning health reports will be produced for sub-optimal sub-clustering situations and a value of 2 will produce "OK" health reports. The default value for this parameter is 1.

ClusterManifest.xml:

``` xml
        <Section Name="PlacementAndLoadBalancing">
            <Parameter Name="SubclusteringEnabled" Value="true" />
            <Parameter Name="SubclusteringReportingPolicy" Value="1" />
        </Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "PlacementAndLoadBalancing",
    "parameters": [
      {
          "name": "SubclusteringEnabled",
          "value": "true"
      },
      {
          "name": "SubclusteringReportingPolicy",
          "value": "1"
      },
    ]
  }
]
```

## Next steps
* To find out about how the Cluster Resource Manager manages and balances load in the cluster, check out the article on [balancing load](service-fabric-cluster-resource-manager-balancing.md)
* To find out about how your services can be constrained to only be placed on certain nodes see [Node properties and placement constraints](service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints)

[Image1]:./media/service-fabric-cluster-resource-manager-sub-clustering/sub-clustered-placement.png
[Image2]:./media/service-fabric-cluster-resource-manager-sub-clustering/subset-superset-nodes.png
