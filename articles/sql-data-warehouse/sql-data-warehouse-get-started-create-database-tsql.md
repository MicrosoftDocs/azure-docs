<properties
   pageTitle="Create a SQL Data Warehouse with TSQL | Microsoft Azure"
   description="Learn how to create an Azure SQL Data Warehouse with TSQL"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""
   tags="azure-sql-data-warehouse"/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="07/20/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Create a SQL Data Warehouse database by using Transact-SQL (TSQL)

> [AZURE.SELECTOR]
- [Azure Portal](sql-data-warehouse-get-started-provision.md)
- [TSQL](sql-data-warehouse-get-started-create-database-tsql.md)
- [PowerShell](sql-data-warehouse-get-started-provision-powershell.md)

This article will show you how to create a SQL Data Warehouse database with Transact-SQL (T-SQL).

## Prerequisites

Before starting, be sure you have met the following prerequisites.

- **Create Azure account**: See [Azure Free Trial][] or [MSDN Azure Credits][].
- **Create Azure SQL server**:  See [Create an Azure SQL Database logical server with the Azure Portal][] or 
[Create an Azure SQL Database logical server with PowerShell][].
- **Create Resource group name**: Either use the same Resource Group as your Azure SQL server or see [resource groups][] to create a new resource group.
- **Environment to execute T-SQL**: You can use [Visual Studio][Installing Visual Studio and SSDT], [sqlcmd][] or [SSMS][] to execute T-SQL.

> [AZURE.NOTE] Creating a new SQL Data Warehouse may result in a new billable service.  See [SQL Data Warehouse pricing][] for more details on pricing.

## Create a database with Visual Studio

If you are new to Visual Studio, see the article [Connect to SQL Data Warehouse with Visual Studio][].  To start, open SQL Server Object Explorer in Visual Studio and connect to the server that will host your SQL Data Warehouse database.  Once connected, you can create a SQL Data Warehouse by running the following SQL command against the **master** database.  This command will create the database MySqlDwDb with a Service Objective of DW400 and allow the database to grow to a maximum size of 10 TB.

```sql
CREATE DATABASE MySqlDwDb (EDITION='datawarehouse', SERVICE_OBJECTIVE = 'DW400', MAXSIZE= 10240 GB);
```

## Create a database with sqlcmd

Alternatively, you can run the same command with sqlcmd by runnig the following at a command prompt.

```sql
sqlcmd -S <Server Name>.database.windows.net -I -U <User> -P <Password> -Q "CREATE DATABASE MySqlDwDb (EDITION='datawarehouse', SERVICE_OBJECTIVE = 'DW400', MAXSIZE= 10240 GB)"
```

The `MAXSIZE` can be between 250 GB and 240 TB.  The `SERVICE_OBJECTIVE` can be between DW100 and DW2000 [DWU][].  For a list of all valid values, see the MSDN documentation for [CREATE DATABASE][].  Both the MAXSIZE and SERVICE_OBJECTIVE can also be changed with an [ALTER DATABASE][] T-SQL command.  Caution should be used when changing the SERVICE_OBJECTIVE as this causes a restart of services which will cancel all queries in flight.  Changing MAXSIZE does not restart services as it is just a simple metadata operation.

## Next steps

After your SQL Data Warehouse has finished provisioning you can [load sample data][] or check out how to [develop][], [load][], or [migrate][].

<!--Article references-->
[DWU]: ./sql-data-warehouse-overview-what-is.md#data-warehouse-units
[how to create a SQL Data Warehouse from the Azure portal]: ./sql-data-warehouse-get-started-provision.md
[Connect to SQL Data Warehouse with Visual Studio]: ./sql-data-warehouse-get-started-connect.md
[migrate]: ./sql-data-warehouse-overview-migrate.md
[develop]: ./sql-data-warehouse-overview-develop.md
[load]: ./sql-data-warehouse-overview-load.md
[load sample data]: ./sql-data-warehouse-get-started-load-sample-databases.md
[Create an Azure SQL Database logical server with the Azure Portal]: ../sql-database/sql-database-get-started.md#create-an-azure-sql-database-logical-server
[Create an Azure SQL Database logical server with PowerShell]: ../sql-database/sql-database-get-started-powershell.md#database-setup-create-a-resource-group-server-and-firewall-rule
[resource groups]: ../resource-group-template-deploy-portal.md
[Installing Visual Studio and SSDT]: ./sql-data-warehouse-install-visual-studio.md
[sqlcmd]: ./sql-data-warehouse-get-started-connect-sqlcmd.md

<!--MSDN references--> 
[CREATE DATABASE]: https://msdn.microsoft.com/library/mt204021.aspx
[ALTER DATABASE]: https://msdn.microsoft.com/library/mt204042.aspx
[SSMS]: /https://msdn.microsoft.com/library/mt238290.aspx

<!--Other Web references-->
[SQL Data Warehouse pricing]: https://azure.microsoft.com/pricing/details/sql-data-warehouse/
[Azure Free Trial]: https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F
[MSDN Azure Credits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F
