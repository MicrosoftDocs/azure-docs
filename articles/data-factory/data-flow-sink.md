---
title: Sink transformation in mapping data flow
description: Learn how to configure a sink transformation in mapping data flow.
author: kromerm
ms.author: makromer
ms.reviewer: daperlov
manager: anandsub
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 12/12/2019
---

# Sink transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

After you transform your data, you can sink the data into a destination dataset. Every data flow requires at least one sink transformation, but you can write to as many sinks as necessary to complete your transformation flow. To write to additional sinks, create new streams via new branches and conditional splits.

Each sink transformation is associated with exactly one Data Factory dataset. The dataset defines the shape and location of the data you want to write to.

## Supported sink connectors in mapping data flow

Currently the following datasets can be used in a sink transformation:
    
* [Azure Blob Storage](connector-azure-blob-storage.md#mapping-data-flow-properties) (JSON, Avro, Text, Parquet)
* [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md#mapping-data-flow-properties)  (JSON, Avro, Text, Parquet)
* [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#mapping-data-flow-properties)  (JSON, Avro, Text, Parquet)
* [Azure Synapse Analytics](connector-azure-sql-data-warehouse.md#mapping-data-flow-properties)
* [Azure SQL Database](connector-azure-sql-database.md#mapping-data-flow-properties)
* [Azure CosmosDB](connector-azure-cosmos-db.md#mapping-data-flow-properties)

Settings specific to these connectors are located in the **Settings** tab. Information on these settings are located in the connector documentation. 

Azure Data Factory has access to over [90 native connectors](connector-overview.md). To write data to those other sources from your data flow, use the Copy Activity to load that data from one of the supported staging areas after completion of your data flow.

## Sink settings

Once you have added a sink, configure via the **Sink** tab. Here you can pick or create the dataset your sink writes to. Below is a video explaining a number of different Sink options for text delimited file types:

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4tf7T]

![Sink settings](media/data-flow/sink-settings.png "Sink Settings")

**Schema drift:** [Schema Drift](concepts-data-flow-schema-drift.md) is data factory's ability to natively handle flexible schemas in your data flows without needing to explicitly define column changes. Enable **Allow schema drift** to write additional columns on top of what is defined in the sink data schema.

**Validate schema:** If validate schema is selected, the data flow will fail if any column of the incoming source schema is not found in the source projection, or if the data types do not match. Use this setting to enforce that the source data meets the contract of your defined projection. It is very useful in database source scenarios to signal that column names or types have changed.

## Field mapping

Similar to a Select transformation, in the **Mapping** tab of the sink, you can decide which incoming columns will get written. By default, all input columns, including drifted columns, are mapped. This is known as **Auto-mapping**.

When you turn off auto-mapping, you'll have the option to add either fixed column-based mappings or rule-based mappings. Rule-based mappings allow you to write expressions with pattern matching while fixed mapping will map logical and physical column names. For more information on rule-based mapping, see [column patterns in mapping data flow](concepts-data-flow-column-pattern.md#rule-based-mapping-in-select-and-sink).

## Custom sink ordering

By default, data is written to multiple sinks in a nondeterministic order. The execution engine will write data in parallel as the transformation logic is completed and the sink ordering may vary each run. To specify and exact sink ordering, enable **Custom sink ordering** in the general tab of the data flow. When enabled, sinks will be written sequentially in increasing order.

![Custom sink ordering](media/data-flow/custom-sink-ordering.png "Custom sink ordering")

## Data preview in sink

When fetching a data preview on a debug cluster, no data will be written to your sink. A snapshot of what the data looks like will be returned, but nothing will be written to your destination. To test writing data into your sink, run a pipeline debug from the pipeline canvas.

## Next steps
Now that you've created your data flow, add a [Data Flow activity to your pipeline](concepts-data-flow-overview.md).
