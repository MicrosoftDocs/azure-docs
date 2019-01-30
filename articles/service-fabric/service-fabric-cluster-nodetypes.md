---
title: Azure Service Fabric node types and virtual machine scale sets | Microsoft Docs
description: Learn how Azure Service Fabric node types relate to virtual machine scale sets, and how to remotely connect to a scale set instance or cluster node.
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.assetid: 5441e7e0-d842-4398-b060-8c9d34b07c48
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/23/2018
ms.author: chackdan

---
# Azure Service Fabric node types and virtual machine scale sets
[Virtual machine scale sets](/azure/virtual-machine-scale-sets) are an Azure compute resource. You can use scale sets to deploy and manage a collection of virtual machines as a set. Each node type that you define in an Azure Service Fabric cluster sets up a separate scale.  The Service Fabric runtime installed on each virtual machine in the scale set. You can independently scale each node type up or down, change the OS SKU running on each cluster node, have different sets of ports open, and use different capacity metrics.

The following figure shows a cluster that has two node types, named FrontEnd and BackEnd. Each node type has five nodes.

![A cluster that has two node types][NodeTypes]

## Map virtual machine scale set instances to nodes
As shown in the preceding figure, scale set instances start at instance 0, and then increase by 1. The numbering is reflected in the node names. For example, node BackEnd_0 is instance 0 of the BackEnd scale set. This particular scale set has five instances, named BackEnd_0, BackEnd_1, BackEnd_2, BackEnd_3, and BackEnd_4.

When you scale up a scale set, a new instance is created. The new scale set instance name typically is the scale set name plus the next instance number. In our example, it is BackEnd_5.

## Map scale set load balancers to node types and scale sets
If you deployed your cluster in the Azure portal or used the sample Azure Resource Manager template, all resources under a resource group are listed. You can see the load balancers for each scale set or node type. The load balancer name uses the following format: **LB-&lt;node type name&gt;**. An example is LB-sfcluster4doc-0, as shown in the following figure:

![Resources][Resources]


## Next steps
* See the [overview of the "Deploy anywhere" feature and a comparison with Azure-managed clusters](service-fabric-deploy-anywhere.md).
* Learn about [cluster security](service-fabric-cluster-security.md).
* [Remote connect](service-fabric-cluster-remote-connect-to-azure-cluster-node.md) to a specific scale set instance
* [Update the RDP port range values](./scripts/service-fabric-powershell-change-rdp-port-range.md) on cluster VMs after deployment
* [Change the admin username and password](./scripts/service-fabric-powershell-change-rdp-user-and-pw.md) for cluster VMs

<!--Image references-->
[NodeTypes]: ./media/service-fabric-cluster-nodetypes/NodeTypes.png
[Resources]: ./media/service-fabric-cluster-nodetypes/Resources.png
[InboundNatPools]: ./media/service-fabric-cluster-nodetypes/InboundNatPools.png
