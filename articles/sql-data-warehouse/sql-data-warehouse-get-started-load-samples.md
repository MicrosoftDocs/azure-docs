<properties
   pageTitle="Load sample data into SQL Data Warehouse | Microsoft Azure"
   description="Load ample data into SQL Data Warehouse"
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
   ms.date="08/05/2015"
   ms.author="lodipalm;barbkess"/>

#Load sample data into SQL Data Warehouse

Now that you have set-up a SQL Data Warehouse instance you can easily load some sample data into it.  The following will help you create a dataset called AdventureWorksPDW2012 in your database.  This dataset models out a sample data warehouse structure for a fictional company called AdventureWorks.  Note that you will need to have BCP installed for the following steps.  If you do not currently have BCP installed, please install the [Microsoft Command Line Utilities for SQL Server][]. 

1. To get started click to download our [Sample Data Scripts][].

2. After the file has downloaded, extract the contents of the AdventureWorksPDW2012.zip file and open the new AdventureWorksPDW2012 folder. 

3. Edit the aw_create.bat file and set the following values at the top of the file:

   a. **Server**: The fully qualified name of the server your SQL Data Warehouse resides on

   b. **User**: The user for the above server
   
   c. **Password**: The password for the provided server log-in
   
   d. **Database**: The name of the SQL Data Warehouse instance you wish to load data onto
   
   Ensure that there is no whitespace between the '=' and these parameters.
   

4. Run aw_create.bat from the directory in which it is located. This will create the schema and load data into all the tables using BCP.


## Connecting to and querying your sample

As described in the [connect and query][] documentation you can connect to this database using Visual Studio and SSDT.  Now that you've loaded some sample data into your SQL Data Warehouse, you can quickly run a few queries to get started. 

We can run a simple select statement to get all the info of the employees:

	SELECT * FROM DimEmployee;

We can also run a more complex query using constructs such as GROUP BY to look at the total amount for all sales on each day:

	SELECT OrderDateKey, SUM(SalesAmount) AS TotalSales
	FROM FactInternetSales
	GROUP BY OrderDateKey
	ORDER BY OrderDateKey;

We can even use the WHERE clause to filter out orders from before a certain date:

	SELECT OrderDateKey, SUM(SalesAmount) AS TotalSales
	FROM FactInternetSales
	WHERE OrderDateKey > '20020801'
	GROUP BY OrderDateKey
	ORDER BY OrderDateKey;

In fact, SQL Data Warehouse supports almost all of the T-SQL constructs that SQL Server does, and you can find some of the differences in our [migrate code][] documentation.  

## Next steps
Now that we've given you some time to warm up with the sample data check out how to [develop][], [load][], or [migrate][].

<!--Image references-->

<!--Article references-->
[migrate]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-overview-migrate/
[develop]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-overview-develop/
[load]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-overview-load/
[connect and query]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-get-started-connect-query/
[migrate code]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-migrate-code/

<!--MSDN references-->
[Microsoft Command Line Utilities for SQL Server]:http://www.microsoft.com/en-us/download/details.aspx?id=36433

<!--Other Web references-->
[Sample Data Scripts]:https://migrhoststorage.blob.core.windows.net/sqldwsample/AdventureWorksPDW2012.zip 
