---
title: Azure Blob Storage and Data Lake Storage Gen2 output
description: This article describes Azure Blob Storage and Azure Data Lake Gen2 as output for an Azure Stream Analytics job.
author: an-emma
ms.author: raan
ms.service: azure-stream-analytics
ms.topic: conceptual
ms.date: 02/27/2024
---

# Azure Blob Storage and Data Lake Storage Gen2 output from Stream Analytics

Azure Data Lake Storage Gen2 makes Azure Storage the foundation for building enterprise data lakes on Azure. Data Lake Storage Gen2 is designed to service multiple petabytes of information while sustaining hundreds of gigabits of throughput. You can use it to easily manage massive amounts of data. A fundamental part of Data Lake Storage Gen2 is the addition of a hierarchical namespace to Azure Blob Storage.

Blob Storage offers a cost-effective and scalable solution for storing large amounts of unstructured data in the cloud. For an introduction on Blob Storage and its use, see [Upload, download, and list blobs with the Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md).

>[!NOTE]
> For information on the behaviors specific to the Avro and Parquet formats, see the related sections in the [overview](stream-analytics-define-outputs.md).

## Output configuration

The following table lists the property names and their descriptions for creating a blob or Data Lake Storage Gen2 output.

| Property name       | Description                                                                      |
| ------------------- | ---------------------------------------------------------------------------------|
| Output alias        | A friendly name used in queries to direct the query output to this blob. |
| Storage account     | The name of the storage account where you're sending your output.               |
| Storage account key | The secret key associated with the storage account.                              |
| Container   | A logical grouping for blobs stored in Blob Storage. When you upload a blob to Blob Storage, you must specify a container for that blob. <br /><br /> A dynamic container name is optional. It supports one and only one dynamic `{field}` in the container name. The field must exist in the output data and follow the [container name policy](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).<br /><br />The field data type must be `string`. To use multiple dynamic fields or combine static text along with a dynamic field, you can define it in the query with built-in string functions, like `CONCAT` and `LTRIM`. |
| Event serialization format | The serialization format for output data. JSON, CSV, Avro, and Parquet are supported. Delta Lake is listed as an option here. The data is in Parquet format if Delta Lake is selected. Learn more about [Delta Lake](write-to-delta-lake.md). |
| Delta path name | Required when the event serialization format is Delta Lake. The path that's used to write the Delta Lake table within the specified container. It includes the table name. For more information and examples, see [Write to a Delta Lake table](write-to-delta-lake.md). |
|Write mode | Write mode controls the way that Azure Stream Analytics writes to an output file. Exactly-once delivery only happens when Write mode is Once. For more information, see the next section. |
| Partition column | Optional. The `{field}` name from your output data to partition. Only one partition column is supported.  |
| Path pattern | Required when the event serialization format is Delta Lake. The file path pattern that's used to write your blobs within the specified container. <br /><br /> In the path pattern, you can choose to use one or more instances of the date and time variables to specify the frequency at which blobs are written: `{date}`, `{time}`. <br /><br />If your Write mode is Once, you need to use both `{date}` and `{time}`.  <br /><br />You can use custom blob partitioning to specify one custom `{field}` name from your event data to partition blobs. The field name is alphanumeric and can include spaces, hyphens, and underscores. Restrictions on custom fields include the following ones: <ul><li>No dynamic custom `{field}` name is allowed if your Write mode is Once. </li><li>Field names aren't case sensitive. For example, the service can't differentiate between column `ID` and column `id`.</li><li>Nested fields aren't permitted. Instead, use an alias in the job query to "flatten" the field.</li><li>Expressions can't be used as a field name.</li></ul> <br />This feature enables the use of custom date/time format specifier configurations in the path. Custom date/time formats must be specified one at a time and enclosed by the `{datetime:\<specifier>}` keyword. Allowable inputs for `\<specifier>` are `yyyy`, `MM`, `M`, `dd`, `d`, `HH`, `H`, `mm`, `m`, `ss`, or `s`. The `{datetime:\<specifier>}` keyword can be used multiple times in the path to form custom date/time configurations. <br /><br />Examples: <ul><li>Example 1: `cluster1/logs/{date}/{time}`</li><li>Example 2: `cluster1/logs/{date}`</li><li>Example 3: `cluster1/{client_id}/{date}/{time}`</li><li>Example 4: `cluster1/{datetime:ss}/{myField}` where the query is `SELECT data.myField AS myField FROM Input;`</li><li>Example 5: `cluster1/year={datetime:yyyy}/month={datetime:MM}/day={datetime:dd}`</ul><br />The time stamp of the created folder structure follows UTC and not local time. [System.Timestamp](./stream-analytics-time-handling.md#choose-the-best-starting-time) is the time used for all time-based partitioning.<br /><br />File naming uses the following convention: <br /><br />`{Path Prefix Pattern}/schemaHashcode_Guid_Number.extension`<br /><br /> Here, `Guid` represents the unique identifier assigned to an internal writer that's created to write to a blob file. The number represents the index of the blob block. <br /><br /> Example output files:<ul><li>`Myoutput/20170901/00/45434_gguid_1.csv`</li>  <li>`Myoutput/20170901/01/45434_gguid_1.csv`</li></ul> <br />For more information about this feature, see [Azure Stream Analytics custom blob output partitioning](stream-analytics-custom-path-patterns-blob-storage-output.md). |
| Date format | Required when the event serialization format is Delta Lake. If the date token is used in the prefix path, you can select the date format in which your files are organized. An example is `YYYY/MM/DD`. |
| Time format | Required when the event serialization format is Delta Lake. If the time token is used in the prefix path, specify the time format in which your files are organized.|
|Minimum  rows |The number of minimum rows per batch. For Parquet, every batch creates a new file. The current default value is 2,000 rows and the allowed maximum is 10,000 rows.|
|Maximum time |The maximum wait time per batch. After this time, the batch is written to the output even if the minimum rows requirement isn't met. The current default value is 1 minute and the allowed maximum is 2 hours. If your blob output has path pattern frequency, the wait time can't be higher than the partition time range.|
| Encoding    | If you're using CSV or JSON format, encoding must be specified. UTF-8 is the only supported encoding format at this time. |
| Delimiter   | Applicable only for CSV serialization. Stream Analytics supports many common delimiters for serializing CSV data. Supported values are comma, semicolon, space, tab, and vertical bar. |
| Format      | Applicable only for JSON serialization. **Line separated** specifies that the output is formatted by having each JSON object separated by a new line. If you select **Line separated**, the JSON is read one object at a time. The whole content by itself wouldn't be a valid JSON. **Array** specifies that the output is formatted as an array of JSON objects. This array is closed only when the job stops or Stream Analytics has moved on to the next time window. In general, it's preferable to use line-separated JSON because it doesn't require any special handling while the output file is still being written to. |

