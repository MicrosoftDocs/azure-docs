---
title: Move a Windows VM resource in Azure | Microsoft Docs
description: Move a Windows VM to another Azure subscription or resource group in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 4e383427-4aff-4bf3-a0f4-dbff5c6f0c81
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2018
ms.author: cynthn

---
# Move a Windows VM to another Azure subscription or resource group
This article walks you through how to move a Windows virtual machine (VM) between resource groups or subscriptions. Moving between subscriptions can be handy if you originally created a VM in a personal subscription and now want to move it to your company's subscription to continue your work.

> [!IMPORTANT]
>You cannot move Azure Managed Disks at this time. 
>
>New resource IDs are created as part of the move. After the VM has been moved, you will need to update your tools and scripts to use the new resource IDs. 
> 
> 

[!INCLUDE [virtual-machines-common-move-vm](../../../includes/virtual-machines-common-move-vm.md)]

## Use Powershell to move a VM

To move a virtual machine to another resource group, you need to make sure that you also move all of the dependent resources. To get a list with the resource ID of each of these resources, use the [Get-AzureRMResource](/powershell/module/azurerm.resources/get-azurermresource) cmdlet.

```azurepowershell-interactive
 Get-AzureRMResource -ResourceGroupName <sourceResourceGroupName> | Format-table -Property ResourceId 
```

You can use the output of the previous command as a comma-separated list of resource IDs to [Move-AzureRMResource](/powershell/module/azurerm.resources/move-azurermresource) to move each resource to the destination. 

```azurepowershell-interactive
Move-AzureRmResource -DestinationResourceGroupName "<myDestinationResourceGroup>" `
    -ResourceId <myResourceId,myResourceId,myResourceId>
```
	
To move the resources to different subscription, include the **-DestinationSubscriptionId** parameter. 

```azurepowershell-interactive
Move-AzureRmResource -DestinationSubscriptionId "<myDestinationSubscriptionID>" `
    -DestinationResourceGroupName "<myDestinationResourceGroup>" `
    -ResourceId <myResourceId,myResourceId,myResourceId>
```


When you are asked to confirm that you want to move the specified resources, enter **Y** to confirm.

## Next steps
You can move many different types of resources between resource groups and subscriptions. For more information, see [Move resources to a new resource group or subscription](../../resource-group-move-resources.md).    

