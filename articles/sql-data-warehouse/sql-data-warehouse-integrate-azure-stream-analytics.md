<properties
   pageTitle="Use Azure Stream Analytics with SQL Data Warehouse | Microsoft Azure"
   description="Tips for using Azure Stream Analytics with Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="kevinvngo"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="08/08/2016"
   ms.author="shigu;barbkess;sonyama"/>

# Use Azure Stream Analytics with SQL Data Warehouse

Azure Stream Analytics is a fully managed service providing low-latency, highly available, scalable complex event processing over streaming data in the cloud. You can learn the basics by reading [Introduction to Azure Stream Analytics][]. You can then learn how to create an end-to-end solution with Stream Analytics by following the [Get started using Azure Stream Analytics][] tutorial.

In this article, you will learn how to use your Azure SQL Data Warehouse database as an output sink for your Steam Analytics jobs.

## Prerequisites

First, run through the following steps in the [Get started using Azure Stream Analytics][] tutorial.  

1. Create an Event Hub input
2. Configure and start event generator application
3. Provision a Stream Analytics job
4. Specify job input and query

Then, create an Azure SQL Data Warehouse database

## Specify job output: Azure SQL Data Warehouse database

### Step 1

In your Stream Analytics job click **OUTPUT** from the top of the page, and then click **ADD OUTPUT**.

### Step 2

Select SQL Database and click next.

![][add-output]

### Step 3
Enter the following values on the next page:

- *Output Alias*: Enter a friendly name for this job output.
- *Subscription*:
	- If your SQL Data Warehouse database is in the same subscription as the Stream Analytics job, select Use SQL Database from Current Subscription.
	- If your database is in a different subscription, select Use SQL Database from Another Subscription.
- *Database*: Specify the name of a destination database.
- *Server Name*: Specify the server name for the database you just specified. You can use the Azure Classic Portal to find this.

![][server-name]

- *User Name*: Specify the user name of an account that has write permissions for the database.
- *Password*: Provide the password for the specified user account.
- *Table*: Specify the name of the target table in the database.

![][add-database]

### Step 4

Click the check button to add this job output and to verify that Stream Analytics can successfully connect to the database.

![][test-connection]

When the connection to the database succeeds, you will see a notification at the bottom of the portal. You can click Test Connection at the bottom to test the connection to the database.

## Next steps

For an overview of integration, see [SQL Data Warehouse integration overview][].

For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

[add-output]: ./media/sql-data-warehouse-integrate-azure-stream-analytics/add-output.png
[server-name]: ./media/sql-data-warehouse-integrate-azure-stream-analytics/dw-server-name.png
[add-database]: ./media/sql-data-warehouse-integrate-azure-stream-analytics/add-database.png
[test-connection]: ./media/sql-data-warehouse-integrate-azure-stream-analytics/test-connection.png

<!--Article references-->

[Introduction to Azure Stream Analytics]: ../stream-analytics/stream-analytics-introductiond.md
[Get started using Azure Stream Analytics]: ../stream-analytics/stream-analytics-get-started.md
[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop.md
[SQL Data Warehouse integration overview]:  ./sql-data-warehouse-overview-integrate.md

<!--MSDN references-->

<!--Other Web references-->
[Azure Stream Analytics documentation]: http://azure.microsoft.com/documentation/services/stream-analytics/