## Exactly-once delivery (public preview)

End-to-end exactly-once delivery when reading any streaming input means that processed data is written to Data Lake Storage Gen2 output once without duplicates. When the feature is enabled, your Stream Analytics job guarantees no data loss and no duplicates being produced as output, across user-initiated restart from the last output time. It simplifies your streaming pipeline by not having to implement and troubleshoot deduplication logic.

### Write mode

There are two ways that Stream Analytics writes to your Blob Storage or Data Lake Storage Gen2 account. One way is to append results either to the same file or to a sequence of files as results are coming in. The other way is to write after all the results for the time partition, when all the data for the time partition is available. Exactly-once delivery is enabled when Write mode is Once.

There's no Write mode option for Delta Lake. However, Delta Lake output also provides exactly-once guarantees by using the Delta log. It doesn't require time partition and writes results continuously based on the batching parameters that the user defined.

> [!NOTE]
> If you prefer not to use the preview feature for exactly-once delivery, select **Append as results arrive**.

### Configuration

To receive exactly-once delivery for your Blob Storage or Data Lake Storage Gen2 account, you need to configure the following settings:

* Select **Once after all results of time partition is available** for your **Write Mode**.
* Provide **Path Pattern** with both `{date}` and `{time}` specified.
* Specify **date format** and **time format**.

### Limitations

* [Substream](/stream-analytics-query/timestamp-by-azure-stream-analytics) isn't supported.
* Path Pattern becomes a required property and must contain both `{date}` and `{time}`. No dynamic custom `{field}` name is allowed. Learn more about [custom path pattern](stream-analytics-custom-path-patterns-blob-storage-output.md).
* If the job is started at a custom time before or after the last output time, there's a risk of the file being overwritten. For example, when **time format** is set to **HH**, the file is generated every hour. If you stop the job at 8:15 AM and restart the job at 8:30 AM, the file generated between 8 AM to 9 AM only covers data from 8:30 AM to 9 AM. The data from 8 AM to 8:15 AM gets lost as it's overwritten.

## Blob output files

When you're using Blob Storage as output, a new file is created in the blob in the following cases:

* The file exceeds the maximum number of allowed blocks (currently 50,000). You might reach the maximum-allowed number of blocks without reaching the maximum-allowed blob size. For example, if the output rate is high, you can see more bytes per block, and the file size is larger. If the output rate is low, each block has less data, and the file size is smaller.
* There's a schema change in the output, and the output format requires fixed schema (CSV, Avro, or Parquet).
* A job is restarted, either externally by a user stopping it and starting it or internally for system maintenance or error recovery.
* Query is fully partitioned, and a new file is created for each output partition. It comes from using `PARTITION BY` or the native parallelization introduced in [compatibility level 1.2](stream-analytics-compatibility-level.md#parallel-query-execution-for-input-sources-with-multiple-partitions).
* User deletes a file or a container of the storage account.
* Output is time partitioned by using the path prefix pattern, and a new blob is used when the query moves to the next hour.
* Output is partitioned by a custom field, and a new blob is created per partition key if it doesn't exist.
* Output is partitioned by a custom field where the partition key cardinality exceeds 8,000, and a new blob is created per partition key.

## Partitioning

For partition key, use `{date}` and `{time}` tokens from your event fields in the path pattern. Choose the date format, such as `YYYY/MM/DD`, `DD/MM/YYYY`, or `MM-DD-YYYY`. `HH` is used for the time format. Blob output can be partitioned by a single custom event attribute `{fieldname}` or `{datetime:\<specifier>}`. The number of output writers follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md).

## Output batch size

For the maximum message size, see [Azure Storage limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits). The maximum blob block size is 4 MB and the maximum blob block count is 50,000.

## Limitations

* If a forward slash symbol (`/`) is used in the path pattern (for example, `/folder2/folder3`), empty folders are created and they aren't visible in Storage Explorer.
* Stream Analytics appends to the same file in cases where a new blob file isn't needed. It could cause more triggers to be generated if Azure services like Azure Event Grid are configured to be triggered on a blob file update.
* Stream Analytics appends to a blob by default. When the output format is a JSON array, it completes the file on shutdown or when the output moves to the next time partition for time-partitioned outputs. In some cases, such as an unclean restart, it's possible that the closing square bracket (`]`) for the JSON array is missing.

## Related content

* [Use Managed Identity to authenticate your Azure Stream Analytics job to Azure Blob Storage](blob-output-managed-identity.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
