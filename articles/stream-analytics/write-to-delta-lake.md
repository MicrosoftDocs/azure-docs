---
title: 'Azure Stream Analytics: Write to a Delta Lake table'

description: This article describes how to write data to a Delta Lake table stored in Azure Data Lake Storage Gen2.
author: an-emma
ms.author: raan
ms.service: azure-stream-analytics
ms.topic: conceptual
ms.date: 10/12/2022
ms.custom: build-2023
---

# Azure Stream Analytics: Write to a Delta Lake table

Delta Lake is an open format that brings reliability, quality, and performance to data lakes. You can use Azure Stream Analytics to directly write streaming data to your Delta Lake tables without writing a single line of code.

A Stream Analytics job can be configured to write through a native Delta Lake output connector, either to a new or a precreated Delta table in an Azure Data Lake Storage Gen2 account. This connector is optimized for high-speed ingestion to Delta tables in Append mode. It also provides exactly-once semantics, which guarantees that no data is lost or duplicated. Ingesting real-time data streams from Azure Event Hubs into Delta tables allows you to perform ad hoc interactive or batch analytics.

## Delta Lake configuration

To write data in Delta Lake, you need to connect to a Data Lake Storage Gen2 account. The following table lists the properties related to Delta Lake configuration.

|Property name  |Description  |
|----------|-----------|
|Event serialization format|Serialization format for output data. JSON, CSV, Avro, and Parquet are supported. Delta Lake is listed as an option here. The data is in Parquet format if Delta Lake is selected. |
|Delta path name| The path that's used to write your Delta Lake table within the specified container. It includes the table name. More information is in the next section. |
|Partition column |Optional. The `{field}` name from your output data to partition. Only one partition column is supported. The column's value must be of `string` type. |

To see the full list of Data Lake Storage Gen2 configuration, see [Azure Data Lake Storage Gen2 overview](blob-storage-azure-data-lake-gen2-output.md).

### Delta path name

The Delta path name is used to specify the location and name of your Delta Lake table stored in Data Lake Storage Gen2.

You can use one or more path segments to define the path to the Delta table and the Delta table name. A path segment is the string between consecutive delimiter characters (for example, the forward slash `/`) that corresponds to the name of a virtual directory.

The segment name is alphanumeric and can include spaces, hyphens, and underscores. The last path segment is used as the table name.

Restrictions on the Delta path name include:

- Field names aren't case sensitive. For example, the service can't differentiate between column `ID` and `id`.
- No dynamic `{field}` name is allowed. For example, `{ID}` is treated as text {ID}.
- The number of path segments that comprise the name can't exceed 254.

### Examples

Examples for a Delta path name:

- Example 1: `WestUS/CA/factory1/device-table`
- Example 2: `Test/demo`
- Example 3: `mytable`

Example output files:

1. Under the chosen container, the directory path is `WestEurope/CA/factory1` and the Delta table folder name is **device-table**.
1. Under the chosen container, the directory path is `Test` and the Delta table folder name is **demo**.
1. Under the chosen container, the Delta table folder name is **mytable**.

## Create a new table

If there isn't already a Delta Lake table with the same name and in the location specified by the Delta path name, by default, Stream Analytics creates a new Delta table. This new table is created with the following configuration:

- [Writer Version 2](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#writer-version-requirements).
- [Reader Version 1](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#reader-version-requirements).
- The table is [append-only](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#append-only-tables).
- The table schema is created with the schema of the first record encountered.

## Write to the table

If a Delta Lake table already exists with the same name and in the location specified by the Delta path name, by default, Stream Analytics writes new records to the existing table.

### Exactly-once delivery

The transaction log enables Delta Lake to guarantee exactly-once processing. Stream Analytics also provides exactly-once delivery when outputting data to Data Lake Storage Gen2 during a single job run.

### Schema enforcement

Schema enforcement means that all new writes to a table are enforced to be compatible with the target table's schema at write time to ensure data quality.

All records of output data are projected to the schema of the existing table. If the output is written to a new Delta table, the table schema is created with the first record. If the incoming data has one extra column compared to the existing table schema, it's written in the table without the extra column. If the incoming data is missing one column compared to the existing table schema, it's written in the table with the column being null.

If there's no intersection between the schema of the Delta table and the schema of a record of the streaming job, it's considered an instance of schema conversion failure. It isn't the only case that's considered schema conversion failure.

At the failure of schema conversion, the job behavior follows the [output data error-handling policy](stream-analytics-output-error-policy.md) configured at the job level.

### Delta log checkpoints

The Stream Analytics job creates [Delta log checkpoints](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#checkpoints-1) periodically in the V1 format. Delta log checkpoints are snapshots of the Delta table and typically contain the name of the data file generated by the Stream Analytics job. If the number of data files is large, it leads to large checkpoints, which can cause memory issues in the Stream Analytics job.

## Limitations

- Dynamic partition key (specifying the name of a column of the record schema in the Delta path) isn't supported.
- Multiple partition columns aren't supported. If you want multiple partition columns, we recommend that you use a composite key in the query and then specify it as the partition column.
    - A composite key can be created in the query. An example is `"SELECT concat (col1, col2) AS compositeColumn INTO [blobOutput] FROM [input]"`.
- Writing to Delta Lake is append only.
- Schema checking in query testing isn't available.
- Small file compaction isn't performed by Stream Analytics.
- All data files are created without compression.
- The [Date and Decimal types](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#valid-feature-names-in-table-features) aren't supported.
- Writing to existing tables of Writer Version 7 or above with writer features fail.
    - Example: Writing to existing tables with [Deletion Vectors](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#deletion-vectors) enabled fail.
    - The exceptions here are the [changeDataFeed and appendOnly Writer Features](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#valid-feature-names-in-table-features).
- When a Stream Analytics job writes a batch of data to a Delta Lake, it can generate multiple [Add File actions](https://github.com/delta-io/delta/blob/master/PROTOCOL.md#add-file-and-remove-file). When there are too many Add File actions generated for a single batch, a Stream Analytics job can be stuck.
    - The number of Add File actions generated are determined by many factors:
        - Size of the batch. It's determined by the data volume and the batching parameters [Minimum Rows and Maximum Time](blob-storage-azure-data-lake-gen2-output.md#output-configuration).
        - Cardinality of the [partition column values](#delta-lake-configuration) of the batch.
    - To reduce the number of Add File actions generated for a batch:
        - Reduce the batching configurations [Minimum Rows and Maximum Time](blob-storage-azure-data-lake-gen2-output.md#output-configuration).
        - Reduce the cardinality of the [partition column values](#delta-lake-configuration) by tweaking the input data or choosing a different partition column.
- Stream Analytics jobs can only read and write single part V1 checkpoints. Multipart checkpoints and the checkpoint V2 format aren't supported.

## Related content

* [Capture data from Event Hubs in Delta Lake format](capture-event-hub-data-delta-lake.md)
