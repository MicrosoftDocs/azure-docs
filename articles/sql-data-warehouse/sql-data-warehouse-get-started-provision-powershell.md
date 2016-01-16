<properties
   pageTitle="Create SQL Data Warehouse by using Powershell | Microsoft Azure"
   description="Create SQL Data Warehouse by using Powershell"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="01/11/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Create SQL Data Warehouse using Powershell

> [AZURE.SELECTOR]
- [Azure Portal](sql-data-warehouse-get-started-provision.md)
- [TSQL](sql-data-warehouse-get-started-create-database-tsql.md)
- [PowerShell](sql-data-warehouse-get-started-provision-powershell.md)

> [AZURE.NOTE]  In order to use Microsoft Azure Powershell with SQL Data Warehouse, you will need version 1.0 or greater.  You can check your version by running (Get-Module Azure).Version in PowerShell.

## Get and run the Azure PowerShell cmdlets
If you're not already set-up with PowerShell, you need to download and configure it.

1. To download the Azure PowerShell module, run [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409).
2. To run the module, at the start window type **Microsoft Azure PowerShell**.
3. If you have not already added your account to the machine, then run the following cmdlet. (For more information, see [How to install and configure Azure PowerShell][]):

```
Add-AzureAccount
```

4. Select the subscription you want to use.This example gets the list of subscription names. Then it sets the subscription name to "MySubscription". 

```
Get-AzureRmSubscription
Select-AzureRmSubscription -SubscriptionName "MySubscription"
```
   
## Creating SQL Data Warehouse
After PowerShell is configured for your account you can run the following to deploy a new database in SQL Data Warehouse.

```
New-AzureSqlDatabase -RequestedServiceObjectiveName "<Service Objective>" -DatabaseName "<Data Warehouse Name>" -ServerName "<Server Name>" -ResourceGroupName "<ResourceGroupName>" -Edition "DataWarehouse"
```

The necessary parameters for this cmdlet are as follows:

 + **RequestedServiceObjectiveName**: The amount of DWU you are requesting, in the form "DWXXX" currently supported values are: 100, 200, 300, 400, 500, 600, 1000, 1200, 1500, 2000.
 + **DatabaseName**: The name of the SQL Data Warehouse that you are creating.
 + **ServerName**: The name of the server that you are using for creation (must be V12).
 + **ResourceGroupName**: Resource group you are using.  To find available resource groups in your subscription use Get-AzureResource.
 + **Edition**: You must set edition to "DataWarehouse" to create a SQL Data Warehouse. 

For the command reference, see [New-AzureSqlDatabase](https://msdn.microsoft.com/library/mt619339.aspx)

For the parameter options, see [Create Database (Azure SQL Data Warehouse)](https://msdn.microsoft.com/library/mt204021.aspx).

## Next steps
After your SQL Data Warehouse has finished provisioning you can [load sample data][] or check out how to [develop][], [load][], or [migrate][].

If you're interested in more on how to manage SQL Data Warehouse programmatically, check out our [Powershell][] or [REST API][] documentation.



<!--Image references-->

<!--Article references-->
[migrate]: ./sql-data-warehouse-overview-migrate.md
[develop]: ./sql-data-warehouse-overview-develop/.md
[load sample data]: ./sql-data-warehouse-get-started-manually-load-samples.md
[Powershell]: ./sql-data-warehouse-reference-powershell-cmdlets.md
[REST API]: https://msdn.microsoft.com/library/azure/dn505719.aspx
[MSDN]:https://msdn.microsoft.com/library/azure/dn546722.aspx
[firewall rules]: ../sql-database/sql-database-configure-firewall-settings.md
[How to install and configure Azure PowerShell]: ./powershell-install-configure.md
