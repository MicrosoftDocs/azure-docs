---
title: Connect using sqlcmd
description: Use the sqlcmd command-line utility to connect to and query an Azure Synapse Analytics.
services: synapse analytics
author: azaricstefan 
ms.service: synapse-analytics
ms.topic: overview 
ms.subservice: 
ms.date: 10/21/2019 
ms.author: v-stazar 
ms.reviewer: jrasnick
---

# Connect to SQL Analytics with sqlcmd
> [!div class="op_single_selector"]
> * [Azure Data Studio](get-started-azure-data-studio.md)
> * [Power BI](get-started-power-bi-professional.md)
> * [Visual Studio](../../sql-data-warehouse/sql-data-warehouse-query-visual-studio.md)
> * [sqlcmd](azure-synapse-get started-connect-sqlcmd.md)
> * [SSMS](get-started-ssms.md)
> 
> 

Use the [sqlcmd][sqlcmd] command-line utility to connect to and query an Azure SQL Analytics.  

## 1. Connect
To get started with [sqlcmd][sqlcmd], open the command prompt and enter **sqlcmd** followed by the connection string for your SQL Analytics database. The connection string requires the following parameters:

* **Server (-S):** Server in the form `<`Server Name`>`.database.windows.net
* **Database (-d):** Database name
* **Enable Quoted Identifiers (-I):** Quoted identifiers must be enabled to connect to a SQL Analytics instance

To use SQL Server Authentication, you need to add the username/password parameters:

* **User (-U):** Server user in the form `<`User`>`
* **Password (-P):** Password associated with the user


For example, your connection string might look like the following:


**SQL on-demand**

```sql
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P Enter_Your_Password_Here -I
```

**SQL pool**
```sql
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I
```

To use Azure Active Directory Integrated authentication, you need to add the Azure Active Directory parameters:

* **Azure Active Directory Authentication (-G):** use Azure Active Directory for authentication

For example, your connection string might look like the following:

**SQL on-demand**
```sql
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -G -I
```

**SQL pool**
```sql
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -G -I
```

> [!NOTE]
> You need to [enable Azure Active Directory Authentication](../../sql-data-warehouse/sql-data-warehouse-authentication.md) to authenticate using Active Directory.
> 
> 

## 2. Query 

### Using SQL pool
After connection, you can issue any supported Transact-SQL statements against the instance.  In this example, queries are submitted in interactive mode:

```sql
C:\>sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I
1> SELECT name FROM sys.tables;
2> GO
3> QUIT
```

These next examples show how you can run your queries in batch mode using the -Q option or piping your SQL to sqlcmd:

```sql
sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I -Q "SELECT name FROM sys.tables;"
```

```sql
"SELECT name FROM sys.tables;" | sqlcmd -S MySqlDw.database.windows.net -d Adventure_Works -U myuser -P myP@ssword -I > .\tables.out
```
### Using SQL on-demand
After connection, you can issue any supported Transact-SQL statements against the instance.  In this example, queries are submitted in interactive mode:

```sql
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P Enter_Your_Password_Here -I
1> SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')
2> GO
3> QUIT
```

These next examples show how you can run your queries in batch mode using the -Q option or piping your SQL to sqlcmd:

```sql
sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P 'Enter_Your_Password_Here' -I -Q "SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')"
```

```sql
"SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')" | sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P 'Enter_Your_Password_Here' -I > ./tables.out
```

## Next steps
See [sqlcmd documentation][sqlcmd] for more details about the options available in sqlcmd.

<!--Image references-->

<!--Article references-->

<!--MSDN references--> 
[sqlcmd]: https://msdn.microsoft.com/library/ms162773.aspx
[Azure portal]: https://portal.azure.com

<!--Other Web references-->
