---
title: Source transformation in mapping data flow - Azure Data Factory | Microsoft Docs
description: Learn how to set up a source transformation in mapping data flow. 
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 09/06/2019
---

# Source transformation for mapping data flow 

A source transformation configures your data source for the data flow. When designing data flows, your first step will always be configuring a source transformation. To add a source, click on the **Add Source** box in the data flow canvas.

Every data flow requires at least one source transformation, but you can add as many sources as necessary to complete your data transformations. You can join those sources together with a join, lookup, or a union transformation.

Each source transformation is associated with exactly one Data Factory dataset. The dataset defines the shape and location of the data you want to write to or read from. If using a file-based dataset, you can use wildcards and file lists in your source to work with more than one file at a time.

## Supported connectors in mapping data flow

Mapping Data Flow follows an extract, load, transform (ELT) approach and works with *staging* datasets that are all in Azure. Currently the following datasets can be used in a source transformation:
    
* Azure Blob Storage (JSON, Avro, Text, Parquet)
* Azure Data Lake Storage Gen1 (JSON, Avro, Text, Parquet)
* Azure Data Lake Storage Gen2 (JSON, Avro, Text, Parquet)
* Azure SQL Data Warehouse
* Azure SQL Database
* Azure CosmosDB

Azure Data Factory has access to over 80 native connectors. To include data from those other sources in your data flow, use the Copy Activity to load that data into one of the supported staging areas.

## Source settings

Once you have added a source, configure via the **Source Settings** tab. Here you can pick or create the dataset your source points at. You can also select schema and sampling options for your data.

![Source settings tab](media/data-flow/source1.png "Source settings tab")

**Schema drift:** [Schema Drift](concepts-data-flow-schema-drift.md) is data factory's ability to natively handle flexible schemas in your data flows without needing to explicitly define column changes.

* Check the **Allow schema drift** box if the source columns will change often. This setting allows all incoming source fields to flow through the transformations to the sink.

* Choosing **Infer drifted column types** will instruct data factory to detect and define data types for each new column discovered. With this feature turned off, all drifted columns will be of type string.

**Validate schema:** If validate schema is selected, the data flow will fail to run if the incoming source data doesn't match the defined schema of the dataset.

**Skip line count:** The skip line count field specifies how many lines to ignore at the beginning of the dataset.

**Sampling:** Enable sampling to limit the number of rows from your source. Use this setting when you test or sample data from your source for debugging purposes.

**Multiline rows:** Select multiline rows if your source text file contains string values that span multiple rows, i.e. newlines inside a value.

To validate your source is configured correctly, turn on debug mode and fetch a data preview. For more information, see [Debug mode](concepts-data-flow-debug-mode.md).

> [!NOTE]
> When debug mode is turned on, the row limit configuration in debug settings will overwrite the sampling setting in the source during data preview.

## File-based source options

If you're using a file-based dataset such as Azure Blob Storage or Azure Data Lake Storage, the **Source options** tab lets you manage how your source reads files.

![Source options](media/data-flow/sourceOPtions1.png "Source options")

**Wildcard path:** Using a wildcard pattern will instruct ADF to loop through each matching folder and file in a single Source transformation. This is an effective way to process multiple files within a single flow. Add multiple wildcard matching patterns with the + sign that appears when hovering over your existing wildcard pattern.

From your source container, choose a series of files that match a pattern. Only container can be specified in the dataset. Your wildcard path must therefore also include your folder path from the root folder.

Wildcard examples:

* ```*``` Represents any set of characters
* ```**``` Represents recursive directory nesting
* ```?``` Replaces one character
* ```[]``` Matches one of more characters in the brackets

* ```/data/sales/**/*.csv``` Gets all csv files under /data/sales
* ```/data/sales/20??/**``` Gets all files in the 20th century
* ```/data/sales/2004/*/12/[XY]1?.csv``` Gets all csv files in 2004 in December starting with X or Y prefixed by a two-digit number

**Partition Root Path:** If you have partitioned folders in your file source with  a ```key=value``` format (for example, year=2019), then you can assign the top level of that partition folder tree to a column name in your data flow data stream.

First, set a wildcard to include all paths that are the partitioned folders plus the leaf files that you wish to read.

![Partition source file settings](media/data-flow/partfile2.png "Partition file setting")

