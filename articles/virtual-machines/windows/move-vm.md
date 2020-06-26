---
title: Move a Windows VM resource in Azure
description: Move a Windows VM to another Azure subscription or resource group in the Resource Manager deployment model.
author: cynthn
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 07/03/2019
ms.author: cynthn
---
# Move a Windows VM to another Azure subscription or resource group
This article walks you through how to move a Windows virtual machine (VM) between resource groups or subscriptions. Moving between subscriptions can be handy if you originally created a VM in a personal subscription and now want to move it to your company's subscription to continue your work. You do not need to stop the VM in order to move it and it should continue to run during the move.

> [!IMPORTANT]
>New resource IDs are created as part of the move. After the VM has been moved, you will need to update your tools and scripts to use the new resource IDs.
>
>

[!INCLUDE [virtual-machines-common-move-vm](../../../includes/virtual-machines-common-move-vm.md)]

## Use Powershell to move a VM

To move a virtual machine to another resource group, you need to make sure that you also move all of the dependent resources. To get a list with the resource ID of each of these resources, use the [Get-AzResource](https://docs.microsoft.com/powershell/module/az.resources/get-azresource) cmdlet.

```azurepowershell-interactive
 Get-AzResource -ResourceGroupName myResourceGroup | Format-table -wrap -Property ResourceId
```

You can use the output of the previous command to create a comma-separated list of resource IDs to [Move-AzResource](https://docs.microsoft.com/powershell/module/az.resources/move-azresource) to move each resource to the destination.

```azurepowershell-interactive
Move-AzResource -DestinationResourceGroupName "myDestinationResourceGroup" `
    -ResourceId <myResourceId,myResourceId,myResourceId>
```

To move the resources to different subscription, include the **-DestinationSubscriptionId** parameter.

```azurepowershell-interactive
Move-AzResource -DestinationSubscriptionId "<myDestinationSubscriptionID>" `
    -DestinationResourceGroupName "<myDestinationResourceGroup>" `
    -ResourceId <myResourceId,myResourceId,myResourceId>
```


When you are asked to confirm that you want to move the specified resources, enter **Y** to confirm.

## Next steps
You can move many different types of resources between resource groups and subscriptions. For more information, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).    
