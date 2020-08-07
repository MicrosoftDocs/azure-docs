---
title: "PowerShell: Create a managed instance"
titleSuffix: Azure SQL Managed Instance 
description: This article provides an Azure PowerShell example script to create a managed instance. 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: 
ms.devlang: PowerShell
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 03/25/2019
---
# Use PowerShell to create a managed instance

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqlmi.md)]

This PowerShell script example creates a managed instance in a dedicated subnet within a new virtual network. It also configures a route table and a network security group for the virtual network. Once the script has been successfully run, the managed instance can be accessed from within the virtual network or from an on-premises environment. See [Configure Azure VM to connect to Azure SQL Database Managed Instance](../connect-vm-instance-configure.md) and [Configure a point-to-site connection to Azure SQL Managed Instance from on-premises](../point-to-site-p2s-configure.md).

> [!IMPORTANT]
> For limitations, see [supported regions](../resource-limits.md#supported-regions) and [supported subscription types](../resource-limits.md#supported-subscription-types).

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!code-powershell-interactive[main](../../../../powershell_scripts/sql-database/managed-instance/create-and-configure-managed-instance.ps1 "Create managed instance")]

## Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

## Script explanation

This script uses some of the following commands. For more information about used and other commands in the table below, click on the links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored.
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates a virtual network. |
| [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/Add-AzVirtualNetworkSubnetConfig) | Adds a subnet configuration to a virtual network. |
| [Get-AzVirtualNetwork](/powershell/module/az.network/Get-AzVirtualNetwork) | Gets a virtual network in a resource group. |
| [Set-AzVirtualNetwork](/powershell/module/az.network/Set-AzVirtualNetwork) | Sets the goal state for a virtual network. |
| [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/Get-AzVirtualNetworkSubnetConfig) | Gets a subnet in a virtual network. |
| [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/Set-AzVirtualNetworkSubnetConfig) | Configures the goal state for a subnet configuration in a virtual network. |
| [New-AzRouteTable](/powershell/module/az.network/New-AzRouteTable) | Creates a route table. |
| [Get-AzRouteTable](/powershell/module/az.network/Get-AzRouteTable) | Gets route tables. |
| [Set-AzRouteTable](/powershell/module/az.network/Set-AzRouteTable) | Sets the goal state for a route table. |
| [New-AzSqlInstance](/powershell/module/az.sql/New-AzSqlInstance) | Creates a managed instance. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group, including all nested resources. |
|||

## Next steps

For more information on Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional PowerShell script samples for Azure SQL Managed Instance can be found in [Azure SQL Managed Instance PowerShell scripts](../../database/powershell-script-content-guide.md).
