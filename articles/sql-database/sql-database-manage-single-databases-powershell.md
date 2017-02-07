---
title: 'PowerShell: Create and manage single Azure SQL databases | Microsoft Docs'
description: Quick reference on how to create and manage single Azure SQL database using the Azure portal
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: single databases
ms.devlang: NA
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA
ms.date: 02/06/2017
ms.author: carlrab

---
# Create and manage single Azure SQL databases with PowerShell

You can create and manage single Azure SQL databases using the [Azure portal](https://portal.azure.com/), PowerShell, Transact-SQL, the REST API, or C#. This topic is about using PowerShell. For the Azure portal, see [Create and manage single databases with the Azure portal](sql-database-manage-single-databases-powershell.md). For Transact-SQL, see [Create and manage single databases with Transact-SQL](sql-database-manage-single-databases-tsql.md). 

[!INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]

## Create an Azure SQL database using PowerShell

To create a SQL database, use the [New-AzureRmSqlDatabase](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.3.0/new-azurermsqldatabase) cmdlet. The resource group, and server must already exist in your subscription. 

```
$resourceGroupName = "resourcegroup1"
$sqlServerName = "server1"

$databaseName = "database1"
$databaseEdition = "Standard"
$databaseServiceLevel = "S0"

$currentDatabase = New-AzureRmSqlDatabase -ResourceGroupName $resourceGroupName `
 -ServerName $sqlServerName -DatabaseName $databaseName `
 -Edition $databaseEdition -RequestedServiceObjectiveName $databaseServiceLevel
```

> [!TIP]
> For a sample script, see [Create a SQL database PowerShell script](sql-database-get-started-powershell.md).
>

## Change the service tier and performance level of a single database

Run the [Set-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619433\(v=azure.300\).aspx) cmdlet and set the **-RequestedServiceObjectiveName** to the performance level of the desired pricing tier; for example, *S0*, *S1*, *S2*, *S3*, *P1*, *P2*, ...

Replace ```{variables}``` with your values (do not include the curly braces).

```
$SubscriptionId = "{4cac86b0-1e56-bbbb-aaaa-000000000000}"

$ResourceGroupName = "{resourceGroup}"
$Location = "{AzureRegion}"

$ServerName = "{server}"
$DatabaseName = "{database}"

$NewEdition = "{Standard}"
$NewPricingTier = "{S2}"

Add-AzureRmAccount
Set-AzureRmContext -SubscriptionId $SubscriptionId

Set-AzureRmSqlDatabase -DatabaseName $DatabaseName -ServerName $ServerName -ResourceGroupName $ResourceGroupName -Edition $NewEdition -RequestedServiceObjectiveName $NewPricingTier
```

## Next steps
* For an overview of management tools, see [Overview of management tools](sql-database-manage-overview.md).
* To see how to perform management tasks using the Azure portal, see [Manage Azure SQL Databases using the Azure portal](sql-database-manage-portal.md).
* To see how to perform management tasks using PowerShell, see [Manage Azure SQL Databases using PowerShell](sql-database-manage-powershell.md).
* To see how to perform management tasks using SQL Server Management Studio, see [SQL Server Management Studio](sql-database-manage-azure-ssms.md).
* For information about the SQL Database service, see [What is SQL Database](sql-database-technical-overview.md). 
* For information about Azure Database servers and database features, see [Features](sql-database-features.md).
