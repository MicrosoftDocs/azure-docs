---
title: Use reference data for lookups in Azure Stream Analytics
description: This article describes how to use reference data to lookup or correlate data in an Azure Stream Analytics job's query design.
author: jseb225
ms.author: jeanb
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 5/11/2020
---
# Using reference data for lookups in Stream Analytics

Reference data (also known as a lookup table) is a finite data set that is static or slowly changing in nature, used to perform a lookup or to augment your data streams. For example, in an IoT scenario, you could store metadata about sensors (which don’t change often) in reference data and join it with real time IoT data streams. Azure Stream Analytics loads reference data in memory to achieve low latency stream processing. To make use of reference data in your Azure Stream Analytics job, you will generally use a [Reference Data Join](https://docs.microsoft.com/stream-analytics-query/reference-data-join-azure-stream-analytics) in your query. 

## Example  
You can have a real time stream of events generated when cars pass a toll booth. The toll booth can capture the license plate in real time and join with a static dataset that has registration details to identify license plates that have expired.  
  
```SQL  
SELECT I1.EntryTime, I1.LicensePlate, I1.TollId, R.RegistrationId  
FROM Input1 I1 TIMESTAMP BY EntryTime  
JOIN Registration R  
ON I1.LicensePlate = R.LicensePlate  
WHERE R.Expired = '1'
```  

Stream Analytics supports Azure Blob storage and Azure SQL Database as the storage layer for Reference Data. You can also transform and/or copy reference data to Blob storage from Azure Data Factory to use [any number of cloud-based and on-premises data stores](../data-factory/copy-activity-overview.md).

## Azure Blob storage

Reference data is modeled as a sequence of blobs (defined in the input configuration) in ascending order of the date/time specified in the blob name. It **only** supports adding to the end of the sequence by using a date/time **greater** than the one specified by the last blob in the sequence.

### Configure blob reference data

To configure your reference data, you first need to create an input that is of type **Reference Data**. The table below explains each property that you will need to provide while creating the reference data input with its description:

|**Property Name**  |**Description**  |
|---------|---------|
|Input Alias   | A friendly name that will be used in the job query to reference this input.   |
|Storage Account   | The name of the storage account where your blobs are located. If it’s in the same subscription as your Stream Analytics Job, you can select it from the drop-down.   |
|Storage Account Key   | The secret key associated with the storage account. This gets automatically populated if the storage account is in the same subscription as your Stream Analytics job.   |
|Storage Container   | Containers provide a logical grouping for blobs stored in the Microsoft Azure Blob service. When you upload a blob to the Blob service, you must specify a container for that blob.   |
|Path Pattern   | This is a required property that is used to locate your blobs within the specified container. Within the path, you may choose to specify one or more instances of the following 2 variables:<BR>{date}, {time}<BR>Example 1: products/{date}/{time}/product-list.csv<BR>Example 2: products/{date}/product-list.csv<BR>Example 3: product-list.csv<BR><br> If the blob doesn't exist in the specified path, the Stream Analytics job will wait indefinitely for the blob to become available.   |
|Date Format [optional]   | If you have used {date} within the Path Pattern that you specified, then you can select the date format in which your blobs are organized from the drop-down of supported formats.<BR>Example: YYYY/MM/DD, MM/DD/YYYY, etc.   |
|Time Format [optional]   | If you have used {time} within the Path Pattern that you specified, then you can select the time format in which your blobs are organized from the drop-down of supported formats.<BR>Example: HH, HH/mm, or HH-mm.  |
|Event Serialization Format   | To make sure your queries work the way you expect, Stream Analytics needs to know which serialization format you're using for incoming data streams. For Reference Data, the supported formats are CSV and JSON.  |
|Encoding   | UTF-8 is the only supported encoding format at this time.  |

### Static reference data

If your reference data is not expected to change, then support for static reference data is enabled by specifying a static path in the input configuration. Azure Stream Analytics picks up the blob from the specified path. {date} and {time} substitution tokens aren't required. Because reference data is immutable in Stream Analytics, overwriting a static reference data blob is not recommended.

### Generate reference data on a schedule

If your reference data is a slowly changing data set, then support for refreshing reference data is enabled by specifying a path pattern in the input configuration using the {date} and {time} substitution tokens. Stream Analytics picks up the updated reference data definitions based on this path pattern. For example, a pattern of `sample/{date}/{time}/products.csv` with a date format of **"YYYY-MM-DD"** and a time format of **"HH-mm"** instructs Stream Analytics to pick up the updated blob `sample/2015-04-16/17-30/products.csv` at 5:30 PM on April 16th, 2015 UTC time zone.

Azure Stream Analytics automatically scans for refreshed reference data blobs at a one minute interval. If a blob with timestamp 10:30:00 is uploaded with a small delay (for example, 10:30:30), you will notice a small delay in Stream Analytics job referencing this blob. To avoid such scenarios, it is recommended to upload the blob earlier than the target effective time (10:30:00 in this example) to allow the Stream Analytics job enough time to discover and load it in memory and perform operations. 

> [!NOTE]
> Currently Stream Analytics jobs look for the blob refresh only when the machine time advances to the time encoded in the blob name. For example, the job will look for `sample/2015-04-16/17-30/products.csv` as soon as possible but no earlier than 5:30 PM on April 16th, 2015 UTC time zone. It will *never* look for a blob with an encoded time earlier than the last one that is discovered.
> 
> For example, once the job finds the blob `sample/2015-04-16/17-30/products.csv` it will ignore any files with an encoded date earlier than 5:30 PM April 16th, 2015 so if a late arriving `sample/2015-04-16/17-25/products.csv` blob gets created in the same container the job will not use it.
> 
> Likewise if `sample/2015-04-16/17-30/products.csv` is only produced at 10:03 PM April 16th, 2015 but no blob with an earlier date is present in the container, the job will use this file starting at 10:03 PM April 16th, 2015 and use the previous reference data until then.
> 
> An exception to this is when the job needs to re-process data back in time or when the job is first started. At start time the job is looking for the most recent blob produced before the job start time specified. This is done to ensure that there is a **non-empty** reference data set when the job starts. If one cannot be found, the job displays the following diagnostic: `Initializing input without a valid reference data blob for UTC time <start time>`.

[Azure Data Factory](https://azure.microsoft.com/documentation/services/data-factory/) can be used to orchestrate the task of creating the updated blobs required by Stream Analytics to update reference data definitions. Data Factory is a cloud-based data integration service that orchestrates and automates the movement and transformation of data. Data Factory supports [connecting to a large number of cloud based and on-premises data stores](../data-factory/copy-activity-overview.md) and moving data easily on a regular schedule that you specify. For more information and step by step guidance on how to set up a Data Factory pipeline to generate reference data for Stream Analytics which refreshes on a pre-defined schedule, check out this [GitHub sample](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/ReferenceDataRefreshForASAJobs).

### Tips on refreshing blob reference data

1. Do not overwrite reference data blobs as they are immutable.
2. The recommended way to refresh reference data is to:
    * Use {date}/{time} in the path pattern
    * Add a new blob using the same container and path pattern defined in the job input
    * Use a date/time **greater** than the one specified by the last blob in the sequence.
3. Reference data blobs are **not** ordered by the blob’s "Last Modified" time but only by the time and date specified in the blob name using the {date} and {time} substitutions.
3. To avoid having to list large number of blobs, consider deleting very old blobs for which processing will no longer be done. Please note that ASA might go have to reprocess a small amount in some scenarios like a restart.

## Azure SQL Database

Azure SQL Database reference data is retrieved by your Stream Analytics job and is stored as a snapshot in memory for processing. The snapshot of your reference data is also stored in a container in a storage account that you specify in the configuration settings. The container is auto-created when the job starts. If the job is stopped or enters a failed state, the auto-created containers are deleted when the job is restarted.  

If your reference data is a slowly changing data set, you need to periodically refresh the snapshot that is used in your job. Stream Analytics allows you to set a refresh rate when you configure your Azure SQL Database input connection. The Stream Analytics runtime will query your Azure SQL Database at the interval specified by the refresh rate. The fastest refresh rate supported is once per minute. For each refresh, Stream Analytics stores a new snapshot in the storage account provided.

Stream Analytics provides two options for querying your Azure SQL Database. A snapshot query is mandatory and must be included in each job. Stream Analytics runs the snapshot query periodically based on your refresh interval and uses the result of the query (the snapshot) as the reference data set. The snapshot query should fit most scenarios, but if you run into performance issues with large data sets and fast refresh rates, you can use the delta query option. Queries that take more than 60 seconds to return reference data set will result in a timeout.

With the delta query option, Stream Analytics runs the snapshot query initially to get a baseline reference data set. After, Stream Analytics runs the delta query periodically based on your refresh interval to retrieve incremental changes. These incremental changes are continually applied to the reference data set to keep it updated. Using delta query may help reduce storage cost and network I/O operations.

### Configure SQL Database reference

To configure your SQL Database reference data, you first need to create **Reference Data** input. The table below explains each property that you will need to provide while creating the reference data input with its description. For more information, see [Use reference data from a SQL Database for an Azure Stream Analytics job](sql-reference-data.md).

You can use [Azure SQL Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance) as a reference data input. You have to [configure public endpoint in SQL Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-public-endpoint-configure) and then manually configure the following settings in Azure Stream Analytics. Azure virtual machine running SQL Server with a database attached is also supported by manually configuring the settings below.

|**Property Name**|**Description**  |
|---------|---------|
|Input alias|A friendly name that will be used in the job query to reference this input.|
|Subscription|Choose your subscription|
|Database|The Azure SQL Database that contains your reference data. For SQL Managed Instance, it is required to specify the port 3342. For example, *sampleserver.public.database.windows.net,3342*|
|Username|The username associated with your Azure SQL Database.|
|Password|The password associated with your Azure SQL Database.|
|Refresh periodically|This option allows you to choose a refresh rate. Choosing "On" will allow you to specify the refresh rate in DD:HH:MM.|
|Snapshot query|This is the default query option that retrieves the reference data from your SQL Database.|
|Delta query|For advanced scenarios with large data sets and a short refresh rate, choose to add a delta query.|

## Size limitation

It is recommended to use reference datasets which are less than 300 MB for best performance. Usage of reference data greater than 300 MB is supported in jobs with 6 SUs or more. This functionality is in preview and must not be used in production. Using a very large reference data may impact performance of your job. As the complexity of query increases to include stateful processing, such as windowed aggregates, temporal joins and temporal analytic functions, it is expected that the maximum supported size of reference data decreases. If Azure Stream Analytics cannot load the reference data and perform complex operations, the job will run out of memory and fail. In such cases, SU % Utilization metric will reach 100%.    

|**Number of Streaming Units**  |**Recommended Size**  |
|---------|---------|
|1   |50 MB or lower   |
|3   |150 MB or lower   |
|6 and beyond   |300 MB or lower. Using reference data greater than 300 MB is supported in preview and could impact performance of your job.    |

Support for compression is not available for reference data.

## Joining multiple reference datasets in a job
You can join only one stream input with one reference data input in a single step of your query. However, you can join multiple reference datasets by breaking down your query into multiple steps. An example is shown below.

```SQL  
With Step1 as (
    --JOIN input stream with reference data to get 'Desc'
    SELECT streamInput.*, refData1.Desc as Desc
    FROM    streamInput
    JOIN    refData1 ON refData1.key = streamInput.key 
)
--Now Join Step1 with second reference data
SELECT *
INTO    output 
FROM    Step1
JOIN    refData2 ON refData2.Desc = Step1.Desc 
``` 

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.query.language.reference]: https://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: https://go.microsoft.com/fwlink/?LinkId=517301
