<properties
   pageTitle="Load sample data into SQL Data Warehouse | Microsoft Azure"
   description="Load sample data into SQL Data Warehouse"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/17/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

#Load sample data into SQL Data Warehouse

Follow these simple steps to load and query the Adventure Works Sample database. These scripts first use sqlcmd to run SQL which will create tables and views. Once tables have been created, the scripts will use bcp to load data.  If you don't already have sqlcmd and bcp installed, follow these links to [install bcp][] and to [install sqlcmd][].

##Load sample data

1. Download the [Adventure Works Sample Scripts for SQL Data Warehouse][] zip file.

2. Extract the files from downloaded zip to a directory on your local machine.

3. Edit the extracted file aw_create.bat and set the following variables found at the top of the file.  Be sure to leave no whitespace between the "=" and the parameter.  Below are examples of how your edits might look.

    ```
    server=mylogicalserver.database.windows.net
    user=mydwuser
    password=Mydwpassw0rd
    database=mydwdatabase
    ```

4. From a Windows cmd prompt, run the edited aw_create.bat.  Be sure you are in the directory where you saved your edited version of aw_create.bat.
This script will...
	* Drop any Adventure Works tables or views that already exist in your database
	* Create the Adventure Works tables and views
	* Load each Adventure Works table using bcp
	* Validate the row counts for each Adventure Works table
	* Collect statistics on every column for each Adventure Works table


##Query sample data

Once you've loaded some sample data into your SQL Data Warehouse, you can quickly run a few queries.  To run a query, connect to your newly created Adventure Works database in Azure SQL DW using Visual Studio and SSDT, as described in the [connect][] document.

Example of simple select statement to get all the info of the employees:

```sql
SELECT * FROM DimEmployee;
```

Example of a more complex query using constructs such as GROUP BY to look at the total amount for all sales on each day:

```sql
SELECT OrderDateKey, SUM(SalesAmount) AS TotalSales
FROM FactInternetSales
GROUP BY OrderDateKey
ORDER BY OrderDateKey;
```

Example of a SELECT with a WHERE clause to filter out orders from before a certain date:

```
SELECT OrderDateKey, SUM(SalesAmount) AS TotalSales
FROM FactInternetSales
WHERE OrderDateKey > '20020801'
GROUP BY OrderDateKey
ORDER BY OrderDateKey;
```

SQL Data Warehouse supports almost all T-SQL constructs which SQL Server supports.  Any differences are documented in our [migrate code][] documentation.

## Next steps
Now that you've had a chance to try some queries with sample data, check out how to [develop][], [load][], or [migrate][] to SQL Data Warehouse.

<!--Image references-->

<!--Article references-->
[migrate]: ./sql-data-warehouse-overview-migrate.md
[develop]: ./sql-data-warehouse-overview-develop.md
[load]: ./sql-data-warehouse-overview-load.md
[connect]: ./sql-data-warehouse-get-started-connect.md
[migrate code]: ./sql-data-warehouse-migrate-code.md
[install bcp]: ./sql-data-warehouse-load-with-bcp.md
[install sqlcmd]: ./sql-data-warehouse-get-started-connect-sqlcmd.md

<!--Other Web references-->
[Adventure Works Sample Scripts for SQL Data Warehouse]: https://migrhoststorage.blob.core.windows.net/sqldwsample/AdventureWorksSQLDW2012.zip
