---
title: "PowerShell: Restore an automatic backup of a database in SQL Database" 
description: Use an Azure PowerShell example script to restore a database in SQL Database to an earlier point in time from automatic backups.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: PowerShell
ms.topic: sample
author: mashamsft
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 03/27/2019
---

# Use PowerShell to restore a database to an earlier point in time

[!INCLUDE[appliesto-sqldb](../../includes/appliesto-sqldb.md)]

This PowerShell script example restores a database in SQL Database to a specific point in time.  

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Az PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Sample script

[!code-powershell-interactive[main](../../../../powershell_scripts/sql-database/restore-database/restore-database.ps1?highlight=17-18 "Create SQL Database")]

## Clean up deployment

Use the following command to remove  the resource group and all resources associated with it.

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

## Script explanation

This script uses the following commands. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) | Creates a server that hosts databases and elastic pools. |
| [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) | Creates a database in a server. |
| [Get-AzSqlDatabaseGeoBackup](/powershell/module/az.sql/get-azsqldatabasegeobackup) | Gets a geo-redundant backup of a standalone or pooled database. |
| [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase) | Restores a database. |
| [Remove-AzSqlDatabase](/powershell/module/az.sql/remove-azsqldatabase) | Removes a database. |
| [Get-AzSqlDeletedDatabaseBackup](/powershell/module/az.sql/get-azsqldeleteddatabasebackup) | Gets a deleted database that you can restore. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |

## Next steps

For more information on Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../powershell-script-content-guide.md).
