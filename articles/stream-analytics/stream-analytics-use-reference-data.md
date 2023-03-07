---
title: Use reference data for lookups in Azure Stream Analytics
description: This article describes how to use reference data to look up or correlate data in an Azure Stream Analytics job's query design.
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 06/17/2022
---
# Use reference data for lookups in Stream Analytics

Reference data is a finite dataset that's static or slowly changing in nature. It's used to perform a lookup or to augment your data streams. Reference data is also known as a lookup table.

Take an IoT scenario as an example. You could store metadata about sensors, which don't change often, in reference data. Then you could join it with real-time IoT data streams.

Azure Stream Analytics loads reference data in memory to achieve low-latency stream processing. To make use of reference data in your Stream Analytics job, you'll generally use a [reference data join](/stream-analytics-query/reference-data-join-azure-stream-analytics) in your query.

## Example

You can have a real-time stream of events generated when cars pass a tollbooth. The tollbooth can capture the license plates in real time. That data can join with a static dataset that has registration details to identify license plates that have expired.

```SQL  
SELECT I1.EntryTime, I1.LicensePlate, I1.TollId, R.RegistrationId  
FROM Input1 I1 TIMESTAMP BY EntryTime  
JOIN Registration R  
ON I1.LicensePlate = R.LicensePlate  
WHERE R.Expired = '1'
```

Stream Analytics supports Azure Blob Storage and Azure SQL Database as the storage layer for reference data. You can also transform or copy reference data to Blob Storage from Azure Data Factory to use [cloud-based and on-premises data stores](../data-factory/copy-activity-overview.md).

## Azure Blob Storage

Reference data is modeled as a sequence of blobs in ascending order of the date/time specified in the blob name. Blobs can only be added to the end of the sequence by using a date/time *greater* than the one specified by the last blob in the sequence. Blobs are defined in the input configuration.

For more information, see [Use reference data from Blob Storage for a Stream Analytics job](data-protection.md).

### Configure blob reference data

To configure your reference data, you first need to create an input that's of the type *reference data*. The following table explains each property you need to provide when you create the reference data input with its description.

|Property name  |Description  |
|---------|---------|
|Input alias   | A friendly name used in the job query to reference this input.   |
|Storage account   | The name of the storage account where your blobs are located. If it's in the same subscription as your Stream Analytics job, select it from the dropdown list.   |
|Storage account key   | The secret key associated with the storage account. This key is automatically populated if the storage account is in the same subscription as your Stream Analytics job.   |
|Storage container   | Containers provide a logical grouping for blobs stored in Blob Storage. When you upload a blob to Blob Storage, you must specify a container for that blob.   |
|Path pattern   | This required property is used to locate your blobs within the specified container. Within the path, you might choose to specify one or more instances of the variables {date} and {time}.<BR>Example 1: products/{date}/{time}/product-list.csv<BR>Example 2: products/{date}/product-list.csv<BR>Example 3: product-list.csv<BR><br> If the blob doesn't exist in the specified path, the Stream Analytics job waits indefinitely for the blob to become available.   |
|Date format [optional]   | If you used {date} within the path pattern you specified, select the date format in which your blobs are organized from the dropdown list of supported formats.<BR>Example: YYYY/MM/DD or MM/DD/YYYY   |
|Time format [optional]   | If you used {time} within the path pattern you specified, select the time format in which your blobs are organized from the dropdown list of supported formats.<BR>Example: HH, HH/mm, or HH-mm  |
|Event serialization format   | To make sure your queries work the way you expect, Stream Analytics needs to know which serialization format you're using for incoming data streams. For reference data, the supported formats are CSV and JSON.  |
|Encoding   | UTF-8 is the only supported encoding format at this time.  |

### Static reference data

Your reference data might not be expected to change. To enable support for static reference data, specify a static path in the input configuration.

Stream Analytics picks up the blob from the specified path. The {date} and {time} substitution tokens aren't required. Because reference data is immutable in Stream Analytics, overwriting a static reference data blob isn't recommended.

### Generate reference data on a schedule

Your reference data might be a slowly changing dataset. To refresh reference data, specify a path pattern in the input configuration by using the {date} and {time} substitution tokens. Stream Analytics picks up the updated reference data definitions based on this path pattern.

