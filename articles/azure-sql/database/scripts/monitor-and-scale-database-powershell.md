---
title: Use PowerShell to monitor and scale a single database in Azure SQL Database 
description: Use an Azure PowerShell example script to monitor and scale a single database in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: sqldbrb=1
ms.devlang: PowerShell
ms.topic: sample
author: juliemsft
ms.author: jrasnick
ms.reviewer: carlrab
ms.date: 03/12/2019
---

# Use PowerShell to monitor and scale a single database in Azure SQL Database

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This PowerShell script example monitors the performance metrics of a single database, scales it to a higher compute size, and creates an alert rule on one of the performance metrics.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Az PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!code-powershell-interactive[main](../../../../powershell_scripts/sql-database/monitor-and-scale-database/monitor-and-scale-database.ps1?highlight=15-16 "Monitor and scale single database")]

> [!NOTE]
> For a full list of metrics, see [metrics supported](../../../azure-monitor/platform/metrics-supported.md#microsoftsqlserversdatabases).
> [!TIP]
> Use [Get-AzSqlDatabaseActivity](/powershell/module/az.sql/get-azsqldatabaseactivity) to get the status of database operations and use [Stop-AzSqlDatabaseActivity](/powershell/module/az.sql/stop-azsqldatabaseactivity) to cancel a database update operation.

## Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

## Script explanation

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) | Creates a server that hosts a single database or elastic pool. |
| [Get-AzMetric](/powershell/module/az.monitor/get-azmetric) | Shows the size usage information for the database.|
| [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) | Updates database properties or moves the database into, out of, or between elastic pools. |
| [Add-AzMetricAlertRule](/powershell/module/az.monitor/add-azmetricalertrule) | Sets an alert rule to automatically monitor metrics in the future. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional PowerShell script samples can be found in [Azure PowerShell scripts](../powershell-script-content-guide.md).
