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
	ms.date="07/08/2015" 
	ms.author="jeffstok"/>

# Connect Stream Analytics inputs

## Understanding Stream Analytics inputs
When creating a Stream Analytics job, the user must understand the type of data being analyzed. As long as the job is composed of at least single streaming data source, Stream Analytics jobs can process it. If the data also includes additional auxiliary data sources or even stored time-based events, it is important to understand the two input methods for Stream Analytics and which is appropriate for each dataset in the present use case.

## Data stream inputs
At a basic level, Stream Analytics job definitions must include at least one data stream input source to be consumed and transformed by the job. Azure Blob storage and Azure Event Hubs are supported as data stream input sources. Azure Event Hubs input sources are used to collect event streams from multiple devices and services

Alternately, Azure Blob storage can be used as an input source for ingesting bulk data. Because blobs are generally data at rest and therefore are not streaming, Stream Analytics jobs ingesting blobs will not be temporal in nature **unless** the records in the blob contain timestamps.

## Reference data inputs
Stream Analytics also supports a second type of input source data knowns as reference data. This is auxiliary data which is typically used for performing correlation and lookups, and the data here is usually static or infrequently changed. Azure Blob storage is the only supported input source for reference data. Reference data source blobs are limited to 50MB in size.

To enable support for refreshing reference data the user may specify a list of blobs in the input configuration using the {date} and {time} tokens inside the path pattern. The job will load the corresponding blob based on the date and time encoded in the blob names using UTC time zone.

For example if the job has a reference input configured in the portal with the path pattern such as: /sample/{date}/{time}/products.csv where the date format is “YYYY-MM-DD” and the time format is “HH:mm” than the job will pick up a file named /sample/2015-04-16/17:30/products.csv at 5:30 PM on April 16th 2015 UTC time zone (which is equivalent to 10:30 AM on April 16th 2015 using PST time zone).

## Creation of a data stream input
Creating a data stream input will present the user with two choices, **Event Hub** or **Blob storage**.

### Creating a Blob storage input data stream

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

### Creating an Event hub input data stream

Below is a walkthrough to configure an Event hub as an input. To start using an Event hub input, the user should have the following information collect about the Table:

1. The name of the Service Bus Namespace. 
2. The name of the Event hub.
3. The Event hub Policy Name.
4. Optional: Event Hub Consumer Group name.
	- The Consumer Group to ingest data from the Event Hub. If not specified, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub.   It is recommended to use a distinct consumer Group for each Stream Analytics job.
5. What serialization format is utilized for the data (Avro, CSV, JSON).

First select **ADD INPUT** from the Inputs page of the Stream Analytics job.

![image5](./media/stream-analytics-connect-data-event-inputs/05-stream-analytics-create-inputs.png)

Then input the information into the fields as shown below for the Event hub.

![image5](./media/stream-analytics-connect-data-event-inputs/05-stream-analytics-create-inputs.png)

Then validate the event serialization format is correct for the data stream.

![image5](./media/stream-analytics-connect-data-event-inputs/05-stream-analytics-create-inputs.png)


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)
