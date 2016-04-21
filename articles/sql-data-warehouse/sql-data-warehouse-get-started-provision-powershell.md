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
   ms.date="04/20/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Create SQL Data Warehouse using Powershell

> [AZURE.SELECTOR]
- [Azure Portal](sql-data-warehouse-get-started-provision.md)
- [TSQL](sql-data-warehouse-get-started-create-database-tsql.md)
- [PowerShell](sql-data-warehouse-get-started-provision-powershell.md)

### Prerequisites
Before starting, be sure you have the following prerequisites.

- A V12 Azure SQL Server to host the database
- Know the resource group name for the SQL Server

For more details on the above prerequisites, see **Configure and create a server** in the article [how to create a SQL Data Warehouse from the Azure Portal][].

> [AZURE.NOTE]  In order to use Azure PowerShell with SQL Data Warehouse, you will need to install Azure PowerShell version 1.0.3 or greater.  You can check your version by running **Get-Module -ListAvailable -Name Azure**.  The latest version can be installed from  [Microsoft Web Platform Installer][].  For more information on installing the latest version, see [How to install and configure Azure PowerShell][].

## Creating a SQL Data Warehouse database
1. Open Windows PowerShell.
2. Run this cmdlet to login to Azure Resource Manager.

	```Powershell
	Login-AzureRmAccount
	```
	
3. Select the subscription you want to use for your current session.

	```Powershell
	Get-AzureRmSubscription	-SubscriptionName "MySubscription" | Select-AzureRmSubscription
	```

4.  Create database. This example creates a new database named "mynewsqldw", with service objective level "DW400", to the server named "sqldwserver1" which is in the resource group named "mywesteuroperesgp1".  **NOTE: Creating a new SQL Data Warehouse database may result in a new billable charges.  See [SQL Data Warehouse pricing][] for more details on pricing.**

	```Powershell
	New-AzureRmSqlDatabase -RequestedServiceObjectiveName "DW400" -DatabaseName "mynewsqldw" -ServerName "sqldwserver1" -ResourceGroupName "mywesteuroperesgp1" -Edition "DataWarehouse"
	```

The parameters required for this cmdlet are:

- **RequestedServiceObjectiveName**: The amount of DWU you are requesting, in the form "DWXXX". DWU represents an allocation of CPU and memory.  Each DWU value represents a linear increase in these resources.  Currently supported values are: 100, 200, 300, 400, 500, 600, 1000, 1200, 1500, 2000.
- **DatabaseName**: The name of the SQL Data Warehouse that you are creating.
- **ServerName**: The name of the server that you are using for creation (must be V12).
- **ResourceGroupName**: Resource group you are using.  To find available resource groups in your subscription use Get-AzureResource.
- **Edition**: You must set edition to "DataWarehouse" to create a SQL Data Warehouse.

For more details on the parameter options, see [Create Database (Azure SQL Data Warehouse)][].
For the command reference, see [New-AzureRmSqlDatabase][]

## Next steps
After your SQL Data Warehouse has finished provisioning you may want to try [loading sample data][] or check out how to [develop][], [load][], or [migrate][].

If you're interested in more on how to manage SQL Data Warehouse programmatically, check out our article on how to use [PowerShell cmdlets and REST APIs][].

<!--Image references-->

<!--Article references-->
[migrate]: sql-data-warehouse-overview-migrate.md
[develop]: sql-data-warehouse-overview-develop.md
[load]: sql-data-warehouse-load-with-bcp.md
[loading sample data]: sql-data-warehouse-get-started-manually-load-samples.md
[PowerShell cmdlets and REST APIs]: sql-data-warehouse-reference-powershell-cmdlets.md
[firewall rules]: sql-database-configure-firewall-settings.md
[How to install and configure Azure PowerShell]: powershell-install-configure.md
[how to create a SQL Data Warehouse from the Azure Portal]: sql-data-warehouse-get-started-provision.md

<!--MSDN references--> 
[MSDN]:https://msdn.microsoft.com/library/azure/dn546722.aspx
[New-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619339.aspx
[Create Database (Azure SQL Data Warehouse)]: https://msdn.microsoft.com/library/mt204021.aspx

<!--Other Web references-->
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
[SQL Data Warehouse pricing]: https://azure.microsoft.com/pricing/details/sql-data-warehouse/
 
