---
title: Manage compute power in Azure SQL Data Warehouse (PowerShell) | Microsoft Docs
description: PowerShell tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: jhubbard
editor: ''

ms.assetid: 8354a3c1-4e04-4809-933f-db414a8c74dc
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: manage
ms.date: 10/31/2016
ms.author: elbutter;barbkess

---
# Manage compute power in Azure SQL Data Warehouse (PowerShell)
> [!div class="op_single_selector"]
> * [Overview](sql-data-warehouse-manage-compute-overview.md)
> * [Portal](sql-data-warehouse-manage-compute-portal.md)
> * [PowerShell](sql-data-warehouse-manage-compute-powershell.md)
> * [REST](sql-data-warehouse-manage-compute-rest-api.md)
> * [TSQL](sql-data-warehouse-manage-compute-tsql.md)
>
>

## Before you begin
### Install the latest version of Azure PowerShell
> [!NOTE]
> To use Azure PowerShell with SQL Data Warehouse, you need Azure PowerShell version 1.0.3 or greater.  To verify your current version run the command **Get-Module -ListAvailable -Name Azure**. You can install the latest version from [Microsoft Web Platform Installer][Microsoft Web Platform Installer].  For more information, see [How to install and configure Azure PowerShell][How to install and configure Azure PowerShell].
>
> 

### Get started with Azure PowerShell cmdlets
To get started:

1. Open Azure PowerShell.
2. At the PowerShell prompt, run these commands to sign in to the Azure Resource Manager and select your subscription.

    ```PowerShell
    Login-AzureRmAccount
    Get-AzureRmSubscription
    Select-AzureRmSubscription -SubscriptionName "MySubscription"
    ```

<a name="scale-performance-bk"></a>
<a name="scale-compute-bk"></a>

## Scale compute power
[!INCLUDE [SQL Data Warehouse scale DWUs description](../../includes/sql-data-warehouse-scale-dwus-description.md)]

To change the DWUs, use the [Set-AzureRmSqlDatabase][Set-AzureRmSqlDatabase] PowerShell cmdlet. The following example sets the service level objective to DW1000 for the database MySQLDW which is hosted on server MyServer.

```Powershell
Set-AzureRmSqlDatabase -DatabaseName "MySQLDW" -ServerName "MyServer" -RequestedServiceObjectiveName "DW1000"
```

<a name="pause-compute-bk"></a>

## Pause compute
[!INCLUDE [SQL Data Warehouse pause description](../../includes/sql-data-warehouse-pause-description.md)]

To pause a database, use the [Suspend-AzureRmSqlDatabase][Suspend-AzureRmSqlDatabase] cmdlet. The following example pauses a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1.

> [!NOTE]
> Note that if your server is foo.database.windows.net, use "foo" as the -ServerName in the PowerShell cmdlets.
>
> 

```Powershell
Suspend-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" –DatabaseName "Database02"
```
A variation, this next example retrieves the database into the $database object. It then pipes the object to [Suspend-AzureRmSqlDatabase][Suspend-AzureRmSqlDatabase]. The results are stored in the object resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Suspend-AzureRmSqlDatabase
$resultDatabase
```

<a name="resume-compute-bk"></a>

## Resume compute
[!INCLUDE [SQL Data Warehouse resume description](../../includes/sql-data-warehouse-resume-description.md)]

To start a database, use the [Resume-AzureRmSqlDatabase][Resume-AzureRmSqlDatabase] cmdlet. The following example starts a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1.

```Powershell
Resume-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" -DatabaseName "Database02"
```

A variation, this next example retrieves the database into the $database object. It then pipes the object to [Resume-AzureRmSqlDatabase][Resume-AzureRmSqlDatabase] and stores the results in $resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Resume-AzureRmSqlDatabase
$resultDatabase
```

<a name="check-database-state-bk"></a>

## Check database state

As shown in the above examples, one can use [Get-AzureRmSqlDatabase][Get-AzureRmSqlDatabase] cmdlet to get information on a database, thereby checking the status, but also to use as an argument. 

```powershell
Get-AzureRmSqlDatabase [-ResourceGroupName] <String> [-ServerName] <String> [[-DatabaseName] <String>]
 [-InformationAction <ActionPreference>] [-InformationVariable <String>] [-Confirm] [-WhatIf]
 [<CommonParameters>]
```

Which will result in something like 

```powershell	
ResourceGroupName             : nytrg
ServerName                    : nytsvr
DatabaseName                  : nytdb
Location                      : West US
DatabaseId                    : 86461aae-8e3d-4ded-9389-ac9d4bc69bbb
Edition                       : DataWarehouse
CollationName                 : SQL_Latin1General_CP1CI_AS
CatalogCollation              :
MaxSizeBytes                  : 32212254720
Status                        : Online
CreationDate                  : 10/26/2016 4:33:14 PM
CurrentServiceObjectiveId     : 620323bf-2879-4807-b30d-c2e6d7b3b3aa
CurrentServiceObjectiveName   : System2
RequestedServiceObjectiveId   : 620323bf-2879-4807-b30d-c2e6d7b3b3aa
RequestedServiceObjectiveName :
ElasticPoolName               :
EarliestRestoreDate           : 1/1/0001 12:00:00 AM
```

Where you can then check to see the *Status* of the database. In this case, you can see that this database is online. 

When you run this command, you should receive a Status value of either Online, Pausing, Resuming, Scaling, and Paused.

<a name="next-steps-bk"></a>

## Next steps
For other management tasks, see [Management overview][Management overview].

<!--Image references-->

<!--Article references-->
[Service capacity limits]: ./sql-data-warehouse-service-capacity-limits.md
[Management overview]: ./sql-data-warehouse-overview-manage.md
[How to install and configure Azure PowerShell]: /powershell/azureps-cmdlets-docs
[Manage compute overview]: ./sql-data-warehouse-manage-compute-overview.md

<!--MSDN references-->
[Resume-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619347.aspx
[Suspend-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619337.aspx
[Set-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619433.aspx
[Get-AzureRmSqlDatabase]: /powershell/servicemanagement/azure.sqldatabase/v1.6.1/get-azuresqldatabase

<!--Other Web references-->
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
[Azure portal]: http://portal.azure.com/
