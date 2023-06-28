---
title: 'Quickstart: Create and configure Azure DDoS Network Protection - Azure PowerShell'
description: Learn how to create a DDoS Protection Plan using Azure PowerShell
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: quickstart
ms.workload: infrastructure-services
ms.date: 05/23/2023
ms.author: abell 
ms.custom: devx-track-azurepowershell, mode-api, ignite-2022
---
# QuickStart: Create and configure Azure DDoS Network Protection using Azure PowerShell

Get started with Azure DDoS Network Protection by using Azure PowerShell.

A DDoS protection plan defines a set of virtual networks that have DDoS Network Protection enabled, across subscriptions. You can configure one DDoS protection plan for your organization and link virtual networks from multiple subscriptions to the same plan.

In this QuickStart, you'll create a DDoS protection plan and link it to a virtual network.

:::image type="content" source="./media/manage-ddos-protection/ddos-network-protection-diagram-simple.png" alt-text="Diagram of DDoS Network Protection.":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a DDoS Protection plan

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

To create a resource group, use [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). In this example, we'll name our resource group _MyResourceGroup_ and use the _East US_ location:

```azurepowershell-interactive
New-AzResourceGroup -Name MyResourceGroup -Location "East US"
```

Now create a DDoS protection plan named _MyDdosProtectionPlan_:

```azurepowershell-interactive
New-AzDdosProtectionPlan -ResourceGroupName MyResourceGroup -Name MyDdosProtectionPlan -Location "East US"
```

## Enable DDoS for a virtual network

### Enable DDoS for a new virtual network

You can enable DDoS protection when creating a virtual network. In this example, we'll name our virtual network _MyVnet_:

```azurepowershell-interactive
#Gets the DDoS protection plan ID
$ddosProtectionPlanID = Get-AzDdosProtectionPlan -ResourceGroupName MyResourceGroup -Name MyDdosProtectionPlan

#Creates the virtual network
New-AzVirtualNetwork -Name MyVnet -ResourceGroupName MyResourceGroup -Location "East US" -AddressPrefix 10.0.0.0/16 -DdosProtectionPlan $ddosProtectionPlanID.Id -EnableDdosProtection  
```

### Enable DDoS for an existing virtual network

You can associate an existing virtual network when creating a DDoS protection plan:

```azurepowershell-interactive
#Gets the DDoS protection plan ID
$ddosProtectionPlanID = Get-AzDdosProtectionPlan -ResourceGroupName MyResourceGroup -Name MyDdosProtectionPlan

# Gets the most updated version of the virtual network
$vnet = Get-AzVirtualNetwork -Name MyVnet -ResourceGroupName MyResourceGroup
$vnet.DdosProtectionPlan = New-Object Microsoft.Azure.Commands.Network.Models.PSResourceId

# Update the properties and enable DDoS protection
$vnet.DdosProtectionPlan.Id = $ddosProtectionPlanID.Id
$vnet.EnableDdosProtection = $true
$vnet | Set-AzVirtualNetwork
```
### Disable DDoS for a virtual network

To disable DDoS protection for a virtual network:

```azurepowershell-interactive
# Gets the most updated version of the virtual network
$vnet = Get-AzVirtualNetwork -Name MyVnet -ResourceGroupName MyResourceGroup
$vnet.DdosProtectionPlan = $null
$vnet.EnableDdosProtection = $false
$vnet | Set-AzVirtualNetwork
```

## Validate and test

Check the details of your DDoS protection plan and verify that the command returns the correct details of your DDoS protection plan.

```azurepowershell-interactive
Get-AzDdosProtectionPlan -ResourceGroupName MyResourceGroup -Name MyDdosProtectionPlan
```

Check the details of your vNet and verify the DDoS protection plan is enabled.

```azurepowershell-interactive
Get-AzVirtualNetwork -Name MyVnet -ResourceGroupName MyResourceGroup
```

## Clean up resources

You can keep your resources for the next tutorial. If no longer needed, delete the _MyResourceGroup_ resource group. When you delete the resource group, you also delete the DDoS protection plan and all its related resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```

> [!NOTE]
> If you want to delete a DDoS protection plan, you must first dissociate all virtual networks from it.

## Next steps

To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)
