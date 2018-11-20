---
title: Data storage and ingress in The Azure Time Series Insights Update | Microsoft Docs
description: Understanding data storage and ingress in The Azure Time Series Insights Update
author: ashannon7
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/20/2018
ms.author: anshan, Shiful.Parti
---

# Data storage and ingress in The Azure Time Series Insights Update

The purpose of this document is to explain information related to how The Azure Time Series Insights Update will store and ingress data. This document covers the underlying storage structure, the file format, Time Series ID property, underlying ingress process, throughput, and limitations.

## Data storage

The Azure Time Series Insights Update uses Azure blob storage with the Parquet file type. Time Series Insights manages all the data operations including creating blobs, indexing, and partitioning the data in the Azure storage account. These Azure blobs need to be created in an Azure storage account. To ensure that all events can be queried in a performant manner, The Azure Time Series Insights Update will support Azure storage general purpose V1 and V2 ‘hot’ configuration options.  

Like any other Azure storage blob, you can read and write to your Time Series Insights-created blobs to support different integration scenarios. However, it is important to remember Time Series Insights performance can be adversely affect by reading or writing to your blobs too frequently.

To get a general overview of how Azure blob storage works, you can read more [here](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction).

If you want to learn more on Azure blob storage Parquet file types, please have a look at [this](https://docs.microsoft.com/azure/data-factory/supported-file-formats-and-compression-codecs#Parquet-format) document.

## Storage architecture

![storage-architecture][1]

## Parquet file format

Parquet is column-oriented data file format that was designed for:

* Interoperability
* Space Efficiency
* Query Efficiency

It provides efficient data compression and encoding schemes with enhanced performance to handle complex data in bulk.

For a better understanding of the what the Parquet file format is all about you can head to this [link](https://parquet.apache.org/documentation/latest/).

## Event structure in Parquet

Two copies of blobs created by Time Series Insights will be stored in the following formats.

> [!NOTE]
> * `<YYYY>` maps to year.
> * `<MM>` maps to month.
> * `<YYYYMMDDHHMMSSfff>` maps to full timestamp in milliseconds.

1. The first, an initial copy, will be partitioned by arrival time:

    * `V=1/PT=Time/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI internal suffix>.parquet`
    * Blob creation time for blobs partitioned by arrival time.

1. The second, a repartitioned copy, will be partitioned by dynamic grouping of time series ID:

    • `V=1/PT=TsId/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_< TSI internal suffix >.parquet`
    * Min event timestamp in the blob for blobs partitioned by time series ID.

Time Series Insights events are mapped to Parquet file contents:

* Every event maps to a single row.
* Built-in "timestamp" column with an event timestamp.  

Timestamp property is never null.  It defaults to event source enqueued time or timestamp is not specified in event source.  Timestamp is in UTC.  

* All other properties map to columns will end with `_string` (string), `_bool` (boolean), `_datetime` (datetime), and `_double` (double) depending on property type.
* This is the first version of the file format, and we refer to it as V=1.  If we evolve this in the future, this could change to V=2, V=3, and so on if the naming schema changes.

## How does partitioning work?

Each Time Series Insights update environment must have a time series ID property and a timestamp property, which uniquely identify it. Your time series ID acts as a logical partition for your data and provides the Azure Time Series Insights update environment with a natural boundary for distributing data across physical partitions. Physical partition management is managed by Azure Time Series Insights update in an Azure storage account.

Time Series Insights uses dynamic partitioning to optimize storage utilization and query performance by dropping and recreating partitions. The Time Series Insights update dynamic partitioning algorithm strives to avoid a single physical partition having data for multiple different logical partitions. Or in other words the partitioning algorithm’s goal is to try and keep all data related to a single time series ID to be exclusively present in Parquet file(s) without being interleaved with other Time Series IDs. The dynamic partitioning algorithm also strives to preserve the original order of events within a single Time Series ID.

Initially, at ingress time, data is partitioned by the timestamp so a single, logical partition within a given time range might be spread across multiple physical partitions. A single physical partition could also contain many or all logical partitions.  Due to blob size limitations even with optimal partitioning a single logical partition could occupy multiple physical partitions.

> [!NOTE]
> Timestamp ID is the message enqueued time in your configured event source by default.  

If you are uploading historical data or batch messages, you should designate the timestamp property in your data that maps to the appropriate timestamp value you wish to store with your data.  This property is case sensitive.  More on this, [here]().  

## Physical partition

A physical partition is a block blob stored in Azure storage. The actual size of the blobs will vary as it depends on the push rate, however we expect blobs to be approximately 20-50 MB in size. Because of this the Time Series Insights team selected 20MB to be the size to optimize query performance. This could change over time based on file size and the velocity of data ingress.
Note - Azure blobs are occasionally repartitioned for better performance by being dropped and recreated. The same Times Series Insights data can be present in multiple blobs.

## Logical partition

A logical partition is a partition within a physical partition that stores all the data associated with a single partition key value. Time Series Insights update will logically partition each blob based on two properties:

1. Time series ID - is the partition key for all Time Series Insights data within the event stream and the model.
1. Timestamp - based on the initial ingress.

Time Series Insights update provides very performant queries that are based on these two properties. These two properties provide the most effective method for delivering Time Series Insights data in a timely manner.

![storage-architecture][2]

## Best practices when choosing a Time Series ID

The choice of the time series ID is like selecting a partition key for a database and is an important decision that you must make at design time. You cannot update an existing Time Series Insights update environment to use a different time series ID.  In other words, once an environment is created with a time Series ID, the policy cannot be changed as it is an immutable property.  With this in mind, selecting the appropriate Time Series ID is critical.  Consider the following properties when selecting a time series ID:

* Pick a property name that has a wide range of values and has even access patterns. It’s a best practice to have a partition key with many distinct values (e.g., hundreds or thousands). For many customers, this will be something like device ID, sensor ID, etc.
* It should be unique at the leaf node level of your [model](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-tsm?branch=pr-en-us-53688).  
* A time series ID property name character string can be up to 128 characters and time series ID property values can be up to 1024 characters.  
* If some unique time series ID property values are missing, they are treated as null values, which take part in the uniqueness constraint.
* You can select up to 3 key properties as your time series ID.  Note – they must all be string properties.  With regards to selecting more than one key property as your time series ID, please see the following scenarios:

    1. You have legacy fleets of assets that each have unique keys.  For example, one fleet is uniquely identified by the property ‘deviceId’ and another where the unique property is ‘objectId’.  In both fleets, the other fleet’s unique property is not present.  In this example, you would select two keys, ‘deviceId’ and ‘objectId’ as unique keys.  We accept null values, and the lack of a property’s presence in the event payload will count as a null value.  This would also be the appropriate way to handle sending data to two different event sources where the data in each event source had a different unique time series ID.

    1. You require multiple properties to show uniqueness in the same fleet of assets.  For example, let’s say you are a smart building manufacturer and deploy sensors in every room.  In each room, you typically have the same values for ‘sensorId’, including ‘sensor1’, ‘sensor2’, ‘sensor3’, and so on.  Additionally, you have overlapping floor and room numbers across sites in the property ‘flrRm’ which contain values like ‘1a’, ‘2b’, ‘3a’, and so on.  Finally, you have a property, ‘location’ which contains values like ‘Redmond’, ‘Barcelona’, ‘Tokyo’, and so on.  To create uniqueness, you would designate all three of these properties as your time series ID keys – ‘sensorId’, ‘flrRm’, and ‘location’.

## Your Azure Storage account

### Storage

Time Series Insights will publish up to two copies of each event in your Azure storage account.  The initial copy is always preserved to ensure you can query it performantly using other services - This allows easy Spark/Hadoop/etc. jobs across time series ids over raw parquet files since all these engines support basic file name filtering..  Grouping blobs by year and month is useful to collect blob list within specific time range for a custom job.  

Additionally, Time Series Insights will repartition the Parquet files to optimize for Time Series Insights APIs, and the most-recently repartitioned file will also be saved.

During public preview, data will be stored indefinitely in your Azure storage account.  We will add the ability to delete data in the future, thus allowing you to delete old data.

### Writing and editing Time Series Insights blobs

To ensure query performance and data availability, please do not edit or delete any blobs created by Time Series Insights.   
Accessing and exporting data from Time Series Insights update.

You may want to access data stored in Time Series Insights update to use in conjunction with other services. For example, you may want to use your data for reporting in Power BI, to perform ML using Azure Machine Learning Studio or in a notebook application Jupyter Notebooks, etc.

There are three general paths to access your data:

* Time Series Insights update explorer.
* Time Series Insights update APIs.
* Directly from the Azure storage account.

![three-ways][3]

### From Time Series Insights update explorer

You can export data as a CSV file from the Time Series Insights update explorer.  You can find out more about the Time Series Insights update explorer by going [here](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-explorer?branch=pr-en-us-53688).

### From Time Series Insights update APIs

/getRecorded API.  To learn more about this API, head [here](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-explorer?branch=pr-en-us-53688).

### From an Azure storage account

1. You need to have read access granted to whatever account you will be using to access your Time Series Insights data. To learn more about granting read access to Azure blob storage please take a look at this [page](https://docs.microsoft.com/azure/storage/blobs/storage-manage-access-to-resources).

1. For more information on direct ways to read data from Azure blob Storage you can head [here](https://docs.microsoft.com/azure/storage/common/storage-moving-data?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

1. Exporting data from an Azure Storage account:

    * First make sure your account has the necessary requirements met to export data. You can read more about it on [this](https://docs.microsoft.com/azure/storage/common/storage-import-export-requirements) page
    * Learn different ways to export data from your Azure storage account by visiting this [link](https://docs.microsoft.com/azure/storage/common/storage-import-export-data-from-blobs)

### Blob Storage Considerations

* Azure storage does have read and write limits based on how heavy your Time Series Insights update usage is.  
* Time Series Insights update does not yet provide any kind of Parquet blob meta-store to support external data processing systems. However, we are investigating this and may add support in the future.  
* Customers will need to read the Azure blobs partitioned by time to be able to process the data.
* Time Series Insights update performs dynamic repartitioning of blob data for better performance. This is accomplished by dropping and recreating the blobs.  Most services will be best served by using the original files.  
* Your Time Series Insights update data may be duplicated across blobs.

### Data deletion

Time Series Insights update does not currently support data deletion but will in the future. We expect to support it by GA, but potentially sooner. We will notify users when we support data deletion.

Please do not delete blobs since Time Series Insights update maintains metadata about the blobs inside of Time Series Insights update.

## Ingress

### Azure Time Series Insights ingress policies

The Azure Time Series Insights update supports the same event sources and file types that it does today.

Supported event sources include:

* Azure IoT Hub
* Azure Event hubs

    * Azure Event hubs support Kafka.

Supported file types include:

* JSON

    * For more on the supported JSON shapes we can handle, please see documentation [here](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-tsq?branch=pr-en-us-53688).

### Data availability

In the private preview, the Time Series Insights update indexes data using a blob-size optimization strategy. This means that data will be available to query once it’s indexed, which is based on how much data is coming in and at what velocity. As we approach public preview, we will add logic to look for new events every few seconds, which will make data available for queries faster and more reliable.  We expect that are public preview Time Series Insights will attempt to make data available within 60 seconds of it hitting an event source.  During the private preview we expect to see a longer period before the data is made available.  If you experience any significant latency, please let us know.

### Scale

We expect Azure Time Series Insights to support at least 72,000 events per minute during the private preview.

### V2 Private Preview Time Series Insights update documents

* [Private Preview Explorer](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-explorer?branch=pr-en-us-53688)
* [Private Preview Storage and ingress](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-storage-ingress?branch=pr-en-us-53688)
* [Private Preview TSM](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-tsm?branch=pr-en-us-53688)
* [Private Preview TSQ](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-tsq?branch=pr-en-us-53688)
* [Private Preview TSI Javascript SDK](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-sdk?branch=pr-en-us-53688)
* [Private Preview Provisioning](https://review.docs.microsoft.com/azure/time-series-insights/time-series-insights-v2-provisioning?branch=pr-en-us-53688)

## Next steps

* [LINK](bla.md) text.

<!-- Images -->
[1]: media/storage-ingress/storage-architecture.png
[2]: media/storage-ingress/parquet-files.png
[3]: media/storage-ingress/blob-storage.png