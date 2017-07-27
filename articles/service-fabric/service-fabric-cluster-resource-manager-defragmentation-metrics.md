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
ms.date: 07/28/2017
ms.author: masnider

---
# Defragmentation of metrics and load in Service Fabric
The Service Fabric Cluster Resource Manager's default strategy for managing load metrics in the cluster is to distribute the load. The goal is to make sure that the nodes in the cluster are equally utilized, and to avoid hot spots and cold spots that can lead to both unnecessary contention and wasted resources. Having workloads distributed in the cluster is also the safest layout in terms of surviving failures since it ensures that a failure doesn’t take out a large percentage of a given workload. 

The Service Fabric Cluster Resource Manager does support a different strategy for managing load, which is defragmentation. Defragmentation means that instead of trying to distribute the utilization of a metric across the cluster, it is consolidated. Consolidation is just an inversion of the default balancing strategy – instead of minimizing the average standard deviation of metric load, the Cluster Resource Manager tries to increase it.

## When to use defragmentation
When load is distributed in the cluster then some of the resources on each node are consumed. Some workloads create services that are exceptionally large and consume most if not all of a node. In these cases it's possible that when there are large workloads getting created that there isn't enough space on any node to run them. Large workloads aren't a problem in Service Fabric; in these cases the Cluster Resource Manager determines that it needs to reorganize the cluster to make room for this large workload. However, in the meantime that workload has to wait to be scheduled in the cluster.

If there are many services and state to move around, then it could take a long time for the large workload to be placed in the cluster. This is more likely if other workloads in the cluster are also large or costly to move and hence take longer to reorganize. The Service Fabric team measured creation times in simulations of this scenario. We found that if services were large enough and the cluster was highly utilized that the creation of those large services would be very slow. To handle this scenario, we introduced defragmentation as a balancing strategy. We found that for large workloads, especially ones where creation time was important, defragmentation really helped those new workloads get scheduled in the cluster.

You can configure defragmentation metrics to have the Cluster Resource Manager to proactively try to condense the load of the services into fewer nodes. This helps ensure that there is (almost) always room for even large services. This allows such services to be created quickly when necessary.

Most people don’t need defragmentation. Services should usually be small, and hence it’s not hard to find room for them in the cluster. However, if you have large services and need them created quickly (and are willing to accept the other tradeoffs) then the defragmentation strategy is for you.

## Defragmentation tradeoffs
Defragmentation can increase impactfulness of failures (since more services are running on nodes that fail). Furthermore, defragmentation ensures that some resources in the cluster are unutilized while they wait for those large workloads to be scheduled.

The following diagram gives a visual representation of two clusters, one that is defragmented and one that is not. 

<center>
![Comparing Balanced and Defragmented Clusters][Image1]
</center>

In the balanced case, consider the number of movements that would be necessary to place one of the largest service objects. Compare that to the defragmented cluster, where the large workload could be immediately placed on nodes four or five without having to wait for any other services to move.

## Defragmentation pros and cons
So what are those other conceptual tradeoffs? Here’s a quick table of things to think about:

| Defragmentation Pros | Defragmentation Cons |
| --- | --- |
| Allows faster creation of large services |Concentrates load onto fewer nodes, increasing contention |
| Enables lower data movement during creation |Failures can impact more services and cause more churn |
| Allows rich description of requirements and reclamation of space |More complex overall Resource Management configuration |

You can mix defragmented and normal metrics in the same cluster. The Cluster Resource Manager tries to consolidate the defragmentation metrics as much as possible while spreading out the others. This works fairly well when the services that use defragmented metrics and those that use balanced metrics are different. The exact results will depend on the number of balancing metrics compared to the number of defragmentation metrics, how much they overlap (if at all), the metric weights, current load, and other factors. Experimentation is required to determine the exact configuration necessary. We recommend thorough measurement of your workloads before turning on defragmentation metrics in a production environment, especially when mixing them with balanced metrics. 

## Configuring defragmentation metrics
Configuring defragmentation metrics is a global decision in the cluster, and individual metrics can be selected for defragmentation. The config snippets below show how to configure some metrics for defragmentation:

ClusterManifest.xml:

```xml
<Section Name="DefragmentationMetrics">
    <Parameter Name="Disk" Value="true" />
    <Parameter Name="CPU" Value="false" />
</Section>
```

via ClusterConfig.json for Standalone deployments or Template.json for Azure hosted clusters:

```json
"fabricSettings": [
  {
    "name": "DefragmentationMetrics",
    "parameters": [
      {
          "name": "Disk",
          "value": "true"
      },
      {
          "name": "CPU",
          "value": "false"
      }
    ]
  }
]
```


## Next steps
- The Cluster Resource Manager has man options for describing the cluster. To find out more about them, check out this article on [describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md)
- Metrics are how the Service Fabric Cluster Resource Manger manages consumption and capacity in the cluster. To learn more about them and how to configure them, check out [this article](service-fabric-cluster-resource-manager-metrics.md)

[Image1]:./media/service-fabric-cluster-resource-manager-defragmentation-metrics/balancing-defrag-compared.png
