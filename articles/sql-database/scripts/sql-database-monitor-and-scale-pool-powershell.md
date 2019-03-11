---
title: PowerShell example-monitor-scale-elastic pool-Azure SQL Database | Microsoft Docs
description: Azure PowerShell example script to monitor and scale an elastic pool in Azure SQL Database
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: 
ms.devlang: PowerShell
ms.topic: sample
author: juliemsft
ms.author: jrasnick
ms.reviewer: carlrab
manager: craigg
ms.date: 03/04/2019
---
# Use PowerShell to monitor and scale an elastic pool in Azure SQL Database

This PowerShell script example monitors the performance metrics of an elastic pool, scales it to a higher compute size, and creates an alert rule on one of the performance metrics.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!code-powershell-interactive[main](../../../powershell_scripts/sql-database/monitor-and-scale-pool/monitor-and-scale-pool.ps1?highlight=17-18 "Monitor and scale a single SQL Database")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
 [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) | Creates a SQL Database server that hosts a single database or elastic pool. |
| [New-AzSqlElasticPool](/powershell/module/az.sql/new-azsqlelasticpool) | Creates an elastic pool. |
| [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) | Creates a single database or database in an elastic pool. |
| [Get-AzMetric](/powershell/module/az.insights/get-azmetric) | Shows the size usage information for the database.|
| [Add-AzMetricAlertRule](/powershell/module/az.insights/add-azmetricalertrule) | Adds or updates a metric-based alert rule. |
| [Set-AzSqlElasticPool](/powershell/module/az.sql/set-azsqlelasticpool) | Updates elastic pool properties |
| [Add-AzMetricAlertRule](/powershell/module/az.insights/add-azmetricalertrule) | Sets an alert rule to automatically monitor DTUs in the future. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
