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
When creating a Stream Analytics job, one of the considerations is how the output of the job is consumed. How are the consumers of the data transformation viewing the results of the Stream Analytics job? What tool(s) will they be using to analyze the output? Is data retention or warehousing a requirement?

Azure Stream Analytics provides seven different methods for storing and viewing job outputs. SQL Database, Blob storage, Event Hubs, Service Bus Queues, Service Bus Topics, Power BI and Table storage. This provides for both ease of viewing job output and flexibility in the consumption and storage of the job output for data warehousing and other purposes.

## Using a SQL Database as an output
---
A SQL Database can be used as an output for data that is relational in nature or for applications that depend on content being hosted in a relational database. For more information on Azure SQL databases see [Azure SQL Databases](http://azure.microsoft.com/services/sql-database/).

To start using a SQL Database, the following information will be needed about the SQL Database:

1. Server Name
2. Database Name
3. A valid username/password combination
4. Output table name

![graphic1][graphic1]

Go to the outputs tab of the job, and click on the "ADD OUTPUT" command and click next.

![graphic2][graphic2]

Choose "SQL Database" as the output.

![graphic3][graphic3]

Enter the database information on the next page. The output alias is a friendly name used in queries to direct the query output to this database. The default alias if if only a single output is present is "output".

![graphic4][graphic4]

If the database exists within the same subscription as the Stream Analytics job, the option to select "Use SQL Database from Current Subscription", is available. Then select the database from the drop down list.

![graphic5][graphic5]

Click next to add this output. Two operations should start, the first is to add the output.

![graphic6][graphic6]

The second operation is to test the connection. Azure Stream Analytics will try to connect to the SQL Database and verify the credentials entered are correct and that the table is accessible. After this is complete, one of two messages will appear:

![graphic7][graphic7]

![graphic8][graphic8]

If that was "Connection testing has failed" , click "DETAILS" to view the exact details of the error.

![graphic9][graphic9]

In this example, the credentials that were provided were incorrect. Simply supplying the correct credentials and retesting the connection is sufficient for remediation.

![graphic10][graphic10]

## Using Blob storage as an Output
---
For an introduction on Azure Blob storage and its usage, review the article [An introduction to Windows Azure Blob storage](https://www.simple-talk.com/cloud/cloud-data/an-introduction-to-windows-azure-blob-storage-/).

To start using a Blob storage output, the following information will be needed about the Table:

1. If the storage account is in a different subscription than the streaming job then fields will appear to provide the Storage Account Name and Storage Account Key.
2. The container name.
3. The file name prefix.
4. What serialization format is utilized for the data (Avro, CSV, JSON).

Select output to Blob storage.
![graphic20][graphic20]

Then supply the details as shown below:
![graphic21][graphic21]

## Using an Event Hub as an output
---
### Overview
 
Event Hubs are a highly scalable event ingestor, and typically are the most common way for Stream Analytics data ingress. Their robust handling of high numbers of events also make them perfect for job output.  One use of an Event Hub as output is when the output of an Stream Analytics job will be the input of another streaming job. For further details on Event Hubs visit the portal at [Event Hubs](https://azure.microsoft.com/services/event-hubs/ "Event Hubs").

### Consumer groups
Each Stream Analytics job output should be configured to have its own Event Hub consumer group. When a job contains self-join or multiple outputs, some output may be read by more than one reader downstream, which causes the total number of readers in a single consumer group to exceed the event hub’s limit of 5 readers per consumer group. In this case, the query will need to be broken down into multiple queries and intermediate results routed through additional event hubs. Note that there is also a limit of 20 consumer groups per event hub. For details, see the [Event Hubs Programming Guide](https://msdn.microsoft.com/library/azure/dn789972.aspx "Event Hubs Programming Guide").

 
### Parameters
There are a few parameters that customers need to configure for Event Hub data streams.  These parameters apply to both Event Hub input and output data streams, unless noted otherwise.

1. Service Bus Namespace: Service Bus Namespace of the Event Hub. A Service Bus namespace is a container for a set of messaging entities. When creating a new Event Hub, a Service Bus namespace is also created. 
2. Event Hub Name: Name of the Event Hub.  It’s the name specified when creating a new Event Hub. 
3. Event Hub Policy Name: The name of the shared access policy for accessing the Event Hub.  Shared access policies can be configured for an Event Hub on the Configure tab. Each shared access policy will have a name, permissions set, and access keys generated.
4. Event Hub Policy Key:  The primary or secondary key of the shared access policy for accessing the Event Hub.  
5. Event Hub Consumer Group: Optional parameter for Event Hub inputs.  The Consumer Group to ingest data from the Event Hub. If not specified, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub.   It is recommended to utilize a distinct consumer Group for each Stream Analytics job.
6. Partition Key Column:  Optional parameter for Event Hub outputs. The data attribute column that is used as the partition key for Event Hub output. 

## Service Bus Queue ##
---
### Introduction to Service Bus Queue concepts ###
Service Bus Queues offer a First In, First Out (FIFO) message delivery to one or more competing consumers. Typically, messages are expected to be received and processed by the receivers in the temporal order in which they were added to the queue, and each message is received and processed by only one message consumer.

Some benefits of using Service Bus Queues are:
- The senders and receivers do not need to transmit/receive messages at the same time, a queue exists for buffering the messages.
- The sender does not need to wait for an acknowledgment of reception of the sent message to continue processing messages.
- Because there is a queue and ability to buffer messages, the senders and receivers of messages can send and receive/process messages at differing rates. This is very useful in the event the events have sporadic or unpredictable rates and your receivers can only process events at a fixed rate.

For further information on Service Bus Queues see [Service Bus Queues, Topics, and Subscriptions](https://msdn.microsoft.com/library/azure/hh367516.aspx "Service Bus Queues, Topics, and Subscriptions") and [An Introduction to Service Bus Queues](http://blogs.msdn.com/b/appfabric/archive/2011/05/17/an-introduction-to-service-bus-queues.aspx "An Introduction to Service Bus Queues").

### Adding a Service Bus Queue via the Azure Portal ###

## Service Bus Topic ##
---
### Introduction to Service Bus Topic concepts ###
Whereas Service Bus Queues provide a one to one communication method from sender to receiver, Service Bus Topics and subscriptions provide a one-to-many form of communication.

Some benefits of using Service Bus Topics are:
- Scaling capabilities where each published message is made available to each subscription registered with a topic.
- Filter rules can be set on a per-subscription basis to control what messages the subscription receives.

For further informaiton on Service Bus Topics see [Service Bus Queues, Topics, and Subscriptions](https://msdn.microsoft.com/library/azure/hh367516.aspx "Service Bus Queues, Topics, and Subscriptions") and [An Introduction to Service Bus Topics](http://blogs.msdn.com/b/appfabric/archive/2011/05/25/an-introduction-to-service-bus-topics.aspx "An Introduction to Service Bus Topics")

### Adding a Service Bus Topic via the Azure Portal ###

## Power BI as an output ##
---
Power BI can be utilized as an output for a Stream Analytics job to provide for a rich visualization experience for Stream Analytics users. This capability can be utilized for operational dashboards, report generation and metric driven reporting. Note that multiple Power BI outputs may exist on a single Stream Analytics job.

1.  Click **Output** from the top of the page, and then click **Add Output**. Power BI listed as an output option.

    ![graphic22][graphic22]

    > [AZURE.NOTE] Power BI output is available only for Azure accounts using Org Ids. If you are not using an Org Id for your azure account (e.g. your live id/ personal Microsoft account), you will not see a Power BI output option.

2.  Select **Power BI** and then click the right button.
3.  A screen like the following is presented.

    ![graphic23][graphic23]

4.  In this step, it is important to use the same Org Id that is being for the Stream Analytics job. At this point, Power BI output has to use the same Org Id that the Stream Analytics job uses. If there is already a Power BI account using the same Org Id, select “Authorize Now”. If not, choose “Sign up now” and use same Org Id as your azure account while signing up for Power BI. [Here is a good blog with a walkthrough of a Power BI sign-up](http://blogs.technet.com/b/powerbisupport/archive/2015/02/06/power-bi-sign-up-walkthrough.aspx). One may also assign an Azure account as a Power BI login account if desired. Details are [here](https://support.powerbi.com/knowledgebase/articles/499083-how-to-use-the-same-account-login-for-power-bi-and).
5.  Next a screen like the following will be presented.

    ![graphic24][graphic24]

Provide values as below:

* **Output Alias** – Any friendly-named output alias that is easy to refer to. This output alias is particularly helpful if it is decided to have multiple outputs for a job. In that case, this alias will be referred to in your query. For example, use the output alias value = “OutPbi”.
* **Dataset Name** - Provide a dataset name that it is desired for the Power BI output to use. For example, use “pbidemo”.
*	**Table Name** - Provide a table name under the dataset of the Power BI output. For example, use “pbidemo”. **Currently, Power BI output from Stream Analytics jobs may only have one table in a dataset.**

>	[AZURE.NOTE] One should not explicitly create this dataset and table in the Power BI dashboard. The dataset and table will be automatically populated when the job is started and the job starts pumping output into Power BI. Note that if the job query doesn’t return any results, the dataset and table will not be created.

*	Click **OK**, **Test Connection** and now the output configuration is complete.

>	[AZURE.WARNING] Also be aware that if Power BI already had a dataset and table with the same name as the one provided in this Stream Analytics job, the existing data will be overwritten.


### Write a Query ###
Go to the **Query** tab of the job. Write the query, the output of which is desired in the Power BI dashboard. For example, it could be something such as the following SQL query:

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

        
Start the job. Validate that the Event hub is receiving events and that the query generates the expected results. If the query outputs 0 rows, the Power BI dataset and tables will not be automatically created.

## Using Azure Table storage for an output
---
Table storage offers highly available, massively scalable storage, so that an application can automatically scale to meet user demand. Table storage is Microsoft’s NoSQL key/attribute store which one can leverage for structured data with less constraints on the schema. Azure Table storage can be used to store data for persistence and efficient retrieval. For further information on Azure Table storage visit [Azure Table storage](./articles/storage/storage-introduction.md).

To start using an Azure Table storage, the following information is needed:

1. Storage account name (if this storage is in a different subscription from the streaming job).
2. Storage account key (if this storage is in a different subscription from the streaming job).
3. Output table name (will be created if not exist).
4. Partition Key (required).
5. Row key

For a better design of Partition key and Row key, please refer article below
[Designing a Scalable Partitioning Strategy for Azure Table Storage](https://msdn.microsoft.com/library/azure/hh508997.aspx).


![graphic11][graphic11]


Go to the outputs tab of the job, and click on the "ADD OUTPUT" command and click next.


![graphic12][graphic12]


Choose "Table storage" as the output.


![graphic13][graphic13]


Enter the Azure Table information on the next page. The output alias is the name that can be used in the query to direct the query output to this table.


![graphic14][graphic14]
![graphic15][graphic15]

Batch Size is the number of records for a batch operation. Typically the default is sufficient for most jobs, refer to the [Table Batch Operation spec](https://msdn.microsoft.com/library/microsoft.windowsazure.storage.table.tablebatchoperation.aspx) for more details on modifying this setting.


If an Azure Storage account exists within the same subscription being used to create the job, select "Use Storage Account from Current Subscription", and select the Storage Account from the drop down.

Click next to add this output. Two two operations should start, the first is to add the output.

![graphic16][graphic16]

The second one is to test the connection. Azure Stream Analytics will try to connect to that Storage Account and verify the credentials entered are correct.

![graphic17][graphic17]

![graphic18][graphic18]

If that was the later, click "DETAILS" to view the exact details of the error.

In this example, the credentials that were provided were incorrect. Correcting the credentials and test again by clicking the "TEST CONNECTION" button if necessary.

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