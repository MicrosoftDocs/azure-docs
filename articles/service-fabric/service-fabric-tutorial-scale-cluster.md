---
title: Scale a Service Fabric cluster | Microsoft Docs
description: Learn how to quickly scale a Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: Thraka
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/24/2017
ms.author: adegeo

---

# Scale a Service Fabric cluster

This tutorial is part three of a series and shows you how to scale your existing cluster out and in. When you've finished, you will know how to scale your cluster and how to clean up and left-over resources.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Read the cluster node count
> * Add cluster nodes (scale out)
> * Remove cluster nodes (scale in)

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) or [Azure CLI 2.0](/cli/azure/install-azure-cli).
- Create a secure [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md) or [Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md) on Azure
- If you deploy a Windows cluster, set up a Windows development environment. Install [Visual Studio 2017](http://www.visualstudio.com) and the **Azure development**, **ASP.NET and web development**, and **.NET Core cross-platform development** workloads.  Then set up a [.NET development environment](service-fabric-get-started.md).
- If you deploy a Linux cluster, set up a Java development environment on [Linux](service-fabric-get-started-linux.md) or [MacOS](service-fabric-get-started-mac.md).  Install the [Service Fabric CLI](service-fabric-cli.md). 

## Sign in to Azure and select your subscription
Sign in to your Azure account select your subscription before you execute Azure commands.

```powershell
Login-AzureRmAccount
Get-AzureRmSubscription
Set-AzureRmContext -SubscriptionId <guid>
```

```azurecli
az login
az account set --subscription <guid>
```

## Connect to resources

To successfully complete this step in the tutorial, you need to connect to both the Service Fabric cluster and the virtual machine scale set (that hosts the cluster).

### Connect to cluster

When you connect to a cluster, you can query it for information. In this tutorial, we look at the cluster to learn about what nodes the cluster is aware of. This example uses a certificate to connect with that was created in the [first step](service-fabric-tutorial-create-vnet-and-windows-cluster.md) of this series. Make sure you set the `$endpoint` and `$thumbprint` variables to your values.

```powershell
$endpoint = "<mycluster>.southcentralus.cloudapp.azure.com:19000"
$thumbprint = "63EB5BA4BC2A3BADC42CA6F93D6F45E5AD98A1E4"

Connect-ServiceFabricCluster -ConnectionEndpoint $endpoint `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint $thumbprint `
          -FindType FindByThumbprint -FindValue $thumbprint `
          -StoreLocation CurrentUser -StoreName My

Get-ServiceFabricClusterHealth
```

With the `Get-ServiceFabricClusterHealth` command, status is returned to you with details about the health of each node in the cluster.

## Scale out

When you scale out, you add more virtual machines to the scale set, these become nodes that Service Fabric can use. Service Fabric knows about scale out operations and reacts automatically, deploying the appropriate applications to the newly created nodes.

```powershell
$scaleset = Get-AzureRmVmss -ResourceGroupName SFCLUSTERTUTORIALGROUP -VMScaleSetName nt1vm
$scaleset.Sku.Capacity += 1

Update-AzureRmVmss -ResourceGroupName SFCLUSTERTUTORIALGROUP -VMScaleSetName nt1vm -VirtualMachineScaleSet $scaleset
```

## Scale in

Scaling in is the same as scaling out, except you use a lower **capacity** value. Normally, Service Fabric is unaware that it has suddenly lost a node when you remove scale set instances. It just knows that a node has gone missing. To prevent that bad state, inform service fabric that you expect the node to go missing, so that it doesn't show up as unhealthy. 

### Remove the service fabric node

> [!NOTE]
> This part only applies to the *Bronze* durability tier. For more information about durability, see [Service Fabric cluster capacity planning](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster).

Virtual machine scale sets (in most cases) always removes the virtual machine instance that was last created. So we need to find the matching service fabric node, which you can find by checking the biggest `NodeInstanceId` property value on the service fabric nodes.

```powershell
Get-ServiceFabricNode | Sort-Object NodeInstanceId -Descending | Select-Object -First 1
```

The service fabric cluster needs to know that this node is going to be removed. So there are three actions you need to take.

1. Disable the node so that it no longer is a replicate for data.  
`Disable-ServiceFabricNode`

2. Stop the node so that the service fabric runtime shuts down cleanly, and your app gets a terminate request.  
`Start-ServiceFabricNodeTransition -Stop`

2. Remove the node from the cluster.  
`Remove-ServiceFabricNodeState`

Once these three things have been done to the node, it can be removed from the scale set. If you're using any durability tier besides bronze, this is done for you when the scale set instance is removed.

The following code block gets the last created node, disables, stops, and removes the node from the cluster.

```powershell
# Get the node that was created last
$node = Get-ServiceFabricNode | Sort-Object NodeInstanceId -Descending | Select-Object -First 1

# Node details for the disable/stop process
$nodename = $node.NodeName
$nodeid = $node.NodeInstanceId

$loopTimeout = 10

# Run disable logic
Disable-ServiceFabricNode -NodeName $nodename -Intent RemoveNode -TimeoutSec 300 -Force

$state = Get-ServiceFabricNode | Where-Object NodeName -eq $nodename | Select-Object -ExpandProperty NodeStatus

while (($state -ne [System.Fabric.Query.NodeStatus]::Disabled) -and ($loopTimeout -ne 0))
{
    Start-Sleep 5
    $loopTimeout -= 1
    $state = Get-ServiceFabricNode | Where-Object NodeName -eq $nodename | Select-Object -ExpandProperty NodeStatus
    Write-Host "Checking state... $state found"
}

# Exit if the node was unable to be disabled
if ($state -ne [System.Fabric.Query.NodeStatus]::Disabled)
{
    Write-Error "Disable failed with state $state"
}
else
{
    # Stop node
    $stopid = New-Guid
    Start-ServiceFabricNodeTransition -Stop -OperationId $stopid -NodeName $nodename -NodeInstanceId $nodeid -StopDurationInSeconds 300
    
    $state = (Get-ServiceFabricNodeTransitionProgress -OperationId $stopid).State
    $loopTimeout = 10

    # Watch the transaction
    while (($state -eq [System.Fabric.TestCommandProgressState]::Running) -and ($loopTimeout -ne 0))
    {
        Start-Sleep 5
        $state = (Get-ServiceFabricNodeTransitionProgress -OperationId $stopid).State
        Write-Host "Checking state... $state found"
    }
    
    if ($state -ne [System.Fabric.TestCommandProgressState]::Completed)
    {
        Write-Error "Stop transaction failed with $state"
    }
    else
    {
        # Remove the node from the cluster
        Remove-ServiceFabricNodeState -NodeName $nodename -TimeoutSec 300 -Force
    }
}
```

### Scale in the scale set
Now that the service fabric node has been removed from the cluster, the virtual machine scale set can be scaled in. In the example below, the scale set capacity is reduced by 1, and the scale set is then updated on Azure.

```powershell
$scaleset = Get-AzureRmVmss -ResourceGroupName SFCLUSTERTUTORIALGROUP -VMScaleSetName nt1vm
$scaleset.Sku.Capacity -= 1

Update-AzureRmVmss -ResourceGroupName SFCLUSTERTUTORIALGROUP -VMScaleSetName nt1vm -VirtualMachineScaleSet $scaleset
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Read the cluster node count
> * Add cluster nodes (scale out)
> * Remove cluster nodes (scale in)
