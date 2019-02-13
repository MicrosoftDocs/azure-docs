---
title: Azure Data Factory Mapping Data Flow Source Transformation
description: Azure Data Factory Mapping Data Flow Source Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/12/2019
--- 

# Azure Data Factory Mapping Data Flow Source Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

The Source transformation configures a data source that you wish to use to bring data into your data flow. You may have more than 1 Source transform in a single Data Flow. Always begin designing your Data Flows with a Source.

> [!NOTE]
> Every Data Flow requires at least one Source Transformation. Add as many additional Sources as you require

![Source Transformation options](media/data-flow/source.png "source")

Your Data Flow source must be associated with exactly one ADF Dataset, which defines the shape and location of your data to write to or read from.

## Data Flow Staging Areas

ADF Data Flow has line-of-sight to 5 primary "staging" areas within Azure to perform your data transformations: Azure Blob, ADLS Gen 1, ADLS Gen 2, Azure SQL DB, and Azure SQL DW. ADF has access to nearly 80 different native connectors, so to include those other sources of data into your Data Flow, first stage that data into one of those five primary Data Flow staging areas first by using the Copy Activity:

## Options

### Allow schema drift
Select Allow Schema Drift if the source columns will change often. This setting will allow all incoming fields from your source to flow through the transformations to the Sink.

### Fail if columns in the dataset are not found
Choose this option to enforce a Source schema validation that will fail your Data Flow if columns that are expected from your source are not present.

### Sampling
Use Sampling to limit the number of rows from your Source.  This is useful when you need just a sample of your source data for testing and debugging purposes.

### Define Schema

![Source Transformation](media/data-flow/source2.png "source 2")

### You can modify the name of the source columns and their associated data types

For source file types that are not strongly typed (i.e. flat files as opposed to Parquet files) you should define the data types for each field here in the Source transformation as opposed to in the Dataset.

If you do not see the column names and types in your Data Flow, it is likely because you did not define them in the Define Schema section of the Sink. You will only need to do this if you are not using Data Flow's Schema Drift handling.

Here in the "Define Schema" tab on the Source transformation is where you can set the data types and formats:

![Source Transformation](media/data-flow/source003.png "data types")

### Optimize

![Source Partitions](media/data-flow/sourcepart.png "partitioning")

On the Optimize tab for the Source Transformation, you will see an additional partitioning type called "Source". This will only light-up when you have selected Azure SQL DB as your source. This is because ADF will wish to parallelize connections to execute large queries against your Azure SQL DB source.

Partitioning data on your SQL DB source is optional, but is useful for large queries. You have two options:

### Column

Select a column to partition on from your source table. You must also set the max number of connections.

### Query Condition

You can optionally choose to partition the connections based on a query. For this option, simply put in the contents of a WHERE predicate. I.e. year > 1980
