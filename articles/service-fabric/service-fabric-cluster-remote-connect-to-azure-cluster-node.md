---
title: Remote connect to an Azure Service Fabric cluster node | Microsoft Docs
description: Learn how to remotely connect to a scale set instance (a Service Fabric cluster node).
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
ms.date: 2/5/2018
ms.author: chackdan

---
# Remote connect to a virtual machine scale set instance or a cluster node
In a Service Fabric cluster running in Azure, each cluster node type that you define [sets up a virtual machine separate scale](service-fabric-cluster-node-types.md).  You can remote connect to specific scale set instances (or cluster nodes).  Unlike single-instance VMs, scale set instances don't have their own virtual IP addresses. This can be challenging when you are looking for an IP address and port that you can use to remotely connect to a specific instance.

To find an IP address and port that you can use to remotely connect to a specific instance, complete the following steps.

1. Find the virtual IP address for the node type by getting the inbound NAT rules for Remote Desktop Protocol (RDP).

    First, get the inbound NAT rules values that were defined as part of the resource definition for `Microsoft.Network/loadBalancers`.
    
    In the Azure portal, on the load balancer page, select **Settings** > **Inbound NAT rules**. This gives you the IP address and port that you can use to remotely connect to the first scale set instance. 
    
    ![Load balancer][LBBlade]
    
    In the following figure, the IP address and port are **104.42.106.156** and **3389**.
    
    ![NAT rules][NATRules]

2. Find the port that you can use to remotely connect to the specific scale set instance or node.

    Scale set instances map to nodes. Use the scale set information to determine the exact port to use.
    
    Ports are allocated in an ascending order that matches the scale set instance. For the earlier example of the FrontEnd node type, the following table lists the ports for each of the five node instances. Apply the same mapping to your scale set instance.
    
    | **Virtual machine scale set instance** | **Port** |
    | --- | --- |
    | FrontEnd_0 |3389 |
    | FrontEnd_1 |3390 |
    | FrontEnd_2 |3391 |
    | FrontEnd_3 |3392 |
    | FrontEnd_4 |3393 |
    | FrontEnd_5 |3394 |

3. Remotely connect to the specific scale set instance.

    The following figure demonstrates using Remote Desktop Connection to connect to the FrontEnd_1 scale set instance:
    
    ![Remote Desktop Connection][RDP]


## Next steps
* See the [overview of the "Deploy anywhere" feature and a comparison with Azure-managed clusters](service-fabric-deploy-anywhere.md).
* Learn about [cluster security](service-fabric-cluster-security.md).
* Learn about the [Service Fabric SDK and getting started](service-fabric-get-started.md).

<!--Image references-->
[NodeTypes]: ./media/service-fabric-cluster-nodetypes/NodeTypes.png
[Resources]: ./media/service-fabric-cluster-nodetypes/Resources.png
[InboundNatPools]: ./media/service-fabric-cluster-nodetypes/InboundNatPools.png
[LBBlade]: ./media/service-fabric-cluster-nodetypes/LBBlade.png
[NATRules]: ./media/service-fabric-cluster-nodetypes/NATRules.png
[RDP]: ./media/service-fabric-cluster-nodetypes/RDP.png
