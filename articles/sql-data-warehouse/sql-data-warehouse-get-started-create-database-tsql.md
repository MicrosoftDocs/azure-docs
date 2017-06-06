---
title: Create a SQL Data Warehouse with TSQL | Microsoft Docs
description: Learn how to create an Azure SQL Data Warehouse with TSQL
services: sql-data-warehouse
documentationcenter: NA
author: barbkess
manager: jhubbard
editor: ''
tags: azure-sql-data-warehouse

ms.assetid: a4e2e68e-aa9c-4dd3-abb0-f7df997d237a
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: create
ms.date: 10/31/2016
ms.author: barbkess

---
# Create a SQL Data Warehouse database by using Transact-SQL (TSQL)
> [!div class="op_single_selector"]
> * [Azure Portal](sql-data-warehouse-get-started-provision.md)
> * [TSQL](sql-data-warehouse-get-started-create-database-tsql.md)
> * [PowerShell](sql-data-warehouse-get-started-provision-powershell.md)
>
>

This article shows you how to create a SQL Data Warehouse using T-SQL.

## Prerequisites
To get started, you need:

* **Azure account**: Visit [Azure Free Trial][Azure Free Trial] or [MSDN Azure Credits][MSDN Azure Credits] to create an account.
* **Azure SQL server**:  See [Create an Azure SQL Database logical server with the Azure Portal][Create an Azure SQL Database logical server with the Azure Portal] or
  [Create an Azure SQL Database logical server with PowerShell][Create an Azure SQL Database logical server with PowerShell] for more details.
* **Resource group**: Either use the same resource group as your Azure SQL server or see [how to create a resource group][how to create a resource group].
* **Environment to execute T-SQL**: You can use [Visual Studio][Installing Visual Studio and SSDT], [sqlcmd][sqlcmd], or [SSMS][SSMS] to execute T-SQL.

> [!NOTE]
> Creating a SQL Data Warehouse may result in a new billable service.  See [SQL Data Warehouse pricing][SQL Data Warehouse pricing] for more details on pricing.
>
>

## Create a database with Visual Studio
If you are new to Visual Studio, see the article [Query Azure SQL Data Warehouse (Visual Studio)][Query Azure SQL Data Warehouse (Visual Studio)].  To start, open SQL Server Object Explorer in Visual Studio and connect to the server that will host your SQL Data Warehouse database.  Once connected, you can create a SQL Data Warehouse by running the following SQL command against the **master** database.  This command creates the database MySqlDwDb with a Service Objective of DW400 and allow the database to grow to a maximum size of 10 TB.

```sql
CREATE DATABASE MySqlDwDb COLLATE SQL_Latin1_General_CP1_CI_AS (EDITION='datawarehouse', SERVICE_OBJECTIVE = 'DW400', MAXSIZE= 10240 GB);
```

## Create a database with sqlcmd
Alternatively, you can run the same command with sqlcmd by running the following at a command prompt.

```sql
sqlcmd -S <Server Name>.database.windows.net -I -U <User> -P <Password> -Q "CREATE DATABASE MySqlDwDb COLLATE SQL_Latin1_General_CP1_CI_AS (EDITION='datawarehouse', SERVICE_OBJECTIVE = 'DW400', MAXSIZE= 10240 GB)"
```

The default collation when not specified is COLLATE SQL_Latin1_General_CP1_CI_AS.  The `MAXSIZE` can be between 250 GB and 240 TB.  The `SERVICE_OBJECTIVE` can be between DW100 and DW2000 [DWU][DWU].  For a list of all valid values, see the MSDN documentation for [CREATE DATABASE][CREATE DATABASE].  Both the MAXSIZE and SERVICE_OBJECTIVE can be changed with an [ALTER DATABASE][ALTER DATABASE] T-SQL command.  The collation of a database cannot be changed after creation.   Caution should be used when changing the SERVICE_OBJECTIVE as changing DWU causes a restart of services, which cancels all queries in flight.  Changing MAXSIZE does not restart services as it is just a simple metadata operation.

## Next steps
After your SQL Data Warehouse has finished provisioning you can [load sample data][load sample data] or check out how to [develop][develop], [load][load], or [migrate][migrate].

<!--Article references-->
[DWU]: ./sql-data-warehouse-overview-what-is.md
[how to create a SQL Data Warehouse from the Azure portal]: sql-data-warehouse-get-started-provision.md
[Query Azure SQL Data Warehouse (Visual Studio)]: sql-data-warehouse-query-visual-studio.md
[migrate]: sql-data-warehouse-overview-migrate.md
[develop]: sql-data-warehouse-overview-develop.md
[load]: sql-data-warehouse-overview-load.md
[load sample data]: sql-data-warehouse-load-sample-databases.md
[Create an Azure SQL database with the Azure Portal]: ../sql-database/sql-database-get-started.md
[Create an Azure SQL database with PowerShell]: ../sql-database/sql-database-create-and-configure-database-powershell
[how to create a resource group]: ../azure-resource-manager/resource-group-template-deploy-portal.md#create-resource-group
[Installing Visual Studio and SSDT]: sql-data-warehouse-install-visual-studio.md
[sqlcmd]: sql-data-warehouse-get-started-connect-sqlcmd.md

<!--MSDN references-->
[CREATE DATABASE]: https://msdn.microsoft.com/library/mt204021.aspx
[ALTER DATABASE]: https://msdn.microsoft.com/library/mt204042.aspx
[SSMS]: https://msdn.microsoft.com/library/mt238290.aspx

<!--Other Web references-->
[SQL Data Warehouse pricing]: https://azure.microsoft.com/pricing/details/sql-data-warehouse/
[Azure Free Trial]: https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F
[MSDN Azure Credits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F
