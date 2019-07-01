---
title: PowerShell example - create a managed instance in Azure SQL Database | Microsoft Docs
description: Azure PowerShell example script to create a managed instance in Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: PowerShell
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
manager: craigg
ms.date: 03/25/2019
---
# Use PowerShell to create an Azure SQL Database managed instance

This PowerShell script example creates an Azure SQL Database managed instance in a dedicated subnet within a new virtual network. It also configures a route table and a network security group for the virtual network. Once the script has been successfully run, the managed instance can be accessed from within the virtual network or from an on-premises environment. See [Configure Azure VM to connect to an Azure SQL Database Managed Instance](../sql-database-managed-instance-configure-vm.md) and [Configure a point-to-site connection to an Azure SQL Database Managed Instance from on-premises](../sql-database-managed-instance-configure-p2s.md).

> [!IMPORTANT]
> For limitations, see [supported regions](../sql-database-managed-instance-resource-limits.md#supported-regions) and [supported subscription types](../sql-database-managed-instance-resource-limits.md#supported-subscription-types).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the PowerShell locally, this tutorial requires AZ PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!code-powershell-interactive[main](../../../powershell_scripts/sql-database/managed-instance/create-and-configure-managed-instance.ps1 "Create managed instance")]

## Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored.
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates a virtual network |
| [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/Add-AzVirtualNetworkSubnetConfig) | Adds a subnet configuration to a virtual network |
| [Get-AzVirtualNetwork](/powershell/module/az.network/Get-AzVirtualNetwork) | Gets a virtual network in a resource group |
| [Set-AzVirtualNetwork](/powershell/module/az.network/Set-AzVirtualNetwork) | Sets the goal state for a virtual network |
| [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/Get-AzVirtualNetworkSubnetConfig) | Gets a subnet in a virtual network |
| [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/Set-AzVirtualNetworkSubnetConfig) | Configures the goal state for a subnet configuration in a virtual network |
| [New-AzRouteTable](/powershell/module/az.network/New-AzRouteTable) | Creates a route table |
| [Get-AzRouteTable](/powershell/module/az.network/Get-AzRouteTable) | Gets route tables |
| [Set-AzRouteTable](/powershell/module/az.network/Set-AzRouteTable) | Sets the goal state for a route table |
| [New-AzSqlInstance](/powershell/module/az.sql/New-AzSqlInstance) | Creates an Azure SQL Database managed instance |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