For example, a pattern of `sample/{date}/{time}/products.csv` with a date format of YYYY-MM-DD and a time format of HH-mm instructs Stream Analytics to pick up the updated blob `sample/2015-04-16/17-30/products.csv` on April 16, 2015, at 5:30 PM UTC.

Stream Analytics automatically scans for refreshed reference data blobs at a one-minute interval. A blob with the timestamp 10:30:00 might be uploaded with a small delay, for example, 10:30:30. You'll notice a small delay in the Stream Analytics job referencing this blob.

To avoid such scenarios, upload the blob earlier than the target effective time, which is 10:30:00 in this example. The Stream Analytics job now has enough time to discover and load the blob in memory and perform operations.

> [!NOTE]
> Currently, Stream Analytics jobs look for the blob refresh only when the machine time advances to the time encoded in the blob name. For example, the job looks for `sample/2015-04-16/17-30/products.csv` as soon as possible but no earlier than April 16, 2015, at 5:30 PM UTC. It will *never* look for a blob with an encoded time earlier than the last one that's discovered.
>
> For example, after the job finds the blob `sample/2015-04-16/17-30/products.csv`, it ignores any files with an encoded date earlier than April 16, 2015, at 5:30 PM. If a late-arriving `sample/2015-04-16/17-25/products.csv` blob gets created in the same container, the job won't use it.
>
> In another example, `sample/2015-04-16/17-30/products.csv` is only produced on April 16, 2015, at 10:03 PM, but no blob with an earlier date is present in the container. Then the job uses this file starting on April 16, 2015, at 10:03 PM and uses the previous reference data until then.
>
> An exception to this behavior is when the job needs to reprocess data back in time or when the job is first started.

At start time, the job looks for the most recent blob produced before the job start time specified. This behavior ensures there's a *non-empty* reference dataset when the job starts. If one can't be found, the job displays the following diagnostic: `Initializing input without a valid reference data blob for UTC time <start time>`.

When a reference dataset is refreshed, a diagnostic log is generated: `Loaded new reference data from <blob path>`. For many reasons, a job might need to reload a previous reference dataset. Most often, the reason is to reprocess past data. The same diagnostic log is generated at that time. This action doesn't imply that current stream data will use past reference data.

[Azure Data Factory](../data-factory/index.yml) can be used to orchestrate the task of creating the updated blobs required by Stream Analytics to update reference data definitions.

Data Factory is a cloud-based data integration service that orchestrates and automates the movement and transformation of data. Data Factory supports [connecting to a large number of cloud-based and on-premises data stores](../data-factory/copy-activity-overview.md). It can move data easily on a regular schedule that you specify.

