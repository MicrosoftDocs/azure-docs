---
title: Create SQL Data Warehouse by using PowerShell | Microsoft Docs
description: Create SQL Data Warehouse by using PowerShell
services: sql-data-warehouse
documentationcenter: NA
author: barbkess
manager: jhubbard
editor: ''

ms.assetid: 97434863-7938-4129-8949-5a119f5949e3
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: create
ms.date: 10/31/2016
ms.author: barbkess

---
# Create SQL Data Warehouse using PowerShell
> [!div class="op_single_selector"]
> * [Azure Portal](sql-data-warehouse-get-started-provision.md)
> * [TSQL](sql-data-warehouse-get-started-create-database-tsql.md)
> * [PowerShell](sql-data-warehouse-get-started-provision-powershell.md)
>
>

This article shows you how to create a SQL Data Warehouse using PowerShell.

## Prerequisites
To get started, you need:

* **Azure account**: Visit [Azure Free Trial][Azure Free Trial] or [MSDN Azure Credits][MSDN Azure Credits] to create an account.
* **Azure SQL server**:  See [Create an Azure SQL database in the Azure Portal][Create an Azure SQL database in the Azure Portal] or
  [Create an Azure SQL database with PowerShell][Create an Azure SQL database with PowerShell] for more details.
* **Resource group**: Either use the same resource group as your Azure SQL server or see [how to create a resource group](../azure-resource-manager/resource-group-portal.md).
* **PowerShell version 1.0.3 or greater**:  You can check your version by running **Get-Module -ListAvailable -Name Azure**.  The latest version can be installed from [Microsoft Web Platform Installer][Microsoft Web Platform Installer].  For more information on installing the latest version, see [How to install and configure Azure PowerShell][How to install and configure Azure PowerShell].

> [!NOTE]
> Creating a SQL Data Warehouse may result in a new billable service.  See [SQL Data Warehouse pricing][SQL Data Warehouse pricing] for more details on pricing.
>
>

## Create a SQL Data Warehouse
1. Open Windows PowerShell.
2. Run this cmdlet to login to Azure Resource Manager.

    ```Powershell
    Login-AzureRmAccount
    ```
3. Select the subscription you want to use for your current session.

    ```Powershell
    Get-AzureRmSubscription    -SubscriptionName "MySubscription" | Select-AzureRmSubscription
    ```
4. Create database. This example creates a database named "mynewsqldw", with service objective level "DW400", to the server named "sqldwserver1", which is in the resource group named "mywesteuroperesgp1".

   ```Powershell
   New-AzureRmSqlDatabase -RequestedServiceObjectiveName "DW400" -DatabaseName "mynewsqldw" -ServerName "sqldwserver1" -ResourceGroupName "mywesteuroperesgp1" -Edition "DataWarehouse" -CollationName "SQL_Latin1_General_CP1_CI_AS" -MaxSizeBytes 10995116277760
   ```

Required Parameters are:

* **RequestedServiceObjectiveName**: The amount of [DWU][DWU] you are requesting.  Supported values are: DW100, DW200, DW300, DW400, DW500, DW600, DW1000, DW1200, DW1500, DW2000, DW3000, and DW6000.
* **DatabaseName**: The name of the SQL Data Warehouse that you are creating.
* **ServerName**: The name of the server that you are using for creation (must be V12).
* **ResourceGroupName**: Resource group you are using.  To find available resource groups in your subscription use Get-AzureResource.
* **Edition**: Must be "DataWarehouse" to create a SQL Data Warehouse.

Optional Parameters are:

* **CollationName**: The default collation if not specified is SQL_Latin1_General_CP1_CI_AS.  Collation cannot be changed on a database.
* **MaxSizeBytes**: The default max size of a database is 10 GB.

For more details on the parameter options, see [New-AzureRmSqlDatabase][New-AzureRmSqlDatabase] and [Create Database (Azure SQL Data Warehouse)][Create Database (Azure SQL Data Warehouse)].

## Next steps
After your SQL Data Warehouse has finished provisioning you may want to try [loading sample data][loading sample data] or check out how to [develop][develop], [load][load], or [migrate][migrate].

If you're interested in more on how to manage SQL Data Warehouse programmatically, check out our article on how to use [PowerShell cmdlets and REST APIs][PowerShell cmdlets and REST APIs].

<!--Image references-->

<!--Article references-->
[DWU]: ./sql-data-warehouse-overview-what-is.md
[migrate]: ./sql-data-warehouse-overview-migrate.md
[develop]: ./sql-data-warehouse-overview-develop.md
[load]: ./sql-data-warehouse-load-with-bcp.md
[loading sample data]: ./sql-data-warehouse-load-sample-databases.md
[PowerShell cmdlets and REST APIs]: ./sql-data-warehouse-reference-powershell-cmdlets.md
[firewall rules]: ../sql-database-configure-firewall-settings.md

[How to install and configure Azure PowerShell]: /powershell/azureps-cmdlets-docs
[how to create a SQL Data Warehouse from the Azure Portal]: ./sql-data-warehouse-get-started-provision.md
[Create an Azure SQL database in the Azure Portal]: ../sql-database/sql-database-get-started.md
[Create an Azure SQL database with PowerShell]: ../sql-database/sql-database-get-started-powershell.md
[how to create a resource group]: ../azure-resource-manager/resource-group-template-deploy-portal.md#create-resource-group

<!--MSDN references-->
[MSDN]: https://msdn.microsoft.com/library/azure/dn546722.aspx
[New-AzureRmSqlDatabase]: https://msdn.microsoft.com/library/mt619339.aspx
[Create Database (Azure SQL Data Warehouse)]: https://msdn.microsoft.com/library/mt204021.aspx

<!--Other Web references-->
[Microsoft Web Platform Installer]: https://aka.ms/webpi-azps
[SQL Data Warehouse pricing]: https://azure.microsoft.com/pricing/details/sql-data-warehouse/
[Azure Free Trial]: https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F
[MSDN Azure Credits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F
