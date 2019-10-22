---
title: Connect to Azure SQL on-demand sqlcmd | Microsoft Docs
description: Use sqlcmd command-line utility to connect to and query an Azure SQL on-demand.
services: sql-data-warehouse
author: azaricstefan 
ms.service: sql-data-warehouse
ms.topic: overview 
ms.subservice: design 
ms.date: 10/21/2019 
ms.author: v-stazar 
ms.reviewer: jrasnick
---

# Connect to SQL on-demand with sqlcmd
> [!div class="op_single_selector"]
> * [Power BI](tutorial-bi-professional.md)
> * [Visual Studio](sql-analytics-query-visual-studio.md)
> * [sqlcmd](sql-analytics-get-started-connect-sqlcmd.md) 
> * [SSMS](sql-analytics-query-ssms.md)
> 
> 

Use [sqlcmd][sqlcmd] command-line utility to connect to and query an Azure SQL on-demand.  

## 1. Connect
To get started with [sqlcmd][sqlcmd], open the command prompt and enter **sqlcmd** followed by the connection string for your SQL on-demand database. The connection string requires the following parameters:

* **Server (-S):** Server in the form `<`Server Name`>`.database.windows.net
* **Database (-d):** Database name.
* **Enable Quoted Identifiers (-I):** Quoted identifiers must be enabled to connect to a SQL on-demand instance.

To use SQL Server Authentication, you need to add the username/password parameters:

* **User (-U):** Server user in the form `<`User`>`
* **Password (-P):** Password associated with the user.

For example, your connection string might look like the following:

```sql
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P Enter_Your_Password_Here -I
```

To use Azure Active Directory Integrated authentication, you need to add the Azure Active Directory parameters:

* **Azure Active Directory Authentication (-G):** use Azure Active Directory for authentication

For example, your connection string might look like the following:

```sql
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -G -I
```

> [!NOTE]
> You need to [enable Azure Active Directory Authentication](sql-data-warehouse-authentication.md) to authenticate using Active Directory.
> 
> 

## 2. Query
After connection, you can issue any supported Transact-SQL statements against the instance.  In this example, queries are submitted in interactive mode.

```sql
C:\>sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P Enter_Your_Password_Here -I
1> SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')
2> GO
3> QUIT
```

These next examples show how you can run your queries in batch mode using the -Q option or piping your SQL to sqlcmd.

```sql
sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P 'Enter_Your_Password_Here' -I -Q "SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')"
```

```sql
"SELECT COUNT(*) FROM  OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet', FORMAT='PARQUET')" | sqlcmd -S partyeunrt.database.windows.net -d demo -U Enter_Your_Username_Here -P 'Enter_Your_Password_Here' -I > ./tables.out
```

## Next steps
See [sqlcmd documentation][sqlcmd] for more about details about the options available in sqlcmd.

<!--Image references-->

<!--Article references-->

<!--MSDN references--> 
[sqlcmd]: https://msdn.microsoft.com/library/ms162773.aspx
[Azure portal]: https://portal.azure.com

<!--Other Web references-->
