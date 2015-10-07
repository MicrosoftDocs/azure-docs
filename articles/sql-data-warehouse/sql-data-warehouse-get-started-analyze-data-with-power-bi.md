<properties
    pageTitle="Connect to SQL Data Warehouse with Power BI | Microsoft Azure"
    description="Connect to SQL Data Warehouse with Power BI"
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
    ms.date="10/07/2015"
    ms.author="lodipalm"/>

# Connect to SQL Data Warehouse with Power BI
This tutorial shows you how to use Power BI to connect to SQL Data Warehouse and create a few basic visualizations.

> [AZURE.NOTE] To complete this tutorial, you need a SQL Data Warehouse database that is pre-loaded with the AdventureWorksDW sample database. [Create a SQL Data Warehouse](sql-data-warehouse-get-started-provision.md) shows you how to create one. 
> 
> If you already have a SQL Data Warehouse database but do not have sample data, you can [load sample data manually][].


## Connect to the SQL Data Warehouse database

To open Power BI and connect to your AdventureWorksDW database:

1. Sign into the [Azure preview portal][].
2. Click **SQL databases** and choose your AdventureWorks SQL Data Warehouse database. 

    ![Find your database][1]

3. Click the 'Open in Power BI' button.

    ![Power BI button][2]

4. You should now see the SQL Data Warehouse connection page displaying your database information. Enter your password and you will be fully connected to your SQL Data Warehouse database. 


## Analyze you data with Power BI

You are now ready to use Power BI to analyze your AdventureWorksDW sample data. To perform the analysis, AdventureWorksDW has a view called AggregateSales. This view contains a few of the key metrics for analyzing the sales of the company. 

1. To create a map of sales amount according to postal code, click the AggregateSales view to expand it, and then click the PostalCode and SalesAmount columns. Power BI automatically recognizes this is geographic data and put it in a map for you.

    ![Power BI map][3]

2. To create a bar graph of sales, just click the SalesAmount column. To add details, drag the CustomerIncome chart to the Axis field to the left of AggregateSale' to show sales by customer income.

    ![Power BI bar][4]

3. To create a timeline of sales, click SalesAmount, OrderDate, and Line Chart, which is the first icon in the second line under Visualizations.

    ![Power BI line][5]

You can save your progress at any time by clicking the **SAVE** button in the upper left-hand corner and saving your visualizations as a report.

## Next steps
Now that we've given you some time to warm up with the sample data, see how to [develop][], [load][], or [migrate][].

<!--Image references-->
[1]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/pbi-find-database.png
[2]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/pbi-button.png
[3]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/pbi-map.png
[4]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/pbi-bar.png
[5]:./media/sql-data-warehouse-get-started-analyze-data-with-power-bi/pbi-line.png

<!--Article references-->
[migrate]: sql-data-warehouse-overview-migrate.md
[develop]: sql-data-warehouse-overview-develop.md
[load]: sql-data-warehouse-overview-load.md
[load sample data manually]: sql-data-warehouse-get-started-manually-load-samples.md
[Azure preview portal]: https://portal.azure.com/
[Power BI]: http://www.powerbi.com/
[connecting to SQL Data Warehouse]: sql-data-warehouse-integrate-power-bi.md
[Create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md
