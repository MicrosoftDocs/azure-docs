---
title: Connect to Synapse SQL using sqlcmd
description: Use the sqlcmd command-line utility to connect to and query SQL on-demand (preview) and SQL pool.
services: synapse analytics
author: azaricstefan 
ms.service: synapse-analytics
ms.topic: overview 
ms.subservice: 
ms.date: 04/15/2020 
ms.author: v-stazar 
ms.reviewer: jrasnick
---

# Connect to Synapse SQL with sqlcmd

> [!div class="op_single_selector"]
> * [Azure Data Studio (preview)](get-started-azure-data-studio.md)
> * [Power BI](get-started-power-bi-professional.md)
> * [Visual Studio](../sql-data-warehouse/sql-data-warehouse-query-visual-studio.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json)
> * [sqlcmd](../sql/get-started-connect-sqlcmd.md)
> * [SSMS](get-started-ssms.md)

You can use the [sqlcmd](/sql/tools/sqlcmd-utility?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) command-line utility to connect to and query SQL on-demand (preview) and SQL pool within Synapse SQL.  

## 1. Connect
To get started with [sqlcmd](/sql/tools/sqlcmd-utility?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), open the command prompt and enter **sqlcmd** followed by the connection string for your Synapse SQL database. The connection string requires the following parameters:

* **Server (-S):** Server in the form `<`Server Name`>`.database.windows.net
* **Database (-d):** Database name
* **Enable Quoted Identifiers (-I):** Quoted identifiers must be enabled to connect to a Synapse SQL instance

To use SQL Server Authentication, you need to add the username and password parameters:

* **User (-U):** Server user in the form `<`User`>`
* **Password (-P):** Password associated with the user

Your connection string might look like the following example:

**SQL on-demand**

```sql
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P Enter_Your_Password_Here -I
```

**SQL pool**

```
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I
```

To use Azure Active Directory Integrated authentication, you need to add the Azure Active Directory parameters:

* **Azure Active Directory Authentication (-G):** use Azure Active Directory for authentication

Your connection string might look like on of the following examples:

**SQL on-demand**

```
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -G -I
```

**SQL pool**

```sql
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -G -I
```

> [!NOTE]
> You need to [enable Azure Active Directory Authentication](../sql-data-warehouse/sql-data-warehouse-authentication.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) to authenticate using Active Directory.

## 2. Query

### Use SQL pool

After connection, you can issue any supported [Transact-SQL](/sql/t-sql/language-reference?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) (T-SQL) statements against the instance. In this example, queries are submitted in interactive mode:

```sql
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I
1> SELECT name FROM sys.tables;
2> GO
3> QUIT
```

For SQL pool, the following examples show you how to run queries in batch mode using the -Q option or piping your SQL to sqlcmd:

```sql
sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I -Q "SELECT name FROM sys.tables;"
```

```sql
"SELECT name FROM sys.tables;" | sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I > .\tables.out
```

### Use SQL on-demand

After connecting, you can issue any supported [Transact-SQL](/sql/t-sql/language-reference?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) (T-SQL) statements against the instance.  In the following example, queries are submitted in interactive mode:

```sql
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P Enter_Your_Password_Here -I
1> SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')
2> GO
3> QUIT
```

For SQL on-demand, the examples that follow show you how to run queries in batch mode using the -Q option or piping your SQL to sqlcmd:

```sql
sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P 'Enter_Your_Password_Here' -I -Q "SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')"
```

```sql
"SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')" | sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P 'Enter_Your_Password_Here' -I > ./tables.out
```

## Next steps

For more information about sqlcmd options, see the [sqlcmd documentation](/sql/tools/sqlcmd-utility?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).
