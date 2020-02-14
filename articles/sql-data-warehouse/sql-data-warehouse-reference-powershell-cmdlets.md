---
title: PowerShell & REST APIs 
description: Find the top PowerShell cmdlets for Azure Synapse Analytics data warehouse including how to pause and resume a database.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: manage
ms.date: 04/17/2018
ms.author: kevin
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# PowerShell & REST APIs for Azure Synapse Analytics data warehouse
Many Azure Synapse Analytics data warehouse administration tasks can be managed using either Azure PowerShell cmdlets or REST APIs.  Below are some examples of how to use PowerShell commands to automate common tasks in your data warehouse.  For some good REST examples, see the article [Manage scalability with REST](sql-data-warehouse-manage-compute-rest-api.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Get started with Azure PowerShell cmdlets
1. Open Windows PowerShell.
2. At the PowerShell prompt, run these commands to sign in to the Azure Resource Manager and select your subscription.
   
    ```powershell
    Connect-AzAccount
    Get-AzSubscription
    Select-AzSubscription -SubscriptionName "MySubscription"
    ```

## Pause data warehouse example
Pause a database named "Database02" hosted on a server named "Server01."  The server is in an Azure resource group named "ResourceGroup1."

```Powershell
Suspend-AzSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
```

A variation, this example pipes the retrieved object to [Suspend-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/suspend-azsqldatabase).  As a result, the database is paused. The final command shows the results.

```Powershell
$database = Get-AzSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Suspend-AzSqlDatabase
$resultDatabase
```

## Start data warehouse example

Resume operation of a database named "Database02" hosted on a server named "Server01." The server is contained in a resource group named "ResourceGroup1."

```Powershell
Resume-AzSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" -DatabaseName "Database02"
```

A variation, this example retrieves a database named "Database02" from a server named "Server01" that is contained in a resource group named "ResourceGroup1." It pipes the retrieved object to [Resume-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/resume-azsqldatabase).

```Powershell
$database = Get-AzSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Resume-AzSqlDatabase
```

> [!NOTE]
> Note that if your server is foo.database.windows.net, use "foo" as the -ServerName in the PowerShell cmdlets.
> 
> 

## Other supported PowerShell cmdlets
These PowerShell cmdlets are supported with Azure Synapse Analytics data warehouse.

* [Get-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/get-azsqldatabase)
* [Get-AzSqlDeletedDatabaseBackup](https://docs.microsoft.com/powershell/module/az.sql/get-azsqldeleteddatabasebackup)
* [Get-AzSqlDatabaseRestorePoint](https://docs.microsoft.com/powershell/module/az.sql/get-azsqldatabaserestorepoint)
* [New-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/new-azsqldatabase)
* [Remove-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/remove-azsqldatabase)
* [Restore-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/restore-azsqldatabase)
* [Resume-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/resume-azsqldatabase)
* [Select-AzSubscription](https://msdn.microsoft.com/library/dn722499.aspx)
* [Set-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/set-azsqldatabase)
* [Suspend-AzSqlDatabase](https://docs.microsoft.com/powershell/module/az.sql/suspend-azsqldatabase)

## Next steps
For more PowerShell examples, see:

* [Create a data warehouse using PowerShell](create-data-warehouse-powershell.md)
* [Database restore](sql-data-warehouse-restore-database-powershell.md)

For other tasks that can be automated with PowerShell, see [Azure SQL Database cmdlets](https://docs.microsoft.com/powershell/module/az.sql). Not all Azure SQL Database cmdlets are supported for Azure Synapse Analytics data warehouse.  For a list of tasks that can be automated with REST, see [Operations for Azure SQL Database](/rest/api/sql/).
