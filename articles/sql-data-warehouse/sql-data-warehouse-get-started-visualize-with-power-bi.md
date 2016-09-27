<properties
   pageTitle="Visualize SQL Data Warehouse data with Power BI Microsoft Azure"
   description="Visualize SQL Data Warehouse data with Power BI"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor="" />

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/16/2016"
   ms.author="lodipalm;barbkess;sonyama" />

# Visualize data with Power BI

> [AZURE.SELECTOR]
- [Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md)
- [Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md)
- [Visual Studio](sql-data-warehouse-query-visual-studio.md)
- [sqlcmd](sql-data-warehouse-get-started-connect-sqlcmd.md) 

This tutorial shows you how to use Power BI to connect to SQL Data Warehouse and create a few basic visualizations.

> [AZURE.VIDEO azure-sql-data-warehouse-sample-data-and-powerbi]

## Prerequisites

To step through this tutorial, you need:

- A SQL Data Warehouse pre-loaded with the AdventureWorksDW database. To provision this, see [Create a SQL Data Warehouse][] and choose to load the sample data. If you already have a data warehouse but do not have sample data, you can [load sample data manually][].


## 1. Connect to your database

To open Power BI and connect to your AdventureWorksDW database:

1. Sign into the [Azure portal][].
2. Click **SQL databases** and choose your AdventureWorks SQL Data Warehouse database.

    ![Find your database][1]

3. Click the 'Open in Power BI' button.

    ![Power BI button][2]

4. You should now see the SQL Data Warehouse connection page displaying your database web address. Click next.

    ![Power BI connection][3]

6. Enter your Azure SQL server username and password and you will be fully connected to your SQL Data Warehouse database.

    ![Power BI sign in][4]

7. Once you have signed into Power BI, click the AdventureWorksDW dataset on the left blade. This will open the database.

    ![Power BI open AdventureWorksDW][5]



## 2. Create a report

You are now ready to use Power BI to analyze your AdventureWorksDW sample data. To perform the analysis, AdventureWorksDW has a view called AggregateSales. This view contains a few of the key metrics for analyzing the sales of the company.

1. To create a map of sales amount according to postal code, in the right-hand fields pane, click the AggregateSales view to expand it. Click the PostalCode and SalesAmount columns to select them.

    ![Power BI select AggregateSales][6]

    Power BI automatically recognizes this is geographic data and put it in a map for you.

    ![Power BI map][7]

2. This step creates a bar graph that shows amount of sales per customer income. To create this go to the expanded AggregateSales view. Click the SalesAmount field. Drag the Customer Income field to the left and drop it into Axis.

    ![Power BI select axis][8]

    We moved the bar chart over the left.

    ![Power BI bar][9]

3. This step creates a line chart that shows sales amount per order date. To create this go to the expanded AggregateSales view. Click SalesAmount and OrderDate. In the Visualizations column click the Line Chart icon; this is the first icon in the second line under visualizations.

	![Power BI select line chart][10]

    You now have a report that shows three different visualizations of the data.

    ![Power BI line][11]

You can save your progress at any time by clicking **File** and selecting **Save**.

## Next steps
Now that we've given you some time to warm up with the sample data, see how to [develop][], [load][], or [migrate][]. Or take a look at the [Power BI website][].

<!--Image references-->
[1]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-find-database.png
[2]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-button.png
[3]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-connect-to-azure.png
[4]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-sign-in.png
[5]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-open-adventureworks.png
[6]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-aggregatesales.png
[7]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-map.png
[8]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-chooseaxis.png
[9]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-bar.png
[10]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-prepare-line.png
[11]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-line.png
[12]: media/sql-data-warehouse-get-started-visualize-with-power-bi/pbi-save.png

<!--Article references-->
[migrate]: sql-data-warehouse-overview-migrate.md
[develop]: sql-data-warehouse-overview-develop.md
[load]: sql-data-warehouse-overview-load.md
[load sample data manually]: sql-data-warehouse-load-sample-databases.md
[connecting to SQL Data Warehouse]: sql-data-warehouse-integrate-power-bi.md
[Create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md

<!--Other-->
[Azure portal]: https://portal.azure.com/
[Power BI website]: http://www.powerbi.com/
