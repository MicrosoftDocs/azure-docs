---
title: Delete a Service Fabric cluster in Azure | Microsoft Docs
description: In this tutorial, you learn how to delete an Azure-hosted Service Fabric cluster and all it's resources. You can delete the resource group containing the cluster or selectively delete resources.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/26/2018
ms.author: ryanwi
ms.custom: mvc
---
# Tutorial: Remove a Service Fabric cluster running in Azure

This tutorial is part four of a series, and shows you how to delete a Service Fabric cluster running in Azure. To completely delete a Service Fabric cluster you also need to delete the resources used by the cluster. You have two options: either delete the resource group that the cluster is in (which deletes the cluster resource and all other resources in the resource group) or specifically delete the cluster resource and it's associated resources (but not other resources in the resource group).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Delete a resource group and all it's resources
> * Selectively delete resources from a resource group

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Create a secure [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md) or [Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md) on Azure using a template
> * [Scale a cluster in or out](service-fabric-tutorial-scale-cluster.md)
> * [Upgrade the runtime of a cluster](service-fabric-tutorial-upgrade-cluster.md)
> * Delete a cluster

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) or [Azure CLI](/cli/azure/install-azure-cli).
* Create a secure [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md) or [Linux cluster](service-fabric-tutorial-create-vnet-and-linux-cluster.md) on Azure

## Delete the resource group containing the Service Fabric cluster
The simplest way to delete the cluster and all the resources it consumes is to delete the resource group.

Log in to Azure and select the subscription ID with which you want to remove the cluster.  You can find your subscription ID by logging in to the [Azure portal](http://portal.azure.com). Delete the resource group and all the cluster resources using the [Remove-AzureRMResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) cmdlet or [az group delete](/cli/azure/group?view=azure-cli-latest#az_group_delete) command.

```powershell
Connect-AzureRmAccount
Set-AzureRmContext -SubscriptionId <guid>
$groupname = "sfclustertutorialgroup"
Remove-AzureRmResourceGroup -Name $groupname -Force
```

```azurecli
az login
az account set --subscription <guid>
ResourceGroupName="sfclustertutorialgroup"
az group delete --name $ResourceGroupName
```

## Selectively delete the cluster resource and the associated resources
If your resource group has only resources that are related to the Service Fabric cluster you want to delete, then it is easier to delete the entire resource group. If you want to selectively delete the resources in your resource group, and keep resources not associated with the cluster, then follow these steps.

List the resources in the resource group:

```powershell
Connect-AzureRmAccount
Set-AzureRmContext -SubscriptionId <guid>
$groupname = "sfclustertutorialgroup"
Get-AzureRmResource -ResourceGroupName $groupname | ft
```

```azurecli
az login
az account set --subscription <guid>
ResourceGroupName="sfclustertutorialgroup"
az resource list --resource-group $ResourceGroupName
```

For each of the resources you want to delete, run the following script:

```powershell
Remove-AzureRmResource -ResourceName "<name of the Resource>" -ResourceType "<Resource Type>" -ResourceGroupName $groupname -Force
```

```azurecli
az resource delete --name "<name of the Resource>" --resource-type "<Resource Type>" --resource-group $ResourceGroupName
```

To delete the cluster resource, run the following script:

```powershell
Remove-AzureRmResource -ResourceName "<name of the Resource>" -ResourceType "Microsoft.ServiceFabric/clusters" -ResourceGroupName $groupname -Force
```

```azurecli
az resource delete --name "<name of the Resource>" --resource-type "Microsoft.ServiceFabric/clusters" --resource-group $ResourceGroupName
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Delete a resource group and all it's resources
> * Selectively delete resources from a resource group

Now that you've completed this tutorial, try the following:
* Learn how to inspect and manage a Service Fabric cluster using [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).
* Learn how to [patch the Windows operating system](service-fabric-patch-orchestration-application.md) or [patch the Linux operating system](service-fabric-patch-orchestration-application-linux.md) of the cluster nodes.
* Learn how to aggregate and collect events for [Windows clusters](service-fabric-diagnostics-event-aggregation-wad.md) or [Linux clusters](service-fabric-diagnostics-event-aggregation-lad.md) and [setup Log Analytics](service-fabric-diagnostics-oms-setup.md) to monitor cluster events.