<properties 
	pageTitle="Connect to inputs and outputs | Azure" 
	description="Learn how to connect to and configure the input sources and output targets for Stream Analytics solutions." 
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
	ms.date="04/24/2015" 
	ms.author="jeffstok"/>

#Connect to inputs and outputs
In this document you will discover the different methods of configuring input sources and output targets for Stream Analytics solutions.

##Using SQL as output

You can use Azure SQL databases as output for data that is relational in nature or for applications that depend on content being hosted in a database.

[http://azure.microsoft.com/services/sql-database/](http://azure.microsoft.com/services/sql-database/)

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

##Using Event Hubs

###Overview
 
Event Hubs are a highly scalable event ingestor, and typically are the most common way for Stream Analytics data ingress. They're designed to collect event streams from a number of different devices and services. Event Hubs and Stream Analytics together provide customers an end to end solution for real time analytics -- Event Hubs allow customers feed events into Azure in real time, and Stream Analytics jobs can process them in real time.  For example, customers can publish web clicks, sensor readings, online log events to Event Hubs, and create Stream Analytics jobs to use Event Hubs as the input data streams for real time filtering, aggregating and joining.
Event Hubs can be used for data egress also.  The most common use of EH as output is when the output of an Stream Analytics job will be the input of another streaming job.

###Consumer groups
Each Stream Analytics job input should be configured to have its own event-hub consumer group. When a job contains self-join or multiple outputs, some input may be read by more than one reader, which causes the total number of readers in a single consumer group to exceed the event hub’s limit of 5 readers per consumer group. In this case, the query will need to be broken down into multiple queries and intermediate results routed through additional event hubs. Note that there is also a limit of 20 consumer groups per event hub. For details, see Event Hubs developer guide.

 
###Parameters
 
There are a few parameters that customers need to configure for Event Hub data streams.  These parameters apply to both Event Hub input and output data streams, unless noted otherwise.

1. Service Bus Namespace: Service Bus Namespace of the Event Hub. A Service Bus namespace is a container for a set of messaging entities. When you created a new Event Hub, you also created a Service Bus namespace. 
2. Event Hub Name: Name of the Event Hub.  It’s the name you specified when creating a new Event Hub. 
3. Event Hub Policy Name: The name of the shared access policy for accessing the Event Hub.  Shared access policies can be configured for an Event Hub on the Configure tab. Each shared access policy will have a name, permissions that you set, and access keys.
4. Event Hub Policy Key:  The primary or secondary key of the shared access policy for accessing the Event Hub.  
5. Event Hub Consumer Group: Optional parameter for Event Hub inputs.  The Consumer Group to ingest data from the Event Hub. If not specified, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub.   We recommend using a distinct consumer Group for each Stream Analytics job.

Partition Key Column:  Optional parameter for Event Hub outputs. The data attribute column that is used as the partition key for Event Hub output. 

##Using Azure table output

One can use azure table for structured data with less constraints on the schema. Azure Table storage can be used to store data for persistence and efficient retrieval.
For more information see:
  [Introduction to Azure Storage](http://azure.microsoft.com/storage-introduction/)
 
To start using an Azure Table Storage, you should have the following information about your Table:

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

Batch Size is the number of records for a batch operation, leave it as default if you are not familiar of it, or refer to [https://msdn.microsoft.com/library/microsoft.windowsazure.storage.table.tablebatchoperation.aspx](https://msdn.microsoft.com/library/microsoft.windowsazure.storage.table.tablebatchoperation.aspx) for more details 


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




[graphic1]: ./media/stream-analytics-connect-data-event-input-output/1-stream-analytics-connect-data-event-input-output.png
[graphic2]: ./media/stream-analytics-connect-data-event-input-output/2-stream-analytics-connect-data-event-input-output.png
[graphic3]: ./media/stream-analytics-connect-data-event-input-output/3-stream-analytics-connect-data-event-input-output.png
[graphic4]: ./media/stream-analytics-connect-data-event-input-output/4-stream-analytics-connect-data-event-input-output.png
[graphic5]: ./media/stream-analytics-connect-data-event-input-output/5-stream-analytics-connect-data-event-input-output.png
[graphic6]: ./media/stream-analytics-connect-data-event-input-output/6-stream-analytics-connect-data-event-input-output.png
[graphic7]: ./media/stream-analytics-connect-data-event-input-output/7-stream-analytics-connect-data-event-input-output.png
[graphic8]: ./media/stream-analytics-connect-data-event-input-output/8-stream-analytics-connect-data-event-input-output.png
[graphic9]: ./media/stream-analytics-connect-data-event-input-output/9-stream-analytics-connect-data-event-input-output.png
[graphic10]: ./media/stream-analytics-connect-data-event-input-output/10-stream-analytics-connect-data-event-input-output.png
[graphic11]: ./media/stream-analytics-connect-data-event-input-output/11-stream-analytics-connect-data-event-input-output.png
[graphic12]: ./media/stream-analytics-connect-data-event-input-output/12-stream-analytics-connect-data-event-input-output.png
[graphic13]: ./media/stream-analytics-connect-data-event-input-output/13-stream-analytics-connect-data-event-input-output.png
[graphic14]: ./media/stream-analytics-connect-data-event-input-output/14-stream-analytics-connect-data-event-input-output.png
[graphic15]: ./media/stream-analytics-connect-data-event-input-output/15-stream-analytics-connect-data-event-input-output.png
[graphic16]: ./media/stream-analytics-connect-data-event-input-output/16-stream-analytics-connect-data-event-input-output.png
[graphic17]: ./media/stream-analytics-connect-data-event-input-output/17-stream-analytics-connect-data-event-input-output.png
[graphic18]: ./media/stream-analytics-connect-data-event-input-output/18-stream-analytics-connect-data-event-input-output.png
[graphic19]: ./media/stream-analytics-connect-data-event-input-output/19-stream-analytics-connect-data-event-input-output.png
