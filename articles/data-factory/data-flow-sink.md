---
title: Sink transformation in mapping data flow
titleSuffix: Azure Data Factory& Azure Synapse
description: Learn how to configure a sink transformation in mapping data flow.
author: kromerm
ms.author: makromer
ms.reviewer: daperlov
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/20/2021
---

# Sink transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

After you finish transforming your data, write it into a destination store by using the sink transformation. Every data flow requires at least one sink transformation, but you can write to as many sinks as necessary to complete your transformation flow. To write to additional sinks, create new streams via new branches and conditional splits.

Each sink transformation is associated with exactly one Azure Data Factory dataset object or linked service. The sink transformation determines the shape and location of the data you want to write to.

## Inline datasets

When you create a sink transformation, choose whether your sink information is defined inside a dataset object or within the sink transformation. Most formats are available in only one or the other. To learn how to use a specific connector, see the appropriate connector document.

When a format is supported for both inline and in a dataset object, there are benefits to both. Dataset objects are reusable entities that can be used in other data flows and activities such as Copy. These reusable entities are especially useful when you use a hardened schema. Datasets aren't based in Spark. Occasionally, you might need to override certain settings or schema projection in the sink transformation.

Inline datasets are recommended when you use flexible schemas, one-off sink instances, or parameterized sinks. If your sink is heavily parameterized, inline datasets allow you to not create a "dummy" object. Inline datasets are based in Spark, and their properties are native to data flow.

To use an inline dataset, select the format you want in the **Sink type** selector. Instead of selecting a sink dataset, you select the linked service you want to connect to.

![Screenshot that shows Inline selected.](media/data-flow/inline-selector.png "Screenshot that shows Inline selected.")

##  <a name="supported-sinks"></a> Supported sink types

Mapping data flow follows an extract, load, and transform (ELT) approach and works with *staging* datasets that are all in Azure. Currently, the following datasets can be used in a source transformation.

