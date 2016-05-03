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
   ms.date="04/20/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Create a SQL Data Warehouse database by using Transact-SQL (TSQL)

> [AZURE.SELECTOR]
- [Azure Portal](sql-data-warehouse-get-started-provision.md)
- [TSQL](sql-data-warehouse-get-started-create-database-tsql.md)
- [PowerShell](sql-data-warehouse-get-started-provision-powershell.md)

This article will show you how to create a SQL Data Warehouse database with Transact-SQL (TSQL).

## Before you begin

To complete the steps in this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- A V12 logical SQL server. You will need a V12 SQL server to create SQL Data Warehouse.  If you don't have a V12 logical SQL server, see **Configure and create a server** in the article [how to create a SQL Data Warehouse from the Azure Pportal][].
- Visual Studio. For a free copy of Visual Studio, see the [Visual Studio Downloads][] page.


> [AZURE.NOTE] Creating a new SQL Data Warehouse may result in a new billable service.  See [SQL Data Warehouse pricing][] for more details on pricing.

## Create a database with Visual Studio

If you are new to Visual Studio, see the article [getting connected to SQL Data Warehouse with Visual Studio][].  To start, open SQL Server Object Explorer in Visual Studio and connect to the server that will host your SQL Data Warehouse database.  Once connected, you can create a SQL Data Warehouse by running the following SQL command against the **master** database.  This command will create the database MySqlDwDb with a Service Objective of DW400 and allow the database to grow to a maximum size of 10 TB.

```sql
CREATE DATABASE MySqlDwDb (EDITION='datawarehouse', SERVICE_OBJECTIVE = 'DW400', MAXSIZE= 10240 GB);
```

## Create a database with sqlcmd

Alternatively, you can run the same command with sqlcmd by runnig the following at a command prompt.

```sql
sqlcmd -S <Server Name>.database.windows.net -I -U <User> -P <Password> -Q "CREATE DATABASE MySqlDwDb (EDITION='datawarehouse', SERVICE_OBJECTIVE = 'DW400', MAXSIZE= 10240 GB)"
```

The **MAXSIZE** and **SERVICE_OBJECTIVE** parameters specify the maximum space the database may use on disk and the compute resources allocated to your Data Warehouse instance.  The Service Objective is essentially an allocation of CPU and memory which scales linearly with the size of DWU.  

The MAXSIZE can be between 250 GB and 60 TB.  The Service Objective can be between DW100 and DW2000.  For a complete list of all valid values for MAXSIZE and SERVICE_OBJECTIVE see the MSDN documentation for [CREATE DATABASE][].  Both the MAXSIZE and SERVICE_OBJECTIVE can also be changed with an [ALTER DATABASE][] T-SQL command.  Caution should be used when changing the SERVICE_OBJECTIVE as this causes a restart of services which will cancel all queries in flight.  Changing MAXSIZE does not have this caution as it is just a simple metadata operation.

## Next steps
After your SQL Data Warehouse has finished provisioning you can [load sample data][] or check out how to [develop][], [load][], or [migrate][].

<!--Article references-->
[how to create a SQL Data Warehouse from the Azure portal]: sql-data-warehouse-get-started-provision.md
[getting connected to SQL Data Warehouse with Visual Studio]: sql-data-warehouse-get-started-connect.md
[migrate]: sql-data-warehouse-overview-migrate.md
[develop]: sql-data-warehouse-overview-develop.md
[load]: sql-data-warehouse-overview-load.md
[load sample data]: sql-data-warehouse-get-started-manually-load-samples.md

<!--MSDN references--> 
[CREATE DATABASE]: https://msdn.microsoft.com/library/mt204021.aspx
[ALTER DATABASE]: https://msdn.microsoft.com/library/mt204042.aspx

<!--Other Web references-->
[SQL Data Warehouse pricing]: https://azure.microsoft.com/pricing/details/sql-data-warehouse/
[Visual Studio Downloads]: https://www.visualstudio.com/downloads/download-visual-studio-vs
