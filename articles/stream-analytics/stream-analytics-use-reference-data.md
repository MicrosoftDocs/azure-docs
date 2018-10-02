---
title: Use reference data for lookups in Azure Stream Analytics
description: This article describes how to use reference data to lookup or correlate data in an Azure Stream Analytics job's query design.
services: stream-analytics
author: jseb225
ms.author: jeanb
manager: kfile
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 04/25/2018
---
# Using reference data for lookups in Stream Analytics
Reference data (also known as a lookup table) is a finite data set that is static or slowly changing in nature, used to perform a lookup or to correlate with your data stream. Azure Stream Analytics loads reference data in memory to achieve low latency stream processing. To make use of reference data in your Azure Stream Analytics job, you will generally use a [Reference Data Join](https://msdn.microsoft.com/library/azure/dn949258.aspx) in your Query. Stream Analytics uses Azure Blob storage as the storage layer for Reference Data, and with Azure Data Factory reference data can be transformed and/or copied to Azure Blob storage, for use as Reference Data, from [any number of cloud-based and on-premises data stores](../data-factory/copy-activity-overview.md). Reference data is modeled as a sequence of blobs (defined in the input configuration) in ascending order of the date/time specified in the blob name. It **only** supports adding to the end of the sequence by using a date/time **greater** than the one specified by the last blob in the sequence.

Stream Analytics supports reference data with **maximum size of 300 MB**. The 300 MB limit of maximum size of reference data is achievable only with simple queries. As the complexity of query increases to include stateful processing such as windowed aggregates, temporal joins and temporal analytic functions, it is expected that the maximum supported size of reference data decreases. If Azure Stream Analytics cannot load the reference data and perform complex operations, the job will run out of memory and fail. In such cases, SU % Utilization metric will reach 100%.    

|**Number of Streaming Units**  |**Approx. Max Size Supported (in MB)**  |
|---------|---------|
|1   |50   |
|3   |150   |
|6 and beyond   |300   |

Increasing number of Streaming Units of a job beyond 6 does not increase the maximum supported size of reference data.

Support for compression is not available for reference data. 

## Configuring reference data
To configure your reference data, you first need to create an input that is of type **Reference Data**. The table below explains each property that you will need to provide while creating the reference data input with its description:

|**Property Name**  |**Description**  |
|---------|---------|
|Input Alias   | A friendly name that will be used in the job query to reference this input.   |
|Storage Account   | The name of the storage account where your blobs are located. If it’s in the same subscription as your Stream Analytics Job, you can select it from the drop-down.   |
|Storage Account Key   | The secret key associated with the storage account. This gets automatically populated if the storage account is in the same subscription as your Stream Analytics job.   |
|Storage Container   | Containers provide a logical grouping for blobs stored in the Microsoft Azure Blob service. When you upload a blob to the Blob service, you must specify a container for that blob.   |
|Path Pattern   | The path used to locate your blobs within the specified container. Within the path, you may choose to specify one or more instances of the following 2 variables:<BR>{date}, {time}<BR>Example 1: products/{date}/{time}/product-list.csv<BR>Example 2: products/{date}/product-list.csv<BR><br> If the blob doesn't exist in the specified path, the Stream Analytics job will wait indefinitely for the blob to become available.   |
|Date Format [optional]   | If you have used {date} within the Path Pattern that you specified, then you can select the date format in which your blobs are organized from the drop-down of supported formats.<BR>Example: YYYY/MM/DD, MM/DD/YYYY, etc.   |
|Time Format [optional]   | If you have used {time} within the Path Pattern that you specified, then you can select the time format in which your blobs are organized from the drop-down of supported formats.<BR>Example: HH, HH/mm, or HH-mm.  |
|Event Serialization Format   | To make sure your queries work the way you expect, Stream Analytics needs to know which serialization format you're using for incoming data streams. For Reference Data, the supported formats are CSV and JSON.  |
|Encoding   | UTF-8 is the only supported encoding format at this time.  |

## Static reference data
If your reference data is not expected to change, then support for static reference data is enabled by specifying a static path in the input configuration. Azure Stream Analytics picks up the blob from the specified path. {date} and {time} substitution tokens aren't required. Reference data is immutable in Stream Analytics. Therefore, overwriting a static reference data blob is not recommended.

## Generating reference data on a schedule
If your reference data is a slowly changing data set, then support for refreshing reference data is enabled by specifying a path pattern in the input configuration using the {date} and {time} substitution tokens. Stream Analytics picks up the updated reference data definitions based on this path pattern. For example, a pattern of `sample/{date}/{time}/products.csv` with a date format of **"YYYY-MM-DD"** and a time format of **"HH-mm"** instructs Stream Analytics to pick up the updated blob `sample/2015-04-16/17-30/products.csv` at 5:30 PM on April 16th, 2015 UTC time zone.

Azure Stream Analytics automatically scans for refreshed reference data blobs at a one minute interval.

> [!NOTE]
> Currently Stream Analytics jobs look for the blob refresh only when the machine time advances to the time encoded in the blob name. For example, the job will look for `sample/2015-04-16/17-30/products.csv` as soon as possible but no earlier than 5:30 PM on April 16th, 2015 UTC time zone. It will *never* look for a blob with an encoded time earlier than the last one that is discovered.
> 
> E.g. once the job finds the blob `sample/2015-04-16/17-30/products.csv` it will ignore any files with an encoded date earlier than 5:30 PM April 16th, 2015 so if a late arriving `sample/2015-04-16/17-25/products.csv` blob gets created in the same container the job will not use it.
> 
> Likewise if `sample/2015-04-16/17-30/products.csv` is only produced at 10:03 PM April 16th, 2015 but no blob with an earlier date is present in the container, the job will use this file starting at 10:03 PM April 16th, 2015 and use the previous reference data until then.
> 
> An exception to this is when the job needs to re-process data back in time or when the job is first started. At start time the job is looking for the most recent blob produced before the job start time specified. This is done to ensure that there is a **non-empty** reference data set when the job starts. If one cannot be found, the job displays the following diagnostic: `Initializing input without a valid reference data blob for UTC time <start time>`.
> 
> 

[Azure Data Factory](https://azure.microsoft.com/documentation/services/data-factory/) can be used to orchestrate the task of creating the updated blobs required by Stream Analytics to update reference data definitions. Data Factory is a cloud-based data integration service that orchestrates and automates the movement and transformation of data. Data Factory supports [connecting to a large number of cloud based and on-premises data stores](../data-factory/copy-activity-overview.md) and moving data easily on a regular schedule that you specify. For more information and step by step guidance on how to set up a Data Factory pipeline to generate reference data for Stream Analytics which refreshes on a pre-defined schedule, check out this [GitHub sample](https://github.com/Azure/Azure-DataFactory/tree/master/Samples/ReferenceDataRefreshForASAJobs).

## Tips on refreshing your reference data
1. Do not overwrite reference data blobs as they are immutable.
2. The recommended way to refresh reference data is to:
    * Use {date}/{time} in the path pattern
    * Add a new blob using the same container and path pattern defined in the job input
    * Use a date/time **greater** than the one specified by the last blob in the sequence.
3. Reference data blobs are **not** ordered by the blob’s "Last Modified" time but only by the time and date specified in the blob name using the {date} and {time} substitutions.
3. To avoid having to list large number of blobs, consider deleting very old blobs for which processing will no longer be done. Please note that ASA might go have to reprocess a small amount in some scenarios like a restart.

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
