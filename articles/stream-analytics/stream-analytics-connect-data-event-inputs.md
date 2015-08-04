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
	ms.date="07/30/2015" 
	ms.author="jeffstok"/>

# Create Stream Analytics inputs

## Understanding Stream Analytics inputs
---
Stream Analytics inputs are defined as a connection to a data source. As data is sent to that data source, it is consumed by the Stream Analytics job and processed in real time. Inputs are divided into two distinct groups, data stream inputs and reference data inputs.  Stream Analytics has first-class integration with input sources Event Hub and Blob storage from within and outside of the job subscription. The supported data formats are Avro, CSV and JSON.

## Data stream inputs
---
At a basic level, Stream Analytics job definitions must include at least one data stream input source to be consumed and transformed by the job. Azure Blob storage and Azure Event Hubs are supported as data stream input sources. Azure Event Hubs input sources are used to collect event streams from multiple devices and services. Examples of data streams may be things such as social media activity feeds, stock trade information or data from sensors. 

Alternately, Azure Blob storage can be used as an input source for ingesting bulk data. It is important to note that when using Azure Blobs the data is at rest and therefore Stream Analytics will interpret all data contained in a blob as having the timestamp of the creation timestamp of the blob itself. That is, unless the records in the blob contain timestamps and the TIMESTAMP BY keyword is used.

## Reference data inputs
---
Stream Analytics also supports a second type of input source known as reference data. This is auxiliary data which is typically used for performing correlation and look-ups, and the data here is usually static or infrequently changed. Azure Blob storage is currently the only supported input source for reference data. Reference data source blobs are limited to 50MB in size.

Support for refreshing reference data can be enabled by specifying a path pattern in the input configuration uses the {date} and {time} tokens. The job will load the corresponding blob based on the date and time encoded in the blob names using UTC time zone. This sequence of reference data blobs with encoded date and time is needed to guarantee consistency of results. For example if there is a delay in processing and we have to reload a blob file, we expect the file to exist in the same location without being modified, else we might see a different output. The only supported scenario is to add new blobs with future date and time encoded in the path pattern. 

For example if the job has a reference input configured in the portal with the path pattern such as: /sample/{date}/{time}/products.csv where the date format is “YYYY-MM-DD” and the time format is “HH:mm” then the job will pick up a file named /sample/2015-04-16/17:30/products.csv at 5:30 PM on April 16th 2015 UTC time zone .


> [AZURE.NOTE]currently Stream Analytics jobs look for reference blob refresh data only when the time coincides with the time encoded in the blob name:
e.g. jobs look for /sample/2015-04-16/17:30/products.csv between 5:30 PM and 5:30:59.999999999PM on April 16th 2015 UTC time zone. When the clock strikes 5:31PM it stops looking for /sample/2015-04-16/17:30/products.csv and starts looking for /sample/2015-04-16/17:31/products.csv

The only time previous reference data blobs are considered is when the job starts. At that time the job is looking for the blob which has a latest date/time encoded in its name with a value before than the job start time (the newest reference data blob from before the job start time). This is done to ensure there is a non-empty reference data set at the start of the job. If one cannot be found, the job will fail and display a diagnostic notice to the user:

    “Initializing input without a valid reference data blob for UTC time <job start time>.”

 
## Creating a data stream input
---
To create a data stream input, go to the **Inputs** tab of the Stream Analytics job and click **Add Input** at the bottom of the page.

![image1](./media/stream-analytics-connect-data-event-inputs/01-stream-analytics-create-inputs.png)

 Creating a data stream input will present the user with two choices, [**Event Hub**](Creating-an-Event-hub-input-data-stream) or [**Blob storage**](Creating-a Blob-storage-input-data-stream). Select the appropriate for the type of stream to be processed.

![image2](./media/stream-analytics-connect-data-event-inputs/02-stream-analytics-create-inputs.png)

## Creating an Event Hub data input stream
---
### Overview of Event Hubs
Event Hubs are a highly scalable event ingestor, and typically are the most common way for Stream Analytics data ingress. They're designed to collect event streams from a number of different devices and services. Event Hubs and Stream Analytics together provide customers an end to end solution for real time analytics -- Event Hubs allow customers to feed events into Azure in real time, and Stream Analytics jobs can process them in real time.  For example, customers can send web clicks, sensor readings, online log events to Event Hubs, and create Stream Analytics jobs to use Event Hubs as the input data streams for real time filtering, aggregating and joining. Event Hubs can be used for data egress also.  A potential use of Event Hubs as output is when the output of a Stream Analytics job will be the input of another streaming job. For further details on Event Hubs see the [Event Hubs](https://azure.microsoft.com/services/event-hubs/ "Event Hubs") documentation.

