<properties
   pageTitle="PowerShell cmdlets for Azure SQL Data Warehouse"
   description="Find the top PowerShell cmdlets for Azure SQL Data Warehouse including how to pause and resume a database."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/18/2016"
   ms.author="sonyama;barbkess;mausher"/>

# PowerShell cmdlets and REST APIs for SQL Data Warehouse

Many SQL Data Warehouse administration tasks can be managed using either Azure PowerShell cmdlets or REST APIs.  Below are some examples of how to use PowerShell commands to automate common tasks in your SQL Data Warehouse.  For some good REST examples, see the article [Manage scalability with REST][].

> [AZURE.NOTE]  In order to use Azure PowerShell with SQL Data Warehouse, you will need to install Azure PowerShell version 1.0.3 or greater.  You can check your version by running **Get-Module -ListAvailable -Name Azure**.  The latest version can be installed from  [Microsoft Web Platform Installer][].  For more information on installing the latest version, see [How to install and configure Azure PowerShell][].

## Get started with Azure PowerShell cmdlets

1. Open Windows PowerShell. 
2. At the PowerShell prompt, run these commands to sign in to the Azure Resource Manager and select your subscription.

    ```PowerShell
    Login-AzureRmAccount
    Get-AzureRmSubscription
    Select-AzureRmSubscription -SubscriptionName "MySubscription"
    ```

## Pause SQL Data Warehouse Example

Pause a database named "Database02" hosted on a server named "Server01."  The server is in an Azure resource group named "ResourceGroup1." 

```Powershell
Suspend-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
```
A variation, this example pipes the retrieved object to [Suspend-AzureRmSqlDatabase][].  As a result, the database is paused. The final command shows the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Suspend-AzureRmSqlDatabase
$resultDatabase
```

## Start SQL Data Warehouse Example

Resume operation of a database named "Database02" hosted on a server named "Server01." The server is contained in a resource group named "ResourceGroup1."

```Powershell
Resume-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" -DatabaseName "Database02"
```

A variation, this example retrieves a database named "Database02" from a server named "Server01" that is contained in a resource group named "ResourceGroup1." It pipes the retrieved object to [Resume-AzureRmSqlDatabase][].

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Resume-AzureRmSqlDatabase
```

> [AZURE.NOTE] Note that if your server is foo.database.windows.net, use "foo" as the -ServerName in the PowerShell cmdlets.

## Frequently Used PowerShell cmdlets

These PowerShell cmdlets are frequently used with Azure SQL Data Warehouse.

- [Get-AzureRmSqlDatabase][]
- [Get-AzureRmSqlDeletedDatabaseBackup][]
- [Get-AzureRmSqlDatabaseRestorePoints][]
- [New-AzureRmSqlDatabase][]
- [Remove-AzureRmSqlDatabase][]
- [Restore-AzureRmSqlDatabase][] 
- [Resume-AzureRmSqlDatabase][]
- [Select-AzureRmSubscription][]
- [Set-AzureRmSqlDatabase][]
- [Suspend-AzureRmSqlDatabase][]

## Next steps
For more PowerShell examples, see:

- [Create a SQL Data Warehouse using PowerShell][]
- [Database restore][]

For a list of all tasks which can be automated with PowerShell, see [Azure SQL Database Cmdlets][].  For a list of tasks which can be automated with REST, see [Operations for Azure SQL Databases][].

<!--Image references-->

<!--Article references-->
[How to install and configure Azure PowerShell]: ./powershell-install-configure.md
[Create a SQL Data Warehouse using PowerShell]: ./sql-data-warehouse-get-started-provision-powershell.md
[Database restore]: ./sql-data-warehouse-manage-database-restore-powershell.md
[Manage scalability with REST]: ./sql-data-warehouse-manage-compute-rest-api.md

<!--MSDN references-->
[Azure SQL Database Cmdlets]: https://msdn.microsoft.com/library/mt574084.aspx
[Operations for Azure SQL Databases]: https://msdn.microsoft.com/library/azure/dn505719.aspx
[Get-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt603648.aspx
[Get-AzureRmSqlDeletedDatabaseBackup]: https://msdn.microsoft.com/library/mt693387.aspx
[Get-AzureRmSqlDatabaseRestorePoints]: https://msdn.microsoft.com/library/mt603642.aspx
[New-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619339.aspx
[Remove-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619368.aspx
[Restore-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt693390.aspx
[Resume-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619347.aspx
<!-- It appears that Select-AzureRmSubscription isn't documented, so this points to Select-AzureSubscription -->
[Select-AzureRmSubscription]: https://msdn.microsoft.com/library/dn722499.aspx
[Set-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619433.aspx
[Suspend-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619337.aspx

<!--Other Web references-->
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
