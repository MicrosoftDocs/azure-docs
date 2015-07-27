<properties 
	pageTitle="Create Stream Analytics Outputs | Microsoft Azure" 
	description="Learn how to connect to and configure the output targets for Stream Analytics solutions." 
	documentationCenter="" 
	services="stream-analytics"
	authors="jeffstokes72" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="stream-analytics" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-services" 
	ms.date="07/27/2015" 
	ms.author="jeffstok"/>

# Create Stream Analytics outputs

## Understanding Stream Analytics outputs
---
When creating a Stream Analytics job, one of the considerations is how the output of the job is consumed. Who are the consumers of the data transformation and what tool(s) will they be using to analyze the output? Azure Stream Analytics provides five different methods for storing and viewing job outputs. SQL Database, Blob storage, Event Hubs, Power BI and Table storage. This provides for both ease of viewing job output and flexibility in the consumption and storage of the job output for data warehousing and other purposes.

## Using a SQL Database as an output
---
You can use Azure SQL databases as output for data that is relational in nature or for applications that depend on content being hosted in a database. For more information on Azure SQL databases see [Azure SQL Databases](http://azure.microsoft.com/services/sql-database/).

To start using an Azure SQL database, you should have the following information about your database:

1. Server Name.
2. Database Name.
3. A valid username/password combination.
4. Output table name.

![graphic1][graphic1]

Go to the outputs tab of your job, and click on the "ADD OUTPUT" command and click next.

![graphic2][graphic2]


Choose "SQL Database" as your output.

![graphic3][graphic3]

Enter the database information on the next page. The output alias is the name you can use in your query to direct the query output to this database. The default alias if you have one output is "output".

![graphic4][graphic4]

If you are using a database that exists within the same subscription you're using, you can select "Use SQL Database from Current Subscription", and select the database from the dropdown.

![graphic5][graphic5]

Click next to add this output. You should see two operations starting, the first is to add the output.

![graphic6][graphic6]

The second one is to test the connection. Azure Stream Analytics will try to connect to that SQL Database and verify the credentials you entered are correct and that the table is accessible. You should see one of two messages after it completes.

![graphic7][graphic7]

![graphic8][graphic8]



If that was the later, click "DETAILS" to view the exact details of the error.

![graphic9][graphic9]

In this example, the credentials that were provided were incorrect. You can correct the credentials and try testing again by clicking the "TEST CONNECTION" button.

![graphic10][graphic10]

## Using Blob Storage as an Output
---
For an introduction on Azure Blob Storage and its usage, review the article [An introduction to Windows Azure Blob Storage](https://www.simple-talk.com/cloud/cloud-data/an-introduction-to-windows-azure-blob-storage-/).

To start using an Azure Blog Storage Output, you should have the following information collect about your Table:

1. If your storage is in a different subscription than your streaming job you will need the Storage Account Name and Storage Account Key.
2. The container name.
3. The file name prefix.
4. What serialization format is utilized for the data (Avro, CSV, JSON).

Select output to Blog storage.
![graphic20][graphic20]

Then fill out the details as shown below:
![graphic21][graphic21]

## Using an Event Hub as an output
---
### Overview
 
Event Hubs are a highly scalable event ingestor, and typically are the most common way for Stream Analytics data ingress. Their robust handling of high numbers of events also make them perfect for job output.  The most common use of EH as output is when the output of an Stream Analytics job will be the input of another streaming job. For further details on Event Hubs visit the portal at [Event Hubs](https://azure.microsoft.com/services/event-hubs/ "Event Hubs").

### Consumer groups
Each Stream Analytics job output should be configured to have its own event-hub consumer group. When a job contains self-join or multiple outputs, some output may be read by more than one reader downstream, which causes the total number of readers in a single consumer group to exceed the event hub’s limit of 5 readers per consumer group. In this case, the query will need to be broken down into multiple queries and intermediate results routed through additional event hubs. Note that there is also a limit of 20 consumer groups per event hub. For details, see the [Event Hubs Programming Guide](https://msdn.microsoft.com/library/azure/dn789972.aspx "Event Hubs Programming Guide").

 
### Parameters
There are a few parameters that customers need to configure for Event Hub data streams.  These parameters apply to both Event Hub input and output data streams, unless noted otherwise.

1. Service Bus Namespace: Service Bus Namespace of the Event Hub. A Service Bus namespace is a container for a set of messaging entities. When you created a new Event Hub, you also created a Service Bus namespace. 
2. Event Hub Name: Name of the Event Hub.  It’s the name you specified when creating a new Event Hub. 
3. Event Hub Policy Name: The name of the shared access policy for accessing the Event Hub.  Shared access policies can be configured for an Event Hub on the Configure tab. Each shared access policy will have a name, permissions that you set, and access keys.
4. Event Hub Policy Key:  The primary or secondary key of the shared access policy for accessing the Event Hub.  
5. Event Hub Consumer Group: Optional parameter for Event Hub inputs.  The Consumer Group to ingest data from the Event Hub. If not specified, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub.   We recommend using a distinct consumer Group for each Stream Analytics job.
6. Partition Key Column:  Optional parameter for Event Hub outputs. The data attribute column that is used as the partition key for Event Hub output. 

## Service Bus Queue ##
---

## Add Power BI output ##
---
1.  Click **Output** from the top of the page, and then click **Add Output**. You will see Power BI listed as an output option.

    ![graphic22][graphic22]

    > [AZURE.NOTE] Power BI output is available only for Azure accounts using Org Ids. If you are not using an Org Id for your azure account (e.g. your live id/ personal Microsoft account), you will not see a Power BI output option.

2.  Select **Power BI** and then click the right button.
3.  You will see a screen like the following:

    ![graphic23][graphic23]

4.  In this step, you have to be careful to use the same Org Id that you are using for your Stream Analytics job. At this point, Power BI output has to use the same Org Id that your Stream Analytics job uses. If you already have Power BI account using the same Org Id, select “Authorize Now”. If not, choose “Sign up now” and use same Org Id as your azure account while signing up for Power BI. [Here is a good blog with a walkthrough of a Power BI sign-up](http://blogs.technet.com/b/powerbisupport/archive/2015/02/06/power-bi-sign-up-walkthrough.aspx). You can also assign your Azure account as your Power BI login account if you chose. Details are [here](https://support.powerbi.com/knowledgebase/articles/499083-how-to-use-the-same-account-login-for-power-bi-and).
5.  Next you will see a screen like the following:

    ![graphic24][graphic24]

Provide values as below:

* **Output Alias** – You can put any output alias that is easy for you to refer to. This output alias is particularly helpful if you decide to have multiple outputs for your job. In that case, you have to refer to this output in your query. For example, let’s use the output alias value = “OutPbi”.
* **Dataset Name** - Provide a dataset name that you want your Power BI output to have. For example, let’s use “pbidemo”.
*	**Table Name** - Provide a table name under the dataset of your Power BI output. Let’s say we call it “pbidemo”. Currently, Power BI output from Stream Analytics jobs may only have one table in a dataset.

>	[AZURE.NOTE] You should not explicitly create this dataset and table in your Power BI account. They will be automatically created when you start your Stream Analytics job and the job starts pumping output into Power BI. If your job query doesn’t return any results, the dataset and table will not be created.

*	Click **OK**, **Test Connection** and now you output configuraiton is complete.

>	[AZURE.WARNING] Also be aware that if Power BI already had a dataset and table with the same name as the one you provided in this Stream Analytics job, the existing data will be overwritten.


### Write a Query ###
Go to the **Query** tab of your job. Write your query, the output of which you want in your Power BI. For example, it could be something such as the following SQL query:

    SELECT
    	MAX(hmdt) AS hmdt,
    	MAX(temp) AS temp,
    	System.TimeStamp AS time,
    	dspl
    INTO
        OutPBI
    FROM
    	Input TIMESTAMP BY time
    GROUP BY
    	TUMBLINGWINDOW(ss,1),
    	dspl

    
    
Start your job. Validate that your event hub is receiving events and your query generates the expected results. If your query outputs 0 rows, Power BI dataset and tables will not be automatically created.

## Using Azure Table storage for an output
---
Table storage offers highly available, massively scalable storage, so that your application can automatically scale to meet user demand. Table storage is Microsoft’s NoSQL key/attribute store which one can leverage for structured data with less constraints on the schema. Azure Table storage can be used to store data for persistence and efficient retrieval. For further information on Azure Table storage visit [Azure Table storage](./articles/storage/storage-introduction.md).

To start using an Azure Table storage, you should have the following information about your Table:

1. Storage account name (if this storage is in a different subscription from your streaming job).
2. Storage account key (if this storage is in a different subscription from your streaming job).
3. Output table name (will be created if not exist).
4. Partition Key (required).
5.   Row key (currently this is required , according to customers feedback, we are planning to make this optional)

For a better design of Partition key and Row key, please refer article below
[Designing a Scalable Partitioning Strategy for Azure Table Storage](https://msdn.microsoft.com/library/azure/hh508997.aspx).


![graphic11][graphic11]


Go to the outputs tab of your job, and click on the "ADD OUTPUT" command and click next.


![graphic12][graphic12]


Choose "Table storage" as your output.


![graphic13][graphic13]


Enter the Azure Table information on the next page. The output alias is the name you can use in your query to direct the query output to this table.


![graphic14][graphic14]
![graphic15][graphic15]

Batch Size is the number of records for a batch operation, leave it as default if you are not familiar of it, or refer to the [Table Batch Operation spec](https://msdn.microsoft.com/library/microsoft.windowsazure.storage.table.tablebatchoperation.aspx) for more details.


If you are using a Azure storage that exists within the same subscription you're using, you can select "Use Storage Account from Current Subscription", and select the Storage Account from the dropdown.

Click next to add this output. You should see two operations starting, the first is to add the output.

![graphic16][graphic16]

The second one is to test the connection. Azure Stream Analytics will try to connect to that Storage Account and verify the credentials you entered are correct . You should see one of two messages after it completes.

![graphic17][graphic17]

If that was the later, click "DETAILS" to view the exact details of the error.

![graphic18][graphic18]

In this example, the credentials that were provided were incorrect. You can correct the credentials and try testing again by clicking the "TEST CONNECTION" button.

![graphic19][graphic19]







## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)




[graphic1]: ./media/stream-analytics-connect-data-event-outputs/1-stream-analytics-connect-data-event-input-output.png
[graphic2]: ./media/stream-analytics-connect-data-event-outputs/2-stream-analytics-connect-data-event-input-output.png
[graphic3]: ./media/stream-analytics-connect-data-event-outputs/3-stream-analytics-connect-data-event-input-output.png
[graphic4]: ./media/stream-analytics-connect-data-event-outputs/4-stream-analytics-connect-data-event-input-output.png
[graphic5]: ./media/stream-analytics-connect-data-event-outputs/5-stream-analytics-connect-data-event-input-output.png
[graphic6]: ./media/stream-analytics-connect-data-event-outputs/6-stream-analytics-connect-data-event-input-output.png
[graphic7]: ./media/stream-analytics-connect-data-event-outputs/7-stream-analytics-connect-data-event-input-output.png
[graphic8]: ./media/stream-analytics-connect-data-event-outputs/8-stream-analytics-connect-data-event-input-output.png
[graphic9]: ./media/stream-analytics-connect-data-event-outputs/9-stream-analytics-connect-data-event-input-output.png
[graphic10]: ./media/stream-analytics-connect-data-event-outputs/10-stream-analytics-connect-data-event-input-output.png
[graphic11]: ./media/stream-analytics-connect-data-event-outputs/11-stream-analytics-connect-data-event-input-output.png
[graphic12]: ./media/stream-analytics-connect-data-event-outputs/12-stream-analytics-connect-data-event-input-output.png
[graphic13]: ./media/stream-analytics-connect-data-event-outputs/13-stream-analytics-connect-data-event-input-output.png
[graphic14]: ./media/stream-analytics-connect-data-event-outputs/14-stream-analytics-connect-data-event-input-output.png
[graphic15]: ./media/stream-analytics-connect-data-event-outputs/15-stream-analytics-connect-data-event-input-output.png
[graphic16]: ./media/stream-analytics-connect-data-event-outputs/16-stream-analytics-connect-data-event-input-output.png
[graphic17]: ./media/stream-analytics-connect-data-event-outputs/17-stream-analytics-connect-data-event-input-output.png
[graphic18]: ./media/stream-analytics-connect-data-event-outputs/18-stream-analytics-connect-data-event-input-output.png
[graphic19]: ./media/stream-analytics-connect-data-event-outputs/19-stream-analytics-connect-data-event-input-output.png
[graphic20]: ./media/stream-analytics-connect-data-event-outputs/20-stream-analytics-connect-data-event-input-output.png
[graphic21]: ./media/stream-analytics-connect-data-event-outputs/21-stream-analytics-connect-data-event-input-output.png
[graphic22]: ./media/stream-analytics-connect-data-event-outputs/22-stream-analytics-connect-data-event-input-output.png
[graphic23]: ./media/stream-analytics-connect-data-event-outputs/23-stream-analytics-connect-data-event-input-output.png
[graphic24]: ./media/stream-analytics-connect-data-event-outputs/24-stream-analytics-connect-data-event-input-output.png
[graphic25]: ./media/stream-analytics-connect-data-event-outputs/25-stream-analytics-connect-data-event-input-output.png
[graphic26]: ./media/stream-analytics-connect-data-event-outputs/26-stream-analytics-connect-data-event-input-output.png
[graphic27]: ./media/stream-analytics-connect-data-event-outputs/27-stream-analytics-connect-data-event-input-output.png
[graphic28]: ./media/stream-analytics-connect-data-event-outputs/28-stream-analytics-connect-data-event-input-output.png
[graphic29]: ./media/stream-analytics-connect-data-event-outputs/29-stream-analytics-connect-data-event-input-output.png
[graphic30]: ./media/stream-analytics-connect-data-event-outputs/30-stream-analytics-connect-data-event-input-output.png