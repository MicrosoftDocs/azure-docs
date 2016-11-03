---
title: Defragmentation of Metrics in Azure Service Fabric | Microsoft Docs
description: An overview of using defragmentation or packing as a strategy for metrics in Service Fabric
services: service-fabric
documentationcenter: .net
author: masnider
manager: timlt
editor: ''

ms.assetid: e5ebfae5-c8f7-4d6c-9173-3e22a9730552
ms.service: Service-Fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/19/2016
ms.author: masnider

---
# Defragmentation of metrics and load in Service Fabric
The Service Fabric Cluster Resource Manager mainly is concerned with balancing in terms of distributing the load – making sure that all of the nodes in the cluster are equally utilized. This is usually the safest and smartest layout in terms of surviving failures since it makes sure that any given failure doesn’t take out the some large percentage of a given workload. The Service Fabric Cluster Resource Manager does support a different strategy as well, which is defragmentation. Defragmentation generally means that instead of trying to distribute the utilization of a metric across the cluster, we should actually try to consolidate it. This is a fortunate inversion of our normal strategy – instead of optimizing the cluster based on minimizing the average standard deviation of metric load for a given metric, we start optimizing for increases in deviation. But why would you want this strategy?

Well, if you’ve spread the load out evenly among the nodes in the cluster then you’ve eaten up some of the resources that the nodes have to offer. Normally this isn’t a problem, but sometimes some workloads create services which are exceptionally large and consume the vast majority of a node – say 75% to 95% of a node’s resources would end up dedicated to a single service instance or replica. This isn’t a problem, the Cluster Resource Manager will detect at service creation time that it needs to reorganize the cluster in order to make room for this large workload and set about making it happen, but in the meantime that workload has to wait to be scheduled in the cluster.

Given that the scheduling of new workloads is usually at least a little latency sensitive, if we don’t do anything differently we can sometimes blow right by those SLAs if there’s a lot of services and state to move around, particularly if workloads in the cluster are generally large (and hence taking longer to move around in the cluster). Indeed, when we measured creation times in simulations based on real cluster data, we saw that if services were large enough and the cluster was fairly utilized that the creation of those large services would be slowed down, and that we could improve this by introducing the policy of defragmentation metrics.

Just like file creation or access could get slowed down if a computer’s hard disk was fragmented and could be sped up by defragmenting the drive so that there were larger contiguous blocks available, you can configure defragmentation metrics to have the Cluster Resource Manager to proactively try to condense the load of the services into fewer nodes so that there is (almost) always room for even large services, enabling them to be created quickly. Most people won’t need this, because services should usually be small and hence it’s not hard to find room for them, but if you have large services and need them created quickly (and are willing to accept the other tradeoffs such as increased impactfulness of failures and some resources being left unutilized while they wait for workloads to be scheduled) then the defragmentation strategy is for you.

The diagram below gives a visual representation of two different clusters, one which is defragmented and one which is not. In the balanced case, consider the movements which would be necessary to place one of the largest service objects, if a new one were to be created, compared to the defragmented cluster, where it could be immediately placed on nodes 4 or 5.

![Comparing Balanced and Defragmented Clusters][Image1]

## Defragmentation pros and cons
So what are those other conceptual tradeoffs? We recommend thorough measurement of your workloads before turning on defragmentation metrics. Here’s a quick table of things to think about:

| Defragmentation Pros | Defragmentation Cons |
| --- | --- |
| Allows faster creation of large services |Concentrates load onto fewer nodes, increasing contention |
| Enables lower data movement during creation |Failures can impact more services and cause more churn |
| Allows rich description of requirements and reclamation of space |More complex overall Resource Management configuration |

You can mix defragmented and normal metrics in the same cluster and the Resource Manager will do it’s best to ensure that you get a layout that consolidates as much of the defragmentation metrics as it can while trying to spread out the rest. The exact results you’ll get will depend on the number of balancing metrics compared to the number of defragmentation metrics and their weights, current loads, etc.

## Configuring defragmentation metrics
Configuring defragmentation metrics is a global decision in the cluster, and individual metrics can be selected for defragmentation:

ClusterManifest.xml:

```xml
<Section Name="DefragmentationMetrics">
    <Parameter Name="Disk" Value="true" />
    <Parameter Name="CPU" Value="false" />
</Section>
```

## Next steps
* The Cluster Resource Manager has a lot of options for describing the cluster. To find out more about them check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)
* Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about them and how to configure them check out [this article](service-fabric-cluster-resource-manager-metrics.md)

[Image1]:./media/service-fabric-cluster-resource-manager-defragmentation-metrics/balancing-defrag-compared.png
