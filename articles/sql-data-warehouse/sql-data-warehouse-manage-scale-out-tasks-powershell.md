<properties
   pageTitle="Scale out performance or pause and resume compute resources in Azure SQL Data Warehouse | Microsoft Azure"
   description="Powershell tasks to scale out performance for Azure SQL Data Warehouse. Change compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="04/26/2016"
   ms.author="barbkess;sonyama"/>

# Scale out performance or pause and resume compute resources in Azure SQL Data Warehouse

> [AZURE.SELECTOR]
- [Azure portal](sql-data-warehouse-manage-scale-out-tasks.md)
- [PowerShell](sql-data-warehouse-manage-scale-out-tasks-powershell.md)


Elastically scale out compute resources and memory to meet the changing demands of your workload, and save costs by scaling back resources during non-peak times. 

This collection of tasks uses PowerShell cmdlets to:

- Scale performance by adjusting DWUs
- Pause compute resources
- Resume compute resources


For scale-out capabilities and recommendations, see [Scalable performance overview][].

## Before you begin

### Install the latest version of Azure PowerShell

> [AZURE.NOTE]  To use Azure PowerShell with SQL Data Warehouse, you need Azure PowerShell version 1.0.3 or greater.  To verify your current version run the command **Get-Module -ListAvailable -Name Azure**. You can install the latest version from [Microsoft Web Platform Installer][].  For more information, see [How to install and configure Azure PowerShell][].

### Get started with Azure PowerShell cmdlets

To get started:

1. Open Azure PowerShell. 
2. At the PowerShell prompt, run these commands to sign in to the Azure Resource Manager and select your subscription.

    ```PowerShell
    Login-AzureRmAccount
    Get-AzureRmSubscription
    Select-AzureRmSubscription -SubscriptionName "MySubscription"
    ```

## Task 1: Scale performance

[AZURE.INCLUDE [SQL Data Warehouse scale DWUs description](../../includes/sql-data-warehouse-scale-dwus-description.md)]

To change the DWUs, use the [Set-AzureRmSqlDatabase][] PowerShell cmdlet. The following example sets the service level objective to DW1000 for the database MySQLDW which is hosted on server MyServer. 

```Powershell
Set-AzureRmSqlDatabase -DatabaseName "MySQLDW" -ServerName "MyServer" -RequestedServiceObjectiveName "DW1000"
```


## Task 2: Pause compute

[AZURE.INCLUDE [SQL Data Warehouse pause description](../../includes/sql-data-warehouse-pause-description.md)]

To pause a database, use the [Suspend-AzureRmSqlDatabase][] cmdlet. The following example pauses a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1. 

> [AZURE.NOTE] Note that if your server is foo.database.windows.net, use "foo" as the -ServerName in the PowerShell cmdlets.

```Powershell
Suspend-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
```
A variation, this next example retrieves the database into the $database object. It then pipes the object to [Suspend-AzureRmSqlDatabase][]. The results are stored in the object resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Suspend-AzureRmSqlDatabase
$resultDatabase
```

## Task 3: Resume compute

[AZURE.INCLUDE [SQL Data Warehouse resume description](../../includes/sql-data-warehouse-resume-description.md)]

To start a database, use the [Resume-AzureRmSqlDatabase][] cmdlet. The following example starts a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1. 

```Powershell
Resume-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" -DatabaseName "Database02"
```

A variation, this next example retrieves the database into the $database object. It then pipes the object to [Resume-AzureRmSqlDatabase][] and stores the results in $resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" –ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Resume-AzureRmSqlDatabase
$resultDatabase
```

## Next steps

For other management tasks, see [Management overview][].

<!--Image references-->

<!--Article references-->
[Scalable performance overview]: ./sql-data-warehouse-overview-scalability.md
[Service capacity limits]: ./sql-data-warehouse-service-capacity-limits.md
[Management overview]: ./sql-data-warehouse-overview-manage.md

<!--MSDN references-->
[Resume-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619347.aspx
[Suspend-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619337.aspx
[Set-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619433.aspx


<!--Other Web references-->

[Azure portal]: http://portal.azure.com/
