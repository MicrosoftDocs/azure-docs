---
title: PowerShell example-geo-replication failover group-single Azure SQL Database | Microsoft Docs
description: Azure PowerShell example script to set up active geo-replication failover group for a single Azure SQL database and fail it over.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: PowerShell
ms.topic: sample
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 09/07/2018
---
# Use PowerShell to configure an active geo-replication failover group for a single Azure SQL database

This PowerShell script example configures an active geo-replication failover group for a single Azure SQL database and fails it over to a secondary replica of the Azure SQL database.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

## Sample scripts

[!code-powershell-interactive[main](../../../powershell_scripts/sql-database/setup-geodr-and-failover-database/setup-geodr-and-failover-database-failover-group.ps1?highlight=19-22 "Set up failover group for single database")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```powershell
Remove-AzureRmResourceGroup -ResourceGroupName $primaryresourcegroupname
Remove-AzureRmResourceGroup -ResourceGroupName $secondaryresourcegroupname
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmSqlServer](/powershell/module/azurerm.sql/new-azurermsqlserver) | Creates a logical server that hosts a database or elastic pool. |
| [New-AzureRmSqlElasticPool](/powershell/module/azurerm.sql/new-azurermsqlelasticpool) | Creates an elastic pool within a logical server. |
| [Set-AzureRmSqlDatabase](/powershell/module/azurerm.sql/set-azurermsqldatabase) | Updates database properties or moves a database into, out of, or between elastic pools. |
| [New-AzureRmSqlDatabaseSecondary](/powershell/module/azurerm.sql/new-azurermsqldatabasesecondary)| Creates a secondary database for an existing database and starts data replication. |
| [Get-AzureRmSqlDatabase](/powershell/module/azurerm.sql/get-azurermsqldatabase)| Gets one or more databases. |
| [Set-AzureRmSqlDatabaseSecondary](/powershell/module/azurerm.sql/set-azurermsqldatabasesecondary)| Switches a secondary database to be primary to initiate failover.|
| [Get-AzureRmSqlDatabaseReplicationLink](/powershell/module/azurerm.sql/get-azurermsqldatabasereplicationlink) | Gets the geo-replication links between an Azure SQL Database and a resource group or SQL Server. |
| [Remove-AzureRmSqlDatabaseSecondary](/powershell/module/azurerm.sql/remove-azurermsqldatabasesecondary) | Terminates data replication between a SQL Database and the specified secondary database. |
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Deletes a resource group including all nested resources. |
| [New-AzureRMSqlDatabaseFailoverGroup](/powershell/module/azurerm.sql/new-azurermsqldatabasefailovergroup) | Creates a new Azure SQL Database Failover Group for the specified servers. |
| [Switch-AzureRMSqlDatabaseFailoverGroup](/powershell/module/azurerm.sql/switch-azurermsqldatabasefailovergroup) | Swaps the roles of the servers in the Failover Group and switches all secondary databases to the primary role. |
| [Get-AzureRMSqlDatabaseFailoverGroup](/powershell/module/azurerm.sql/get-azurermsqldatabasefailovergroup) | Gets a specific Azure SQL Database Failover Group or lists the Failover Groups on a server. |

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
