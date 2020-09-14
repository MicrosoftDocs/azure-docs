---
title: Blob storage and Azure Data Lake Gen2 output from Azure Stream Analytics
description: This article describes blob storage and Azure Data Lake Gen 2 as output for Azure Stream Analytics.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 08/25/2020
---

# Blob storage and Azure Data Lake Gen2 output from Azure Stream Analytics

Data Lake Storage Gen2 makes Azure Storage the foundation for building enterprise data lakes on Azure. Designed from the start to service multiple petabytes of information while sustaining hundreds of gigabits of throughput, Data Lake Storage Gen2 allows you to easily manage massive amounts of data.A fundamental part of Data Lake Storage Gen2 is the addition of a hierarchical namespace to Blob storage.

Azure Blob storage offers a cost-effective and scalable solution for storing large amounts of unstructured data in the cloud. For an introduction on Blob storage and its usage, see [Upload, download, and list blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md).

## Output configuration

The following table lists the property names and their descriptions for creating a blob or ADLS Gen2 output.

| Property name       | Description                                                                      |
| ------------------- | ---------------------------------------------------------------------------------|
| Output alias        | A friendly name used in queries to direct the query output to this blob storage. |
| Storage account     | The name of the storage account where you're sending your output.               |
| Storage account key | The secret key associated with the storage account.                              |
| Storage container   | A logical grouping for blobs stored in the Azure Blob service. When you upload a blob to the Blob service, you must specify a container for that blob. |
| Path pattern | Optional. The file path pattern that's used to write your blobs within the specified container. <br /><br /> In the path pattern, you can choose to use one or more instances of the date and time variables to specify the frequency that blobs are written: <br /> {date}, {time} <br /><br />You can use custom blob partitioning to specify one custom {field} name from your event data to partition blobs. The field name is alphanumeric and can include spaces, hyphens, and underscores. Restrictions on custom fields include the following: <ul><li>Field names aren't case-sensitive. For example, the service can't differentiate between column "ID" and column "id."</li><li>Nested fields are not permitted. Instead, use an alias in the job query to "flatten" the field.</li><li>Expressions can't be used as a field name.</li></ul> <br />This feature enables the use of custom date/time format specifier configurations in the path. Custom date and time formats must be specified one at a time, enclosed by the {datetime:\<specifier>} keyword. Allowable inputs for \<specifier> are yyyy, MM, M, dd, d, HH, H, mm, m, ss, or s. The {datetime:\<specifier>} keyword can be used multiple times in the path to form custom date/time configurations. <br /><br />Examples: <ul><li>Example 1: cluster1/logs/{date}/{time}</li><li>Example 2: cluster1/logs/{date}</li><li>Example 3: cluster1/{client_id}/{date}/{time}</li><li>Example 4: cluster1/{datetime:ss}/{myField} where the query is: SELECT data.myField AS myField FROM Input;</li><li>Example 5: cluster1/year={datetime:yyyy}/month={datetime:MM}/day={datetime:dd}</ul><br />The time stamp of the created folder structure follows UTC and not local time.<br /><br />File naming uses the following convention: <br /><br />{Path Prefix Pattern}/schemaHashcode_Guid_Number.extension<br /><br />Example output files:<ul><li>Myoutput/20170901/00/45434_gguid_1.csv</li>  <li>Myoutput/20170901/01/45434_gguid_1.csv</li></ul> <br />For more information about this feature, see [Azure Stream Analytics custom blob output partitioning](stream-analytics-custom-path-patterns-blob-storage-output.md). |
| Date format | Optional. If the date token is used in the prefix path, you can select the date format in which your files are organized. Example: YYYY/MM/DD |
| Time format | Optional. If the time token is used in the prefix path, specify the time format in which your files are organized. Currently the only supported value is HH. |
| Event serialization format | Serialization format for output data. JSON, CSV, Avro, and Parquet are supported. |
|Minimum  rows |The number of minimum rows per batch. For Parquet, every batch will create a new file. The current default value is 2,000 rows and the allowed maximum is 10,000 rows.|
|Maximum time |The maximum wait time per batch. After this time, the batch will be written to the output even if the minimum rows requirement is not met. The current default value is 1 minute and the allowed maximum is 2 hours. If your blob output has path pattern frequency, the wait time cannot be higher than the partition time range.|
| Encoding    | If you're using CSV or JSON format, an encoding must be specified. UTF-8 is the only supported encoding format at this time. |
| Delimiter   | Applicable only for CSV serialization. Stream Analytics supports a number of common delimiters for serializing CSV data. Supported values are comma, semicolon, space, tab, and vertical bar. |
| Format      | Applicable only for JSON serialization. **Line separated** specifies that the output is formatted by having each JSON object separated by a new line. If you select **Line separated**, the JSON is read one object at a time. The whole content by itself would not be a valid JSON. **Array** specifies that the output is formatted as an array of JSON objects. This array is closed only when the job stops or Stream Analytics has moved on to the next time window. In general, it's preferable to use line-separated JSON, because it doesn't require any special handling while the output file is still being written to. |

## Blob output files

When you're using Blob storage as output, a new file is created in the blob in the following cases:

* If the file exceeds the maximum number of allowed blocks (currently 50,000). You might reach the maximum allowed number of blocks without reaching the maximum allowed blob size. For example, if the output rate is high, you can see more bytes per block, and the file size is larger. If the output rate is low, each block has less data, and the file size is smaller.
* If there's a schema change in the output, and the output format requires fixed schema (CSV and Avro).
* If a job is restarted, either externally by a user stopping it and starting it, or internally for system maintenance or error recovery.
* If the query is fully partitioned, and a new file is created for each output partition.
* If the user deletes a file or a container of the storage account.
* If the output is time partitioned by using the path prefix pattern, and a new blob is used when the query moves to the next hour.
* If the output is partitioned by a custom field, and a new blob is created per partition key if it does not exist.
* If the output is partitioned by a custom field where the partition key cardinality exceeds 8,000, and a new blob is created per partition key.

## Partitioning

For partition key, use {date} and {time} tokens from your event fields in the path pattern. Choose the date format, such as YYYY/MM/DD, DD/MM/YYYY, or MM-DD-YYYY. HH is used for the time format. Blob output can be partitioned by a single custom event attribute {fieldname} or {datetime:\<specifier>}. The number of output writers follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md).

## Output batch size

For the maximum message size, see [Azure Storage limits](../azure-resource-manager/management/azure-subscription-service-limits.md#storage-limits). The maximum blob block size is 4 MB and the maximum blob bock count is 50,000. |

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create an Azure Stream Analytics job using the Azure CLI](quick-create-azure-cli.md)
* [Quickstart: Create an Azure Stream Analytics job by using an ARM template](quick-create-azure-resource-manager.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Quickstart: Create an Azure Stream Analytics job in Visual Studio Code](quick-create-vs-code.md)