| Connector | Format | Dataset/inline |
| --------- | ------ | -------------- |
| [Azure Blob Storage](connector-azure-blob-storage.md#mapping-data-flow-properties) | [Avro](format-avro.md#mapping-data-flow-properties) <br>[Delimited text](format-delimited-text.md#mapping-data-flow-properties) <br>[Delta](format-delta.md) <br>[JSON](format-json.md#mapping-data-flow-properties) <br/>[ORC](format-orc.md#mapping-data-flow-properties)<br>[Parquet](format-parquet.md#mapping-data-flow-properties) | ✓/- <br>✓/- <br>-/✓ <br>✓/- <br>✓/✓<br>✓/- |
| [Azure Cosmos DB (SQL API)](connector-azure-cosmos-db.md#mapping-data-flow-properties) | | ✓/- |
| [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md#mapping-data-flow-properties) | [Avro](format-avro.md#mapping-data-flow-properties) <br>[Delimited text](format-delimited-text.md#mapping-data-flow-properties) <br>[JSON](format-json.md#mapping-data-flow-properties) <br/>[ORC](format-orc.md#mapping-data-flow-properties)<br/>[Parquet](format-parquet.md#mapping-data-flow-properties) | ✓/- <br>✓/- <br>✓/- <br>✓/✓<br>✓/- |
| [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#mapping-data-flow-properties) | [Avro](format-avro.md#mapping-data-flow-properties) <br/>[Common Data Model](format-common-data-model.md#sink-properties)<br>[Delimited text](format-delimited-text.md#mapping-data-flow-properties) <br>[Delta](format-delta.md) <br>[JSON](format-json.md#mapping-data-flow-properties) <br/>[ORC](format-orc.md#mapping-data-flow-properties)<br/>[Parquet](format-parquet.md#mapping-data-flow-properties) | ✓/- <br>-/✓ <br>✓/- <br>-/✓ <br>✓/-<br>✓/✓ <br>✓/- |
| [Azure Database for MySQL](connector-azure-database-for-mysql.md) |  | ✓/✓ |
| [Azure Database for PostgreSQL](connector-azure-database-for-postgresql.md) |  | ✓/✓ |
| [Azure SQL Database](connector-azure-sql-database.md#mapping-data-flow-properties) | | ✓/✓ |
| [Azure SQL Managed Instance](connector-azure-sql-managed-instance.md#mapping-data-flow-properties) | | ✓/- |
| [Azure Synapse Analytics](connector-azure-sql-data-warehouse.md#mapping-data-flow-properties) | | ✓/- |
| [Snowflake](connector-snowflake.md) | | ✓/✓ |
| [SQL Server](connector-sql-server.md) | | ✓/✓ |

Settings  specific to these connectors are located on the **Settings** tab. Information and data flow script examples on these settings are located in the connector documentation.

Azure Data Factory has access to more than [90 native connectors](connector-overview.md). To write data to those other sources from your data flow, use the Copy Activity to load that data from a supported sink.

## Sink settings

After you've added a sink, configure via the **Sink** tab. Here you can pick or create the dataset your sink writes to. Development values for dataset parameters can be configured in [Debug settings](concepts-data-flow-debug-mode.md). (Debug mode must be turned on.)

The following video explains a number of different sink options for text-delimited file types.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4tf7T]

![Screenshot that shows Sink settings.](media/data-flow/sink-settings.png "Screenshot that shows Sink settings.")

**Schema drift**: [Schema drift](concepts-data-flow-schema-drift.md) is the ability of Data Factory to natively handle flexible schemas in your data flows without needing to explicitly define column changes. Enable **Allow schema drift** to write additional columns on top of what's defined in the sink data schema.

**Validate schema**: If validate schema is selected, the data flow will fail if any column of the incoming source schema isn't found in the source projection, or if the data types don't match. Use this setting to enforce that the source data meets the contract of your defined projection. It's useful in database source scenarios to signal that column names or types have changed.

## Cache sink

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4HKt1]

A *cache sink* is when a data flow writes data into the Spark cache instead of a data store. In mapping data flows, you can reference this data within the same flow many times using a *cache lookup*. This is useful when you want to reference data as part of an expression but don't want to explicitly join the columns to it. Common examples where a cache sink can help are looking up a max value on a data store and matching error codes to an error message database. 

To write to a cache sink, add a sink transformation and select **Cache** as the sink type. Unlike other sink types, you don't need to select a dataset or linked service because you aren't writing to an external store. 

![Select cache sink](media/data-flow/select-cache-sink.png "Select cache sink")

In the sink settings, you can optionally specify the key columns of the cache sink. These are used as matching conditions when using the `lookup()` function in a cache lookup. If you specify key columns, you can't use the `outputs()` function in a cache lookup. To learn more about the cache lookup syntax, see [cached lookups](concepts-data-flow-expression-builder.md#cached-lookup).

![Cache sink key columns](media/data-flow/cache-sink-key-columns.png "Cache sink key columns")

For example, if I specify a single key column of `column1` in a cache sink called `cacheExample`, calling `cacheExample#lookup()` would have one parameter specifies which row in the cache sink to match on. The function outputs a single complex column with subcolumns for each column mapped.

> [!NOTE]
> A cache sink must be in a completely independent data stream from any transformation referencing it via a cache lookup. A cache sink also must the first sink written. 

**Write to activity output** The cached sink can optionally write your output data to the input of the next pipeline activity. This will allow you to quickly and easily pass data out of your data flow activity without needing to persist the data in a data store.

## Field mapping

Similar to a select transformation, on the **Mapping** tab of the sink, you can decide which incoming columns will get written. By default, all input columns, including drifted columns, are mapped. This behavior is known as *automapping*.

When you turn off automapping, you can add either fixed column-based mappings or rule-based mappings. With rule-based mappings, you can write expressions with pattern matching. Fixed mapping maps logical and physical column names. For more information on rule-based mapping, see [Column patterns in mapping data flow](concepts-data-flow-column-pattern.md#rule-based-mapping-in-select-and-sink).

## Custom sink ordering

By default, data is written to multiple sinks in a nondeterministic order. The execution engine writes data in parallel as the transformation logic is completed, and the sink ordering might vary each run. To specify an exact sink ordering, enable **Custom sink ordering** on the **General** tab of the data flow. When enabled, sinks are written sequentially in increasing order.

![Screenshot that shows Custom sink ordering.](media/data-flow/custom-sink-ordering.png "Screenshot that shows Custom sink ordering.")

> [!NOTE]
> When utilizing [cached lookups](./concepts-data-flow-expression-builder.md#cached-lookup), make sure that your sink ordering has the cached sinks set to 1, the lowest (or first) in ordering.

![Custom sink ordering](media/data-flow/cache-2.png "Custom sink ordering")

### Sink groups

You can group sinks together by applying the same order number for a series of sinks. ADF will treat those sinks as groups that can execute in parallel. Options for parallel execution will surface in the pipeline data flow activity.

## Error row handling

When writing to databases, certain rows of data may fail due to constraints set by the destination. By default, a data flow run will fail on the first error it gets. In certain connectors, you can choose to **Continue on error** that allows your data flow to complete even if individual rows have errors. Currently, this capability is only available in Azure SQL Database and Synapse. For more information, see [error row handling in Azure SQL DB](connector-azure-sql-database.md#error-row-handling).

Below is a video tutorial on how to use database error row handling automatically in your sink transformation.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4IWne]

## Data preview in sink

When fetching a data preview in debug mode, no data will be written to your sink. A snapshot of what the data looks like will be returned, but nothing will be written to your destination. To test writing data into your sink, run a pipeline debug from the pipeline canvas.

## Data flow script

### Example

Below is an example of a sink transformation and its data flow script:

```
sink(input(
		movie as integer,
		title as string,
		genres as string,
		year as integer,
		Rating as integer
	),
	allowSchemaDrift: true,
	validateSchema: false,
	deletable:false,
	insertable:false,
	updateable:true,
	upsertable:false,
	keys:['movie'],
	format: 'table',
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true,
	saveOrder: 1,
	errorHandlingOption: 'stopOnFirstError') ~> sink1
```

## Next steps

Now that you've created your data flow, add a [data flow activity to your pipeline](concepts-data-flow-overview.md).
