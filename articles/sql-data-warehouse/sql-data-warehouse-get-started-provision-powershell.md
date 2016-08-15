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
   ms.date="03/30/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Create SQL Data Warehouse using Powershell

> [AZURE.SELECTOR]
- [Azure Portal](sql-data-warehouse-get-started-provision.md)
- [TSQL](sql-data-warehouse-get-started-create-database-tsql.md)
- [PowerShell](sql-data-warehouse-get-started-provision-powershell.md)

## Get and run the Azure PowerShell cmdlets

> [AZURE.NOTE]  In order to use Microsoft Azure Powershell with SQL Data Warehouse, you should download and install the latest version of Azure PowerShell with ARM cmdlets. You can check your version by running `Get-Module -ListAvailable -Name Azure`. This article is based on Microsoft Azure PowerShell version 1.0.3 or greater.

If you're not already set-up with PowerShell, you need to download and configure it.

1. To download the Azure PowerShell module, run [Microsoft Web Platform Installer](http://aka.ms/webpi-azps).  For more information on this installer, see [How to install and configure Azure PowerShell][].
2. To run the module, at the start window type **Windows PowerShell**.
3. Run this cmdlet to login to Azure Resource Manager.

	```Powershell
	Login-AzureRmAccount
	```

4. Select the subscription you want to use for your current session.

	```Powershell
	Get-AzureRmSubscription	-SubscriptionName "MySubscription" | Select-AzureRmSubscription
	```

## Creating a SQL Data Warehouse database
To deploy a SQL Data Warehouse, use the New-AzureRmSQLDatabase cmdlet. Before you run the command, be sure you have the following prerequisites.

### Prerequisites

- A V12 Azure SQL Server to host the database
- Know the resource group name for the SQL Server.

### Deployment command

This command will deploy a new database in SQL Data Warehouse.

```Powershell
New-AzureRmSqlDatabase -RequestedServiceObjectiveName "<Service Objective>" -DatabaseName "<Data Warehouse Name>" -ServerName "<Server Name>" -ResourceGroupName "<ResourceGroupName>" -Edition "DataWarehouse"
```

This example deploys a new database named "mynewsqldw1", with service objective  level "DW400", to the server named "sqldwserver1" which is in the resource group named "mywesteuroperesgp1".

```Powershell
New-AzureRmSqlDatabase -RequestedServiceObjectiveName "DW400" -DatabaseName "mynewsqldw1" -ServerName "sqldwserver1" -ResourceGroupName "mywesteuroperesgp1" -Edition "DataWarehouse"
```

The necessary parameters for this cmdlet are as follows:

 + **RequestedServiceObjectiveName**: The amount of DWU you are requesting, in the form "DWXXX" currently supported values are: 100, 200, 300, 400, 500, 600, 1000, 1200, 1500, 2000.
 + **DatabaseName**: The name of the SQL Data Warehouse that you are creating.
 + **ServerName**: The name of the server that you are using for creation (must be V12).
 + **ResourceGroupName**: Resource group you are using.  To find available resource groups in your subscription use Get-AzureResource.
 + **Edition**: You must set edition to "DataWarehouse" to create a SQL Data Warehouse.

For the command reference, see [New-AzureRmSqlDatabase](https://msdn.microsoft.com/library/mt619339.aspx)

For the parameter options, see [Create Database (Azure SQL Data Warehouse)](https://msdn.microsoft.com/library/mt204021.aspx).

## Next steps
After your SQL Data Warehouse has finished provisioning you can [load sample data][] or check out how to [develop][], [load][], or [migrate][].

If you're interested in more on how to manage SQL Data Warehouse programmatically, check out our [Powershell][] or [REST API][] documentation.



<!--Image references-->

<!--Article references-->
[migrate]: ./sql-data-warehouse-overview-migrate.md
[develop]: ./sql-data-warehouse-overview-develop.md
[load]: ./sql-data-warehouse-load-with-bcp.md
[load sample data]: ./sql-data-warehouse-get-started-manually-load-samples.md
[Powershell]: ./sql-data-warehouse-reference-powershell-cmdlets.md
[REST API]: https://msdn.microsoft.com/library/azure/dn505719.aspx
[MSDN]:https://msdn.microsoft.com/library/azure/dn546722.aspx
[firewall rules]: ../sql-database/sql-database-configure-firewall-settings.md
[How to install and configure Azure PowerShell]: ./powershell-install-configure.md
