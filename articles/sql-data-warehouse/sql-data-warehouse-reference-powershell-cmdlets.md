<properties
   pageTitle="Using PowerShell cmdlets and REST APIs with SQL Data Warehouse"
   description="Suspend and restart SQL Data Warehouse using PowerShell cmdlets"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyama"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="03/31/2016"
   ms.author="barbkess;mausher;sonyama"/>

# Using PowerShell cmdlets and REST APIs with SQL Data Warehouse

SQL Data Warehouse can be managed using either Azure PowerShell cmdlets or REST APIs.

The commands defined for **Azure SQL Database** are also used for **SQL Data Warehouse**. For a current list, see [Azure SQL Cmdlets](https://msdn.microsoft.com/library/mt574084.aspx). The cmdlets [Suspend-AzureRmSqlDatabase][] and [Resume-AzureRmSqlDatabase][] are additions designed for SQL Data Warehouse.

Similarly, the REST APIs for **SQL Azure Database** can also be used for **SQL Data Warehouse** instances. For the current list, see [Operations for Azure SQL Databases](https://msdn.microsoft.com/library/azure/dn505719.aspx).

## Get and run the Azure PowerShell cmdlets

1. To download the Azure PowerShell module, run [Microsoft Web Platform Installer](http://aka.ms/webpi-azps).  For more information on this installer, see [How to install and configure Azure PowerShell][].
2. To run the module, at the start window type **Windows PowerShell**.
3. Run this Login-AzureRmAccount to login to Azure Resource Manager.

```PowerShell
Login-AzureRmAccount
```

3. Select your subscription for the database you want to suspend or resume. This selects the subscription named "MySubscription".

```Powershell
Select-AzureRmSubscription -SubscriptionName "MySubscription"
```

## List of PowerShell cmdlets

The following PowerShell cmdlets are available to use with Azure SQL Data Warehouse:

- [New-AzureRmSqlDatabase][]
- [Get-AzureRmSqlDatabase][]
- [Set-AzureRmSqlDatabase][]
- [Remove-AzureRmSqlDatabase][]
- [Suspend-AzureRmSqlDatabase][]
- [Resume-AzureRmSqlDatabase][]
- [Get-AzureRmSqlDatabaseRestorePoints][]

## Suspend-AzureRmSqlDatabase

For the command reference, see [Suspend-AzureRmSqlDatabase][].

### Example 1: Pause a database by name on a server

This example pauses a database named "Database02" hosted on a server named "Server01." The server is in an Azure resource group named "ResourceGroup1."

```Powershell
Suspend-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
```

### Example 2: Pause a database object

This example retrieves a database named "Database02" from a server named "Server01" contained in a resource group named "ResourceGroup1." It pipes the retrieved object to [Suspend-AzureRmSqlDatabase][]. As a result, the database is paused. The final command shows the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Suspend-AzureRmSqlDatabase
$resultDatabase
```

## Resume-AzureRmSqlDatabase

For the command reference, see [Resume-AzureRmSqlDatabase][]

### Example 1: Resuming a database by name on a server

This example resumes operation of a database named "Database02" hosted on a server named "Server01." The server is contained in a resource group named "ResourceGroup1."

```Powershell
Resume-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" -DatabaseName "Database02"
```

### Example 2: Resuming a database object

This example retrieves a database named "Database02" from a server named "Server01" that is contained in a resource group named "ResourceGroup1." The object is piped to [Resume-AzureRmSqlDatabase][].

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Resume-AzureRmSqlDatabase
```

## Get-AzureRmSqlDatabaseRestorePoints

This cmdlet lists the backup restore points for an Azure SQL Data Warehouse database. The restore points are used to restore the database.
The properties for the returned object are as follows.

Property|Description
---|---
RestorePointType|DISCRETE / CONTINUOUS. Discrete restore points describe the possible point-in-times that an Azure SQL Data Warehouse database can be restored to. Continuous restore points describe the earliest possible point-in-times that an Azure SQL database can be restored to. The database can be restored to any point-in-time after the earliest point.
EarliestRestoreDate|Earliest Restore Time (Populated when restorePointType = CONTINUOUS)
RestorePointCreationDate |Backup Snapshot Time (Populated when restorePointType = DISCRETE)

### Example 1: Retrieving a database’s restore points by name on a server
This example retrieves the restore points for a database named "Database02" from a server named "Server01," contained in a resource group named "ResourceGroup1."

```Powershell
$restorePoints = Get-AzureRmSqlDatabaseRestorePoints –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$restorePoints
```


### Example 2: Resuming a database object

This example retrieves a database named "Database02" from a server named "Server01," contained in a resource group named "ResourceGroup1." The database object is piped to [Get-AzureRmSqlDatabase][], and the result is the database’s restore points. The final command prints the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$restorePoints = $database | Get-AzureRmSqlDatabaseRestorePoints
$retorePoints
```


> [AZURE.NOTE] Note that if your server is foo.database.windows.net, use "foo" as the -ServerName in the PowerShell cmdlets.


## Next steps
For more reference information, see [SQL Data Warehouse reference overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse reference overview]: sql-data-warehouse-overview-reference.md
[How to install and configure Azure PowerShell]: ../articles/powershell-install-configure.md

<!--MSDN references-->
[New-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619339.aspx
[Get-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt603648.aspx
[Set-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619433.aspx
[Remove-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619368.aspx
[Suspend-AzureRmSqlDatabase]: http://msdn.microsoft.com/library/mt619337.aspx
[Resume-AzureRmSqlDatabase]: http://msdn.microsoft.com/library/mt619347.aspx
[Get-AzureRmSqlDatabaseRestorePoints]: https://msdn.microsoft.com/library/mt603642.aspx

<!--Other Web references-->
