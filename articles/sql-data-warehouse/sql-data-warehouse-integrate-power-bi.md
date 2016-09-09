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
   ms.date="05/31/2016"
   ms.author="lodipalm;barbkess;sonyama"/>

# Use Power BI with SQL Data Warehouse
As with Azure SQL Database, SQL Data Warehouse Direct Connect allows user to leverage powerful logical pushdown alongside the analytical capabilities of Power BI.  With Direct Connect, queries are sent back to your Azure SQL Data Warehouse in real time as you explore the data.  This, combined with the scale of SQL Data Warehouse, enables users to create dynamic reports in minutes against terabytes of data.  In addition, the introduction of the Open in Power BI button allows users to directly connect Power BI to their SQL Data Warehouse without collecting information from other parts of Azure.

When using Direct Connect please note:

+ Specify the fully qualified server name when connecting (see below for more details)
+ Ensure firewall rules for the database are configured to "Allow access to Azure services".
+ Every action such as selecting a column or adding a filter will  directly query the data warehouse
+ Tiles are refreshed approximately every 15 minutes (refresh does not need to be scheduled)
+ Q&A is not available for Direct Connect datasets
+ Schema changes are not picked up automatically
+ All Direct Connect queries will time out after 2 minutes

These restrictions and notes may change as we continue to improve the experiences. The steps to connect are detailed below.  

## Using the ‘Open in Power BI’ button
The easiest way to move between your SQL Data Warehouse and Power BI is with the Open in Power BI button. This button allows you to seamlessly begin creating new dashboards in Power BI.  

1.	To get started navigate to your SQL Data Warehouse instance in the Azure Classic Portal.
2.	Click the 'Open in Power BI' button.
3.	If we are not able to sign you in directly, or if you do not have a Power BI account, you will need to sign-in.  
4.	You will be directed to the SQL Data Warehouse connection page, with the information from your SQL Data Warehouse pre-populated.
5.  After entering your credentials you will be fully connected to your SQL Data Warehouse.

## Connecting through the Power BI portal
In addition to using the Open in Power BI button, users can also connect to their SQL Data Warehouse through the Power BI Portal.

1.  Click 'Get Data' at the bottom of the navigation pane.
2.  Select 'Databases'.
3.  Once on the Databases page, select 'Azure SQL Data Warehouse' and then click 'Connect'.
4.  Enter the necessary connection information.  Your server name and database name can be found in the Azure Portal.
5.  You will be directed back to the main page of Power BI and after your connection is made a new entry under 'Datasets' will appear with the name of your instance.  
6.	 You can click on the new dataset to explore all of the tables and views in your database. Selecting a column will send a query back to the source, dynamically creating your visual. These visuals can be saved in a new report and pinned back to your dashboard.

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop/
[SQL Data Warehouse integration overview]:  ./sql-data-warehouse-overview-integration/

<!--MSDN references-->

<!--Other Web references-->
