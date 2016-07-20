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
   ms.date="07/20/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Create SQL Data Warehouse using Powershell

> [AZURE.SELECTOR]
- [Azure Portal](sql-data-warehouse-get-started-provision.md)
- [TSQL](sql-data-warehouse-get-started-create-database-tsql.md)
- [PowerShell](sql-data-warehouse-get-started-provision-powershell.md)

## Prerequisites

Before starting, be sure you have met the following prerequisites.

- **Create Azure Account**: See [Azure Free Trial][] or [MSDN Azure Credits][].
- **Create Azure SQL server**:  See [Create an Azure SQL Database logical server with the Azure Portal][] or 
[Create an Azure SQL Database logical server with PowerShell][].
- **Resource group name**: Either use the same Resource Group as your Azure SQL server or see [resource groups][] to create a new resource group.
- **PowerShell version 1.0.3 or greater**:  You can check your version by running **Get-Module -ListAvailable -Name Azure**.  The latest version can be installed from  [Microsoft Web Platform Installer][].  For more information on installing the latest version, see [How to install and configure Azure PowerShell][].

> [AZURE.NOTE] Creating a new SQL Data Warehouse may result in a new billable service.  See [SQL Data Warehouse pricing][] for more details on pricing.

## Create a SQL Data Warehouse

1. Open Windows PowerShell.
2. Run this cmdlet to login to Azure Resource Manager.

	```Powershell
	Login-AzureRmAccount
	```
	
3. Select the subscription you want to use for your current session.

	```Powershell
	Get-AzureRmSubscription	-SubscriptionName "MySubscription" | Select-AzureRmSubscription
	```

4.  Create database. This example creates a new database named "mynewsqldw", with service objective level "DW400", to the server named "sqldwserver1" which is in the resource group named "mywesteuroperesgp1".

	```Powershell
	New-AzureRmSqlDatabase -RequestedServiceObjectiveName "DW400" -DatabaseName "mynewsqldw" -ServerName "sqldwserver1" -ResourceGroupName "mywesteuroperesgp1" -Edition "DataWarehouse"
	```

The parameters required for this cmdlet are:

- **RequestedServiceObjectiveName**: The amount of [DWU][] you are requesting.  Supported values are: DW100, DW200, DW300, DW400, DW500, DW600, DW1000, DW1200, DW1500, DW2000, DW3000 and DW6000.
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
[DWU]: ./sql-data-warehouse-overview-what-is.md#data-warehouse-units
[migrate]: ./sql-data-warehouse-overview-migrate.md
[develop]: ./sql-data-warehouse-overview-develop.md
[load]: ./sql-data-warehouse-load-with-bcp.md
[loading sample data]: ./sql-data-warehouse-get-started-load-sample-databases.md
[PowerShell cmdlets and REST APIs]: ./sql-data-warehouse-reference-powershell-cmdlets.md
[firewall rules]: ../sql-database-configure-firewall-settings.md

[How to install and configure Azure PowerShell]: ../powershell/powershell-install-configure.md
[how to create a SQL Data Warehouse from the Azure Portal]: ./sql-data-warehouse-get-started-provision.md
[Create an Azure SQL Database logical server with the Azure Portal]: ../sql-database/sql-database-get-started.md#create-an-azure-sql-database-logical-server
[Create an Azure SQL Database logical server with PowerShell]: ../sql-database/sql-database-get-started-powershell.md#database-setup-create-a-resource-group-server-and-firewall-rule
[resource groups]: ../resource-group-template-deploy-portal.md

<!--MSDN references--> 
[MSDN]: https://msdn.microsoft.com/library/azure/dn546722.aspx
[New-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619339.aspx
[Create Database (Azure SQL Data Warehouse)]: https://msdn.microsoft.com/library/mt204021.aspx

<!--Other Web references-->
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
[SQL Data Warehouse pricing]: https://azure.microsoft.com/pricing/details/sql-data-warehouse/
[Azure Free Trial]: https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F
[MSDN Azure Credits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F
