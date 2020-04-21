---
title: Source transformation in mapping data flow
description: Learn how to set up a source transformation in mapping data flow. 
author: kromerm
ms.author: makromer
manager: anandsub
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 12/12/2019
---

# Source transformation in mapping data flow 

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

A source transformation configures your data source for the data flow. When designing data flows, your first step will always be configuring a source transformation. To add a source, click on the **Add Source** box in the data flow canvas.

Every data flow requires at least one source transformation, but you can add as many sources as necessary to complete your data transformations. You can join those sources together with a join, lookup, or a union transformation.

Each source transformation is associated with exactly one Data Factory dataset. The dataset defines the shape and location of the data you want to write to or read from. If using a file-based dataset, you can use wildcards and file lists in your source to work with more than one file at a time.

## Supported source connectors in mapping data flow

Mapping Data Flow follows an extract, load, transform (ELT) approach and works with *staging* datasets that are all in Azure. Currently the following datasets can be used in a source transformation:
    
* [Azure Blob Storage](connector-azure-blob-storage.md#mapping-data-flow-properties) (JSON, Avro, Text, Parquet)
* [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md#mapping-data-flow-properties)  (JSON, Avro, Text, Parquet)
* [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md#mapping-data-flow-properties)  (JSON, Avro, Text, Parquet)
* [Azure Synapse Analytics](connector-azure-sql-data-warehouse.md#mapping-data-flow-properties)
* [Azure SQL Database](connector-azure-sql-database.md#mapping-data-flow-properties)
* [Azure CosmosDB](connector-azure-cosmos-db.md#mapping-data-flow-properties)

Settings specific to these connectors are located in the **Source options** tab. Information on these settings are located in the connector documentation. 

Azure Data Factory has access to over [90 native connectors](connector-overview.md). To include data from those other sources in your data flow, use the Copy Activity to load that data into one of the supported staging areas.

## Source settings

Once you have added a source, configure via the **Source Settings** tab. Here you can pick or create the dataset your source points at. You can also select schema and sampling options for your data.

![Source settings tab](media/data-flow/source1.png "Source settings tab")

**Test connection:** Test whether or not data flow's spark service can successfully connect to the linked service used in your source dataset. Debug mode must be on for this feature to be enabled.

**Schema drift:** [Schema Drift](concepts-data-flow-schema-drift.md) is data factory's ability to natively handle flexible schemas in your data flows without needing to explicitly define column changes.

* Check the **Allow schema drift** box if the source columns will change often. This setting allows all incoming source fields to flow through the transformations to the sink.

* Choosing **Infer drifted column types** will instruct data factory to detect and define data types for each new column discovered. With this feature turned off, all drifted columns will be of type string.

**Validate schema:** If validate schema is selected, the data flow will fail to run if the incoming source data doesn't match the defined schema of the dataset.

**Skip line count:** The skip line count field specifies how many lines to ignore at the beginning of the dataset.

**Sampling:** Enable sampling to limit the number of rows from your source. Use this setting when you test or sample data from your source for debugging purposes.

**Multiline rows:** Select multiline rows if your source text file contains string values that span multiple rows, i.e. newlines inside a value. This setting is only available in DelimitedText datasets.

To validate your source is configured correctly, turn on debug mode and fetch a data preview. For more information, see [Debug mode](concepts-data-flow-debug-mode.md).

> [!NOTE]
> When debug mode is turned on, the row limit configuration in debug settings will overwrite the sampling setting in the source during data preview.

## Projection

Like schemas in datasets, the projection in a source defines the data columns, types, and formats from the source data. For most dataset types such as SQL and Parquet, the projection in a source is fixed to reflect the schema defined in a dataset. When your source files aren't strongly typed (for example, flat csv files rather than Parquet files), you can define the data types for each field in the source transformation.

![Settings on the Projection tab](media/data-flow/source3.png "Projection")

If your text file has no defined schema, select **Detect data type** so that Data Factory will sample and infer the data types. Select **Define default format** to autodetect the default data formats.

**Reset schema** resets the projection to what is defined in the referenced dataset.

You can modify the column data types in a down-stream derived-column transformation. Use a select transformation to modify the column names.

### Import schema

The **Import Schema** button on the **Projection** tab allows you to use an active debug cluster to create a schema projection. Available in every source type, importing the schema here will override the projection defined in the dataset. The dataset object will not be changed.

This is useful in datasets like Avro and CosmosDB that support complex data structures do not require schema definitions to exist in the dataset.

## Optimize the source transformation

On the **Optimize** tab for the source transformation, you might see a **Source** partition type. This option is available only when your source is Azure SQL Database. This is because Data Factory tries to make connections parallel to run large queries against your SQL Database source.

![Source partition settings](media/data-flow/sourcepart3.png "partitioning")

You don't have to partition data on your SQL Database source, but partitions are useful for large queries. You can base your partition on a column or a query.

### Use a column to partition data

From your source table, select a column to partition on. Also set the number of partitions.

### Use a query to partition data

You can choose to partition the connections based on a query. Enter the contents of a WHERE predicate. For example, enter year > 1980.

For more information on optimization within mapping data flow, see the [Optimize tab](concepts-data-flow-overview.md#optimize).

## Next steps

Begin building a [derived-column transformation](data-flow-derived-column.md) and a [select transformation](data-flow-select.md).
