---
title: Azure Service Fabric standalone cluster scaling 
description: Learn about scaling Service Fabric standalone clusters in or out and up or down.
author: dkkapur

ms.topic: conceptual
ms.date: 11/13/2018
ms.author: dekapur
---
# Scaling Service Fabric standalone clusters
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Clusters can contain potentially thousands of nodes. After creating a Service Fabric cluster, you can scale the cluster horizontally (change the number of nodes) or vertically (change the resources of the nodes).  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

Why scale the cluster? Application demands change over time.  You may need to increase cluster resources to meet increased application workload or network traffic or decrease cluster resources when demand drops.

## Scaling in and out, or horizontal scaling
Changes the number of nodes in the cluster.  Once the new nodes join the cluster, the [Cluster Resource Manager](service-fabric-cluster-resource-manager-introduction.md) moves services to them which reduces load on the existing nodes.  You can also decrease the number of nodes if the cluster's resources are not being used efficiently.  As nodes leave the cluster, services move off those nodes and load increases on the remaining nodes.  Reducing the number of nodes in a cluster running in Azure can save you money, since you pay for the number of VMs you use and not the workload on those VMs.  

- Advantages: Infinite scale, in theory.  If your application is designed for scalability, you can enable limitless growth by adding more nodes.  The tooling in cloud environments makes it easy to add or remove nodes, so it's easy to adjust capacity and you only pay for the resources you use.  
- Disadvantages: Applications must be [designed for scalability](service-fabric-concepts-scalability.md).  Application databases and persistence may require additional architectural work to scale as well.  [Reliable collections](service-fabric-reliable-services-reliable-collections.md) in Service Fabric stateful services, however, make it much easier to scale your application data.

Standalone clusters allow you to deploy Service Fabric cluster on-premises or in the cloud provider of your choice.  Node types are comprised of physical machines or virtual machines, depending on your deployment. Compared to clusters running in Azure, the process of scaling a standalone cluster is a little more involved.  You must manually change the number of nodes in the cluster and then run a cluster configuration upgrade.

Removal of nodes may initiate multiple upgrades. Some nodes are marked with `IsSeedNode=”true”` tag and can be identified by querying the cluster manifest using [Get-ServiceFabricClusterManifest](/powershell/module/servicefabric/get-servicefabricclustermanifest). Removal of such nodes may take longer than others since the seed nodes will have to be moved around in such scenarios. The cluster must maintain a minimum of three primary node type nodes.

> [!WARNING]
> We recommend that you do not lower the node count below the [Cluster Size of the Reliability Tier](service-fabric-cluster-capacity.md#the-reliability-characteristics-of-the-cluster) for the cluster. This will interfere with the ability of the Service Fabric System Services to be replicated across the cluster, and will destabilize or possibly destroy the cluster.
>

When scaling a standalone cluster, keep the following guidelines in mind:
- The replacement of primary nodes should be performed one node after another, instead of removing and then adding in batches.
- Before removing a node type, check if there are any nodes referencing the node type. Remove these nodes before removing the corresponding node type. Once all corresponding nodes are removed, you can remove the NodeType from the cluster configuration and begin a configuration upgrade using [Start-ServiceFabricClusterConfigurationUpgrade](/powershell/module/servicefabric/start-servicefabricclusterconfigurationupgrade).

For more information, see [scale a standalone cluster](service-fabric-cluster-windows-server-add-remove-nodes.md).

## Scaling up and down, or vertical scaling 
Changes the resources (CPU, memory, or storage) of nodes in the cluster.
- Advantages: Software and application architecture stays the same.
- Disadvantages: Finite scale, since there is a limit to how much you can increase resources on individual nodes. Downtime, because you will need to take physical or virtual machines offline in order to add or remove resources.

## Next steps
* Learn about [application scalability](service-fabric-concepts-scalability.md).
* [Scale an Azure cluster in or out](service-fabric-tutorial-scale-cluster.md).
* [Scale an Azure cluster programmatically](service-fabric-cluster-programmatic-scaling.md) using the fluent Azure compute SDK.
* [Scale a standalone cluster in or out](service-fabric-cluster-windows-server-add-remove-nodes.md).