Use the Partition Root Path setting to define what the top level of the folder structure is. When you view the contents of your data via a data preview, you'll see that ADF will add the resolved partitions found in each of your folder levels.

![Partition root path](media/data-flow/partfile1.png "Partition root path preview")

**List of files:** This is a file set. Create a text file that includes a list of relative path files to process. Point to this text file.

**Column to store file name:** Store the name of the source file in a column in your data. Enter a new column name here to store the file name string.

**After completion:** Choose to do nothing with the source file after the data flow runs, delete the source file, or move the source file. The paths for the move are relative.

To move source files to another location post-processing, first select "Move" for file operation. Then, set the "from" directory. If you're not using any wildcards for your path, then the "from" setting will be the same folder as your source folder.

If you have a source path with wildcard, your syntax will look like this below:

```/data/sales/20??/**/*.csv```

You can specify "from" as

```/data/sales```

And "to" as

```/backup/priorSales```

In this case, all files that were sourced under /data/sales are moved to /backup/priorSales.

> [!NOTE]
> File operations run only when you start the data flow from a pipeline run (a pipeline debug or execution run) that uses the Execute Data Flow activity in a pipeline. File operations *do not* run in Data Flow debug mode.

**Filter by last modified:** You can filter which files you process by specifying a date range of when they were last modified. All date-times are in UTC. 

### Add dynamic content

All source settings can be specified as expressions using the [Mapping Data flow's transformation expression language](data-flow-expression-functions.md). To add dynamic content, click or hover inside of the fields in the settings panel. Click the hyperlink for **Add dynamic content**. This will launch the expression builder where you can set values dynamically using expressions, static literal values, or parameters.

![Parameters](media/data-flow/params6.png "Parameters")

## SQL source options

If your source is in SQL Database or SQL Data Warehouse, additional SQL-specific settings are available in the **Source Options** tab. 

**Input:** Select whether you point your source at a table (equivalent of ```Select * from <table-name>```) or enter a custom SQL query.

**Query**: If you select Query in the input field, enter a SQL query for your source. This setting overrides any table that you've chosen in the dataset. **Order By** clauses aren't supported here, but you can set a full SELECT FROM statement. You can also use user-defined table functions. **select * from udfGetData()** is a UDF in SQL that returns a table. This query will produce a source table that you can use in your data flow. Using queries is also a great way to reduce rows for testing or for lookups. Example: ```Select * from MyTable where customerId > 1000 and customerId < 2000```

**Batch size**: Enter a batch size to chunk large data into reads.

**Isolation Level**: The default for SQL sources in mapping data flow is read uncommitted. You can change the isolation level here to one of these values:
* Read Committed
* Read Uncommitted
* Repeatable Read
* Serializable
* None (ignore isolation level)

![Isolation Level](media/data-flow/isolationlevel.png "Isolation Level")

## Projection

Like schemas in datasets, the projection in a source defines the data columns, types, and formats from the source data. For most dataset types such as SQL and Parquet, the projection in a source is fixed to reflect the schema defined in a dataset. When your source files aren't strongly typed (for example, flat csv files rather than Parquet files), you can define the data types for each field in the source transformation.

![Settings on the Projection tab](media/data-flow/source3.png "Projection")

If your text file has no defined schema, select **Detect data type** so that Data Factory will sample and infer the data types. Select **Define default format** to autodetect the default data formats. 

You can modify the column data types in a down-stream derived-column transformation. Use a select transformation to modify the column names.

### Import schema

Datasets like Avro and CosmosDB that support complex data structures do not require schema definitions to exist in the dataset. Therefore, you will be able to click the "Import Schema" button the Projection tab for these types of sources.

## CosmosDB specific settings

When using CosmosDB as a source type, there are a few options to consider:

* Include system columns: If you check this, ```id```, ```_ts```, and other system columns will be included in your data flow metadata from CosmosDB. When updating collections, it is important to include this so that you can grab the existing row id.
* Page size: The number of documents per page of the query result. Default is "-1" which uses the service dynamic page up to 1000.
* Throughput: Set an optional value for the number of RUs you'd like to apply to your CosmosDB collection for each execution of this data flow during the read operation. Minimum is 400.
* Preferred regions: You can choose the preferred read regions for this process.

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