### Consumer groups
Each Stream Analytics job input should be configured to have its own Event Hub consumer group. When a job contains self-join or multiple inputs, some input may be read by more than one reader downstream, which causes the total number of readers in a single consumer group to exceed the Event Hub’s limit of 5 readers per consumer group. In this case, the query will need to be broken down into multiple queries and intermediate results routed through additional Event Hubs. Note that there is also a limit of 20 consumer groups per Event Hub. For details, see the [Event Hubs Programming Guide](https://msdn.microsoft.com/library/azure/dn789972.aspx "Event Hubs Programming Guide").

## Example of creating an Event Hub input in the Azure Portal
---
Below is a walk-through to configure an Event Hub as an input. To start using an Event Hub input, the user should have the following information collected about the Event Hub:

1. Input Alias – A friendly-named input alias that is will be referred to in the job query.
2. The name of the Service Bus Namespace. 
3. The name of the Event Hub.
3. The Event hub Policy Name.
4. Optional: Event Hub Consumer Group name.
	- The Consumer Group to ingest data from the Event Hub. If not specified, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub. It is recommended to use a distinct consumer Group for each Stream Analytics job.
5. The serialization format is utilized for the data stream (Avro, CSV, JSON).

First select **ADD INPUT** from the Inputs page of the Stream Analytics job.

![image1](./media/stream-analytics-connect-data-event-inputs/01-stream-analytics-create-inputs.png)

Then select the Event Hub as the input.

![image6](./media/stream-analytics-connect-data-event-inputs/06-stream-analytics-create-inputs.png)

Next, input the information into the fields as shown below for the Event Hub.

![image7](./media/stream-analytics-connect-data-event-inputs/07-stream-analytics-create-inputs.png)

Then validate the event serialization format is correct for the data stream.

![image8](./media/stream-analytics-connect-data-event-inputs/08-stream-analytics-create-inputs.png)

Then select **Complete** and the Event Hub data stream input is now created.

## Creating a Blob storage input data stream
---
For scenarios with large amounts of unstructured data to store in the cloud, Blob storage offers a cost-effective and scalable solution. This data is generally considered data 'at rest'. One scenario where a Blob might be useful for a data stream input would be log analysis where logs are already captured from systems and need to be parsed and meaningful data extracted from them. Another might be analysis of data warehousing data at rest. For further information on Blob storage see the [Blob storage](http://azure.microsoft.com/services/storage/blobs/) documentation.

Below is a walk-through to configure Blob storage as an input. To start using an Azure Blob storage input, the following information is required:

1. Input Alias – A friendly-named input alias that is will be referred to in the job query.
2. If the storage account is in a different subscription than the streaming job the Storage Account Name and Storage Account Key will be required.
3. The container name.
4. The file name prefix.
5. What serialization format is utilized for the data (Avro, CSV, JSON).

On the inputs tab of the Stream Analytics job, click **ADD INPUT** and then select the default option, **Data stream**.
![image1](./media/stream-analytics-connect-data-event-inputs/01-stream-analytics-create-inputs.png)

Next select **Blob storage**

![image2](./media/stream-analytics-connect-data-event-inputs/02-stream-analytics-create-inputs.png)

Then input the information into the fields as shown below for the storage account.

![image3](./media/stream-analytics-connect-data-event-inputs/03-stream-analytics-create-inputs.png)

> [AZURE.NOTE]If the user checks the box for 'Configure Advanced Setting', it leads to the following the configuration . Otherwise, Stream Analytics will scan all the blobs in the storage container.
> ![image4](./media/stream-analytics-connect-data-event-inputs/04-stream-analytics-create-inputs.png)

Next choose the correct serialization setting for the data. The options are JSON, CSV, and Avro.

![image5](./media/stream-analytics-connect-data-event-inputs/05-stream-analytics-create-inputs.png)

Then select **Complete** and the Blob storage data stream input is now created.

## Creating a Blob storage reference data stream
---
To utilize reference data stream capabilities Blob storage can be leveraged.

Below is a walk-through to configure Blob storage as a reference data stream. To start, the following information is required:

1. Input Alias – A friendly-named input alias that is will be referred to in the job query.
2. If the storage account is in a different subscription than the streaming job the Storage Account Name and Storage Account Key will be required.
3. The container name.
4. The file name prefix.
5. What serialization format is utilized for the data (CSV, JSON).
6. The Path Pattern. The file path used to locate your blobs within the specified container. Within the path, you may choose to specify one or more instances of the following 2 variables: {date} and {time}.


On the inputs tab of the Stream Analytics job, click **ADD INPUT** and then select the default option, **Reference stream**.

![image9](./media/stream-analytics-connect-data-event-inputs/09-stream-analytics-create-inputs.png)

Then input the information into the fields as shown below for the Blob storage and storage account.

![image10](./media/stream-analytics-connect-data-event-inputs/10-stream-analytics-create-inputs.png)

Making sure to scroll down to specify the prefix pattern for path hierarchy that contains the blob as well as the format of the date and time fields.

![image12](./media/stream-analytics-connect-data-event-inputs/12-stream-analytics-create-inputs.png)

Now choose the correct serialization setting for the data. The options are JSON, CSV, and Avro.

![image11](./media/stream-analytics-connect-data-event-inputs/11-stream-analytics-create-inputs.png)

Then select **Complete** and the Blob storage reference data input is now created.


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
