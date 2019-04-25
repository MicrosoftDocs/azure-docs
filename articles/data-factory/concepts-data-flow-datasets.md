---
title: Datasets in the Mapping Data Flow feature of Azure Data Factory
description: Learn about dataset compatibility in the Mapping Data Flow feature of Azure Data Factory. 
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/14/2019
---

# Understand datasets in Data Flow

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

In Data Factory, datasets define the shape of the data in your pipeline. In the Data Flow feature, data at the row and column levels requires a fine-grained dataset definition. Datasets in control-flow pipelines don't require the same depth of data definition.

In Data Flow, datasets are used in source and sink transformations. The datasets define the basic data schemas. If your data has no schema, you can use schema drift for your source and sink. 

By defining the schema from the dataset, you'll get the related data types, data formats, file location, and connection information from the associated Linked service. Metadata from the datasets appears in your source transformation as the source *projection*. The schema in the dataset represents the physical data type and shape. The projection in the source transformation represents the Data Flow data with defined names and types.

## Identify dataset types

In Data Flow, you'll find four dataset types:

* Delimited text (from Azure Data Lake Storage and Blob storage)
* Parquet (from Data Lake Storage and Blob storage)
* Azure SQL Database
* Azure SQL Data Warehouse

Data Flow datasets separate the *source type* from the *Linked service connection type*. Typically in Data Factory, you first choose the connection type (Blob storage, Data Lake Storage, and so on). Then you define the type of file in the dataset. You also pick the source types. Source types can be associated with different Linked service connection types.

![Source transformation options](media/data-flow/dataset1.png "sources")

## Find datasets that work in Data Flow

When you create a new dataset, in the upper-right corner of the **New Dataset** pane, select the **Data Flow compatible** check box. This selection filters for the datasets that can be used in Data Flow. 

## Import schemas

When you import the schema of a Data Flow dataset, select the **Import Schema** button and choose to import from the source or from a local file. In most cases, you'll import the schema directly from the source. But if you already have a local schema file (a Parquet file or CSV with headers), you can direct Data Factory to base the schema on that file.

## Create a table

In Data Flow, you can direct Data Factory to create a new table definition in your target database. Define the table by setting a dataset in the sink transformation that has a new table name. In the SQL dataset, below the table name, select **Edit** and enter a new table name. Then in the sink transformation, turn on **Allow schema drift**. Set **Import schema** to **None**.

![Set up a source transformation schema](media/data-flow/dataset2.png "SQL Schema")

## Choose a data type

The following sections describe the types of datasets available in Data Flow.

### Delimited text

In a delimited-text dataset, set the delimiter to handle either single delimiters (for example, '\t' for TSV or ',' for CSV) or to handle multiple characters for a delimiter. Set the header row toggle switch. Then open the source transformation to autodetect data types. If you're using a delimited-text dataset to land data in a sink, select a target folder. In the sink settings, you can define the name of the output files.

### Parquet

Prefer Parquet as the dataset type for staging in Data Factory data flows. Parquet stores rich metadata schemas along with the data.

### Databases

You can select SQL Database or SQL Data Warehouse for your dataset type.

### Other data types

For other Data Factory dataset types, use the Copy Activity feature to stage your data. To build the pattern, open the Data Factory template in the template gallery.

![Use the Copy Activity template for staging](media/data-flow/templatedf.png "copy staging")

## Choose your connection type

If you're using Parquet or delimited-text datasets, select the location for your data. Choose Data Lake Storage or Blob storage.

## Next steps

- [Create a new data flow](data-flow-create.md) and add a source transformation. Then configure the dataset for your source.
- Use the [Copy Activity feature](copy-activity-overview.md) to bring in data from any Data Factory data source. Stage the data in Data Lake Storage or Blob storage so that Data Flow can access it.

