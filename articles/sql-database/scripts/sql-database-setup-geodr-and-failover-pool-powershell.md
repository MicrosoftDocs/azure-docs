---
title: Azure PowerShell Script-Set up geo-replication-pooled SQL database | Microsoft Docs
description: Azure PowerShell Script Sample - Set up Active Geo-Replication for a pooled Azure SQL database using PowerShell
services: sql-database
documentationcenter: sql-database
author: janeng
manager: jstrauss
editor: carlrab
tags: azure-service-management

ms.assetid:
ms.service: sql-database
ms.custom: sample
ms.devlang: PowerShell
ms.topic: article
ms.tgt_pltfrm: sql-database
ms.workload: database
ms.date: 03/07/2017
ms.author: janeng
---

# Configure Active Geo-Replication for a pooled Azure SQL database using PowerShell

This sample PowerShell script configures Active Geo-Replication for a database in an elastic pool and fails it over to the secondary replica.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Sample Scripts

[!code-powershell[main](../../../powershell_scripts/sql-database/setup-geodr-and-failover-pool/setup-geodr-and-failover-pool.ps1 "Set up Active Geo-Replication for elastic pool")]

## Clean up deployment

After the script sample has been run, the following command can be used to remove the resource group and all resources associated with it.

```powershell
Remove-AzureRmResourceGroup -ResourceGroupName "myPrimaryResourceGroup"
Remove-AzureRmResourceGroup -ResourceGroupName "mySecondaryResourceGroup"
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/resourcemanager/azurerm.resources/v3.5.0/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmSqlServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/new-azurermsqlserver) | Creates a logical server that hosts a database or elastic pool. |
| [New-AzureRmSqlElasticPool](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/new-azurermsqlelasticpool) | Creates an elastic pool within a logical server. |
| [New-AzureRmSqlDatabase](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/new-azurermsqldatabase) | Creates a database in a logical server as a single or a pooled database. |
| [Set-AzureRmSqlDatabase](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/set-azurermsqldatabase) | Updates database properties or moves a database into, out of, or between elastic pools. |
| [New-AzureRmSqlDatabaseSecondary](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/new-azurermsqldatabasesecondary)| Creates a secondary database for an existing database and starts data replication. |
| [Get-AzureRmSqlDatabase](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/get-azurermsqldatabase)| Gets one or more databases. |
| [Set-AzureRmSqlDatabaseSecondary](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/set-azurermsqldatabasesecondary)| Switches a secondary database to be primary in order to initiate failover.|
| [Get-AzureRmSqlDatabaseReplicationLink](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/get-azurermsqldatabasereplicationlink) | Gets the geo-replication links between an Azure SQL Database and a resource group or SQL Server. |
| [Remove-AzureRmResourceGroup](https://docs.microsoft.com/powershell/resourcemanager/azurerm.resources/v3.5.0/remove-azurermresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
