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
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="03/23/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

#Create SQL Data Warehouse with TSQL

> [AZURE.SELECTOR]
- [Azure Portal](sql-data-warehouse-get-started-provision.md)
- [TSQL](sql-data-warehouse-get-started-create-TSQL.md)
- [PowerShell](sql-data-warehouse-get-started-create-powershell.md)

This article will show you how to create a SQL Data Warehouse using Transact SQL.  To complete the steps in this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- Visual Studio. For a free copy of Visual Studio, see the [Visual Studio Downloads](https://www.visualstudio.com/downloads/download-visual-studio-vs) page.
- A V12 SQL Server.  You will need a V12 SQL Server to create SQL Data Warehouse.  If you don't have a V12 SQL Server available then we recommend creating in the Portal so you can create your SQL Data Warehouse on a new server.

This article will not cover how to correctly set-up and connect using Visual Studio.  For a full description of how to do this please see the [connect and query][] documentation.  To start, you will have to open up the SQL Server Object Explorer in Visual Studio and connect to the server that you will use to create your SQL Data Warehouse.  Once you have done this you will be able to create a SQL Data Warehouse by running the following command against the Master database:

```sql
CREATE DATABASE <Name> (EDITION='datawarehouse', SERVICE_OBJECTIVE = '<Compute Size - DW####>', MAXSIZE= <Storage Size - #### GB>);
```

You can also create a SQL Data Warehouse by opening the command line and running the following:

```
sqlcmd -S <Server Name>.database.windows.net -I -U <User> -P <Password> -Q "CREATE DATABASE <Name> (EDITION='datawarehouse', SERVICE_OBJECTIVE = '<Compute Size - DW####>', MAXSIZE= <Storage Size - #### GB>)"
```


When running the above TSQL Statements note the `MAXSIZE` and `SERVICE_OBJECTIVE` parameters, these will dictate the initial storage size and compute allotted to your Data Warehouse instance.  `MAXSIZE` will accept the following sizes and we suggest choosing a large size to allow room for growth:

+ 250 GB
+ 500 GB
+ 750 GB
+ 1024 GB
+ 5120 GB
+ 10240 GB
+ 20480 GB
+ 30720 GB
+ 40960 GB
+ 51200 GB

`SERVICE_OBJECTIVE` will indicate the number of DWUs that your instance will start with and will accept the following values:

+ DW100
+ DW200
+ DW300
+ DW400
+ DW500
+ DW600
+ DW1000
+ DW1200
+ DW1500
+ DW2000

For information about the billing impact of these parameters please see our [pricing page][].

## Next steps
After your SQL Data Warehouse has finished provisioning you can [load sample data][] or check out how to [develop][], [load][], or [migrate][].

[connect and query]: ./sql-data-warehouse-get-started-connect.md
[migrate]: ./sql-data-warehouse-overview-migrate.md
[develop]: ./sql-data-warehouse-overview-develop.md
[load]: ./sql-data-warehouse-overview-load.md
[load sample data]: ./sql-data-warehouse-get-started-manually-load-samples.md
[pricing page]: https://azure.microsoft.com/pricing/details/sql-data-warehouse/
