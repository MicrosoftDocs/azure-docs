<properties
   pageTitle="Load sample data into SQL Data Warehouse | Microsoft Azure"
   description="Learn how to load ample data into SQL Data Warehouse"
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
   ms.date="04/30/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Load sample data into SQL Data Warehouse

The following steps can be follwed to simply load the AdventureWorksDW dataset to your database. This dataset models out a sample data warehouse structure for a fictional company called AdventureWorks with data representing sales and customers for the company.

## Adding sample data at creation

You can create the AdventureWorks sample database during creation of your SQL Data Warehouse by following these steps:   

1. Start the creation process by finding SQL Data Warehouse in the [Azure Classic Portal][] by clicking '+ New' and then 'Data and Storage' or in the Marketplace by searching for 'SQL Data Warehouse'.

2. Once the process is started, click on the 'Select source' option and set it to 'Sample'. If you are not creating a new server you will also be asked to provide the log-in for the server that you are using to create.  

> [AZURE.NOTE] In order to load sample data into your instance, you will need to enable Azure services to access your server (this should be on by default when creating a new server).  If this is not done the load will fail, but you can still [load sample data manually][].

## Adding sample data after creation

If you didn't create the AdventureWorks database during creation of your database you can [load sample data manually][] anytime.

## Using Power BI to analyze Adventureworks

Using the sample data set can be a great way to get started with Power BI. After loading the sample data, you can open a connection to SQL Data Warehouse either by clicking the 'Open in Power BI' button in the Azure Classic Portal or going to [Power BI][]  and [connecting to SQL Data Warehouse][]. After connecting, a new dataset should be created with the same name as your data warehouse.  To make analysis easier we have created a view called 'AggregateSales' with a few of the metrics that are key to analyzing the sales of the company. You can click on the name of this view to expand it and see the columns that it contains and you can create some quick visualizations by following these steps:

1. To get started, we can easily create a map of all our sales by clicking the 'PostalCode' and 'SalesAmount' columns. Power BI will even automatically recognize this as geographic data and put it in a map for you.

2. Now, if you wanted to create a bar graph of sales you can just click the 'SalesAmount' column and Power BI will automatically create it for you. You can add extra depth by dragging the 'CustomerIncome' chart to the 'Axis' field to the left of 'AggregateSales' to show sales by customer income brackets.

3. Finally, if you want to create a timeline of sales all you need to do is click 'SalesAmount', 'OrderDate', and 'Line Chart' (the first icon in the second line under 'Visualizations').

You can save your progress at any time by clicking the 'SAVE' button in the upper left-hand corner and saving your visualizations as a report.

## Connecting to and querying your sample

You can also analyze the sample data with traditional means. As described in the [connect and query][] documentation you can connect to this database using SQL Server Data Tools in Visual Studio. Now that you've loaded some sample data into your SQL Data Warehouse, you can quickly run a few queries to get started.

We can run a simple select statement to get all the info of the employees:

```sql
SELECT * FROM DimEmployee;
```

We can also run a more complex query using constructs such as GROUP BY to look at the total amount for all sales on each day:

```sql
SELECT OrderDateKey, SUM(SalesAmount) AS TotalSales
FROM FactInternetSales
GROUP BY OrderDateKey
ORDER BY OrderDateKey
;
```

We can even use the WHERE clause to filter out orders from before a certain date:

```sql
SELECT OrderDateKey, SUM(SalesAmount) AS TotalSales
FROM FactInternetSales
WHERE OrderDateKey > '20020801'
GROUP BY OrderDateKey
ORDER BY OrderDateKey
;
```

In fact, SQL Data Warehouse supports almost all of the T-SQL constructs that SQL Server does, and you can find some of the differences in our [migrate code][] documentation.  

## Next steps
Now that we've given you some time to warm up with the sample data check out how to [develop][], [load][], or [migrate][].

<!--Image references-->

<!--Article references-->
[migrate]: ./sql-data-warehouse-overview-migrate.md
[develop]: ./sql-data-warehouse-overview-develop.md
[load]: ./sql-data-warehouse-overview-load.md
[connect and query]: ./sql-data-warehouse-get-started-connect.md
[migrate code]: ./sql-data-warehouse-migrate-code.md
[load sample data manually]: ./sql-data-warehouse-get-started-manually-load-samples.md
[Azure Classic Portal]: https://portal.azure.com/
[Power BI]: http://www.powerbi.com/
[connecting to SQL Data Warehouse]: ./sql-data-warehouse-integrate-power-bi.md

<!--MSDN references-->
[Microsoft Command Line Utilities for SQL Server]: http://www.microsoft.com/download/details.aspx?id=36433/

<!--Other Web references-->
[Sample Data Scripts]: https://migrhoststorage.blob.core.windows.net/sqldwsample/AdventureWorksPDW2012.zip/