For more information on how to set up a Data Factory pipeline to generate reference data for Stream Analytics that refreshes on a predefined schedule, see this [GitHub sample](https://github.com/Azure/Azure-DataFactory/tree/master/SamplesV1/ReferenceDataRefreshForASAJobs).

### Tips on refreshing blob reference data

- Don't overwrite reference data blobs because they're immutable.
- The recommended way to refresh reference data is to:
    * Use {date}/{time} in the path pattern.
    * Add a new blob by using the same container and path pattern defined in the job input.
    * Use a date/time *greater* than the one specified by the last blob in the sequence.
- Reference data blobs are *not* ordered by the blob's **Last Modified** time. They're only ordered by the date and time specified in the blob name using the {date} and {time} substitutions.
- To avoid having to list a large number of blobs, delete old blobs for which processing will no longer be done. Stream Analytics might have to reprocess a small amount in some scenarios, like a restart.

## Azure SQL Database

Your Stream Analytics job retrieves SQL Database reference data and stores it as a snapshot in memory for processing. The snapshot of your reference data is also stored in a container in a storage account. You specify the storage account in the configuration settings.

The container is auto-created when the job starts. If the job stops or enters a failed state, the auto-created containers are deleted when the job restarts.

If your reference data is a slowly changing dataset, you need to periodically refresh the snapshot that's used in your job.

With Stream Analytics, you can set a refresh rate when you configure your SQL Database input connection. The Stream Analytics runtime queries your SQL Database instance at the interval specified by the refresh rate. The fastest refresh rate supported is once per minute. For each refresh, Stream Analytics stores a new snapshot in the storage account provided.

Stream Analytics provides two options for querying your SQL Database instance. A snapshot query is mandatory and must be included in each job. Stream Analytics runs the snapshot query periodically based on your refresh interval. It uses the result of the query (the snapshot) as the reference dataset.

The snapshot query should fit most scenarios. If you run into performance issues with large datasets and fast refresh rates, use the delta query option. Queries that take more than 60 seconds to return a reference dataset result in a timeout.

With the delta query option, Stream Analytics runs the snapshot query initially to get a baseline reference dataset. Afterwards, Stream Analytics runs the delta query periodically based on your refresh interval to retrieve incremental changes. These incremental changes are continually applied to the reference dataset to keep it updated. Using the delta query option might help reduce storage cost and network I/O operations.

### Configure SQL Database reference data

To configure your SQL Database reference data, you first need to create reference data input. The following table explains each property you need to provide when you create the reference data input with its description. For more information, see [Use reference data from a SQL Database for a Stream Analytics job](sql-reference-data.md).

You can use [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) as a reference data input. You must [configure a public endpoint in SQL Managed Instance](/azure/azure-sql/managed-instance/public-endpoint-configure). Then you manually configure the following settings in Stream Analytics. An Azure virtual machine running SQL Server with a database attached is also supported by manually configuring these settings.

|Property name|Description  |
|---------|---------|
|Input alias|A friendly name used in the job query to reference this input.|
|Subscription|Your subscription.|
|Database|The SQL Database instance that contains your reference data. For SQL Managed Instance, you must specify the port 3342. An example is *sampleserver.public.database.windows.net,3342*.|
|Username|The username associated with your SQL Database instance.|
|Password|The password associated with your SQL Database instance.
|Refresh periodically|This option allows you to select a refresh rate. Select **On** to specify the refresh rate in DD:HH:MM.|
|Snapshot query|This default query option retrieves the reference data from your SQL Database instance.|
|Delta query|For advanced scenarios with large datasets and a short refresh rate, add a delta query.|

## Size limitation

Use reference datasets that are less than 300 MB for best performance. Reference datasets 5 GB or lower are supported in jobs with six streaming units or more. Using a large reference dataset might affect end-to-end latency of your job.

Query complexity can increase to include stateful processing such as windowed aggregates, temporal joins, and temporal analytic functions. When complexity increases, the maximum supported size of reference data decreases.

If Stream Analytics can't load the reference data and perform complex operations, the job runs out of memory and fails. In such cases, the streaming unit percent utilization metric will reach 100%.

|Number of streaming units  |Recommended size  |
|---------|---------|
|1   |50 MB or lower   |
|3   |150 MB or lower   |
|6 and beyond   |5 GB or lower    |

Support for compression isn't available for reference data. For reference datasets larger than 300 MB, use SQL Database as the source with the [delta query](./sql-reference-data.md#delta-query) option for optimal performance. If the delta query option isn't used in such scenarios, you'll see spikes in the watermark delay metric every time the reference dataset is refreshed.

## Join multiple reference datasets in a job

You can only join a reference data input to a streaming input. So to join multiple reference datasets, break down your query into multiple steps. Here's an example:

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

## IoT Edge jobs

Only local reference data is supported for Stream Analytics edge jobs. When a job is deployed to an IoT Edge device, it loads reference data from the user-defined file path. Have a reference data file ready on the device.

For a Windows container, put the reference data file on the local drive and share the local drive with the Docker container. For a Linux container, create a Docker volume and populate the data file to the volume.

Reference data on an IoT Edge update is triggered by a deployment. After it's triggered, the Stream Analytics module picks the updated data without stopping the running job.

You can update the reference data in two ways:

* Update the reference data path in your Stream Analytics job from the Azure portal.
* Update the IoT Edge deployment.

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.get.started]: ./stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: /stream-analytics-query/stream-analytics-query-language-reference
[stream.analytics.rest.api.reference]: /rest/api/streamanalytics/