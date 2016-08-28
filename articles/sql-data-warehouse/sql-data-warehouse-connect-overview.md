<properties
   pageTitle="Connect to Azure SQL Data Warehouse | Microsoft Azure"
   description="Connection overview for connecting to Azure SQL Data Warehouse"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="08/27/2016"
   ms.author="sonyama;barbkess"/>

# Connect to Azure SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-connect-overview.md)
- [Authentication](sql-data-warehouse-authentication.md)
- [Drivers](sql-data-warehouse-connection-strings.md)

Overview of connecting to Azure SQL Data Warehouse. 

## Discover connection string from portal

Your SQL Data Warehouse is associated with an Azure SQL server. To connect, you need the fully qualified name of the server (e.g. **servername**.database.windows.net).

To find the fully qualified server name:

1. Go to the [Azure portal][].
2. Click **SQL databases** and click the database you want to connect to. This example uses the AdventureWorksDW sample database.
3. Locate the full server name.

    ![Full server name][1]

## Connection settings

SQL Data Warehouse standardizes a few settings during connection and object creation. These cannot be overridden.

| Database Setting       | Value                        |
| :--------------------- | :--------------------------- |
| [ANSI_NULLS][]         | ON                           |
| [QUOTED_IDENTIFIERS][] | ON                           |
| [DATEFORMAT][]         | mdy                          |
| [DATEFIRST][]          | 7                            |

## Monitoring connections and queries

Once a connection has been made and a session has been established you are ready to write and submit queries to SQL Data Warehouse.  To learn how to monitor sessions and queries, see [Monitor your workload using DMVs][].

## Next steps

To start querying your data warehouse with Visual Studio and other applications, see [Query with Visual Studio][]. 

<!--Articles-->
[Query with Visual Studio]: ./sql-data-warehouse-query-visual-studio.md
[Monitor your workload using DMVs]: ./sql-data-warehouse-manage-monitor.md

<!--MSDN references-->
[ANSI_NULLS]: https://msdn.microsoft.com/library/ms188048.aspx
[QUOTED_IDENTIFIERS]: https://msdn.microsoft.com/library/ms174393.aspx
[DATEFORMAT]: https://msdn.microsoft.com/library/ms189491.aspx
[DATEFIRST]: https://msdn.microsoft.com/library/ms181598.aspx

<!--Other-->
[Azure portal]: https://portal.azure.com

<!--Image references-->
[1]: media/sql-data-warehouse-connect-overview/get-server-name.png


