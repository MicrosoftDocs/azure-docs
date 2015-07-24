<properties
   pageTitle="Use Power BI with SQL Data Warehouse | Microsoft Azure"
   description="Tips for using Power BI with Azure SQL Data Warehouse for developing solutions."
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
   ms.date="06/22/2015"
   ms.author="lodipalm"/>

# Use Power BI with SQL Data Warehouse
As with Azure SQL Database, SQL Data Warehouse Direct Connect allows user to leverage powerful logical pushdown alongside the analytical capabilities of Power BI.  With Direct Connect, queries are sent back to your Azure SQL Data Warehouse in real time as you explore the data.  This, combined with the scale of SQL Data Warehouse, enables users to create dynamic reports in minutes against terabytes of data.  In addition, the introduction of the Open in Power BI button allows users to directly connect Power BI to their SQL Data Warehouse without collecting information from other parts of Azure. 

When using Direct Connect please note: 

+ Specify the fully qualified server name when connecting (see below for more details)
+ Ensure firewall rules for the database are configured to "Allow access to Azure services".
+ Every action such as selecting a column or adding a filter will  directly query the data warehouse 
+ Tiles are refreshed approximately every 15 minutes (refresh does not need to be scheduled)
+ Q&A is not available for Direct Connect datasets
+ Schema changes are not picked up automatically

These restrictions and notes may change as we continue to improve the experiences. The steps to connect are detailed below.  

## Using the ‘Open in Power BI’ button
The easiest way to move between your SQL Data Warehouse and Power BI is with the Open in Power BI button. This button allows you to seamlessly begin creating new dashboards in Power BI.  

1.	To get started navigate to your SQL Data Warehouse instance in the Azure Portal.
2.	Click the Open in Power BI button.
3.	If we are not able to sign you in directly, or if you do not have a Power BI account, you will need to sign-in.  
4.	You will be directed to the SQL Data Warehouse connection page, with the information from your SQL Data Warehouse pre-populated.
5.  After entering your credentials you will be fully conected to your SQL Data Warehouse. 

## Connecting through the Power BI portal
In addition to using the Open in Power BI button, users can also connect to their SQL Data Warehouse through the Power BI Portal. 

1.   Click Get Data at the bottom of the navigation pane.
2.  Select Big Data & More.
3.  Once on the Big Data & More page, select the SQL Data Warehouse
4.  Enter the necessary connection information.  The in the Finding Parameters section below shows where this data can be found.  
5.	Drilling into the dataset, you can explore all of the tables and columns in your database. Selecting a column will send a query back to the source, dynamically creating your visual. These visuals can be saved in a new report, and pinned back to your dashboard.

## Finding parameter values
Your fully qualified server name and database name can be found in the Azure Portal.  Please note that SQL Data Warehouse only has a presence in the Azure Preview portal at this time.

## Next steps
For an overview of integration, see [SQL Data Warehouse integration overview][].
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop/
[SQL Data Warehouse integration overview]:  ./sql-data-warehouse-overview-integration/

<!--MSDN references-->

<!--Other Web references-->


