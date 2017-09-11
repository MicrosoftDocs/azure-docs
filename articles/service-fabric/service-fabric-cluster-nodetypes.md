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
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/05/2017
ms.author: chackdan

---
# Azure Service Fabric node types and virtual machine scale sets
Virtual machine scale sets are an Azure compute resource. You can use scale sets to deploy and manage a collection of virtual machines as a set. Set up a separate scale set for each node type that you define in an Azure Service Fabric cluster. You can independently scale each node type up or down, have different sets of ports open, and use different capacity metrics.

The following figure shows a cluster that has two node types, named FrontEnd and BackEnd. Each node type has five nodes.

![A cluster that has two node types][NodeTypes]

## Map virtual machine scale set instances to nodes
As shown in the preceding figure, scale set instances start at instance 0, and then increase by 1. The numbering is reflected in the node names. For example, node BackEnd_0 is instance 0 of the BackEnd scale set. This particular scale set has five instances, named BackEnd_0, BackEnd_1, BackEnd_2, BackEnd_3, and BackEnd_4.

When you scale up a scale set, a new instance is created. The new scale set instance name typically is the scale set name plus the next instance number. In our example, it is BackEnd_5.

## Map scale set load balancers to node types and scale sets
If you deployed your cluster in the Azure portal or used the sample Azure Resource Manager template, all resources under a resource group are listed. You can see the load balancers for each scale set or node type. The load balancer name uses the following format: **LB-&lt;node type name&gt;**. For example, LB-sfcluster4doc-0, as shown in the following figure:

![Resources][Resources]
<a name="remote-connect-to-a-vm-scale-set"></a>
## Remotely connect to a scale set instance or cluster node
Set up a separate scale set for each node type that you defined in a cluster. You can independently scale the node types up or down. You also can use different VM SKUs. Unlike single-instance VMs, scale set instances don't have their own virtual IP addresses. This can be challenging when you are looking for an IP address and port that you can use to remotely connect to a specific instance.

To find an IP address and port that you can use to remotely connect to a specific instance, complete the following steps.

**Step 1**: Find the virtual IP address for the node type by getting the inbound NAT rules for Remote Desktop Protocol (RDP).

First, get the inbound NAT rules values that were defined as part of the resource definition for `Microsoft.Network/loadBalancers`.

In the Azure portal, on the load balancer page, select **Settings** > **Inbound NAT rules**. This gives you the IP address and port that you can use to remotely connect to the first scale set instance. 

![Load balancer][LBBlade]

In the following figure, the IP address and port are **104.42.106.156** and **3389**.

![NAT rules][NATRules]

**Step 2**: Find the port that you can use to remotely connect to the specific scale set instance or node.

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

**Step 3**: Remotely connect to the specific scale set instance.

The following figure demonstrates using Remote Desktop Connection to connect to the FrontEnd_1 scale set instance:

![Remote Desktop Connection][RDP]

## Change the RDP port range values

### Before cluster deployment
When you set up the cluster by using a Resource Manager template, specify the range in `inboundNatPools`.

Go to the resource definition for `Microsoft.Network/loadBalancers`. Locate the description for `inboundNatPools`.  Replace the `frontendPortRangeStart` and `frontendPortRangeEnd` values.

![inboundNatPools values][InboundNatPools]

### After cluster deployment
Changing the RDP port range values after the cluster has been deployed is more complex. To ensure that you don't recycle the VMs, use Azure PowerShell to set new values. 

> [!NOTE]
> Ensure that you have Azure PowerShell 1.0 or a later version installed on your computer. If you don't have Azure Powershell 1.0 or a later version, we recommend that you follow the steps described in [How to install and configure Azure PowerShell.](/powershell/azure/overview)

1. Sign in to your Azure account. If the following PowerShell command fails, verify that you installed PowerShell installed correctly.

    ```
    Login-AzureRmAccount
    ```

2. To get details about your load balancer, and to see the values for the description for `inboundNatPools`, run the following code:

    ```
    Get-AzureRmResource -ResourceGroupName <resource group name> -ResourceType Microsoft.Network/loadBalancers -ResourceName <load balancer name>
    ```

3. Set `frontendPortRangeEnd` and `frontendPortRangeStart` to the values that you want.

    ```
    $PropertiesObject = @{
        #Property = value;
    }
    Set-AzureRmResource -PropertyObject $PropertiesObject -ResourceGroupName <resource group name> -ResourceType Microsoft.Network/loadBalancers -ResourceName <load balancer name> -ApiVersion <use the API version that is returned> -Force
    ```

## Change the RDP user name and password for nodes

To change the password for all nodes of a specific node type, complete the following steps. These changes will apply to all current and future nodes in the scale set.

1. Open PowerShell as an Administrator. 
2. To log in and select your subscription for the session, run the following commands. Change the `SUBSCRIPTIONID` parameter to your subscription ID. 

    ```powershell
    Login-AzureRmAccount
    Get-AzureRmSubscription -SubscriptionId 'SUBSCRIPTIONID' | Select-AzureRmSubscription
    ```

3. Run the following script. Use the relevant `NODETYPENAME`, `RESOURCEGROUP`, `USERNAME`, and `PASSWORD` values. The `USERNAME` and `PASSWORD` values are the new credentials that you use in future RDP sessions. 

    ```powershell
    $nodeTypeName = 'NODETYPENAME'
    $resourceGroup = 'RESOURCEGROUP'
    $publicConfig = @{'UserName' = 'USERNAME'}
    $privateConfig = @{'Password' = 'PASSWORD'}
    $extName = 'VMAccessAgent'
    $publisher = 'Microsoft.Compute'
    $node = Get-AzureRmVmss -ResourceGroupName $resourceGroup -VMScaleSetName $nodeTypeName
    $node = Add-AzureRmVmssExtension -VirtualMachineScaleSet $node -Name $extName -Publisher $publisher -Setting $publicConfig -ProtectedSetting $privateConfig -Type $extName -TypeHandlerVersion '2.0' -AutoUpgradeMinorVersion $true

    Update-AzureRmVmss -ResourceGroupName $resourceGroup -Name $nodeTypeName -VirtualMachineScaleSet $node
    ```

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
