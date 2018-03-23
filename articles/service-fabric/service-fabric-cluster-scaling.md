---
title: Azure Service Fabric cluster scaling | Microsoft Docs
description: Learn about scaling Service Fabric clusters in or out and up or down.
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.assetid: 5441e7e0-d842-4398-b060-8c9d34b07c48
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/23/2018
ms.author: chackdan

---
# Scaling Service Fabric clusters
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Clusters can contain potentially thousands of nodes. After creating a Service Fabric cluster, you can scale the cluster by increasing or decreasing the number of cluster nodes or increasing or decreasing the size of nodes.  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

Why scale the cluster?
- Increase the number of nodes to
- Decrease the number of nodes to reduce unused capacity

## Adding or removing nodes (scaling in or out)

### Scaling an Azure cluster in or out

### Scaling a standalone cluster in or out

## Increasing or decreasing the size of nodes (scaling up or down)

### Scaling an Azure cluster up or down

### Scaling a standalone cluster up or down


## Next steps
* [Scale an Azure cluster in or out](service-fabric-tutorial-scale-cluster.md)
* [Scale an Azure cluster programmatically](service-fabric-cluster-programmatic-scaling.md)
* [Scale a standaone cluster in or out](service-fabric-cluster-windows-server-add-remove-nodes.md)

