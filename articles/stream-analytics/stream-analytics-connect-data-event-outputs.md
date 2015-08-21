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
	ms.date="08/19/2015" 
	ms.author="jeffstok"/>

# Create Stream Analytics outputs

## Understanding Stream Analytics outputs ##
---
When creating a Stream Analytics job, one of the considerations is how the output of the job is consumed. How are the consumers of the data transformation viewing the results of the Stream Analytics job? What tool(s) will they be using to analyze the output? Is data retention or warehousing a requirement?

Azure Stream Analytics provides seven different methods for storing and viewing job outputs. SQL Database, Blob storage, Event Hubs, Service Bus Queues, Service Bus Topics, Power BI and Table storage. This provides for both ease of viewing job output and flexibility in the consumption and storage of the job output for data warehousing and other purposes.

## Using a SQL Database as an output ##
---
A SQL Database can be used as an output for data that is relational in nature or for applications that depend on content being hosted in a relational database. For more information on Azure SQL databases see [Azure SQL Databases](http://azure.microsoft.com/services/sql-database/).

### Parameters ###

To start using a SQL Database, the following information will be needed about the SQL Database:

1. Server Name
2. Database Name
3. A valid username/password combination
4. Output table name. This table must already exist, the job will not create it.

### Adding SQL Database as an output ###

![graphic1][graphic1]

Go to the outputs tab of the job, and click on the **ADD OUTPUT** command and click next.

![graphic2][graphic2]

Choose **SQL Database** as the output.

![graphic3][graphic3]

Enter the database information on the next page. The output alias is a friendly name used in queries to direct the query output to this database. The default alias if if only a single output is present is "output".

![graphic4][graphic4]

If the database exists within the same subscription as the Stream Analytics job, the option to select "Use SQL Database from Current Subscription", is available. Then select the database from the drop down list.

![graphic5][graphic5]

Click next to add this output. Two operations should start, the first is to add the output.

![graphic6][graphic6]

The second operation is to test the connection. Azure Stream Analytics will try to connect to the SQL Database and verify the credentials entered are correct and that the table is accessible.

## Using Blob storage as an output ##
---
For an introduction on Azure Blob storage and its usage, see the documentation at [How to use Blobs](./articles/storage/storage-dotnet-how-to-use-blobs.md).

### Parameters ###

To start using a Blob storage output, the following information will be needed:

1. If the storage account is in a different subscription than the streaming job then fields will appear to provide the Storage Account Name and Storage Account Key.
2. The container name.
3. The file name prefix.
4. What serialization format is utilized for the data (Avro, CSV, JSON).

### Adding Blob storage as an output ###

Select output to Blob storage.

![graphic20][graphic20]

Then supply the details as shown below:

![graphic21][graphic21]

## Using an Event Hub as an output ##
---
### Overview ###
 
Event Hubs are a highly scalable event ingestor, and typically are the most common way for Stream Analytics data ingress. Their robust handling of high numbers of events also make them perfect for job output.  One use of an Event Hub as output is when the output of an Stream Analytics job will be the input of another streaming job. For further details on Event Hubs visit the portal at [Event Hubs](https://azure.microsoft.com/services/event-hubs/ "Event Hubs").
 
### Parameters ###

There are a few parameters that are needed to configure Event Hub data streams.

1. Service Bus Namespace: Service Bus Namespace of the Event Hub. A Service Bus namespace is a container for a set of messaging entities. When creating a new Event Hub, a Service Bus namespace is also created. 
2. Event Hub Name: Name of the Event Hub.  It’s the name specified when creating a new Event Hub. 
3. Event Hub Policy Name: The name of the shared access policy for accessing the Event Hub.  Shared access policies can be configured for an Event Hub on the Configure tab. Each shared access policy will have a name, permissions set, and access keys generated.
4. Event Hub Policy Key:  The primary or secondary key of the shared access policy for accessing the Event Hub.  
5. Partition Key Column:  Optional parameter for Event Hub outputs. This column contains the partition key for Event Hub output.

### Adding an Event Hub as an output ###

1. Click **Output** from the top of the page, and then click **Add Output**. Select Event Hub as the output option and click the right button at the bottom of the window.

    ![graphic38][graphic38]

2. Provide the relevant information into the fields for the output and when finished click the right button at the bottom of the window to proceed.

    ![graphic36][graphic36]

3. Validate the Event Serialization Format, Encoding type and Format are set to the appropriate values and click the check box to complete the action.

    ![graphic37][graphic37]

## Using Power BI as an output ##
---
### Overview ###
Power BI can be utilized as an output for a Stream Analytics job to provide for a rich visualization experience for Stream Analytics users. This capability can be utilized for operational dashboards, report generation and metric driven reporting. For more information on Power BI visit the [Power BI](https://powerbi.microsoft.com/) site.

### Parameters ###

There are a few parameters that are needed to configure a Power BI output.

1. Output Alias – Any friendly-named output alias that is easy to refer to. This output alias is particularly helpful if it is decided to have multiple outputs for a job. In that case, this alias will be referred to in your query. For example, use the output alias value = “OutPbi”.
2. Dataset Name - Provide a dataset name that it is desired for the Power BI output to use. For example, use “pbidemo”.
2. Table Name - Provide a table name under the dataset of the Power BI output. For example, use “pbidemo”. **Currently, Power BI output from Stream Analytics jobs may only have one table in a dataset.**

### Adding Power BI as an output ###

1.  Click **Output** from the top of the page, and then click **Add Output**. Select Power BI as the output option.

    ![graphic22][graphic22]

2.  A screen like the following is presented.

    ![graphic23][graphic23]

3.  In this step, provide the work or school account for authorizing the Power BI output. If you are not already signed up for Power BI, choose **Sign up now**.
4.  Next a screen like the following will be presented.

    ![graphic24][graphic24]


>	[AZURE.NOTE] One should not explicitly create the dataset and table in the Power BI dashboard. The dataset and table will be automatically populated when the job is started and the job starts pumping output into Power BI. Note that if the job query doesn’t return any results, the dataset and table will not be created. Also be aware that if Power BI already had a dataset and table with the same name as the one provided in this Stream Analytics job, the existing data will be overwritten.

*	Click **OK**, **Test Connection** and now the output configuration is complete.


## Using Azure Table storage for an output ##
---
Table storage offers highly available, massively scalable storage, so that an application can automatically scale to meet user demand. Table storage is Microsoft’s NoSQL key/attribute store which one can leverage for structured data with less constraints on the schema. Azure Table storage can be used to store data for persistence and efficient retrieval. For further information on Azure Table storage visit [Azure Table storage](./articles/storage/storage-introduction.md).

### Parameters ###

To start using an Azure Table storage, the following information is needed:

1. Storage account name (if this storage is in a different subscription from the streaming job).
2. Storage account key (if this storage is in a different subscription from the streaming job).
3. Output table name (will be created if not exist).
4. Partition Key (required).
5. Row key

For a better design of Partition key and Row key, please refer article below
[Designing a Scalable Partitioning Strategy for Azure Table Storage](https://msdn.microsoft.com/library/azure/hh508997.aspx).

### Adding Azure Table storage as an output ###

![graphic11][graphic11]

Go to the outputs tab of the job, and click on the **ADD OUTPUT** command and click next.

![graphic12][graphic12]

Choose **Table storage** as the output.

![graphic13][graphic13]

Enter the Azure Table information on the next page. The output alias is the name that can be used in the query to direct the query output to this table.

![graphic14][graphic14]

![graphic15][graphic15]

Batch Size is the number of records for a batch operation. Typically the default is sufficient for most jobs, refer to the [Table Batch Operation spec](https://msdn.microsoft.com/library/microsoft.windowsazure.storage.table.tablebatchoperation.aspx) for more details on modifying this setting.

If an Azure Storage account exists within the same subscription being used to create the job, select "Use Storage Account from Current Subscription", and select the Storage Account from the drop down.

Click next to add this output. Two two operations should start, the first is to add the output.

![graphic16][graphic16]

The second one is to test the connection. Azure Stream Analytics will try to connect to that Storage Account and verify the credentials entered are correct.

## Service Bus Queues ##
---
### Introduction to Service Bus Queues concepts ###
Service Bus Queues offer a First In, First Out (FIFO) message delivery to one or more competing consumers. Typically, messages are expected to be received and processed by the receivers in the temporal order in which they were added to the queue, and each message is received and processed by only one message consumer.

For further information on Service Bus Queues see [Service Bus Queues, Topics, and Subscriptions](https://msdn.microsoft.com/library/azure/hh367516.aspx "Service Bus Queues, Topics, and Subscriptions") and [An Introduction to Service Bus Queues](http://blogs.msdn.com/b/appfabric/archive/2011/05/17/an-introduction-to-service-bus-queues.aspx "An Introduction to Service Bus Queues").

### Parameters ###

To start using a Service Bus Queues output, the following information will be needed:

1. Output Alias – Any friendly-named output alias that is easy to refer to. This output alias is particularly helpful if it is decided to have multiple outputs for a job. In that case, this alias will be referred to in the job query.
2. The namespace and service bus name.
3. Queue Name - Queues are messaging entities, similar to event hubs and topics. They're designed to collect event streams from a number of different devices and services. When a queue is created it is also given a specific name.
4. What serialization format is utilized for the data (Avro, CSV, JSON).

### Adding Service Bus Queues as an output ###

![graphic31][graphic31]

Then supply the details as shown below and select next.

![graphic32][graphic32]

Verify your data format and serialization are correct.

![graphic33][graphic33]

## Service Bus Topics ##
---
### Introduction to Service Bus Topics concepts ###
While Service Bus Queues provide a one to one communication method from sender to receiver, Service Bus Topics provide a one-to-many form of communication.

For further information on Service Bus Topics see [Service Bus Queues, Topics, and Subscriptions](https://msdn.microsoft.com/library/azure/hh367516.aspx "Service Bus Queues, Topics, and Subscriptions") and [An Introduction to Service Bus Topics](http://blogs.msdn.com/b/appfabric/archive/2011/05/25/an-introduction-to-service-bus-topics.aspx "An Introduction to Service Bus Topics")

### Parameters ###

To start using a Service Bus Topics output, the following information will be needed:

1. Output Alias – Any friendly-named output alias that is easy to refer to. This output alias is particularly helpful if it is decided to have multiple outputs for a job. In that case, this alias will be referred to in your query.
2. The namespace and service bus name.
3. Topic Name - Topics are messaging entities, similar to event hubs and queues. They're designed to collect event streams from a number of different devices and services. When a topic is created, it is also given a specific name. The messages sent to a Topic will not be available unless a subscription is created, so ensure there are one or more subscriptions under the topic.
4. What serialization format is utilized for the data (Avro, CSV, JSON).

### Adding Service Bus Topics as an output ###

Select output to Service Bus Topics.

![graphic34][graphic34]

Then supply the details as shown below and select next.

![graphic35][graphic35]

Verify your data format and serialization are correct.

![graphic33][graphic33]


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
[graphic31]: ./media/stream-analytics-connect-data-event-outputs/31-stream-analytics-connect-data-event-input-output.png
[graphic32]: ./media/stream-analytics-connect-data-event-outputs/32-stream-analytics-connect-data-event-input-output.png
[graphic33]: ./media/stream-analytics-connect-data-event-outputs/33-stream-analytics-connect-data-event-input-output.png
[graphic34]: ./media/stream-analytics-connect-data-event-outputs/34-stream-analytics-connect-data-event-input-output.png
[graphic35]: ./media/stream-analytics-connect-data-event-outputs/35-stream-analytics-connect-data-event-input-output.png
[graphic36]: ./media/stream-analytics-connect-data-event-outputs/36-stream-analytics-connect-data-event-input-output.png
[graphic37]: ./media/stream-analytics-connect-data-event-outputs/37-stream-analytics-connect-data-event-input-output.png
[graphic38]: ./media/stream-analytics-connect-data-event-outputs/38-stream-analytics-connect-data-event-input-output.png