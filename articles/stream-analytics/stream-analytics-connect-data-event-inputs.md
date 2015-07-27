<properties 
	pageTitle="Create Stream Analytics Inputs | Microsoft Azure" 
	description="Learn how to connect to and configure the input sources for Stream Analytics solutions."
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

# Connect Stream Analytics inputs

## Understanding Stream Analytics inputs
---
When creating a Stream Analytics job, the user must understand the type of data being analyzed. As long as the job is composed of at least a single streaming data source, Stream Analytics jobs can process it. If the data also includes additional auxiliary data sources or even stored time-based events, it is important to understand the two input methods for Stream Analytics and which is appropriate for each dataset in the present use case.

## Data stream inputs
---
At a basic level, Stream Analytics job definitions must include at least one data stream input source to be consumed and transformed by the job. Azure Blob storage and Azure Event Hubs are supported as data stream input sources. Azure Event Hubs input sources are used to collect event streams from multiple devices and services

Alternately, Azure Blob storage can be used as an input source for ingesting bulk data. It is important to note that when using Azure Blobs the data is rest and therefore Stream Analytics will interpret all data contained in a blob as having the timestamp of the creation timestamp of the blob itself. That is, unless the records in the blob contain timestamps.

## Reference data inputs
---
Stream Analytics also supports a second type of input source data known as reference data. This is auxiliary data which is typically used for performing correlation and look-ups, and the data here is usually static or infrequently changed. Azure Blob storage is the only supported input source for reference data. Reference data source blobs are limited to 50MB in size.

To enable support for refreshing reference data the user may specify a list of blobs in the input configuration using the {date} and {time} tokens inside the path pattern. The job will load the corresponding blob based on the date and time encoded in the blob names using UTC time zone.

For example if the job has a reference input configured in the portal with the path pattern such as: /sample/{date}/{time}/products.csv where the date format is “YYYY-MM-DD” and the time format is “HH:mm” than the job will pick up a file named /sample/2015-04-16/17:30/products.csv at 5:30 PM on April 16th 2015 UTC time zone (which is equivalent to 10:30 AM on April 16th 2015 using PST time zone).

## Creation of a data stream input
---
To create a data stream input, simply go to the **Inputs** tab of the Stream Analytics job and click **Add Input** at the bottom of the page.

![image1](./media/stream-analytics-connect-data-event-inputs/01-stream-analytics-create-inputs.png)

 As discussed previously in this article, the typical data stream input for a Stream Analytics job is an Azure Event Hub. There are use cases for the data stream input being a Blob however, so both are documented in this article. Creating a data stream input will present the user with two choices, [**Event Hub**](Creating-an-Event-hub-input-data-stream) or [**Blob storage**](Creating-a Blob-storage-input-data-stream). Select the appropriate for your dataset.

![image2](./media/stream-analytics-connect-data-event-inputs/02-stream-analytics-create-inputs.png)

## Creating an Event hub input data stream
---
### Overview of Event hubs
Event Hubs are a highly scalable event ingestor, and typically are the most common way for Stream Analytics data ingress. They're designed to collect event streams from a number of different devices and services. Event Hubs and Stream Analytics together provide customers an end to end solution for real time analytics -- Event Hubs allow customers feed events into Azure in real time, and Stream Analytics jobs can process them in real time.  For example, customers can publish web clicks, sensor readings, online log events to Event Hubs, and create Stream Analytics jobs to use Event Hubs as the input data streams for real time filtering, aggregating and joining. Event Hubs can be used for data egress also.  The most common use of EH as output is when the output of an Stream Analytics job will be the input of another streaming job. For further details on Event Hubs visit the portal at [Event Hubs](https://azure.microsoft.com/services/event-hubs/ "Event Hubs").

### Consumer groups
Each Stream Analytics job output should be configured to have its own event-hub consumer group. When a job contains self-join or multiple outputs, some input may be read by more than one reader downstream, which causes the total number of readers in a single consumer group to exceed the event hub’s limit of 5 readers per consumer group. In this case, the query will need to be broken down into multiple queries and intermediate results routed through additional event hubs. Note that there is also a limit of 20 consumer groups per event hub. For details, see the [Event Hubs Programming Guide](https://msdn.microsoft.com/library/azure/dn789972.aspx "Event Hubs Programming Guide").

## Creating the Event hub input data stream
---
Below is a walkthrough to configure an Event hub as an input. To start using an Event hub input, the user should have the following information collect about the Table:

1. The name of the Service Bus Namespace. 
2. The name of the Event hub.
3. The Event hub Policy Name.
4. Optional: Event Hub Consumer Group name.
	- The Consumer Group to ingest data from the Event Hub. If not specified, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub.   It is recommended to use a distinct consumer Group for each Stream Analytics job.
5. What serialization format is utilized for the data stream (Avro, CSV, JSON).

First select **ADD INPUT** from the Inputs page of the Stream Analytics job.

![image1](./media/stream-analytics-connect-data-event-inputs/01-stream-analytics-create-inputs.png)

Then select the Event hub as your input.

![image6](./media/stream-analytics-connect-data-event-inputs/06-stream-analytics-create-inputs.png)

Then input the information into the fields as shown below for the Event hub.

![image7](./media/stream-analytics-connect-data-event-inputs/07-stream-analytics-create-inputs.png)

Then validate the event serialization format is correct for the data stream.

![image8](./media/stream-analytics-connect-data-event-inputs/08-stream-analytics-create-inputs.png)

Then check the **Complete** checkbox and your Event hub input is now created.

## Creating a Blob storage input data stream
---
For scenarios with large amounts of unstructured data to store in the cloud, Blob storage offers a cost-effective and scalable solution. For further information on Blog storage visit the portal at [Blog storage](http://azure.microsoft.com/services/storage/blobs/)

Below is a walkthrough to configure Blog storage as an input. To start using an Azure Blog storage input, the user should have the following information collect about the Table:

1. If the storage account is in a different subscription than the streaming job the user will need the Storage Account Name and Storage Account Key.
2. The container name.
3. The file name prefix.
4. What serialization format is utilized for the data (Avro, CSV, JSON).

On the inputs tab of the Stream Analytics job, click **ADD INPUT** and then select the default option, **Data stream**.
![image1](./media/stream-analytics-connect-data-event-inputs/01-stream-analytics-create-inputs.png)

Next select **Blob storage**

![image2](./media/stream-analytics-connect-data-event-inputs/02-stream-analytics-create-inputs.png)

Then input the information into the fields as shown below for the storage account.

![image3](./media/stream-analytics-connect-data-event-inputs/03-stream-analytics-create-inputs.png)

> [AZURE.NOTE]If the user checks the box of 'Configure Advanced Setting', it leads to following the configuration. Otherwise,  ASA will scan all the blobs in the container.

On the next menu, choose prefix pattern for path hierarchy that contains the blob.

![image4](./media/stream-analytics-connect-data-event-inputs/04-stream-analytics-create-inputs.png)

Now choose the correct serialization setting for the data. The options are JSON, CSV, and Avro.

![image5](./media/stream-analytics-connect-data-event-inputs/05-stream-analytics-create-inputs.png)

Then check the **Complete** checkbox and your blog storage input is now created.

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
