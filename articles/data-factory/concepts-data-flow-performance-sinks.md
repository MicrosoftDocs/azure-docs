---
title: Sink performance and best practices in mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about optimizing sink performance and best practices in mapping data flows in Azure Data Factory and Azure Synapse Analytics pipelines.
author: kromerm
ms.topic: conceptual
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.date: 10/20/2023
---

# Optimizing sinks

When data flows write to sinks, any custom partitioning happens immediately before the write. Like the source, in most cases it's recommended that you keep **Use current partitioning** as the selected partition option. Partitioned data writes much faster than unpartitioned data, even your destination isn't partitioned. Following are the individual considerations for various sink types. 

## Azure SQL Database sinks

With Azure SQL Database, the default partitioning should work in most cases. There's a chance that your sink might have too many partitions for your SQL database to handle. If you're running into this, reduce the number of partitions outputted by your SQL Database sink.

### Best practice for deleting rows in sink based on missing rows in source

Here's a video walk-through of how to use data flows with exists, alter row, and sink transformations to achieve this common pattern: 

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWMLr5]

### Impact of error row handling to performance

When you enable error row handling ("continue on error") in the sink transformation, the service takes an extra step before writing the compatible rows to your destination table. This extra step has a small performance penalty that can be in the range of 5% added for this step with an extra small performance hit also added if you set the option to also write the incompatible rows to a log file.

### Disabling indexes using a SQL Script

Disabling indexes before a load in a SQL database can greatly improve performance of writing to the table. Run the below command before writing to your SQL sink.

`ALTER INDEX ALL ON dbo.[Table Name] DISABLE`

After the write has completed, rebuild the indexes using the following command:

`ALTER INDEX ALL ON dbo.[Table Name] REBUILD`

These can both be done natively using Pre and Post-SQL scripts within an Azure SQL Database or Synapse sink in mapping data flows.

:::image type="content" source="media/data-flow/disable-indexes-sql.png" alt-text="Disable indexes":::

> [!WARNING]
> When disabling indexes, the data flow is effectively taking control of a database and queries are unlikely to succeed at this time. As a result, many ETL jobs are triggered in the middle of the night to avoid this conflict. For more information, learn about the [constraints of disabling SQL indexes](/sql/relational-databases/indexes/disable-indexes-and-constraints)

### Scaling up your database

Schedule a resizing of your source and sink Azure SQL DB and DW before your pipeline run to increase the throughput and minimize Azure throttling once you reach DTU limits. After your pipeline execution is complete, resize your databases back to their normal run rate.

## Azure Synapse Analytics sinks

When writing to Azure Synapse Analytics, make sure that **Enable staging** is set to true. This enables the service to write using the [SQL COPY Command](/sql/t-sql/statements/copy-into-transact-sql), which effectively loads the data in bulk. You'll need to reference an Azure Data Lake Storage gen2 or Azure Blob Storage account for staging of the data when using Staging.

Other than Staging, the same best practices apply to Azure Synapse Analytics as Azure SQL Database.

## File-based sinks 

While data flows support various file types, the Spark-native Parquet format is recommended for optimal read and write times.

If the data is evenly distributed, **Use current partitioning** is the fastest partitioning option for writing files.

### File name options

When writing files, you have a choice of naming options that each have an effect on performance.

:::image type="content" source="media/data-flow/file-sink-settings.png" alt-text="Sink options":::

Selecting the **Default** option writes the fastest. Each partition equates to a file with the Spark default name. This is useful if you're just reading from the folder of data.

Setting a naming **Pattern** renames each partition file to a more user-friendly name. This operation happens after write and is slightly slower than choosing the default.

**Per partition** allows you to name each individual partition manually.

If a column corresponds to how you wish to output the data, you can select **Name file as column data**. This reshuffles the data and can affect performance if the columns aren't evenly distributed.

If a column corresponds to how you wish to generate folder names, select **Name folder as column data**.

**Output to single file** combines all the data into a single partition. This leads to long write times, especially for large datasets. This option is discouraged unless there's an explicit business reason to use it.

## Azure Cosmos DB sinks

When you're writing to Azure Cosmos DB, altering throughput and batch size during data flow execution can improve performance. These changes only take effect during the data flow activity run and will return to the original collection settings after conclusion. 

**Batch size:** Usually, starting with the default batch size is sufficient. To further tune this value, calculate the rough object size of your data, and make sure that object size * batch size is less than 2MB. If it is, you can increase the batch size to get better throughput.

**Throughput:** Set a higher throughput setting here to allow documents to write faster to Azure Cosmos DB. Keep in mind the higher RU costs based upon a high throughput setting.

**Write throughput budget:** Use a value, which is smaller than total RUs per minute. If you have a data flow with a high number of Spark partitions, setting a budget throughput allows more balance across those partitions.

## Next steps

- [Data flow performance overview](concepts-data-flow-performance.md)
- [Optimizing sources](concepts-data-flow-performance-sources.md)
- [Optimizing transformations](concepts-data-flow-performance-transformations.md)
- [Using data flows in pipelines](concepts-data-flow-performance-pipelines.md)

See other Data Flow articles related to performance:

- [Data Flow activity](control-flow-execute-data-flow-activity.md)
- [Monitor Data Flow performance](concepts-data-flow-monitoring.md)
- [Integration Runtime performance](concepts-integration-runtime-performance.md)
